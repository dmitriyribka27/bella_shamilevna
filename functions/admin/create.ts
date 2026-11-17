import {authenticated,redirect,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
export async function onRequestPost({request,env}:Context):Promise<Response> {
 const headers=securityHeaders();
 if(!env.DB||!env.ADMIN_PASSWORD_HASH)return new Response('Unavailable',{status:503,headers});
 if(!await authenticated(request,env))return new Response('Unauthorized',{status:401,headers});
 const origin=request.headers.get('Origin');
 const site=request.headers.get('Sec-Fetch-Site');
 if(origin && origin!=='null' && origin!==new URL(request.url).origin)return new Response('Forbidden',{status:403,headers});
 if(origin==='null' && site!=='same-origin')return new Response('Forbidden',{status:403,headers});
 if(site==='cross-site')return new Response('Forbidden',{status:403,headers});
 if(Number(request.headers.get('Content-Length')||0)>4096)return new Response('Too large',{status:413,headers});
 const form=await request.formData().catch(()=>null);
 const title=form?.get('title');
 if(title!==null&&(typeof title!=='string'||title.length>50))return new Response('Invalid title',{status:400,headers});
 const translit:Record<string,string>={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
 const base=Array.from((typeof title==='string'?title:'').trim().toLowerCase()).map(c=>translit[c]??c).join('').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,105).replace(/-+$/,'')||'article';
 const id=crypto.randomUUID();
 let slug='';
 try {
  for(let attempt=0;attempt<8;attempt++){
   const suffix=attempt===0?'':'-'+crypto.randomUUID().slice(0,8);
   const candidate=base.slice(0,120-suffix.length).replace(/-+$/,'')+suffix;
   const existing=await env.DB.prepare('SELECT id FROM articles WHERE slug=?').bind(candidate).first();
   if(existing)continue;
   try{
    await env.DB.batch([
     env.DB.prepare('INSERT INTO articles(id,slug) VALUES (?,?)').bind(id,candidate),
     env.DB.prepare("INSERT INTO article_translations(article_id,lang,title,status) VALUES (?,'ru',?,'draft')").bind(id,(typeof title==='string'?title:'').trim())
    ]);
    slug=candidate;
    break;
   }catch(e){
    const taken=await env.DB.prepare('SELECT id FROM articles WHERE slug=?').bind(candidate).first();
    if(!taken)throw e;
   }
  }
 }catch(e){console.error('Draft creation failed',e);return new Response('Could not create draft',{status:500,headers})}
 if(!slug)return new Response('Could not generate unique article URL',{status:409,headers});
 return redirect(request,'/admin/edit?id='+encodeURIComponent(id)+'&lang=ru');
}
