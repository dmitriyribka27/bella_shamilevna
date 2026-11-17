import {redirect,securityHeaders,startSession,verifyPassword} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
export async function onRequestPost({request,env}:Context):Promise<Response> {
  const headers=securityHeaders();
  const origin=request.headers.get('Origin');
  if(origin && origin!==new URL(request.url).origin) return new Response('Forbidden',{status:403,headers});
  if(request.headers.get('Sec-Fetch-Site')==='cross-site') return new Response('Forbidden',{status:403,headers});
  if(!env.DB || !env.ADMIN_PASSWORD_HASH) return new Response('Admin is not configured',{status:503,headers});
  if(Number(request.headers.get('Content-Length')||0)>4096) return new Response('Request too large',{status:413,headers});
  const form=await request.formData().catch(()=>null);
  const password=form?.get('password');
  if(typeof password!=='string'||password.length>1024) return new Response('Invalid request',{status:400,headers});
  const ip=request.headers.get('CF-Connecting-IP')||'unknown';
  const ipHash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));
  const key=Array.from(new Uint8Array(ipHash),b=>b.toString(16).padStart(2,'0')).join('');
  const row=await env.DB.prepare('SELECT failures,blocked_until,window_started_at FROM login_attempts WHERE ip_hash=?').bind(key).first<{failures:number;blocked_until:string|null;window_started_at:string}>();
  if(row?.blocked_until && Date.parse(row.blocked_until+'Z')>Date.now()) return new Response('Too many attempts. Try later.',{status:429,headers});
  if(!(await verifyPassword(password,env.ADMIN_PASSWORD_HASH))){
    const fresh=!row||Date.now()-Date.parse(row.window_started_at+'Z')>15*60*1000;
    const failures=fresh?1:row.failures+1;
    const blocked=failures>=5?new Date(Date.now()+15*60*1000).toISOString().replace('T',' ').slice(0,19):null;
    await env.DB.prepare("INSERT INTO login_attempts(ip_hash,failures,window_started_at,blocked_until) VALUES(?,?,datetime('now'),?) ON CONFLICT(ip_hash) DO UPDATE SET failures=excluded.failures,window_started_at=CASE WHEN ? THEN datetime('now') ELSE login_attempts.window_started_at END,blocked_until=excluded.blocked_until").bind(key,failures,blocked,fresh?1:0).run();
    return new Response('Неверный пароль',{status:401,headers});
  }
  await env.DB.prepare('DELETE FROM login_attempts WHERE ip_hash=?').bind(key).run();
  const session=await startSession(env);
  return redirect(request,'/admin/',session.cookie);
}
