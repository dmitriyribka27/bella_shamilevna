import {authenticated,redirect,securityHeaders} from '../_lib/auth';
import type {Env as BaseEnv} from '../_lib/auth';
interface Env extends BaseEnv {BELLA_IMAGES?:R2Bucket}
interface Context {request:Request;env:Env}
export async function onRequestPost({request,env}:Context):Promise<Response>{
 const headers=securityHeaders();
 if(!env.DB||!env.ADMIN_PASSWORD_HASH||!env.BELLA_IMAGES)return new Response('Image storage not configured',{status:503,headers});
 if(!await authenticated(request,env))return new Response('Unauthorized',{status:401,headers});
 const origin=request.headers.get('Origin'),site=request.headers.get('Sec-Fetch-Site');
 if(origin&&origin!==new URL(request.url).origin)return new Response('Forbidden',{status:403,headers});
 if(site==='cross-site')return new Response('Forbidden',{status:403,headers});
 if(Number(request.headers.get('Content-Length')||0)>6_000_000)return new Response('Image too large',{status:413,headers});
 const form=await request.formData().catch(()=>null);
 const id=form?.get('id'),alt=form?.get('alt'),image=form?.get('image');
 if(typeof id!=='string'||!id||id.length>100||typeof alt!=='string'||alt.length>200||!(image instanceof File)||image.size<1||image.size>5_000_000)return new Response('Invalid image',{status:400,headers});
 const type=image.type;
 if(!['image/jpeg','image/png','image/webp'].includes(type))return new Response('Unsupported image type',{status:415,headers});
 const bytes=new Uint8Array(await image.arrayBuffer());
 const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
 const png=bytes.slice(0,8).every((b,i)=>b===[137,80,78,71,13,10,26,10][i]);
 const webp=String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 if(!(type==='image/jpeg'&&jpeg||type==='image/png'&&png||type==='image/webp'&&webp))return new Response('Invalid image format',{status:415,headers});
 const article=await env.DB.prepare('SELECT id,cover_key FROM articles WHERE id=?').bind(id).first<{id:string;cover_key:string|null}>();
 if(!article)return new Response('Article not found',{status:404,headers});
 const ext=type==='image/jpeg'?'jpg':type==='image/png'?'png':'webp';
 const key=crypto.randomUUID()+'.'+ext;
 try{
  await env.BELLA_IMAGES.put(key,bytes,{httpMetadata:{contentType:type,cacheControl:'public,max-age=31536000,immutable'}});
  await env.DB.prepare("UPDATE articles SET cover_key=?,cover_alt=?,updated_at=datetime('now') WHERE id=?").bind(key,alt,id).run();
  // Old image remains in R2 to avoid breaking cached URLs; periodic orphan cleanup can remove it.
 }catch(e){console.error('Cover upload failed',e);return new Response('Image upload failed',{status:500,headers})}
 return redirect(request,'/admin/edit?id='+encodeURIComponent(id)+'&lang=ru&saved=1');
}
