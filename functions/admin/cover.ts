import {authenticated,redirect,securityHeaders} from '../_lib/auth';
import type {Env as BaseEnv} from '../_lib/auth';
interface Env extends BaseEnv {BELLA_IMAGES?:R2Bucket}
interface Context {request:Request;env:Env}
const MAX_IMAGE=2_000_000;
const MAX_REQUEST=2_100_000;
const LIMIT=12;
function dimensions(b:Uint8Array,type:string):{w:number;h:number}|null{
 const dv=new DataView(b.buffer,b.byteOffset,b.byteLength);
 if(type==='image/png'){
  if(b.length<24||![137,80,78,71,13,10,26,10].every((n,i)=>b[i]===n)||String.fromCharCode(...b.slice(12,16))!=='IHDR')return null;
  return {w:dv.getUint32(16),h:dv.getUint32(20)};
 }
 if(type==='image/jpeg'){
  if(b.length<4||b[0]!==255||b[1]!==216||b[2]!==255)return null;
  let i=2;
  while(i+9<b.length){
   if(b[i]!==255)return null;
   while(b[i]===255)i++;
   const marker=b[i++];
   if(marker===217||marker===218)break;
   if(i+2>b.length)return null;
   const len=dv.getUint16(i);
   if(len<2||i+len>b.length)return null;
   if([192,193,194,195,198,199,201,202,203,205,206,207].includes(marker)){
    if(len<7)return null;
    return {h:dv.getUint16(i+3),w:dv.getUint16(i+5)};
   }
   i+=len;
  }
  return null;
 }
 if(type==='image/webp'){
  if(b.length<30||String.fromCharCode(...b.slice(0,4))!=='RIFF'||String.fromCharCode(...b.slice(8,12))!=='WEBP'||dv.getUint32(4,true)+8!==b.length)return null;
  const kind=String.fromCharCode(...b.slice(12,16));
  if(kind==='VP8X')return {w:1+b[24]+(b[25]<<8)+(b[26]<<16),h:1+b[27]+(b[28]<<8)+(b[29]<<16)};
  if(kind==='VP8 '&&b[23]===157&&b[24]===1&&b[25]===42)return {w:dv.getUint16(26,true)&16383,h:dv.getUint16(28,true)&16383};
  if(kind==='VP8L'&&b[20]===47)return {w:1+(((b[22]&63)<<8)|b[21]),h:1+(((b[24]&15)<<10)|(b[23]<<2)|(b[22]>>6))};
 }
 return null;
}
export async function onRequestPost({request,env}:Context):Promise<Response>{
 const headers=securityHeaders();
 if(!env.DB||!env.ADMIN_PASSWORD_HASH||!env.BELLA_IMAGES)return new Response('Image storage not configured',{status:503,headers});
 if(!await authenticated(request,env))return new Response('Unauthorized',{status:401,headers});
 const origin=request.headers.get('Origin'),site=request.headers.get('Sec-Fetch-Site');
 if(origin&&origin!==new URL(request.url).origin)return new Response('Forbidden',{status:403,headers});
 if(site==='cross-site')return new Response('Forbidden',{status:403,headers});
 const length=Number(request.headers.get('Content-Length')||0);
 if(!length||length>MAX_REQUEST)return new Response('Image too large',{status:413,headers});
 if(!(request.headers.get('Content-Type')||'').toLowerCase().startsWith('multipart/form-data;'))return new Response('Invalid request',{status:415,headers});
 // Durable D1 counter: atomic increment per authenticated session and hour.
 // This protects R2 from repeated uploads, including concurrent submissions.
 const cookie=request.headers.get('Cookie')||'';
 const session=/\bbella_admin_session=([a-f0-9]{64})\b/.exec(cookie)?.[1];
 if(!session)return new Response('Unauthorized',{status:401,headers});
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(session))),x=>x.toString(16).padStart(2,'0')).join('');
 const window=Math.floor(Date.now()/3600000);
 await env.DB.prepare('CREATE TABLE IF NOT EXISTS cover_upload_limits (session_hash TEXT NOT NULL,window_id INTEGER NOT NULL,attempts INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(session_hash,window_id))').run();
 await env.DB.prepare('INSERT INTO cover_upload_limits(session_hash,window_id,attempts) VALUES (?,?,1) ON CONFLICT(session_hash,window_id) DO UPDATE SET attempts=attempts+1').bind(hash,window).run();
 const count=await env.DB.prepare('SELECT attempts FROM cover_upload_limits WHERE session_hash=? AND window_id=?').bind(hash,window).first<{attempts:number}>();
 if((count?.attempts||0)>LIMIT){const h=new Headers(headers);h.set('Retry-After','3600');return new Response('Слишком много загрузок. Попробуйте позже.',{status:429,headers:h})}
 const form=await request.formData().catch(()=>null);
 const id=form?.get('id'),alt=form?.get('alt'),image=form?.get('image');
 if(typeof id!=='string'||!id||id.length>100||!(image instanceof File)||image.size<1||image.size>MAX_IMAGE)return new Response('Invalid image',{status:400,headers});
 const type=image.type;
 if(!['image/jpeg','image/png','image/webp'].includes(type))return new Response('Unsupported image type',{status:415,headers});
 const bytes=new Uint8Array(await image.arrayBuffer());
 const size=dimensions(bytes,type);
 if(!size||size.w<320||size.h<240||size.w>12000||size.h>12000||size.w*size.h>40000000)return new Response('Invalid image dimensions',{status:415,headers});
 // Client crops to landscape 4:3; server rejects unprocessed images.
 if(Math.abs(size.w/size.h-4/3)>0.005)return new Response('Image must be cropped to 4:3',{status:422,headers});
 const article=await env.DB.prepare('SELECT id,cover_key FROM articles WHERE id=?').bind(id).first<{id:string;cover_key:string|null}>();
 if(!article)return new Response('Article not found',{status:404,headers});
 const ext=type==='image/jpeg'?'jpg':type==='image/png'?'png':'webp';
 const key=crypto.randomUUID()+'.'+ext;
 try{
  await env.BELLA_IMAGES.put(key,bytes,{httpMetadata:{contentType:type,cacheControl:'public,max-age=31536000,immutable'}});
  const result=await env.DB.prepare("UPDATE articles SET cover_key=?,cover_alt=?,updated_at=datetime('now') WHERE id=? AND (cover_key IS ? OR cover_key=?)").bind(key,typeof alt==='string'?alt.slice(0,200):'',id,article.cover_key,article.cover_key).run();
  if(!result.meta.changes){await env.BELLA_IMAGES.delete(key);return new Response('Cover changed, retry upload',{status:409,headers})}
  if(article.cover_key&&article.cover_key!==key){
   try{await env.BELLA_IMAGES.delete(article.cover_key)}catch(e){console.error('Old cover cleanup failed',e)}
  }
 }catch(e){console.error('Cover upload failed',e);return new Response('Image upload failed',{status:500,headers})}
 return redirect(request,'/admin/edit?id='+encodeURIComponent(id)+'&lang=ru&saved=1');
}
