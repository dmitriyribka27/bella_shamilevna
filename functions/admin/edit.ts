import {adminSidebar,adminSidebarCss} from '../_lib/admin-sidebar';
import {authenticated,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
type Row={id:string;slug:string;cover_alt:string;cover_key:string|null;lang:string|null;title:string|null;excerpt:string|null;body_json:string|null;seo_title:string|null;seo_description:string|null;published_at:string|null;status:string|null};
const esc=(v:unknown)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const styles=`*{box-sizing:border-box}body{margin:0;background:#f6f5f2;color:#262626;font:16px/1.55 system-ui,-apple-system,sans-serif}a{color:inherit;text-decoration:none}button,input,textarea{font:inherit}button{cursor:pointer}button,.primary{background:#284b79;color:white;border:0;border-radius:7px;padding:11px 16px}button.secondary{background:white;color:#284b79;border:1px solid #b7c3d2}.shell{display:grid;grid-template-columns:240px minmax(0,1fr);min-height:100vh}.side{border-right:1px solid #ddd;padding:34px 20px;background:#faf9f7}.brand{font-size:22px;font-weight:650;margin:0 0 48px}.side a{display:block;padding:13px 16px;border-radius:8px;margin-bottom:6px}.side a:hover,.side a.active{background:#e9edf2;color:#284b79}.main{padding:40px clamp(18px,5vw,72px);max-width:1100px;width:100%}h1{font-size:32px;font-weight:600;margin:0 0 8px}h2{font-size:20px}p.note{color:#646464}label{display:block;font-size:14px;margin:20px 0 7px}input,textarea{width:100%;padding:12px;border:1px solid #c8c8c8;border-radius:7px;background:white;color:#222}textarea{min-height:110px;resize:vertical}.card{background:white;border:1px solid #ddd;border-radius:12px;padding:clamp(18px,3vw,32px);margin:24px 0}.actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:25px 0}.languages{display:flex;gap:8px;margin:20px 0}.languages a{border:1px solid #c7cbd2;border-radius:6px;padding:8px 16px}.languages a.active{background:#284b79;color:white}.editor{min-height:300px;padding:22px;border:1px solid #ccc;border-radius:0 0 8px 8px;outline-offset:3px;line-height:1.8;overflow-wrap:anywhere}.editor:empty:before{content:'Начните писать статью…';color:#999}.editor h2{font-size:23px}.editor blockquote{border-left:3px solid #284b79;margin:18px 0;padding-left:18px;color:#555}.toolbar{display:flex;flex-wrap:wrap;gap:5px;padding:8px;border:1px solid #ccc;border-bottom:0;border-radius:8px 8px 0 0;background:#f8f8f8}.toolbar button{padding:7px 11px;background:white;color:#222;border:1px solid #ddd}.muted{color:#666}.notice{padding:12px;background:#eef3f9;border-radius:8px}.danger{color:#a22}.logout{margin-top:35px}.preview{background:white;padding:28px;border:1px solid #ddd;border-radius:10px}.preview p{line-height:1.8}@media(max-width:760px){.shell{display:block}.side{padding:14px;border-right:0;border-bottom:1px solid #ddd}.brand{font-size:18px;margin:0 0 10px}.side nav{display:flex;gap:4px;overflow-x:auto}.side a{white-space:nowrap;margin:0}.main{padding:24px 16px}h1{font-size:27px}}
/* Editorial workspace */
body{background:#f7f7f5;color:#262c32;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px}
.shell{grid-template-columns:224px minmax(0,1fr)}
.side{position:sticky;top:0;height:100vh;padding:30px 16px;background:#fbfbfa;border-color:#e4e5e5}
.brand{font-size:19px;letter-spacing:-.025em;margin:0 12px 48px;font-weight:650}
.side nav a{padding:11px 13px;margin:2px 0;color:#4e5358;font-size:14px;transition:background .15s}
.side nav a.active{background:#eaf0f6;color:#294d76;font-weight:600}
.side .logout{position:absolute;bottom:25px;left:27px;margin:0}
.main{max-width:none;padding:26px clamp(20px,2.4vw,42px) 55px}
.breadcrumb{font-size:13px;color:#68727d;margin:0 0 18px}
.breadcrumb a{color:#566a7e}
.heading{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:18px}
.heading h1{font-size:clamp(25px,2.2vw,34px);letter-spacing:-.035em;font-weight:600;margin:0 0 5px}
.heading .note{margin:0;font-size:13px}
.status-pill{display:inline-flex;align-items:center;gap:7px;background:#e9eff5;color:#2a527b;border-radius:20px;padding:6px 12px;font-size:12px;white-space:nowrap}
.status-pill:before{content:"";width:6px;height:6px;background:#527aa0;border-radius:50%}
.workspace{display:grid;grid-template-columns:minmax(0,1fr) 284px;gap:16px;align-items:start}
.writing{min-width:0}.card{margin:0 0 14px;padding:clamp(18px,2vw,26px);border-color:#e3e4e4;border-radius:10px;box-shadow:0 3px 14px rgba(35,45,55,.025)}
.card h2{font-size:16px;font-weight:650;margin:0 0 22px}
.card label{font-size:13px;color:#5b6269;font-weight:550;margin:14px 0 7px}
.card label:first-child{margin-top:0}
input,textarea{border-color:#d9dddf;border-radius:6px;padding:12px 14px;transition:border-color .15s,box-shadow .15s}
input:focus,textarea:focus,.editor:focus{outline:none;border-color:#6286ad;box-shadow:0 0 0 3px rgba(53,103,159,.11)}
#title{font-size:24px;letter-spacing:-.02em;font-weight:550;padding:14px 15px}
#excerpt{min-height:88px}
.editor{min-height:260px;background:#fff;border-color:#d9dddf;border-radius:0 0 6px 6px;padding:26px clamp(18px,3vw,40px);font-size:17px;line-height:1.85}
.editor p{margin:0 0 1.1em}.editor h2{font-size:25px;line-height:1.35;margin:1.6em 0 .7em}
.toolbar{background:#f8f9f9;border-color:#d9dddf;gap:3px;padding:7px}
.toolbar button{font-size:13px;border:0;background:transparent;border-radius:5px;padding:8px 10px}
.toolbar button:hover,.toolbar button:focus-visible{background:#e8eef4;color:#284b79}
.rail{position:sticky;top:26px;display:flex;flex-direction:column;gap:15px}
.rail-card{background:#fff;border:1px solid #e2e4e5;border-radius:10px;padding:21px}
.rail-card h2{font-size:14px;font-weight:650;margin:0 0 16px}
.rail-card .note{font-size:12px;line-height:1.55}
.rail-card .actions{display:grid;gap:9px;margin:16px 0 0}
.rail-card .actions button{width:100%;font-size:13px;line-height:1.4;text-align:center;padding:11px 9px}
.rail-card .actions button.secondary{background:#fff;border-color:#d1d9e2}
.rail-card .actions button.secondary:hover{background:#f0f5f9}
.languages{margin:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.languages a{padding:9px 4px;text-align:center;font-size:13px;border-radius:6px}
.rail-card details summary{cursor:pointer;font-size:14px;font-weight:600;list-style-position:inside}
.rail-card details label{font-size:12px;margin:15px 0 6px}
.rail-card details textarea{min-height:85px}
.rail-card details input,.rail-card details textarea{font-size:13px}
.rail-card details p{font-size:12px;color:#666}
.notice{margin:0 0 20px;font-size:13px}
.preview{max-width:820px;margin-top:24px;padding:clamp(25px,4vw,60px);border-color:#e3e4e4}
.preview h2{font-size:30px;letter-spacing:-.03em}.preview article{font-size:17px;line-height:1.85}
.rail .meta{font-size:12px;line-height:1.6;overflow-wrap:anywhere;color:#68727d}
@media(max-width:1100px){.workspace{grid-template-columns:minmax(0,1fr) 235px;gap:14px}.main{padding:28px 22px}.rail-card{padding:15px}}
@media(max-width:900px){.workspace{grid-template-columns:minmax(0,1fr)}.rail{position:static;display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.rail-card:first-child{grid-column:1/-1}.rail-card .actions{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.shell{display:block}.side{position:static;height:auto;padding:15px;border-bottom:1px solid #ddd}.side .logout{position:static;margin-top:10px}.brand{margin:0 0 8px}.side nav{display:flex;gap:4px;overflow:auto}.side nav a{white-space:nowrap}.main{padding:22px 14px 70px}.heading{margin-bottom:18px}.rail{display:flex}.rail-card .actions{grid-template-columns:1fr 1fr}.card{padding:18px}.editor{padding:18px;min-height:240px}#title{font-size:21px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
.side-create{width:100%;text-align:left;background:transparent;color:#284b79;border-radius:12px}.side-create:hover{background:#e8eef5}.side form{margin:0}\n
.delete-language-button{margin-top:12px;width:100%;background:#fff;color:#a34b4b;border:1px solid #e8d5d5;border-radius:14px;font-size:12px;padding:10px}.delete-language-button:hover{background:#fff4f4}.delete-language-button:disabled{opacity:.4;cursor:not-allowed}
/* Shared approved admin navigation */
body{font-size:15px;color:#25313d;font-family:system-ui,-apple-system,sans-serif}
.card,.rail-card,.preview{border-radius:20px;box-shadow:0 5px 20px rgba(37,52,72,.045)}
input,textarea,.languages a{border-radius:14px}
.toolbar{border-radius:16px 16px 0 0}.editor{border-radius:0 0 16px 16px}
.rail-card details summary{padding:10px 14px;border:1px solid #d7dde3;border-radius:14px;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px}
.rail-card details summary::-webkit-details-marker{display:none}
.rail-card details summary:after{content:"";width:9px;height:9px;border-right:1.6px solid currentColor;border-bottom:1.6px solid currentColor;transform:rotate(45deg);margin-right:4px}
.rail-card details[open] summary:after{transform:rotate(225deg)}
.rail-card details summary:hover{background:#f8fafc;border-color:#9db2ca}
.rail-card .actions button,.languages a{border-radius:14px}

.shell{grid-template-columns:230px minmax(0,1fr)}
.side{position:sticky;top:0;height:100vh;min-height:100vh;padding:32px 18px;background:#fbfaf8;border-right:1px solid #e3e3e1;display:flex;flex-direction:column}
.side .brand{font-size:21px;font-weight:700;letter-spacing:normal;margin:0 12px 48px;line-height:1.55;color:#25313d}
.side .brand small{display:block;font-size:13px;font-weight:400;letter-spacing:0;color:#8290a4;margin-top:0}
.side nav{display:block}
.side nav a,.side nav .side-create{display:block;width:100%;text-align:left;font:inherit;font-size:16px;font-weight:400;padding:13px 16px;border:0;border-radius:20px;margin:0 0 6px;background:transparent;color:#25313d;cursor:pointer}
.side nav a.active,.side nav a:hover,.side nav .side-create:hover{background:#e8eef5;color:#284b79}
.side-bottom{margin-top:auto;padding:20px 4px 0;border-top:1px solid #e4e7eb}
.side-bottom .site-link{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;margin:0 0 8px;border-radius:16px;color:#284b79;font-size:16px}
.side-bottom .site-link:hover{background:#e8eef5}
.side-bottom .site-link span{font-size:17px;color:#6e8299}
.side-bottom .logout{position:static;bottom:auto;left:auto;margin:0}
.side-bottom .logout button{display:block;width:100%;text-align:left;padding:12px 14px;border:1px solid #d8e0e8;border-radius:16px;background:white;color:#284b79;font-size:16px;font-weight:400}
.side-bottom .logout button:hover{background:#eef3f8}
@media(max-width:760px){.shell{display:block}.side{position:static;height:auto;min-height:0;padding:16px;border-right:0;border-bottom:1px solid #ddd}.side .brand{margin:0 0 10px}.side nav{display:flex;gap:4px;overflow-x:auto}.side nav a,.side nav .side-create{white-space:nowrap;margin:0;padding:10px}.side-bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0 0;margin-top:12px}.side-bottom .site-link{margin:0}.side-bottom .logout button{width:auto}}
/* Sidebar geometry and typography aligned with the publications catalog. */
.shell{grid-template-columns:230px minmax(0,1fr)}
.side{padding:32px 18px;background:#fbfaf8;border-color:#e3e3e1}
.side .brand{font-size:21px;font-weight:700;letter-spacing:normal;margin:0 12px 48px;line-height:1.55}
.side .brand small{font-size:12px;color:#7c8793}
.side nav a.active{font-weight:400}
.side nav a,.side nav .side-create{font-size:16px;font-weight:400}
.side-bottom .site-link,.side-bottom .logout button{font-size:16px}
@media(max-width:760px){.shell{display:block}.side{padding:16px}.side .brand{margin:0 0 10px}}
/* Match the catalog sidebar exactly, regardless of legacy editor styles. */
.side{width:100%;min-width:0}
.side nav{display:flex;flex-direction:column;align-items:stretch;gap:0;overflow:visible}
.side nav form{display:block;width:100%;margin:0}
.side nav a,.side nav .side-create{box-sizing:border-box;min-height:52px;display:flex;align-items:center;width:100%;padding:13px 16px;margin:0 0 6px;border-radius:20px;line-height:1.55}
.side nav .side-create{appearance:none}
.side nav a.active{background:#e8eef5;color:#284b79}
.side-bottom{width:100%}
.side-bottom .site-link{min-height:52px}
.side-bottom .logout button{min-height:54px}
@media(min-width:761px){.side{position:sticky;top:0;height:100vh;min-height:100vh}.side-bottom{margin-top:auto}}
@media(max-width:760px){.side nav{flex-direction:row;overflow-x:auto}.side nav form{width:auto;flex:none}.side nav a,.side nav .side-create{width:auto;white-space:nowrap}.side-bottom{margin-top:12px}}

.editor-language-top{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap}.editor-language-top>span{font-size:13px;color:#68727d}.editor-language-top .languages{display:flex;gap:8px}.editor-language-top .languages a{min-width:55px}.title-count{text-align:right;color:#7b8793;font-size:12px;margin-top:6px}.extra-seo{padding-top:16px}.extra-seo h2{margin:4px 0 12px}.rail-card details .delete-language-button{margin-top:16px}
`;
function page(body:string,status=200):Response{const headers=new Headers(securityHeaders());headers.set('Content-Type','text/html; charset=utf-8');headers.set('Content-Security-Policy',"default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; script-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><link rel="icon" href="/admin-icons/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/admin-icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/admin-icons/favicon-16x16.png"><link rel="apple-touch-icon" sizes="180x180" href="/admin-icons/apple-touch-icon.png"><title>Редактор — Белла Рыбка</title><style>${styles}${adminSidebarCss}</style></head><body>${body}</body></html>`,{status,headers})}
export async function onRequestGet({request,env}:Context):Promise<Response>{
 if(!env.DB||!env.ADMIN_PASSWORD_HASH)return page('<p>Редактор не настроен.</p>',503);
 if(!await authenticated(request,env))return new Response(null,{status:303,headers:{Location:'/admin/','Cache-Control':'no-store'}});
 const url=new URL(request.url),isNew=url.searchParams.get('new')==='1',id=isNew?'':url.searchParams.get('id'),lang=url.searchParams.get('lang')||'ru';
 if((!id&&!isNew)||!['ru','en','fr'].includes(lang))return page('<p>Неверный адрес статьи.</p>',400);
 const columns=(await env.DB.prepare("PRAGMA table_info(articles)").all<{name:string}>()).results||[];
 if(!columns.some(c=>c.name==='cover_key'))await env.DB.prepare('ALTER TABLE articles ADD COLUMN cover_key TEXT').run();
 const rows=isNew?{results:[{id:'',slug:'',cover_alt:'',cover_key:null,lang:null,title:null,excerpt:null,body_json:null,seo_title:null,seo_description:null,published_at:null,status:null} as Row]}:await env.DB.prepare('SELECT a.id,a.slug,a.cover_alt,a.cover_key,t.lang,t.title,t.excerpt,t.body_json,t.seo_title,t.seo_description,t.published_at,t.status FROM articles a LEFT JOIN article_translations t ON a.id=t.article_id WHERE a.id=?').bind(id).all<Row>();
 if(!rows.results?.length)return page('<p>Статья не найдена.</p>',404);
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS article_working_versions (article_id TEXT NOT NULL,lang TEXT NOT NULL,title TEXT NOT NULL DEFAULT '',body_json TEXT NOT NULL DEFAULT '',excerpt TEXT NOT NULL DEFAULT '',seo_title TEXT NOT NULL DEFAULT '',seo_description TEXT NOT NULL DEFAULT '',seo_title_manual INTEGER NOT NULL DEFAULT 0,seo_description_manual INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(article_id,lang))").run();
 const r=rows.results[0],published=rows.results.find(x=>x.lang===lang);
 const working=isNew?null:await env.DB.prepare('SELECT * FROM article_working_versions WHERE article_id=? AND lang=?').bind(id,lang).first<any>();
 const t=working?{...published,...working,status:published?.status||'draft'}:published;
 const tabs=['ru','en','fr'].map(l=>`<a class="${l===lang?'active':''}" href="${isNew?`/admin/edit?new=1&lang=${l}`:`/admin/edit?id=${encodeURIComponent(id)}&lang=${l}`}">${l.toUpperCase()}</a>`).join('');
 const saved=url.searchParams.get('saved')==='1'?'<p class="notice">Изменения сохранены.</p>':url.searchParams.get('removed')==='1'?'<p class="notice">Языковая версия удалена. Остальные версии статьи сохранены.</p>':'';
 const body=`<div class="shell">${adminSidebar(isNew?'new':'all')}<main class="main"><p class="breadcrumb"><a href="/admin/">Публикации</a> / Редактирование</p><header class="heading"><div><h1>${isNew?'Новая публикация':'Редактор статьи'}</h1></div><span class="status-pill">${esc(t?.status==='published'?'Опубликовано':t?.status==='draft'?'Черновик':'Новая версия')}</span></header>${saved}<form id="article-form" method="post" action="/admin/save"><input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="lang" value="${esc(lang)}"><input type="hidden" name="body_json" id="body-json"><input type="hidden" name="excerpt" value=""><div class="workspace"><div class="writing"><section class="card"><div class="editor-language-top"><span>Язык публикации</span><div class="languages">${tabs}</div></div><label for="title">Название публикации</label><input id="title" name="title" maxlength="50" value="${esc(t?.title)}" placeholder="Название статьи"><div class="title-count"><span id="title-counter">0 / 50</span></div></section><section class="card"><h2>Содержание</h2><div class="toolbar" role="toolbar" aria-label="Форматирование"><button type="button" data-command="bold" title="Жирный"><b>Ж</b></button><button type="button" data-command="italic" title="Курсив"><i>К</i></button><button type="button" data-command="formatBlock" data-value="h2">Заголовок</button><button type="button" data-command="formatBlock" data-value="p">Абзац</button><button type="button" data-command="insertUnorderedList">Список</button><button type="button" data-command="formatBlock" data-value="blockquote">Цитата</button><button type="button" data-command="createLink">Ссылка</button></div><div id="editor" class="editor" contenteditable="true" role="textbox" aria-label="Текст статьи" aria-multiline="true"></div><textarea id="initial-body" hidden>${esc(t?.body_json||'{"type":"doc","html":""}' )}</textarea></section></div><aside class="rail" aria-label="Параметры публикации"><section class="rail-card"><h2>Управление</h2><p class="meta">Сохранение не публикует изменения. Перед переключением языка сохраните работу.</p><div class="actions"><button type="submit" name="action" value="draft">Сохранить</button><button class="secondary" type="button" id="preview-button">Предпросмотр</button><button class="secondary" type="submit" name="action" value="publish">${published?.status==="published"?"Опубликовать изменения":"Опубликовать"}</button>${isNew?'':'<button class="secondary" type="submit" name="action" value="unpublish">Снять с публикации</button>'}</div><p class="note">«Сохранить» не меняет публичную редакцию. «Опубликовать» выпускает текущую версию в D1.</p></section><section class="rail-card"><h2>Публикация</h2><label for="published-at">Дата публикации</label><input id="published-at" type="date" name="published_at" value="${esc(t?.published_at?.slice(0,10)||'')}"><p class="note">Если оставить пустым, при первой публикации установится текущая дата.</p></section><section class="rail-card"><h2>Общая обложка</h2>${r.cover_key?`<img src="/publication-images/${encodeURIComponent(r.cover_key)}" alt="" style="width:100%;border-radius:12px;margin-bottom:10px">`:'<p class="note">Обложка не загружена.</p>'}<p class="note">Одна обложка для RU, EN и FR.</p>${isNew?'<p class="note">Сначала сохраните статью.</p>':`<div class="cover-upload"><label for="cover-file">Изображение JPEG, PNG или WebP</label><input type="file" id="cover-file" name="image" form="cover-upload-form" accept="image/jpeg,image/png,image/webp" required><label for="cover-alt">Описание изображения</label><input id="cover-alt" name="alt" form="cover-upload-form" maxlength="200" value="${esc(r.cover_alt)}"><button type="submit" form="cover-upload-form" class="secondary" style="margin-top:12px;width:100%">Загрузить обложку</button></div>`}</section><section class="rail-card"><details><summary>Дополнительно</summary><button type="submit" form="delete-language-form" class="delete-language-button" ${isNew||!(published?.lang||working)?'disabled':''}>Удалить только ${lang.toUpperCase()} версию</button><div class="extra-seo"><h2>Поисковая оптимизация</h2><input type="hidden" id="seo-title-manual" name="seo_title_manual" value="${working?.seo_title_manual??Number(!!t?.seo_title)}"><label for="seo-title">SEO-заголовок</label><input id="seo-title" name="seo_title" maxlength="200" data-manual="seo-title-manual" value="${esc(t?.seo_title)}"><input type="hidden" id="seo-description-manual" name="seo_description_manual" value="${working?.seo_description_manual??Number(!!t?.seo_description)}"><label for="seo-description">SEO-описание</label><textarea id="seo-description" name="seo_description" maxlength="320" data-manual="seo-description-manual">${esc(t?.seo_description)}</textarea><p>SEO формируется автоматически. Ручные правки сохраняются.</p></div></details></section></aside></div></form><form id="cover-upload-form" method="post" action="/admin/cover" enctype="multipart/form-data"><input type="hidden" name="id" value="${esc(id)}"></form><form id="delete-language-form" method="post" action="/admin/delete-language"><input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="lang" value="${esc(lang)}"></form><section id="preview" class="preview" hidden aria-live="polite"></section><p id="editor-error" class="danger" role="alert"></p></main></div><script src="/admin-editor.js" defer></script>`;
 return page(body);
}
