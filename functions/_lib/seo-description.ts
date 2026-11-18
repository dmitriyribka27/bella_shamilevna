
function seoDescriptionFromHtml(html,title=''){
 const decode=s=>String(s||'').replace(/&(#x[0-9a-f]+|#[0-9]+|amp|nbsp|lt|gt|quot|apos|#39|ndash|mdash|hellip);/gi,(all,entity)=>{
  const key=entity.toLowerCase();
  if(key[0]==='#'){
   const code=key.startsWith('#x')?parseInt(key.slice(2),16):parseInt(key.slice(1),10);
   return code>0&&code<=0x10ffff?String.fromCodePoint(code):' ';
  }
  return ({amp:'&',nbsp:' ',lt:'<',gt:'>',quot:'"',apos:"'",ndash:'–',mdash:'—',hellip:'…'})[key]||all;
 });
 const normalize=s=>decode(String(s||'').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
 const cleanHtml=String(html||'').replace(/<!--[\s\S]*?-->/g,'').replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi,'');
 const headings=[...cleanHtml.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map(x=>normalize(x[1])).filter(Boolean);
 const blocks=[...cleanHtml.matchAll(/<(p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(x=>({type:x[1].toLowerCase(),value:normalize(x[2])})).filter(x=>x.value);
 if(!blocks.length){
  const withoutHeadings=cleanHtml.replace(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi,' ');
  const raw=normalize(withoutHeadings);
  if(raw)blocks.push({type:'p',value:raw});
 }
 const stop=new Set(['и','или','но','как','что','это','для','при','над','под','все','всех','его','её','их','по','от','из','на','не','за','со','во','же','бы','он','она','мы','они','вы','вам','нас','вас','кто','где','когда','если','почему','может','важно','весь','свой','свои','своей','каждый','человек','людей','жизни','жизнь','the','and','for','with','this','that','from','into','your','you','are','how','why','une','les','des','est','pour','avec']);
 const words=s=>(s.toLowerCase().match(/[\p{L}]{4,}/gu)||[]).filter(w=>!stop.has(w));
 const roots=s=>new Set(words(s).map(w=>w.slice(0,Math.min(5,w.length))));
 const titleRoots=roots(title),headingRoots=roots(headings.join(' '));
 const candidates=[];
 for(let b=0;b<blocks.length;b++){
  const block=blocks[b];
  // Full stops, question marks and exclamation marks delimit sentences; never cut mid-word.
  const segments=block.value.match(/[^.!?…]+(?:[.!?…]+(?=\s|$)|$)/g)||[];
  for(let n=0;n<segments.length;n++){
   const sentence=segments[n].trim().replace(/^[—–•\s]+/,'').trim();
   if(!sentence||sentence.length<35||sentence.length>260)continue;
   const complete=/[.!?…]$/.test(sentence);
   if(!complete)continue;
   const low=sentence.toLowerCase();
   const r=roots(sentence);
   let score=0;
   for(const w of r){if(titleRoots.has(w))score+=7;if(headingRoots.has(w))score+=3}
   if(block.type==='p')score+=4;
   if(block.type==='blockquote')score-=5;
   if(block.type==='li')score-=3;
   if(sentence.length>=65&&sentence.length<=180)score+=5;
   if(sentence.length>200)score-=8;
   if(sentence.endsWith('?'))score-=12;
   if(/^(каждый человек|в этой статье|в данной статье|далее мы|здесь мы|узнайте|представьте|вопрос заключается|вопрос о том|важно понимать|существует множество|на протяжении)/i.test(low))score-=10;
   if(/^(в экзистенциальной|в психологии|исследовани|подход|проблем|смысл|анализ|автор|рассматрива|понимани|отношени)/i.test(low))score+=3;
   score-=b*0.35+n*0.1;
   candidates.push({sentence,score,b,n});
  }
 }
 if(!candidates.length)return '';
 candidates.sort((a,b)=>b.score-a.score||a.b-b.b||a.n-b.n);
 const top=candidates[0];
 // Prefer one accurate complete sentence; add a related adjacent sentence only if naturally compact.
 if(top.sentence.length<90){
  const next=candidates.find(x=>x.b===top.b&&x.n===top.n+1&&x.sentence.length>=30&&x.sentence.length<=140&&!x.sentence.endsWith('?'));
  if(next&&top.sentence.length+1+next.sentence.length<=185)return top.sentence+' '+next.sentence;
 }
 return top.sentence;
}

export {seoDescriptionFromHtml};
