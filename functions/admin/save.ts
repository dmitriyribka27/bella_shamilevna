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
 if(Number(request.headers.get('Content-Length')||0)>150000)return new Response('Too large',{status:413,headers});
 const f=await request.formData().catch(()=>null);
 if(!f)return new Response('Invalid form',{status:400,headers});
 const get=(key:string)=>f.get(key);
 const id=get('id'),lang=get('lang'),title=get('title'),body=get('body_json'),excerpt=get('excerpt'),seoTitle=get('seo_title'),seoDescription=get('seo_description'),action=get('action');
 if(typeof id!=='string'||!id||id.length>100||!['ru','en','fr'].includes(String(lang))||typeof title!=='string'||!title.trim()||title.length>200||typeof body!=='string'||body.length>100000||typeof excerpt!=='string'||excerpt.length>1000||typeof seoTitle!=='string'||seoTitle.length>200||typeof seoDescription!=='string'||seoDescription.length>320||!['draft','publish','unpublish'].includes(String(action)))return new Response('Invalid article fields',{status:400,headers});
 let doc:unknown;try{doc=JSON.parse(body)}catch{return new Response('Invalid article document',{status:400,headers})}
 if(!doc||typeof doc!=='object'||(doc as any).type!=='doc'||typeof (doc as any).html!=='string'||(doc as any).html.length>100000)return new Response('Invalid article document',{status:400,headers});
 const existing=await env.DB.prepare('SELECT id FROM articles WHERE id=?').bind(id).first();
 if(!existing)return new Response('Article not found',{status:404,headers});
 const status=action==='publish'?'published':'draft';
 try{
  await env.DB.prepare(`INSERT INTO article_translations(article_id,lang,title,body_json,excerpt,seo_title,seo_description,status,published_at,updated_at)
 VALUES(?,?,?,?,?,?,?,?,CASE WHEN ?='published' THEN datetime('now') ELSE NULL END,datetime('now'))
 ON CONFLICT(article_id,lang) DO UPDATE SET title=excluded.title,body_json=excluded.body_json,excerpt=excluded.excerpt,seo_title=excluded.seo_title,seo_description=excluded.seo_description,status=excluded.status,published_at=CASE WHEN excluded.status='published' THEN COALESCE(article_translations.published_at,datetime('now')) ELSE NULL END,updated_at=datetime('now')`).bind(id,lang,title.trim(),body,excerpt,seoTitle,seoDescription,status,status).run();
  await env.DB.prepare("UPDATE articles SET updated_at=datetime('now') WHERE id=?").bind(id).run();
 }catch(e){console.error('Article save failed',e);return new Response('Could not save article',{status:500,headers})}
 return redirect(request,'/admin/edit?id='+encodeURIComponent(id)+'&lang='+encodeURIComponent(String(lang))+'&saved=1');
}
