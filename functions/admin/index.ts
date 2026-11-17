import {authenticated,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
function page(content:string):Response {
  return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Белла — редактор</title><style>body{font-family:system-ui,sans-serif;background:#f8f8f6;color:#242424;min-height:100vh;display:grid;place-items:center;margin:0;padding:20px;box-sizing:border-box}main{width:min(100%,420px)}h1{font-size:27px;font-weight:600}label{display:block;margin:22px 0 8px}input{box-sizing:border-box;width:100%;padding:13px;border:1px solid #aaa;border-radius:8px;font:inherit}button{background:#284b79;color:white;border:0;border-radius:8px;padding:13px 18px;font:inherit;margin-top:18px;cursor:pointer}p{line-height:1.5;color:#555}</style></head><body><main>${content}</main></body></html>`,{headers:{...securityHeaders(),'Content-Type':'text/html; charset=utf-8'}});
}
export async function onRequestGet({request,env}:Context):Promise<Response> {
  if(!env.DB || !env.ADMIN_PASSWORD_HASH) return page('<h1>Редактор временно недоступен</h1><p>Проверьте привязку D1 и секрет ADMIN_PASSWORD_HASH в Cloudflare.</p>');
  if(await authenticated(request,env)) return page('<h1>Редактор публикаций</h1><p>Вход выполнен. Редактор статей будет подключён на следующем этапе.</p><form method="post" action="/admin/logout"><button type="submit">Выйти</button></form>');
  return page('<h1>Вход в редактор</h1><form method="post" action="/admin/login"><label for="password">Пароль</label><input id="password" name="password" type="password" autocomplete="current-password" required><button type="submit">Войти</button></form><p>Доступ только для автора сайта.</p>');
}
