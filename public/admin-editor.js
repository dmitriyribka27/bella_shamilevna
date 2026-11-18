(() => {
 'use strict';
 const editor=document.getElementById('editor'),form=document.getElementById('article-form'),hidden=document.getElementById('body-json'),preview=document.getElementById('preview'),error=document.getElementById('editor-error');
 if(!editor||!form)return;
 document.querySelectorAll('form[id^="delete-language-"]').forEach(f=>f.addEventListener('submit',event=>{
  const lang=f.querySelector('[name="lang"]')?.value||'';
  if(!confirm('Удалить '+lang.toUpperCase()+' версию? Остальные переводы сохранятся.'))event.preventDefault();
 }));
 document.getElementById('archive-article-form')?.addEventListener('submit',event=>{
  if(!confirm('Переместить всю статью со всеми языковыми версиями в корзину? Её можно будет восстановить.'))event.preventDefault();
 });

 // Automatically crop cover images to a centered landscape 4:3 rectangle.
 const coverForm=document.getElementById('cover-upload-form');
 const coverInput=document.getElementById('cover-file');
 if(coverForm&&coverInput){
  coverInput.addEventListener('change',()=>{const name=document.getElementById('cover-file-name');if(name)name.textContent=coverInput.files?.[0]?.name||'Файл не выбран'});
  let busy=false;
  coverForm.addEventListener('submit',async event=>{
   event.preventDefault();
   if(busy)return;
   const file=coverInput.files?.[0];
   if(!file)return;
   if(!['image/jpeg','image/png','image/webp'].includes(file.type)){alert('Выберите JPEG, PNG или WebP.');return}
   if(file.size>2_000_000){alert('Исходная фотография должна быть не больше 2 МБ.');return}
   const submit=coverForm.querySelector('button[type="submit"]');
   busy=true;if(submit)submit.disabled=true;
   try{
    const bitmap=await (async()=>{
     if(typeof createImageBitmap==='function'){try{return await createImageBitmap(file)}catch{}}
     const objectUrl=URL.createObjectURL(file);
     try{
      const img=new Image();img.src=objectUrl;await img.decode();
      return {width:img.naturalWidth,height:img.naturalHeight,drawSource:img,close(){}};
     }finally{URL.revokeObjectURL(objectUrl)}
    })();
    try{
     const ratio=4/3;
     const sourceWidth=bitmap.width,sourceHeight=bitmap.height;
     const cropWidth=Math.min(sourceWidth,sourceHeight*ratio);
     const cropHeight=cropWidth/ratio;
     const left=(sourceWidth-cropWidth)/2,top=(sourceHeight-cropHeight)/2;
     const width=Math.min(1600,Math.max(320,Math.floor(cropWidth/4)*4));
     const height=width*3/4;
     const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
     const ctx=canvas.getContext('2d');
     if(!ctx)throw new Error('Не удалось обработать фотографию.');
     ctx.drawImage(bitmap.drawSource||bitmap,left,top,cropWidth,cropHeight,0,0,width,height);
     let blob=null;
     for(const quality of [0.93,0.9,0.86,0.82,0.78]){
      blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
      if(blob&&blob.size<=2_000_000)break;
     }
     if(!blob||blob.size>2_000_000)throw new Error('Не удалось сжать обложку до 2 МБ.');
     const data=new FormData(coverForm);
     data.set('image',new File([blob],'cover.jpg',{type:'image/jpeg'}));
     let response;
     try{response=await fetch(coverForm.action,{method:'POST',body:data,credentials:'same-origin',redirect:'manual'})}
     catch(networkError){throw new Error('Сетевая ошибка при загрузке. '+String(networkError))}
     if(response.type==='opaqueredirect'){window.location.assign('/admin/edit?id='+encodeURIComponent(data.get('id'))+'&lang=ru&saved=1');return}
     if(!response.ok){const detail=await response.text().catch(()=>'');throw new Error('Ошибка загрузки ('+response.status+'): '+detail.slice(0,250))}
     
     window.location.assign(response.url);
    }finally{bitmap.close()}
   }catch(err){
    alert(err instanceof Error?err.message:'Не удалось загрузить обложку.');
    busy=false;if(submit)submit.disabled=false;
   }
  });
 }

 // Sanitize incoming rich text from Word, ChatGPT, Notes, and other browsers.
 // Preserve semantic formatting; do not retain external CSS, classes, scripts, or images.
 const blockTags=new Set(['P','H2','H3','BLOCKQUOTE','UL','OL','LI']);
 const permitted=new Set(['P','H2','H3','BLOCKQUOTE','UL','OL','LI','STRONG','EM','U','S','A','BR']);
 function safeUrl(raw){
  if(!raw||!/^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(raw.trim()))return '';
  try{const u=new URL(raw.trim(),location.origin);return ['https:','http:','mailto:'].includes(u.protocol)?u.href:''}catch{return ''}
 }
 function plainContent(text){
  const fragment=document.createDocumentFragment();
  const normalized=String(text||'').replace(/\r\n?/g,'\n');
  if(!normalized.includes('\n')){fragment.append(document.createTextNode(normalized));return fragment}
  normalized.split(/\n\n+/).forEach(section=>{
   const p=document.createElement('p');
   section.split('\n').forEach((line,i)=>{if(i)p.append(document.createElement('br'));p.append(document.createTextNode(line))});
   fragment.append(p);
  });
  return fragment;
 }
 function normalizeTag(el){
  const name=el.tagName;
  if(name==='B')return 'STRONG';
  if(name==='I')return 'EM';
  if(name==='STRIKE'||name==='DEL')return 'S';
  if(name==='INS')return 'U';
  if(name==='H1')return 'H2';
  if(name==='H4'||name==='H5'||name==='H6')return 'H3';
  if(name==='DIV')return 'P';
  if(name==='PRE')return 'P';
  if(name==='A')return 'A';
  if(name==='SPAN'||name==='FONT')return 'SPAN';
  return permitted.has(name)?name:'SPAN';
 }
 function cleanNode(node,depth=0){
  if(depth>35)return null;
  if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.textContent||'');
  if(node.nodeType!==Node.ELEMENT_NODE)return null;
  const raw=node.tagName;
  if(['SCRIPT','STYLE','META','LINK','HEAD','IFRAME','OBJECT','EMBED','SVG','IMG','FORM','INPUT','BUTTON','NOSCRIPT'].includes(raw))return null;
  // Wrapper DIVs from Word/ChatGPT must not create invalid nested paragraphs.
  if(raw==='DIV'&&Array.from(node.children).some(child=>['P','DIV','H1','H2','H3','UL','OL','BLOCKQUOTE'].includes(child.tagName))){
   const group=document.createDocumentFragment();
   for(const child of Array.from(node.childNodes)){const safe=cleanNode(child,depth+1);if(safe)group.append(safe)}
   return group;
  }
  const tag=normalizeTag(node);
  const base=document.createElement(tag==='SPAN'?'span':tag.toLowerCase());
  if(tag==='A'){
   const href=safeUrl(node.getAttribute('href')||'');
   if(href){base.setAttribute('href',href);base.setAttribute('rel','noopener noreferrer')}
  }
  for(const child of Array.from(node.childNodes)){
   const safe=cleanNode(child,depth+1);
   if(safe)base.appendChild(safe);
  }
  if(raw==='SPAN'||raw==='FONT'||raw==='P'||raw==='DIV'){
   const style=(node.getAttribute('style')||'').toLowerCase();
   const bold=/font-weight\s*:\s*(bold|[6-9]00)/.test(style);
   const italic=/font-style\s*:\s*italic/.test(style);
   const underline=/text-decoration(?:-line)?\s*:[^;]*underline/.test(style);
   const strike=/text-decoration(?:-line)?\s*:[^;]*line-through/.test(style);
   let result=base;
   // Inline marks must live INSIDE block nodes; wrapping a <p> in <strong> produces invalid HTML.
   if(tag==='P'){
    for(const [active,t] of [[bold,'strong'],[italic,'em'],[underline,'u'],[strike,'s']]){
     if(active){const wrapper=document.createElement(t);while(base.firstChild)wrapper.append(base.firstChild);base.append(wrapper)}
    }
    return base;
   }
   for(const [active,t] of [[bold,'strong'],[italic,'em'],[underline,'u'],[strike,'s']]){
    if(active){const wrapper=document.createElement(t);wrapper.appendChild(result);result=wrapper}
   }
   return result;
  }
  return base;
 }
 function sanitizedFragment(html){
  const source=document.createElement('template');
  source.innerHTML=String(html||'');
  const output=document.createDocumentFragment();
  for(const child of Array.from(source.content.childNodes)){const safe=cleanNode(child);if(safe)output.appendChild(safe)}
  return output;
 }
 function safeHtml(html){
  const holder=document.createElement('div');
  holder.append(sanitizedFragment(html));
  return holder.innerHTML;
 }
 const initial=document.getElementById('initial-body');
 try{
  const value=JSON.parse(initial.value);
  if(value&&value.type==='doc'&&typeof value.html==='string')editor.innerHTML=safeHtml(value.html);
  else if(value&&value.type==='doc'&&Array.isArray(value.content)&&value.content.length)error.textContent='Этот формат статьи пока нельзя отредактировать. Данные не изменены.';
 }catch{error.textContent='Не удалось прочитать содержимое статьи.'}
 function insertFragment(fragment){
  editor.focus();
  const selection=window.getSelection();
  if(!selection||!selection.rangeCount)return;
  const range=selection.getRangeAt(0);
  if(!editor.contains(range.commonAncestorContainer))return;
  range.deleteContents();
  const last=fragment.lastChild;
  range.insertNode(fragment);
  if(last){range.setStartAfter(last);range.collapse(true);selection.removeAllRanges();selection.addRange(range)}
  editor.dispatchEvent(new Event('input',{bubbles:true}));
 }
 editor.addEventListener('paste',event=>{
  const clipboard=event.clipboardData;
  if(!clipboard)return;
  event.preventDefault();
  const html=clipboard.getData('text/html');
  const text=clipboard.getData('text/plain');
  if(html){
   const clean=safeHtml(html);
   // Native insertion preserves Safari's undo/redo stack when available.
   if(!document.execCommand('insertHTML',false,clean))insertFragment(sanitizedFragment(html));
  }else if(!text.includes('\n')){
   if(!document.execCommand('insertText',false,text))insertFragment(plainContent(text));
  }else{
   const holder=document.createElement('div');holder.append(plainContent(text));
   if(!document.execCommand('insertHTML',false,holder.innerHTML))insertFragment(plainContent(text));
  }
  editor.dispatchEvent(new Event('input',{bubbles:true}));
 });
 // Drop must never inject unsupported browser HTML, remote assets, or files.
 editor.addEventListener('drop',event=>{
  event.preventDefault();
  const text=event.dataTransfer?.getData('text/plain');
  if(text)insertFragment(plainContent(text));
 });
 // Keep the text selection when a toolbar button is pressed (important on Safari).
 document.querySelectorAll('[data-command]').forEach(button=>{
  button.addEventListener('mousedown',event=>event.preventDefault());
  button.addEventListener('click',()=>{
   const cmd=button.dataset.command;
   if(cmd==='createLink'){
    const selection=window.getSelection();
    if(!selection||selection.isCollapsed||!selection.rangeCount||!editor.contains(selection.getRangeAt(0).commonAncestorContainer)){
     alert('Сначала выделите слово или фразу, к которой нужно добавить ссылку.');return;
    }
    const range=selection.getRangeAt(0).cloneRange();
    const input=prompt('Введите адрес ссылки (https://...)');
    if(input===null)return;
    const href=safeUrl(input);
    if(!href){alert('Укажите полный безопасный адрес https://...');return}
    editor.focus();selection.removeAllRanges();selection.addRange(range);
    document.execCommand('createLink',false,href);
   }else{
    editor.focus();
    document.execCommand(cmd,false,button.dataset.value||null);
   }
   editor.dispatchEvent(new Event('input',{bubbles:true}));
  });
 });
 editor.addEventListener('keydown',event=>{
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){
   event.preventDefault();document.querySelector('[data-command="createLink"]')?.click();
  }
 });
 // Never allow editor links to navigate away on ordinary clicks.
 editor.addEventListener('click',event=>{
  if(event.target.closest('a'))event.preventDefault();
 });
 const titleField=document.getElementById('title'),counter=document.getElementById('title-counter'),seoTitle=document.getElementById('seo-title'),seoDescription=document.getElementById('seo-description');
 const titleManual=document.getElementById('seo-title-manual'),descriptionManual=document.getElementById('seo-description-manual');
 const suggestedDescription=()=>typeof globalThis.BellaSeoDescription==='function'
  ?globalThis.BellaSeoDescription(editor.innerHTML,titleField?.value||''):'';
 function updateSeoModes(){
  const titleMode=document.getElementById('seo-title-mode');
  const descriptionMode=document.getElementById('seo-description-mode');
  if(titleMode)titleMode.textContent=titleManual?.value==='1'?'Задано вручную':'Обновляется автоматически';
  if(descriptionMode)descriptionMode.textContent=descriptionManual?.value==='1'?'Задано вручную':seoDescription?.value?'Автоматически выбрано законченное предложение из текста':'Нет подходящего предложения — заполните описание вручную';
 }
 function refreshSeo(){
  if(seoTitle&&titleManual?.value!=='1')seoTitle.value=(titleField.value.trim()?titleField.value.trim()+' — Белла Рыбка':'');
  if(seoDescription&&descriptionManual?.value!=='1')seoDescription.value=suggestedDescription();
  updateSeoModes();
 }
 seoTitle?.addEventListener('input',()=>{if(titleManual)titleManual.value='1';updateSeoModes()});
 seoDescription?.addEventListener('input',()=>{if(descriptionManual)descriptionManual.value='1';updateSeoModes()});
 function refreshCount(){if(counter)counter.textContent=String(titleField.value.length)+' / 50'}
 titleField?.addEventListener('input',()=>{refreshCount();refreshSeo()});
 refreshCount();
 editor.addEventListener('input',refreshSeo);
 document.querySelectorAll('.languages a').forEach(a=>a.addEventListener('click',e=>{if(form.dataset.dirty==='1'&&!confirm('Есть несохранённые изменения. Перейти без сохранения?'))e.preventDefault()}));
 form.addEventListener('input',()=>{form.dataset.dirty='1'});
 window.addEventListener('beforeunload',e=>{if(form.dataset.dirty==='1'){e.preventDefault();e.returnValue=''}});
 refreshSeo();
 function serialize(){return JSON.stringify({type:'doc',html:safeHtml(editor.innerHTML)})}
 form.addEventListener('submit',event=>{if(error.textContent){event.preventDefault();return}hidden.value=serialize();if(hidden.value.length>100000){event.preventDefault();error.textContent='Статья слишком длинная для этой версии редактора.'}});
 const previewDetails=document.getElementById('preview-details');
 function renderPreview(){
  preview.replaceChildren();
  const hero=document.createElement('div');hero.className='preview-hero';
  const text=document.createElement('div');
  const h=document.createElement('h2');h.textContent=titleField.value||'Без названия';text.appendChild(h);
  const date=document.getElementById('published-at')?.value||preview.dataset.publishedDate||'';
  const time=document.createElement('time');time.className='preview-date';if(date){time.dateTime=date;const parts=date.split('-');time.textContent=parts.length===3?parts.reverse().join('.'):date}else time.textContent='Дата не указана';text.appendChild(time);
  hero.appendChild(text);
  const cover=document.querySelector('.top-cover .cover-image');
  if(cover){const img=document.createElement('img');img.src=cover.src;img.alt='Обложка статьи';hero.appendChild(img)}
  preview.appendChild(hero);
  const article=document.createElement('article');article.className='preview-article';article.innerHTML=safeHtml(editor.innerHTML);preview.appendChild(article);
 }
 previewDetails?.addEventListener('toggle',()=>{if(previewDetails.open)renderPreview()});
 [editor,titleField,document.getElementById('published-at')].forEach(el=>el?.addEventListener('input',()=>{if(previewDetails?.open)renderPreview()}));
})();