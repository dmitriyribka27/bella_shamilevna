// Public D1-backed publication routes. Cloudflare Pages Functions middleware.
interface Env {DB?:D1Database;ASSETS:Fetcher;BELLA_IMAGES?:R2Bucket}
interface Context {request:Request;env:Env;next:()=>Promise<Response>}
type Entry={id:string;slug:string;title:string;body_json:string|null;seo_title:string|null;seo_description:string|null;published_at:string|null;cover_key:string|null;cover_alt:string|null;archive_number:number|null};
const esc=(v:unknown)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const validLang=(s:string)=>s==='en'||s==='fr'||s==='ru';
function safeBody(raw:string|null):string {
 let doc:any;try{doc=JSON.parse(raw||'{}')}catch{return ''}
 if(doc?.type!=='doc'||typeof doc.html!=='string')return '';
 // Tokenize a narrow HTML subset; do not trust markup submitted to the API.
 return doc.html.replace(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g,token=>{
  if(!token.startsWith('<'))return esc(token.replace(/&(?:amp|lt|gt|quot|#39);/g,m=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[m]||m)));
  const m=/^<\s*(\/?)\s*([a-z][a-z0-9]*)\b([^>]*)>$/i.exec(token);
  if(!m)return '';
  const tag=m[2].toLowerCase();
  if(!['p','h2','h3','blockquote','ul','ol','li','strong','em','br','a'].includes(tag))return '';
  if(m[1])return tag==='br'?'':`</${tag}>`;
  if(tag==='br')return '<br>';
  if(tag==='a'){
   const href=/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(m[3]);
   const value=href?.[1]??href?.[2]??'';
   try{const u=new URL(value,'https://bella-shamilevna.pages.dev');if(['https:','http:','mailto:'].includes(u.protocol))return `<a href="${esc(u.href)}" rel="noopener noreferrer">`}catch{}
   return '<a>';
  }
  return `<${tag}>`;
 });
}
function pathInfo(path:string):{lang:string;slug:string|null}|null{
 const m=/^\/(en\/|fr\/)?publications(?:\/([^/]+))?\/?$/.exec(path);
 if(!m)return null;
 return {lang:m[1]?.slice(0,2)||'ru',slug:m[2]?decodeURIComponent(m[2]):null};
}
function date(v:string|null){if(!v)return '';const s=v.slice(0,10);return /^\d{4}-\d{2}-\d{2}$/.test(s)?s.split('-').reverse().join('.'):''}
export async function onRequest(context:Context):Promise<Response>{
 const {request,env}=context,url=new URL(request.url);
 const info=pathInfo(url.pathname);
 if(!info)return context.next();
 if(!env.DB)return context.next();
 let entries:Entry[];
 try{
  const sql=`SELECT a.id,a.slug,t.title,t.body_json,t.seo_title,t.seo_description,t.published_at,a.cover_alt,
    a.cover_key,n.number archive_number FROM articles a
    JOIN article_translations t ON t.article_id=a.id
    LEFT JOIN admin_article_numbers n ON n.article_id=a.id
    LEFT JOIN admin_archived_articles ar ON ar.article_id=a.id
    WHERE t.lang=? AND t.status='published' AND ar.article_id IS NULL
    ORDER BY COALESCE(t.published_at,a.created_at) DESC,a.id DESC`;
  entries=(await env.DB.prepare(sql).bind(info.lang).all<Entry>()).results||[];
 }catch(e){console.error('Public publications query failed',e);return new Response('Публикации временно недоступны',{status:503,headers:{'Cache-Control':'no-store'}})}
 const base=new URL((info.lang==='ru'?'':'/'+info.lang)+'/publications/',url.origin);
 const original=await env.ASSETS.fetch(new Request(base.toString()));
 if(!original.ok)return context.next();
 let html=await original.text();
 const prefix=info.lang==='ru'?'':'/'+info.lang;
 const labels=info.lang==='en'?{archive:'Publications',back:'All publications',empty:'No publications yet'}:info.lang==='fr'?{archive:'Publications',back:'Toutes les publications',empty:'Aucune publication pour le moment'}:{archive:'Публикации',back:'Все публикации',empty:'Публикаций пока нет'};
 if(!info.slug){
  const cards=entries.map(e=>`<article class="d1-publication"><a href="${prefix}/publications/${encodeURIComponent(e.slug)}/"><span class="d1-number">№ ${String(e.archive_number||0).padStart(3,'0')}</span><h2>${esc(e.title)}</h2><time>${esc(date(e.published_at))}</time></a></article>`).join('');
  html=html.replace(/<p class="archive-empty publications-coming-soon">[\s\S]*?<\/p>/,`<div class="d1-archive">${cards||`<p>${labels.empty}</p>`}</div>`);
 }else{
  const e=entries.find(e=>e.slug===info.slug);
  if(!e)return new Response('Not found',{status:404,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  const title=e.seo_title||e.title,desc=e.seo_description||'';
  html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(title)}</title>`);
  html=html.replace(/<meta name="description"[^>]*\/>/,`<meta name="description" content="${esc(desc)}" />`);
  const cover=e.cover_key?`<img class="d1-cover" src="/publication-images/${encodeURIComponent(e.cover_key)}" alt="${esc(e.cover_alt||'')}" loading="eager">`:'';
  const article=`<article class="d1-article"><a class="d1-back" href="${prefix}/publications/">← ${labels.back}</a><header><span class="d1-number">№ ${String(e.archive_number||0).padStart(3,'0')}</span><h1>${esc(e.title)}</h1><time>${esc(date(e.published_at))}</time></header>${cover}<div class="d1-body">${safeBody(e.body_json)}</div></article>`;
  html=html.replace(/<section class="archive-page"[\s\S]*?<\/section>/,article);
 }
 const css=`<style>.d1-archive{max-width:940px;margin:45px auto 100px}.d1-publication{border-bottom:1px solid #d9dfe3;padding:23px 0}.d1-publication a{display:block;text-decoration:none;color:inherit}.d1-publication h2{font-size:clamp(22px,2.2vw,32px);margin:8px 0}.d1-number,.d1-publication time,.d1-article time{color:#74859a;font-size:13px}.d1-article{width:min(100% - 40px,800px);margin:80px auto 140px}.d1-back{display:inline-block;margin-bottom:45px;color:#284b79}.d1-article h1{font-size:clamp(32px,4vw,58px);line-height:1.15;margin:14px 0}.d1-cover{display:block;max-width:100%;width:100%;height:auto;margin:45px 0}.d1-body{font-size:18px;line-height:1.9;overflow-wrap:anywhere}.d1-body p{margin:0 0 1.3em}.d1-body h2{font-size:28px;margin:1.8em 0 .6em}.d1-body blockquote{border-left:3px solid #284b79;padding-left:20px;margin:30px 0}.d1-body a{color:#284b79;text-decoration:underline}@media(max-width:700px){.d1-article{margin:40px auto 80px}.d1-body{font-size:17px}}</style>`;
 html=html.replace('</head>',css+'</head>');
 const headers=new Headers({'Content-Type':'text/html; charset=utf-8','Cache-Control':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff'});
 return new Response(html,{status:200,headers});
}
