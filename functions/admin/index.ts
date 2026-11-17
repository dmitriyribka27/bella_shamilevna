import {authenticated,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
type ArticleRow={id:string;slug:string;created_at:string;ru_title:string|null;ru_status:string|null;en_status:string|null;fr_status:string|null};
const esc=(value:unknown)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function page(content:string,status=200):Response {
 const headers=new Headers(securityHeaders());headers.set('Content-Type','text/html; charset=utf-8');
 return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Белла — редактор</title><style>
*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;background:#f8f8f6;color:#242424;margin:0;padding:clamp(18px,4vw,48px)}main{max-width:980px;margin:6vh auto}h1{font-size:clamp(26px,4vw,36px);font-weight:600}h2{font-size:20px;margin-top:38px}p{line-height:1.6;color:#555}label{display:block;margin:18px 0 8px}input{width:100%;max-width:520px;padding:13px;border:1px solid #aaa;border-radius:8px;font:inherit}button{background:#284b79;color:white;border:0;border-radius:8px;padding:12px 18px;font:inherit;cursor:pointer}button:focus-visible,input:focus-visible{outline:3px solid #7fa7dc;outline-offset:2px}.muted{color:#666}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}.logout{background:transparent;color:#284b79;border:1px solid #284b79}.panel{border:1px solid #ddd;background:#fff;border-radius:12px;padding:24px;margin-top:22px}.row{padding:15px 0;border-bottom:1px solid #e8e8e8}.row:last-child{border-bottom:0}.tag{display:inline-block;font-size:12px;padding:3px 8px;background:#f0f2f6;border-radius:4px;margin-right:6px}.slug{font-size:13px;color:#666;overflow-wrap:anywhere}.error{color:#a12626}
 .admin-side{position:fixed;left:0;top:0;bottom:0;width:235px;background:#faf9f7;border-right:1px solid #ddd;padding:32px 20px}.admin-side strong{font-size:21px}.admin-side nav{margin-top:35px}.admin-side a{display:block;padding:12px 10px;color:#284b79;text-decoration:none;border-radius:7px}.admin-side a:hover{background:#e9edf2}@media(min-width:800px){body{padding-left:265px}}@media(max-width:799px){.admin-side{position:static;width:auto;border-right:0;border-bottom:1px solid #ddd;padding:18px}.admin-side nav{display:flex;overflow-x:auto;margin-top:10px}.admin-side a{white-space:nowrap}} </style></head><body><main>${content}</main></body></html>`,{status,headers});
}
const login='<h1>Вход в редактор</h1><form method="post" action="/admin/login"><label for="password">Пароль</label><input id="password" name="password" type="password" autocomplete="current-password" required><p><button type="submit">Войти</button></p></form><p>Доступ только для автора сайта.</p>';
export async function onRequestGet({request,env}:Context):Promise<Response> {
 if(!env.DB||!env.ADMIN_PASSWORD_HASH)return page('<h1>Редактор временно недоступен</h1><p>Проверьте привязку D1 и секрет.</p>',503);
 if(!await authenticated(request,env))return page(login);
 try{
 const data=await env.DB.prepare(`SELECT a.id,a.slug,a.created_at,
 MAX(CASE WHEN t.lang='ru' THEN t.title END) AS ru_title,
 MAX(CASE WHEN t.lang='ru' THEN t.status END) AS ru_status,
 MAX(CASE WHEN t.lang='en' THEN t.status END) AS en_status,
 MAX(CASE WHEN t.lang='fr' THEN t.status END) AS fr_status
 FROM articles a LEFT JOIN article_translations t ON t.article_id=a.id
 GROUP BY a.id ORDER BY a.created_at DESC LIMIT 100`).all<ArticleRow>();
 const rows=(data.results||[]).map(a=>`<div class="row"><strong><a href="/admin/edit?id=${encodeURIComponent(a.id)}&lang=ru">${esc(a.ru_title||'Без названия')}</a></strong><div class="slug">/${esc(a.slug)}</div><p><span class="tag">RU: ${esc(a.ru_status||'нет')}</span><span class="tag">EN: ${esc(a.en_status||'нет')}</span><span class="tag">FR: ${esc(a.fr_status||'нет')}</span></p></div>`).join('');
 const msg=new URL(request.url).searchParams.get('created')== '1'?'<p>Черновик создан.</p>':'';
 return page(`<aside class="admin-side"><strong>Белла Рыбка</strong><nav><a href="/admin/">Публикации</a><a href="/admin/#new">Создать новую</a><a href="/admin/#drafts">Черновики</a><a href="/" target="_blank" rel="noopener">Открыть сайт</a></nav></aside><div class="toolbar"><h1>Редактор публикаций</h1><form method="post" action="/admin/logout"><button class="logout" type="submit">Выйти</button></form></div>${msg}<section class="panel" id="new"><h2>Новая публикация</h2><p class="muted">Создаём пустой черновик. После создания нажмите на название статьи в списке, чтобы открыть редактор.</p><form method="post" action="/admin/create"><label for="title">Название на русском</label><input id="title" name="title" maxlength="200" required><label for="slug">Адрес статьи (латиница, цифры и дефис)</label><input id="slug" name="slug" pattern="[a-z0-9]+(-[a-z0-9]+)*" maxlength="120" required placeholder="nazvanie-stati"><p><button type="submit">Создать черновик</button></p></form></section><section class="panel" id="drafts"><h2>Публикации</h2>${rows||'<p>Пока публикаций нет.</p>'}</section>`);
 }catch(e){console.error('Admin list query failed',e);return page('<h1>Не удалось загрузить список</h1><p>Проверьте таблицы D1. Вход и сессия сохранены.</p>',500);}
}
