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
 const allowed=['P','H2','H3','BLOCKQUOTE','UL','OL','LI','STRONG','EM','A','BR'];
 function cleanNode(node,depth=0){
  if(depth>25)return null;
  if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.textContent||'');
  if(node.nodeType!==Node.ELEMENT_NODE)return null;
  const tag=node.tagName==='B'?'STRONG':node.tagName==='I'?'EM':node.tagName;
  const wrapper=document.createElement(allowed.includes(tag)?tag:'span');
  if(tag==='A'){
   const href=node.getAttribute('href')||'';
   try{const u=new URL(href,location.origin);if(['http:','https:','mailto:'].includes(u.protocol))wrapper.setAttribute('href',u.href)}catch{}
  }
  for(const child of Array.from(node.childNodes)){const safe=cleanNode(child,depth+1);if(safe)wrapper.appendChild(safe)}
  return wrapper;
 }
 function safeHtml(html){
  const source=document.createElement('template');source.innerHTML=html;
  const output=document.createElement('div');
  for(const child of Array.from(source.content.childNodes)){const safe=cleanNode(child);if(safe)output.appendChild(safe)}
  return output.innerHTML;
 }
 try{
  const value=JSON.parse(document.getElementById('initial-body').value);
  if(value&&value.type==='doc'&&typeof value.html==='string')editor.innerHTML=safeHtml(value.html);
  else if(value&&value.type==='doc'&&Array.isArray(value.content)&&value.content.length)error.textContent='Этот формат статьи пока нельзя отредактировать. Данные не изменены.';
 }catch{error.textContent='Не удалось прочитать содержимое статьи.'}
 document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>{
  editor.focus();const cmd=button.dataset.command;
  if(cmd==='createLink'){const href=prompt('Адрес ссылки (https://)');if(href){try{const u=new URL(href);if(['http:','https:'].includes(u.protocol))document.execCommand(cmd,false,u.href)}catch{alert('Укажите полный адрес https://…')}}}
  else document.execCommand(cmd,false,button.dataset.value||null);
 }));
 const titleField=document.getElementById('title'),counter=document.getElementById('title-counter'),seoTitle=document.getElementById('seo-title'),seoDescription=document.getElementById('seo-description');
 const titleManual=document.getElementById('seo-title-manual'),descriptionManual=document.getElementById('seo-description-manual');
 const plainText=()=>editor.textContent.replace(/\s+/g,' ').trim();
 function refreshSeo(){
  if(seoTitle&&titleManual?.value!=='1')seoTitle.value=(titleField.value.trim()?titleField.value.trim()+' — Белла Рыбка':'');
  if(seoDescription&&descriptionManual?.value!=='1')seoDescription.value=plainText().slice(0,160);
 }
 seoTitle?.addEventListener('input',()=>{titleManual.value='1'});
 seoDescription?.addEventListener('input',()=>{descriptionManual.value='1'});
 function refreshCount(){if(counter)counter.textContent=String(titleField.value.length)+' / 50'}
 titleField?.addEventListener('input',()=>{refreshCount();refreshSeo()});
 refreshCount();
 editor.addEventListener('input',refreshSeo);
 document.querySelectorAll('.languages a').forEach(a=>a.addEventListener('click',e=>{if(form.dataset.dirty==='1'&&!confirm('Есть несохранённые изменения. Перейти без сохранения?'))e.preventDefault()}));
 form.addEventListener('input',()=>{form.dataset.dirty='1'});
 window.addEventListener('beforeunload',e=>{if(form.dataset.dirty==='1'){e.preventDefault();e.returnValue=''}});
 refreshSeo();
 function serialize(){return JSON.stringify({type:'doc',html:safeHtml(editor.innerHTML)})}
 form.addEventListener('submit',event=>{if(error.textContent){event.preventDefault();return}hidden.value=serialize();form.dataset.dirty='0';if(hidden.value.length>100000){event.preventDefault();error.textContent='Статья слишком длинная для этой версии редактора.'}});
 document.getElementById('preview-button').addEventListener('click',()=>{
  preview.hidden=false;
  preview.replaceChildren();
  const h=document.createElement('h2');h.textContent=document.getElementById('title').value||'Без названия';preview.appendChild(h);
  const article=document.createElement('article');article.innerHTML=safeHtml(editor.innerHTML);preview.appendChild(article);
  preview.scrollIntoView({behavior:'smooth',block:'start'});
 });
})();