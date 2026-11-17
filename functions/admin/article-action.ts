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
 const form=await request.formData().catch(()=>null),id=form?.get('id'),action=form?.get('action');
 if(!['publish','unpublish','archive','restore','delete_forever','empty_trash'].includes(String(action))||(action!=='empty_trash'&&(typeof id!=='string'||!id||id.length>100))||(action==='empty_trash'&&id!==null&&(typeof id!=='string'||id.length>100)))return new Response('Invalid action',{status:400,headers});
 try{
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS admin_archived_articles (article_id TEXT PRIMARY KEY, archived_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)').run();
  if(action==='empty_trash'||action==='delete_forever'){
   const ids=action==='empty_trash'?(await env.DB.prepare('SELECT article_id FROM admin_archived_articles').all<{article_id:string}>()).results.map(x=>x.article_id):[id as string];
   if(action==='delete_forever'&&!await env.DB.prepare('SELECT article_id FROM admin_archived_articles WHERE article_id=?').bind(id).first())return new Response('Article is not in trash',{status:409,headers});
   for(const articleId of ids){
    await env.DB.batch([
     env.DB.prepare('DELETE FROM article_working_versions WHERE article_id=?').bind(articleId),
     env.DB.prepare('DELETE FROM article_translations WHERE article_id=?').bind(articleId),
     env.DB.prepare('DELETE FROM admin_archived_articles WHERE article_id=?').bind(articleId),
     env.DB.prepare('DELETE FROM articles WHERE id=?').bind(articleId)
    ]);
   }
   return redirect(request,'/admin/?view=trash&done=1');
  }
  const exists=await env.DB.prepare('SELECT id FROM articles WHERE id=?').bind(id).first();
  if(!exists)return new Response('Not found',{status:404,headers});
  if(action==='archive')await env.DB.prepare('INSERT OR IGNORE INTO admin_archived_articles(article_id) VALUES (?)').bind(id).run();
  else if(action==='restore'){
   const archived=await env.DB.prepare('SELECT article_id FROM admin_archived_articles WHERE article_id=?').bind(id).first();
   if(!archived)return new Response('Article is not in trash',{status:409,headers});
   // Restore as drafts: never republish an article just by restoring it.
   await env.DB.prepare("UPDATE article_translations SET status='draft',published_at=NULL,updated_at=datetime('now') WHERE article_id=?").bind(id).run();
   await env.DB.prepare("UPDATE articles SET updated_at=datetime('now') WHERE id=?").bind(id).run();
   await env.DB.prepare('DELETE FROM admin_archived_articles WHERE article_id=?').bind(id).run();
  }
  else{
   const archived=await env.DB.prepare('SELECT article_id FROM admin_archived_articles WHERE article_id=?').bind(id).first();
   if(archived)return new Response('Restore article first',{status:409,headers});
   const translation=await env.DB.prepare("SELECT body_json,status FROM article_translations WHERE article_id=? AND lang='ru'").bind(id).first<{body_json:string|null;status:string|null}>();
   if(!translation)return new Response('Russian article not found',{status:404,headers});
   if(action==='publish'&&(!translation.body_json||translation.body_json.length<15))return new Response('Save article text first',{status:409,headers});
   await env.DB.prepare("UPDATE article_translations SET status=?,published_at=CASE WHEN ?='published' THEN COALESCE(published_at,datetime('now')) ELSE NULL END,updated_at=datetime('now') WHERE article_id=? AND lang='ru'").bind(action==='publish'?'published':'draft',action==='publish'?'published':'draft',id).run();
   await env.DB.prepare("UPDATE articles SET updated_at=datetime('now') WHERE id=?").bind(id).run();
  }
 }catch(e){console.error('Admin catalog action failed',e);return new Response('Action failed',{status:500,headers})}
 return redirect(request,'/admin/?done=1');
}