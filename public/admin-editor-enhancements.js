/* BELLA SITE — Mac editor reliability and long-form tools. No external libraries. */
(() => {
 'use strict';
 const editor=document.getElementById('editor');
 const form=document.getElementById('article-form');
 if(!editor||!form)return;
 const $=id=>document.getElementById(id);
 const status=$('editor-save-status'),counter=$('editor-statistics'),outline=$('editor-outline');
 const unsavedBadge=$('unsaved-publication-status');
 function syncPublicationStatus(){
  if(unsavedBadge)unsavedBadge.hidden=form.dataset.dirty!=='1';
 }

 const id=form.querySelector('[name=id]')?.value||'new';
 const lang=form.querySelector('[name=lang]')?.value||'ru';
 const draftKey='bella-editor-draft-v2:'+id+':'+lang;
 const backupMaxAge=7*24*60*60*1000;
 const title=$('title'),date=$('published-at');
 let lastSnapshot='',timer=null,saving=false;
 const text=()=>editor.innerText||editor.textContent||'';
 function snapshot(){
  return {version:2,at:Date.now(),title:title?.value||'',date:date?.value||'',html:editor.innerHTML,
   seoTitle:$('seo-title')?.value||'',seoDescription:$('seo-description')?.value||'',
   seoTitleManual:$('seo-title-manual')?.value||'0',seoDescriptionManual:$('seo-description-manual')?.value||'0',archiveNumber:$('archive-number')?.value||''};
 }
 function hasContent(v){return !!(v?.title||v?.html?.replace(/<[^>]*>/g,'').trim())}
 function setStatus(message){if(status)status.textContent=message}
 function saveBackup(){
  if(saving||form.dataset.dirty!=='1')return;
  try{
   const value=snapshot();
   if(JSON.stringify(value).length>180000){setStatus('Локальная копия слишком велика. Нажмите «Сохранить».');return}
   localStorage.setItem(draftKey,JSON.stringify(value));
   lastSnapshot=JSON.stringify(value);
   setStatus('Аварийная копия на этом Mac сохранена · Не опубликовано');
  }catch{setStatus('Не удалось создать локальную копию. Сохраните статью на сервере.')}
 }
 function scheduleBackup(){
  setStatus('Несохранённые изменения…');
  clearTimeout(timer);
  timer=setTimeout(saveBackup,900);
 }
 function recover(){
  const stored=localStorage.getItem(draftKey);
  if(!stored)return;
  let draft;
  try{draft=JSON.parse(stored)}catch{localStorage.removeItem(draftKey);return}
  if(!draft||draft.version!==2||!draft.at||Date.now()-draft.at>backupMaxAge){localStorage.removeItem(draftKey);return}
  const initial=snapshot();
  // Never overwrite published/server content automatically.
  const different=draft.title!==initial.title||draft.date!==initial.date||draft.html!==initial.html||
   draft.seoTitle!==initial.seoTitle||draft.seoDescription!==initial.seoDescription||draft.archiveNumber!==initial.archiveNumber;
  if(!different){localStorage.removeItem(draftKey);return}
  if(confirm('На этом Mac найдена несохранённая версия статьи. Восстановить её? Нажмите «Отмена», чтобы оставить версию с сервера.')){
   if(title)title.value=draft.title;
   if(date)date.value=draft.date;
   if($('archive-number')&&draft.archiveNumber)$('archive-number').value=draft.archiveNumber;
   if($('seo-title'))$('seo-title').value=draft.seoTitle;
   if($('seo-description'))$('seo-description').value=draft.seoDescription;
   if($('seo-title-manual'))$('seo-title-manual').value=draft.seoTitleManual;
   if($('seo-description-manual'))$('seo-description-manual').value=draft.seoDescriptionManual;
   // Backup is authored by this editor; run it through the browser's minimal semantic allowlist.
   const holder=document.createElement('template');holder.innerHTML=draft.html;
   const allowed=new Set(['P','DIV','H2','H3','UL','OL','LI','BLOCKQUOTE','STRONG','EM','U','S','BR','A','SPAN']);
   function strip(node){
    if(node.nodeType===Node.TEXT_NODE)return document.createTextNode(node.textContent||'');
    if(node.nodeType!==Node.ELEMENT_NODE||!allowed.has(node.tagName))return document.createDocumentFragment();
    const e=document.createElement(node.tagName.toLowerCase());
    if(node.tagName==='A'){
     const href=node.getAttribute('href')||'';
     try{const url=new URL(href,location.origin);if(['https:','http:','mailto:'].includes(url.protocol))e.setAttribute('href',url.href)}catch{}
    }
    for(const child of node.childNodes)e.append(strip(child));
    return e;
   }
   editor.replaceChildren(...Array.from(holder.content.childNodes,strip));
   form.dataset.dirty='1';
   setStatus('Текст восстановлен с этого Mac · Нажмите «Сохранить»');
   editor.dispatchEvent(new Event('input',{bubbles:true}));
  }else{
   localStorage.removeItem(draftKey);
   setStatus('Версия с сервера оставлена');
  }
 }
 const archiveInput=$('archive-number');
 archiveInput?.addEventListener('blur',()=>{
  const value=archiveInput.value.trim();
  if(!/^\d{1,6}$/.test(value))return;
  const number=Number(value);
  if(Number.isInteger(number)&&number>0&&number<=999999)archiveInput.value=String(number).padStart(3,'0');
 });
 function updateStatistics(){
  const words=(text().trim().match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[]).length;
  const chars=text().length;
  const minutes=Math.max(1,Math.ceil(words/180));
  if(counter)counter.textContent=words+' слов · '+chars+' знаков · ≈ '+minutes+' мин чтения';
  if(!outline)return;
  outline.replaceChildren();
  const headings=Array.from(editor.querySelectorAll('h2,h3'));
  if(!headings.length){const hint=document.createElement('span');hint.textContent='Добавьте заголовки, чтобы видеть структуру статьи.';outline.append(hint);return}
  headings.forEach((heading,index)=>{
   const b=document.createElement('button');b.type='button';b.className='outline-item '+heading.tagName.toLowerCase();
   b.textContent=heading.textContent?.trim()||'Заголовок без текста';
   b.addEventListener('click',()=>{heading.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});editor.focus()});
   outline.append(b);
  });
 }
 const toolButtons=Array.from(document.querySelectorAll('.toolbar [data-command]'));
 function updateToolbar(){
  const sel=window.getSelection();
  if(!sel?.rangeCount||!editor.contains(sel.anchorNode))return;
  const parent=sel.anchorNode.nodeType===Node.ELEMENT_NODE?sel.anchorNode:sel.anchorNode.parentElement;
  const map={bold:'strong,b',italic:'em,i',underline:'u',strikeThrough:'s,strike,del',
   insertUnorderedList:'ul',insertOrderedList:'ol'};
  for(const button of toolButtons){
   const selector=map[button.dataset.command];
   let active=!!(selector&&parent?.closest(selector)&&editor.contains(parent.closest(selector)));
   if(button.dataset.command==='formatBlock'){
    const current=parent?.closest('h2,h3,p,blockquote');
    active=current?.tagName.toLowerCase()===button.dataset.value;
   }
   if(button.dataset.command==='createLink')active=!!parent?.closest('a[href]');
   if(selector||button.dataset.command==='formatBlock'||button.dataset.command==='createLink'){
    button.setAttribute('aria-pressed',String(active));
   }
  }
 }
 const modal=$('editor-link-dialog'),urlField=$('editor-link-url'),textField=$('editor-link-text');
 let chosenRange=null,activeAnchor=null;
 function currentLink(){
  const selection=window.getSelection();if(!selection?.rangeCount||!editor.contains(selection.anchorNode))return null;
  const node=selection.anchorNode.nodeType===Node.ELEMENT_NODE?selection.anchorNode:selection.anchorNode.parentElement;
  return node?.closest('a[href]')||null;
 }
 function openLink(event){
  event?.preventDefault();event?.stopImmediatePropagation();
  const selection=window.getSelection();
  if(!selection?.rangeCount||!editor.contains(selection.getRangeAt(0).commonAncestorContainer)){
   setStatus('Поместите курсор в текст или выделите фразу для ссылки');editor.focus();return;
  }
  chosenRange=selection.getRangeAt(0).cloneRange();
  activeAnchor=currentLink();
  if(activeAnchor&&editor.contains(activeAnchor)){
   if(textField)textField.value=activeAnchor.textContent||'';
   if(urlField)urlField.value=activeAnchor.getAttribute('href')||'';
  }else{
   if(textField)textField.value=selection.toString();
   if(urlField)urlField.value='';
  }
  if(!modal)return;
  if(typeof modal.showModal==='function')modal.showModal();else modal.hidden=false;
  urlField?.focus();
 }
 function validUrl(value){
  const input=String(value||'').trim();
  if(!/^(https?:\/\/|mailto:)/i.test(input))return null;
  try{const u=new URL(input);return ['http:','https:','mailto:'].includes(u.protocol)?u.href:null}catch{return null}
 }
 function linkApply(event){
  event.preventDefault();
  const href=validUrl(urlField?.value);
  if(!href){urlField?.setCustomValidity('Введите адрес https:// или mailto:');urlField?.reportValidity();return}
  const label=textField?.value.trim()||'';
  if(!label){textField?.setCustomValidity('Введите текст ссылки');textField?.reportValidity();return}
  if(activeAnchor&&editor.contains(activeAnchor)){
   activeAnchor.setAttribute('href',href);activeAnchor.setAttribute('rel','noopener noreferrer');
   activeAnchor.textContent=label;
  }else if(chosenRange){
   const selection=window.getSelection();editor.focus();
   selection.removeAllRanges();selection.addRange(chosenRange);
   const anchor=document.createElement('a');anchor.href=href;anchor.rel='noopener noreferrer';anchor.textContent=label;
   chosenRange.deleteContents();chosenRange.insertNode(anchor);
   const range=document.createRange();range.setStartAfter(anchor);range.collapse(true);
   selection.removeAllRanges();selection.addRange(range);
  }
  modal.close?.();if(!modal.close)modal.hidden=true;
  editor.dispatchEvent(new Event('input',{bubbles:true}));editor.focus();
 }
 function unlink(event){
  event.preventDefault();event.stopImmediatePropagation();
  const link=currentLink();
  if(!link){setStatus('Поместите курсор внутрь ссылки, которую хотите удалить');return}
  link.replaceWith(document.createTextNode(link.textContent||''));
  editor.dispatchEvent(new Event('input',{bubbles:true}));
 }
 const btnLink=toolButtons.find(b=>b.dataset.command==='createLink');
 const btnUnlink=toolButtons.find(b=>b.dataset.command==='unlink');
 btnLink?.addEventListener('click',openLink,true);
 btnUnlink?.addEventListener('click',unlink,true);
 // Capture the shortcut before the older editor listener; do not open two link dialogs.
 editor.addEventListener('keydown',event=>{
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){
   event.preventDefault();event.stopImmediatePropagation();openLink();
  }
 },true);
 $('editor-link-form')?.addEventListener('submit',linkApply);
 $('editor-link-cancel')?.addEventListener('click',()=>modal?.close());
 [urlField,textField].forEach(field=>field?.addEventListener('input',()=>field.setCustomValidity('')));
 $('editor-link-remove')?.addEventListener('click',()=>{const link=activeAnchor;if(link&&editor.contains(link)){link.replaceWith(document.createTextNode(link.textContent||''));editor.dispatchEvent(new Event('input',{bubbles:true}))}modal?.close()});
 editor.addEventListener('click',event=>{if(event.target.closest('a[href]')&&event.metaKey){event.preventDefault();openLink(event)}},true);
 // Status, emergency local copy, and outline only; server remains the source of truth.
 let statisticsTimer=null;
 function scheduleStatistics(){clearTimeout(statisticsTimer);statisticsTimer=setTimeout(updateStatistics,160)}
 editor.addEventListener('input',()=>{scheduleBackup();scheduleStatistics();updateToolbar();syncPublicationStatus()});
 form.addEventListener('input',()=>{scheduleBackup();scheduleStatistics();syncPublicationStatus()},false);
 form.addEventListener('change',()=>{form.dataset.dirty='1';scheduleBackup();syncPublicationStatus()});
 document.addEventListener('selectionchange',()=>{if(document.activeElement===editor)updateToolbar()});
 editor.addEventListener('keyup',updateToolbar);
 form.addEventListener('submit',event=>{
  if(event.defaultPrevented)return;
  clearTimeout(timer);saveBackup();saving=true;
  form.dataset.dirty='0';syncPublicationStatus();setStatus('Отправка на сервер…');
 });
 // When redirect from a successful Save/Publish completes, safely discard the backup.
 if(new URLSearchParams(location.search).get('saved')==='1'){
  try{localStorage.removeItem(draftKey);localStorage.removeItem('bella-editor-draft-v2:new:'+lang)}catch{}
 }
 try{recover()}catch{setStatus('Локальная копия недоступна в этом браузере')}
 updateStatistics();updateToolbar();syncPublicationStatus();
})();
