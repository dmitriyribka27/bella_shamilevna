import {authenticated,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
type Row={id:string;slug:string;cover_alt:string;lang:string|null;title:string|null;excerpt:string|null;body_json:string|null;seo_title:string|null;seo_description:string|null;status:string|null};
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
.main{max-width:none;padding:36px clamp(20px,3.1vw,58px) 90px}
.breadcrumb{font-size:13px;color:#68727d;margin:0 0 18px}
.breadcrumb a{color:#566a7e}
.heading{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:28px}
.heading h1{font-size:clamp(25px,2.2vw,34px);letter-spacing:-.035em;font-weight:600;margin:0 0 5px}
.heading .note{margin:0;font-size:13px}
.status-pill{display:inline-flex;align-items:center;gap:7px;background:#e9eff5;color:#2a527b;border-radius:20px;padding:6px 12px;font-size:12px;white-space:nowrap}
.status-pill:before{content:"";width:6px;height:6px;background:#527aa0;border-radius:50%}
.workspace{display:grid;grid-template-columns:minmax(0,1fr) 284px;gap:24px;align-items:start}
.writing{min-width:0}.card{margin:0 0 22px;padding:clamp(20px,2.6vw,38px);border-color:#e3e4e4;border-radius:10px;box-shadow:0 3px 14px rgba(35,45,55,.025)}
.card h2{font-size:16px;font-weight:650;margin:0 0 22px}
.card label{font-size:13px;color:#5b6269;font-weight:550;margin:21px 0 7px}
.card label:first-child{margin-top:0}
input,textarea{border-color:#d9dddf;border-radius:6px;padding:12px 14px;transition:border-color .15s,box-shadow .15s}
input:focus,textarea:focus,.editor:focus{outline:none;border-color:#6286ad;box-shadow:0 0 0 3px rgba(53,103,159,.11)}
#title{font-size:24px;letter-spacing:-.02em;font-weight:550;padding:14px 15px}
#excerpt{min-height:88px}
.editor{min-height:460px;background:#fff;border-color:#d9dddf;border-radius:0 0 6px 6px;padding:26px clamp(18px,3vw,40px);font-size:17px;line-height:1.85}
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
@media(max-width:760px){.shell{display:block}.side{position:static;height:auto;padding:15px;border-bottom:1px solid #ddd}.side .logout{position:static;margin-top:10px}.brand{margin:0 0 8px}.side nav{display:flex;gap:4px;overflow:auto}.side nav a{white-space:nowrap}.main{padding:22px 14px 70px}.heading{margin-bottom:18px}.rail{display:flex}.rail-card .actions{grid-template-columns:1fr 1fr}.card{padding:18px}.editor{padding:18px;min-height:350px}#title{font-size:21px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
`;
function page(body:string,status=200):Response{const headers=new Headers(securityHeaders());headers.set('Content-Type','text/html; charset=utf-8');headers.set('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; script-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Редактор — Белла Рыбка</title><style>${styles}</style></head><body>${body}</body></html>`,{status,headers})}
export async function onRequestGet({request,env}:Context):Promise<Response>{
 if(!env.DB||!env.ADMIN_PASSWORD_HASH)return page('<p>Редактор не настроен.</p>',503);
 if(!await authenticated(request,env))return new Response(null,{status:303,headers:{Location:'/admin/','Cache-Control':'no-store'}});
 const url=new URL(request.url),id=url.searchParams.get('id'),lang=url.searchParams.get('lang')||'ru';
 if(!id||!['ru','en','fr'].includes(lang))return page('<p>Неверный адрес статьи.</p>',400);
 const rows=await env.DB.prepare('SELECT a.id,a.slug,a.cover_alt,t.lang,t.title,t.excerpt,t.body_json,t.seo_title,t.seo_description,t.status FROM articles a LEFT JOIN article_translations t ON a.id=t.article_id WHERE a.id=?').bind(id).all<Row>();
 if(!rows.results?.length)return page('<p>Статья не найдена.</p>',404);
 const r=rows.results[0],t=rows.results.find(x=>x.lang===lang);
 const tabs=['ru','en','fr'].map(l=>`<a class="${l===lang?'active':''}" href="/admin/edit?id=${encodeURIComponent(id)}&lang=${l}">${l.toUpperCase()}</a>`).join('');
 const saved=url.searchParams.get('saved')==='1'?'<p class="notice">Изменения сохранены.</p>':'';
 const body=`<div class="shell"><aside class="side"><p class="brand">Белла Рыбка</p><nav aria-label="Разделы редактора"><a class="active" href="/admin/">Публикации</a><a href="/admin/#new">Создать новую</a><a href="/admin/#drafts">Черновики</a><a href="/" target="_blank" rel="noopener">Открыть сайт</a></nav><form class="logout" action="/admin/logout" method="post"><button class="secondary">Выйти</button></form></aside><main class="main"><p class="breadcrumb"><a href="/admin/">Публикации</a> / Редактирование</p><header class="heading"><div><h1>Редактор статьи</h1><p class="note">Материал: /${esc(r.slug)}</p></div><span class="status-pill">${esc(t?.status==='published'?'Опубликовано в базе':t?.status==='draft'?'Черновик':'Новая версия')}</span></header>${saved}<form id="article-form" method="post" action="/admin/save"><input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="lang" value="${esc(lang)}"><input type="hidden" name="body_json" id="body-json"><div class="workspace"><div class="writing"><section class="card"><label for="title">Название публикации</label><input id="title" name="title" maxlength="200" required value="${esc(t?.title)}" placeholder="Название статьи"><label for="excerpt">Краткое описание</label><textarea id="excerpt" name="excerpt" maxlength="1000" placeholder="О чём эта статья — несколько предложений">${esc(t?.excerpt)}</textarea></section><section class="card"><h2>Содержание</h2><div class="toolbar" role="toolbar" aria-label="Форматирование"><button type="button" data-command="bold" title="Жирный"><b>Ж</b></button><button type="button" data-command="italic" title="Курсив"><i>К</i></button><button type="button" data-command="formatBlock" data-value="h2">Заголовок</button><button type="button" data-command="formatBlock" data-value="p">Абзац</button><button type="button" data-command="insertUnorderedList">Список</button><button type="button" data-command="formatBlock" data-value="blockquote">Цитата</button><button type="button" data-command="createLink">Ссылка</button></div><div id="editor" class="editor" contenteditable="true" role="textbox" aria-label="Текст статьи" aria-multiline="true"></div><textarea id="initial-body" hidden>${esc(t?.body_json||'{"type":"doc","content":[]}' )}</textarea></section></div><aside class="rail" aria-label="Параметры публикации"><section class="rail-card"><h2>Управление</h2><p class="meta">Все изменения сохраняются после нажатия кнопки. Переход между языками не сохраняет текст автоматически.</p><div class="actions"><button type="submit" name="action" value="draft">Сохранить черновик</button><button class="secondary" type="button" id="preview-button">Предпросмотр</button><button class="secondary" type="submit" name="action" value="publish">Отметить опубликованной</button><button class="secondary" type="submit" name="action" value="unpublish">Снять с публикации</button></div><p class="note">Публикация на самом сайте пока не подключена. Кнопка меняет статус в D1.</p></section><section class="rail-card"><h2>Язык статьи</h2><div class="languages">${tabs}</div></section><section class="rail-card"><details><summary>Поисковая оптимизация</summary><label for="seo-title">SEO-заголовок</label><input id="seo-title" name="seo_title" maxlength="200" value="${esc(t?.seo_title)}"><label for="seo-description">SEO-описание</label><textarea id="seo-description" name="seo_description" maxlength="320">${esc(t?.seo_description)}</textarea><p>Эти данные будут использованы после подключения публичных страниц.</p></details></section><section class="rail-card"><h2>Адрес материала</h2><p class="meta">/${esc(r.slug)}</p><p class="meta">Адрес создаётся при добавлении статьи и пока не редактируется.</p></section></aside></div></form><section id="preview" class="preview" hidden aria-live="polite"></section><p id="editor-error" class="danger" role="alert"></p></main></div><script src="/admin-editor.js" defer></script>`;
 return page(body);
}
