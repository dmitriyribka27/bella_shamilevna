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
 if(typeof id!=='string'||id.length>100||!['ru','en','fr'].includes(String(lang))||typeof title!=='string'||title.length>50||typeof body!=='string'||body.length>100000||typeof excerpt!=='string'||excerpt.length>1000||typeof seoTitle!=='string'||seoTitle.length>200||typeof seoDescription!=='string'||seoDescription.length>320||!['draft','publish','unpublish'].includes(String(action)))return new Response('Invalid article fields',{status:400,headers});
 let doc:unknown;try{doc=JSON.parse(body)}catch{return new Response('Invalid article document',{status:400,headers})}
 if(!doc||typeof doc!=='object'||(doc as any).type!=='doc'||typeof (doc as any).html!=='string'||(doc as any).html.length>100000)return new Response('Invalid article document',{status:400,headers});
 const isNew=id==='';
 if(isNew&&action==='unpublish')return new Response('Cannot unpublish unsaved article',{status:400,headers});
 const existing=isNew?null:await env.DB.prepare('SELECT id FROM articles WHERE id=?').bind(id).first();
 if(!isNew&&!existing)return new Response('Article not found',{status:404,headers});
 let articleId=id;
  try{
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS article_working_versions (
   article_id TEXT NOT NULL,lang TEXT NOT NULL,title TEXT NOT NULL DEFAULT '',
   body_json TEXT NOT NULL DEFAULT '{"type":"doc","html":""}',excerpt TEXT NOT NULL DEFAULT '',
   seo_title TEXT NOT NULL DEFAULT '',seo_description TEXT NOT NULL DEFAULT '',
   seo_title_manual INTEGER NOT NULL DEFAULT 0,seo_description_manual INTEGER NOT NULL DEFAULT 0,
   updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(article_id,lang))`).run();
  if(isNew){
   const plainNew=(doc as {html:string}).html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
   if(!title.trim()||!plainNew)return new Response('Для первого сохранения заполните название и текст',{status:400,headers});
   const translit:Record<string,string>={а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'};
   const base=Array.from(title.trim().toLowerCase()).map(c=>translit[c]??c).join('').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,85).replace(/-+$/,'')||'article';
   articleId=crypto.randomUUID();
   const slug=base+'-'+articleId.slice(0,8);
   await env.DB.batch([
    env.DB.prepare('INSERT INTO articles(id,slug) VALUES (?,?)').bind(articleId,slug),
    env.DB.prepare("INSERT INTO article_translations(article_id,lang,title,status) VALUES (?,?,?,'draft')").bind(articleId,lang,title.trim())
   ]);
  }
  const old=await env.DB.prepare('SELECT status FROM article_translations WHERE article_id=? AND lang=?').bind(articleId,lang).first<{status:string}>();
  const plain=(doc as {html:string}).html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const autoTitle=title.trim()+' — Белла Рыбка';
  const autoDescription=plain.slice(0,160);
  const manualTitle=get('seo_title_manual')==='1',manualDescription=get('seo_description_manual')==='1';
  const finalTitle=manualTitle?seoTitle:autoTitle,finalDescription=manualDescription?seoDescription:autoDescription;
  await env.DB.prepare(`INSERT INTO article_working_versions(article_id,lang,title,body_json,excerpt,seo_title,seo_description,seo_title_manual,seo_description_manual,updated_at)
   VALUES(?,?,?,?,?,?,?,?,?,datetime('now'))
   ON CONFLICT(article_id,lang) DO UPDATE SET title=excluded.title,body_json=excluded.body_json,excerpt=excluded.excerpt,seo_title=excluded.seo_title,seo_description=excluded.seo_description,seo_title_manual=excluded.seo_title_manual,seo_description_manual=excluded.seo_description_manual,updated_at=datetime('now')`).bind(id,lang,title.trim(),body,excerpt,finalTitle,finalDescription,Number(manualTitle),Number(manualDescription)).run();
  if(action==='publish'){
   if(!title.trim()||!plain)return new Response('Для публикации заполните название и текст',{status:400,headers});
   await env.DB.prepare(`INSERT INTO article_translations(article_id,lang,title,body_json,excerpt,seo_title,seo_description,status,published_at,updated_at)
   VALUES(?,?,?,?,?,?,?,'published',datetime('now'),datetime('now'))
   ON CONFLICT(article_id,lang) DO UPDATE SET title=excluded.title,body_json=excluded.body_json,excerpt=excluded.excerpt,seo_title=excluded.seo_title,seo_description=excluded.seo_description,status='published',published_at=COALESCE(article_translations.published_at,datetime('now')),updated_at=datetime('now')`).bind(id,lang,title.trim(),body,excerpt,finalTitle,finalDescription).run();
   await env.DB.prepare('DELETE FROM article_working_versions WHERE article_id=? AND lang=?').bind(articleId,lang).run();
  }else if(action==='unpublish'){
   await env.DB.prepare("UPDATE article_translations SET status='draft',updated_at=datetime('now') WHERE article_id=? AND lang=?").bind(articleId,lang).run();
  }else if(old?.status!=='published'){
   await env.DB.prepare(`INSERT INTO article_translations(article_id,lang,title,status) VALUES (?,?,?,'draft')
    ON CONFLICT(article_id,lang) DO UPDATE SET title=excluded.title`).bind(id,lang,title.trim()).run();
  }
  await env.DB.prepare("UPDATE articles SET updated_at=datetime('now') WHERE id=?").bind(articleId).run();
 }catch(e){console.error('Article save failed',e);return new Response('Could not save article',{status:500,headers})}
 return redirect(request,'/admin/edit?id='+encodeURIComponent(articleId)+'&lang='+encodeURIComponent(String(lang))+'&saved=1');
}
