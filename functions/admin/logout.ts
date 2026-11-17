import {clearCookie,endSession,redirect,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
export async function onRequestPost({request,env}:Context):Promise<Response> {
  const origin=request.headers.get('Origin');
  if(origin && origin!==new URL(request.url).origin) return new Response('Forbidden',{status:403,headers:securityHeaders()});
  if(request.headers.get('Sec-Fetch-Site')==='cross-site') return new Response('Forbidden',{status:403,headers:securityHeaders()});
  await endSession(request,env);
  return redirect(request,'/admin/',clearCookie);
}
