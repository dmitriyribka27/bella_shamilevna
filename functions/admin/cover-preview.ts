import {authenticated,securityHeaders} from '../_lib/auth';
import type {Env as BaseEnv} from '../_lib/auth';
interface Env extends BaseEnv {BELLA_IMAGES?:R2Bucket}
interface Context {request:Request;env:Env}
export async function onRequestGet({request,env}:Context):Promise<Response>{
 const headers=securityHeaders();
 if(!env.BELLA_IMAGES||!env.DB||!await authenticated(request,env))return new Response('Unauthorized',{status:401,headers});
 const id=new URL(request.url).searchParams.get('id');
 if(!id||id.length>100)return new Response('Invalid article',{status:400,headers});
 const row=await env.DB.prepare('SELECT cover_key FROM articles WHERE id=?').bind(id).first<{cover_key:string|null}>();
 if(!row?.cover_key)return new Response('Not found',{status:404,headers});
 const object=await env.BELLA_IMAGES.get(row.cover_key);
 if(!object)return new Response('Not found',{status:404,headers});
 const h=new Headers(headers);h.set('Content-Type',object.httpMetadata?.contentType||'application/octet-stream');
 return new Response(object.body,{headers:h});
}
