interface Env {BELLA_IMAGES?:R2Bucket;DB?:D1Database}
interface Context {request:Request;env:Env}
export async function onRequestGet({request,env}:Context):Promise<Response>{
 const url=new URL(request.url),key=decodeURIComponent(url.pathname.slice('/publication-images/'.length));
 if(!env.BELLA_IMAGES||!env.DB||!/^[0-9a-f-]{36}\.(?:jpg|png|webp)$/.test(key))return new Response('Not found',{status:404});
 const row=await env.DB.prepare(`SELECT a.id FROM articles a JOIN article_translations t ON t.article_id=a.id LEFT JOIN admin_archived_articles ar ON ar.article_id=a.id WHERE a.cover_key=? AND t.status='published' AND ar.article_id IS NULL LIMIT 1`).bind(key).first();
 if(!row)return new Response('Not found',{status:404});
 const obj=await env.BELLA_IMAGES.get(key);
 if(!obj)return new Response('Not found',{status:404});
 return new Response(obj.body,{headers:{'Content-Type':obj.httpMetadata?.contentType||'application/octet-stream','Cache-Control':'public,max-age=3600','X-Content-Type-Options':'nosniff'}});
}
