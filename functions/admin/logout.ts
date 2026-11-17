import {clearCookie,endSession,redirect,validCsrf,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
export async function onRequestPost({request,env}:Context):Promise<Response> {
  const form = await request.formData().catch(()=>null);
  if(!form || !(await validCsrf(request,form,env))) return new Response('Forbidden',{status:403,headers:securityHeaders()});
  await endSession(request,env);
  return redirect(request,'/admin/',clearCookie);
}
