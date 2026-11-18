import {authenticated,securityHeaders} from '../_lib/auth';
import {ensurePendingCoverColumn} from '../_lib/pending-cover';
import type {Env as BaseEnv} from '../_lib/auth';
interface Env extends BaseEnv {BELLA_IMAGES?:R2Bucket}
interface Context {request:Request;env:Env}
export async function onRequestGet({request,env}:Context):Promise<Response>{
 const headers=securityHeaders();
 if(!env.BELLA_IMAGES||!env.DB||!await authenticated(request,env))return new Response('Unauthorized',{status:401,headers});
 const id=new URL(request.url).searchParams.get('id');
 if(!id||id.length>100)return new Response('Invalid article',{status:400,headers});
 await ensurePendingCoverColumn(env.DB);
 const row=await env.DB.prepare('SELECT cover_key,pending_cover_key FROM articles WHERE id=?').bind(id).first<{cover_key:string|null;pending_cover_key:string|null}>();
 const key=row?.pending_cover_key||row?.cover_key;
 if(!key)return new Response('Not found',{status:404,headers});
 const object=await env.BELLA_IMAGES.get(key);
 if(!object)return new Response('Not found',{status:404,headers});
 const h=new Headers(headers);h.set('Content-Type',object.httpMetadata?.contentType||'application/octet-stream');
 return new Response(object.body,{headers:h});
}
