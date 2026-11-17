interface Env {BELLA_IMAGES?:R2Bucket;DB?:D1Database}
interface Context {request:Request;env:Env;waitUntil?:(promise:Promise<unknown>)=>void}
export async function onRequestGet({request,env,waitUntil}:Context):Promise<Response>{
 const url=new URL(request.url),key=decodeURIComponent(url.pathname.slice('/publication-images/'.length));
 if(!env.BELLA_IMAGES||!env.DB||!/^[0-9a-f-]{36}\.(?:jpg|png|webp)$/.test(key))return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
 // Check publication state even on cache hits: hidden and deleted articles must not leak images.
 const row=await env.DB.prepare("SELECT a.id FROM articles a JOIN article_translations t ON t.article_id=a.id LEFT JOIN admin_archived_articles ar ON ar.article_id=a.id WHERE a.cover_key=? AND t.status='published' AND ar.article_id IS NULL LIMIT 1").bind(key).first();
 if(!row)return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
 const cache=typeof caches!=='undefined'?caches.default:null;
 const cacheKey=new Request(url.origin+'/publication-images/'+key,{method:'GET'});
 if(cache){const hit=await cache.match(cacheKey);if(hit)return hit}
 const obj=await env.BELLA_IMAGES.get(key);
 if(!obj)return new Response('Not found',{status:404,headers:{'Cache-Control':'no-store'}});
 const response=new Response(obj.body,{headers:{'Content-Type':obj.httpMetadata?.contentType||'application/octet-stream','Cache-Control':'public,max-age=3600','X-Content-Type-Options':'nosniff'}});
 if(cache&&waitUntil)waitUntil(cache.put(cacheKey,response.clone()).catch(e=>console.error('Cover cache error',e)));
 return response;
}
