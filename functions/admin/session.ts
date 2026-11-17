import {authenticated,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
export async function onRequestGet({request,env}:Context):Promise<Response> {
  const ok=await authenticated(request,env);
  return new Response(JSON.stringify({authenticated:ok}),{status:ok?200:401,headers:{...securityHeaders(),'Content-Type':'application/json'}});
}
