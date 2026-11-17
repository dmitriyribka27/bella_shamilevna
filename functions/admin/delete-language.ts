import {authenticated,redirect,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
export async function onRequestPost({request,env}:Context):Promise<Response>{
 const headers=securityHeaders();
 if(!env.DB||!env.ADMIN_PASSWORD_HASH)return new Response('Unavailable',{status:503,headers});
 if(!await authenticated(request,env))return new Response('Unauthorized',{status:401,headers});
 const origin=request.headers.get('Origin'),site=request.headers.get('Sec-Fetch-Site');
 if(origin&&origin!=='null'&&origin!==new URL(request.url).origin)return new Response('Forbidden',{status:403,headers});
 if(origin==='null'&&site!=='same-origin')return new Response('Forbidden',{status:403,headers});
 if(site==='cross-site')return new Response('Forbidden',{status:403,headers});
 if(Number(request.headers.get('Content-Length')||0)>4096)return new Response('Too large',{status:413,headers});
 const form=await request.formData().catch(()=>null),id=form?.get('id'),lang=form?.get('lang');
 if(typeof id!=='string'||!id||id.length>100||!['ru','en','fr'].includes(String(lang)))return new Response('Invalid request',{status:400,headers});
 try{
  const article=await env.DB.prepare('SELECT id FROM articles WHERE id=?').bind(id).first();
  if(!article)return new Response('Article not found',{status:404,headers});
  const versions=await env.DB.prepare('SELECT lang FROM article_translations WHERE article_id=? UNION SELECT lang FROM article_working_versions WHERE article_id=?').bind(id,id).all<{lang:string}>();
  if((versions.results||[]).length<=1)return new Response('Нельзя удалить последнюю языковую версию. Используйте корзину для всей статьи.',{status:409,headers});
  // Only remove the selected translation and its working version. The article and other languages survive.
  await env.DB.prepare('DELETE FROM article_working_versions WHERE article_id=? AND lang=?').bind(id,lang).run();
  await env.DB.prepare('DELETE FROM article_translations WHERE article_id=? AND lang=?').bind(id,lang).run();
  await env.DB.prepare("UPDATE articles SET updated_at=datetime('now') WHERE id=?").bind(id).run();
 }catch(e){console.error('Delete article language failed',e);return new Response('Could not delete language',{status:500,headers});}
 return redirect(request,'/admin/edit?id='+encodeURIComponent(id)+'&lang='+encodeURIComponent(String(lang))+'&removed=1');
}
