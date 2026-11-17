// Cloudflare Pages Functions authentication. Never import this module in Astro/client code.
export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD_HASH?: string;
}
type SessionRow = { token_hash: string };
const encoder = new TextEncoder();
const COOKIE = 'bella_admin_session';
const MAX_AGE = 60 * 60 * 12;
const ITERATIONS = 310000;
function hex(bytes: Uint8Array): string { return Array.from(bytes, b => b.toString(16).padStart(2,'0')).join(''); }
function fromHex(value: string): Uint8Array | null {
  if (!/^(?:[0-9a-f]{2})+$/i.test(value)) return null;
  return new Uint8Array(value.match(/.{2}/g)!.map(x => parseInt(x,16)));
}
async function digest(value: string): Promise<string> {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))));
}
function equal(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i=0;i<a.length;i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
export async function verifyPassword(password: string, stored?: string): Promise<boolean> {
  if (!stored || password.length > 1024) return false;
  const match = /^pbkdf2-sha256\$310000\$([a-f0-9]{32})\$([a-f0-9]{64})$/i.exec(stored);
  if (!match) return false;
  const salt = fromHex(match[1])!, expected = fromHex(match[2])!;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const actual = new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:ITERATIONS,hash:'SHA-256'},key,256));
  return equal(actual, expected);
}
function cookieValue(request: Request): string | null {
  const cookie = request.headers.get('Cookie') || '';
  const value = cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}
export async function authenticated(request: Request, env: Env): Promise<boolean> {
  const token = cookieValue(request);
  if (!token || !env.DB || !env.ADMIN_PASSWORD_HASH) return false;
  const row = await env.DB.prepare("SELECT token_hash FROM admin_sessions WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > datetime('now')").bind(await digest(token)).first<SessionRow>();
  return !!row;
}
export async function startSession(env: Env): Promise<{cookie:string}> {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const expiry = new Date(Date.now()+MAX_AGE*1000).toISOString();
  await env.DB.prepare('INSERT INTO admin_sessions(token_hash, expires_at) VALUES (?,?)').bind(await digest(token),expiry).run();
  return {cookie:`${COOKIE}=${token}; Path=/admin; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Strict`};
}
export async function endSession(request: Request, env: Env): Promise<void> {
  const token = cookieValue(request);
  if (token && env.DB) await env.DB.prepare("UPDATE admin_sessions SET revoked_at=datetime('now') WHERE token_hash=?").bind(await digest(token)).run();
}
export const clearCookie = `${COOKIE}=; Path=/admin; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
export function securityHeaders(): HeadersInit {
  return {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"};
}
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin');
  return !!origin && origin === new URL(request.url).origin;
}
export function redirect(request: Request, path: string, cookie?: string): Response {
  const headers = new Headers(securityHeaders()); headers.set('Location',new URL(path,request.url).toString());
  if(cookie) headers.set('Set-Cookie',cookie);
  return new Response(null,{status:303,headers});
}
