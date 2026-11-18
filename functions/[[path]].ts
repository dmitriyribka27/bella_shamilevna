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
  if(!['p','h2','h3','blockquote','ul','ol','li','strong','em','u','s','br','a'].includes(tag))return '';
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
 const homeLang=url.pathname==='/'?'ru':url.pathname==='/en/'||url.pathname==='/en'?'en':url.pathname==='/fr/'||url.pathname==='/fr'?'fr':null;
 if(!info&&!homeLang)return context.next();
 if(homeLang&&env.DB){
  try{
   const results=(await env.DB.prepare(`SELECT a.slug,a.cover_key,t.title,t.published_at FROM articles a JOIN article_translations t ON t.article_id=a.id LEFT JOIN admin_archived_articles ar ON ar.article_id=a.id WHERE t.lang=? AND t.status='published' AND ar.article_id IS NULL ORDER BY COALESCE(t.published_at,a.created_at) DESC LIMIT 3`).bind(homeLang).all<{slug:string;cover_key:string|null;title:string;published_at:string|null}>()).results||[];
   if(results.length){
    const base=await context.next();
    if(!base.ok)return base;
    let html=await base.text();
    const prefix=homeLang==='ru'?'':'/'+homeLang;
    const list=results.map(x=>`<a class="publication-card" href="${prefix}/publications/${encodeURIComponent(x.slug)}/">${x.cover_key?`<img src="/publication-images/${encodeURIComponent(x.cover_key)}" alt="" loading="lazy" width="320" height="240">`:''}<span>${esc(x.title)}</span><time class="home-publication-date" datetime="${esc(x.published_at?.slice(0,10)||'')}">${esc(date(x.published_at))}</time></a>`).join('');
    html=html.replace(/<p class="publications-coming-soon">[\s\S]*?<\/p>/,`<div class="publication-grid">${list}</div>`);
    html=html.replace('</head>','<style>.home-publication-date{display:block;margin-top:7px;font-size:13px;color:#718198}.publication-grid .publication-card{min-width:0}.publication-grid .publication-card span{overflow-wrap:anywhere}</style></head>');
    return new Response(html,{status:base.status,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'public,max-age=0,must-revalidate'}});
   }
  }catch(e){console.error('Home publications query failed',e)}
  return context.next();
 }
 if(!info)return context.next();
 if(!env.DB)return context.next();
 let entries:Entry[];
 try{
  const columns=(await env.DB.prepare('PRAGMA table_info(articles)').all<{name:string}>()).results||[];
  const coverColumn=columns.some(c=>c.name==='cover_key')?'a.cover_key':'NULL AS cover_key';
  const sql=`SELECT a.id,a.slug,t.title,t.body_json,t.seo_title,t.seo_description,t.published_at,a.cover_alt,
    ${coverColumn},n.number archive_number FROM articles a
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
  const cards=entries.map(e=>{const cover=e.cover_key?`<img class="archive-cover" src="/publication-images/${encodeURIComponent(e.cover_key)}" alt="${esc(e.cover_alt||'')}" loading="lazy" width="270" height="203">`:'';return `<a class="archive-card" href="${prefix}/publications/${encodeURIComponent(e.slug)}/">${e.archive_number?`<span class="archive-number">№ ${String(e.archive_number).padStart(3,'0')}</span>`:''}${cover}<span class="archive-card-title">${esc(e.title)}</span><time class="archive-card-date" datetime="${esc(e.published_at?.slice(0,10)||'')}">${esc(date(e.published_at))}</time></a>`}).join('');
  html=html.replace(/<p class="archive-empty publications-coming-soon">[\s\S]*?<\/p>/,`<div class="archive-grid">${cards||`<p>${labels.empty}</p>`}</div>`);
 }else{
  const e=entries.find(e=>e.slug===info.slug);
  if(!e)return new Response('Not found',{status:404,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  const title=e.seo_title||e.title,desc=e.seo_description||'';
  html=html.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(title)}</title>`);
  html=html.replace(/<meta name="description"[^>]*\/>/,`<meta name="description" content="${esc(desc)}" />`);
  const cover=e.cover_key?`<img class="article-cover" src="/publication-images/${encodeURIComponent(e.cover_key)}" alt="${esc(e.cover_alt||'')}" width="380" height="285" fetchpriority="high">`:'';
  const currentIndex=entries.findIndex(item=>item.id===e.id);
  const neighbor=(item:Entry|undefined,direction:'prev'|'next')=>item?`<div class="article-neighbor article-neighbor-${direction}"><a href="${prefix}/publications/${encodeURIComponent(item.slug)}/"><span class="article-arrow" aria-hidden="true">${direction==='prev'?'←':'→'}</span><span><small>${direction==='prev'?'Предыдущая':'Следующая'}</small><strong>${esc(item.title)}</strong></span></a></div>`:`<div class="article-neighbor article-neighbor-${direction}"></div>`;
  const article=`<article class="article-page"><header class="article-masthead"><div class="article-heading"><h1>${esc(e.title)}</h1><time datetime="${esc(e.published_at?.slice(0,10)||'')}">${esc(date(e.published_at))}</time></div>${cover}</header><div class="article-content"><div class="article-body">${safeBody(e.body_json)}</div><div class="article-actions"><button type="button" class="article-copy-link" id="article-copy-link">${info.lang==='en'?'Copy link':info.lang==='fr'?'Copier le lien':'Скопировать ссылку'}</button><span class="article-copy-status" role="status" aria-live="polite"></span></div></div><nav class="article-neighbors" aria-label="${esc(labels.archive)}">${neighbor(entries[currentIndex+1],'prev')}${neighbor(entries[currentIndex-1],'next')}</nav></article><script>document.getElementById('article-copy-link')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);document.querySelector('.article-copy-status').textContent='✓'}catch{document.querySelector('.article-copy-status').textContent=location.href}});</script>`;
  html=html.replace(/<section class="archive-page"[\s\S]*?<\/section>/,article);
 }
 const css=`<style>.archive-grid{margin-top:35px}.archive-card-date{display:block;margin-top:12px;font-size:15px;color:#74859a}.archive-card-title{overflow-wrap:anywhere}.article-heading h1{overflow-wrap:anywhere}.article-body{overflow-wrap:anywhere}.article-body img{max-width:100%;height:auto}.article-body a{color:#27598c;text-decoration:underline;text-underline-offset:3px}.article-body a:hover{color:#183c64}.article-body u{text-underline-offset:3px}.article-body s{text-decoration:line-through}.article-neighbor-next .article-arrow{order:2}.article-neighbor-next a{justify-content:flex-end}</style>`;
 html=html.replace('</head>',css+'</head>');
 const headers=new Headers({'Content-Type':'text/html; charset=utf-8','Cache-Control':'public, max-age=0, must-revalidate','X-Content-Type-Options':'nosniff'});
 return new Response(html,{status:200,headers});
}
