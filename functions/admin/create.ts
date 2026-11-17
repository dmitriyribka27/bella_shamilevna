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
 const title=form?.get('title'),slug=form?.get('slug');
 if(typeof title!=='string'||typeof slug!=='string'||!title.trim()||title.length>200||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug.length>120)return new Response('Invalid title or slug',{status:400,headers});
 const id=crypto.randomUUID();
 try {
 await env.DB.batch([
  env.DB.prepare('INSERT INTO articles(id,slug) VALUES (?,?)').bind(id,slug),
  env.DB.prepare("INSERT INTO article_translations(article_id,lang,title,status) VALUES (?,'ru',?,'draft')").bind(id,title.trim())
 ]);
 }catch(e){console.error('Draft creation failed',e);return new Response('Could not create draft (check slug uniqueness)',{status:409,headers});}
 return redirect(request,'/admin/?created=1');
}
