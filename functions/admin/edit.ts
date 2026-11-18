import {adminSidebar,adminSidebarCss} from '../_lib/admin-sidebar';
import {ensureArchiveNumbers,backfillArchiveNumbers,nextArchiveNumber,assignedArchiveNumber} from '../_lib/archive-number';
import {authenticated,securityHeaders} from '../_lib/auth';
import type {Env} from '../_lib/auth';
interface Context {request:Request;env:Env}
type Row={id:string;slug:string;cover_alt:string;cover_key:string|null;lang:string|null;title:string|null;excerpt:string|null;body_json:string|null;seo_title:string|null;seo_description:string|null;published_at:string|null;status:string|null};
const esc=(v:unknown)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
// SEO migration: older editor incorrectly treated any nonempty generated field as manual.
const seoPlain=(raw:string|null|undefined):string=>{
 let html='';try{const data=JSON.parse(raw||'{}');html=typeof data?.html==='string'?data.html:''}catch{}
 return html.replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g,m=>({'&nbsp;':' ','&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'" }[m]||m)).replace(/\s+/g,' ').trim();
};
const automaticTitle=(title:string|null|undefined)=>(title||'').trim()+' — Белла Рыбка';
const automaticDescription=(body:string|null|undefined)=>seoPlain(body).slice(0,160);
const styles=`.top-fields{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,42%);gap:24px;align-items:start}.top-title{min-width:0}.top-cover h2{font-size:13px;margin:0 0 9px}.top-cover .cover-image,.cover-placeholder{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px;border:1px solid #dbe1e7}.cover-placeholder{display:grid;place-items:center;background:#f8fafc;color:#8793a0;font-size:13px;text-align:center;padding:12px}.top-cover .cover-upload{margin-top:10px}.top-cover input[type=file]{font-size:12px;padding:9px}.top-cover .cover-upload button{width:100%;margin-top:8px}.top-date{max-width:240px;margin-top:14px}.top-date label{margin-top:0}.preview-details{margin:8px 0 25px}.preview-details>summary{cursor:pointer;font-size:22px;font-weight:650;padding:12px 0}.preview-details .preview{max-width:none;margin:0}.preview-hero{display:grid;grid-template-columns:minmax(0,1fr) 40%;gap:24px;align-items:center;border-bottom:1px solid #ddd;padding-bottom:24px}.preview-hero img{width:100%;aspect-ratio:4/3;object-fit:cover}.preview-hero h2{font-size:clamp(22px,2.5vw,34px);line-height:1.2}.preview-date{font-size:13px;color:#728299}.preview article{padding-top:25px}.rail{max-height:calc(100vh - 40px);overflow-y:auto;scrollbar-width:thin}.mobile-editor-message{display:none}@media(max-width:760px){.workspace,.heading,.breadcrumb,.notice,.preview-details{display:none!important}.mobile-editor-message{display:block;background:#fff;border:1px solid #dfe3e8;border-radius:18px;padding:25px;font-size:17px}.main{padding-top:35px}}@media(min-width:761px) and (max-width:1100px){.top-fields{grid-template-columns:minmax(0,1fr) 38%;gap:14px}}\n.delete-panel{margin-top:12px;border:1px solid #ead0d0;border-radius:12px;padding:0 12px}.delete-panel summary{padding:12px 3px;color:#b23a3a;cursor:pointer;list-style-position:inside}.delete-panel .note{font-size:12px;margin:6px 0}.delete-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding:10px 0 14px}.delete-choice{background:#fff3f3;color:#ae3030;border:1px solid #e8b9b9;border-radius:9px;font-size:13px;padding:10px 5px}.delete-choice:first-child{grid-column:1/-1}.delete-choice:disabled{background:#f1f2f3;color:#9aa0a7;border-color:#e1e4e8;cursor:not-allowed}.delete-choice:not(:disabled):hover{background:#ffe2e2}.delete-action-form{display:none} *{box-sizing:border-box}body{margin:0;background:#f6f5f2;color:#262626;font:16px/1.55 system-ui,-apple-system,sans-serif}a{color:inherit;text-decoration:none}button,input,textarea{font:inherit}button{cursor:pointer}button,.primary{background:#284b79;color:white;border:0;border-radius:7px;padding:11px 16px}button.secondary{background:white;color:#284b79;border:1px solid #b7c3d2}.shell{display:grid;grid-template-columns:240px minmax(0,1fr);min-height:100vh}.side{border-right:1px solid #ddd;padding:34px 20px;background:#faf9f7}.brand{font-size:22px;font-weight:650;margin:0 0 48px}.side a{display:block;padding:13px 16px;border-radius:8px;margin-bottom:6px}.side a:hover,.side a.active{background:#e9edf2;color:#284b79}.main{padding:40px clamp(18px,5vw,72px);max-width:1100px;width:100%}h1{font-size:32px;font-weight:600;margin:0 0 8px}h2{font-size:20px}p.note{color:#646464}label{display:block;font-size:14px;margin:20px 0 7px}input,textarea{width:100%;padding:12px;border:1px solid #c8c8c8;border-radius:7px;background:white;color:#222}textarea{min-height:110px;resize:vertical}.card{background:white;border:1px solid #ddd;border-radius:12px;padding:clamp(18px,3vw,32px);margin:24px 0}.actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:25px 0}.languages{display:flex;gap:8px;margin:20px 0}.languages a{border:1px solid #c7cbd2;border-radius:6px;padding:8px 16px}.languages a.active{background:#284b79;color:white}.editor{min-height:300px;padding:22px;border:1px solid #ccc;border-radius:0 0 8px 8px;outline-offset:3px;line-height:1.8;overflow-wrap:anywhere}.editor:empty:before{content:'Начните писать статью…';color:#999}.editor h2{font-size:23px}.editor blockquote{border-left:3px solid #284b79;margin:18px 0;padding-left:18px;color:#555}.toolbar{display:flex;flex-wrap:wrap;gap:5px;padding:8px;border:1px solid #ccc;border-bottom:0;border-radius:8px 8px 0 0;background:#f8f8f8}.toolbar button{padding:7px 11px;background:white;color:#222;border:1px solid #ddd}.muted{color:#666}.notice{padding:12px;background:#eef3f9;border-radius:8px}.danger{color:#a22}.logout{margin-top:35px}.preview{background:white;padding:28px;border:1px solid #ddd;border-radius:10px}.preview p{line-height:1.8}@media(max-width:760px){.shell{display:block}.side{padding:14px;border-right:0;border-bottom:1px solid #ddd}.brand{font-size:18px;margin:0 0 10px}.side nav{display:flex;gap:4px;overflow-x:auto}.side a{white-space:nowrap;margin:0}.main{padding:24px 16px}h1{font-size:27px}}
/* Editorial workspace */
body{background:#f7f7f5;color:#262c32;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-size:15px}
.shell{grid-template-columns:224px minmax(0,1fr)}
.side{position:sticky;top:0;height:100vh;padding:30px 16px;background:#fbfbfa;border-color:#e4e5e5}
.brand{font-size:19px;letter-spacing:-.025em;margin:0 12px 48px;font-weight:650}
.side nav a{padding:11px 13px;margin:2px 0;color:#4e5358;font-size:14px;transition:background .15s}
.side nav a.active{background:#eaf0f6;color:#294d76;font-weight:600}
.side .logout{position:absolute;bottom:25px;left:27px;margin:0}
.main{max-width:none;padding:26px clamp(20px,2.4vw,42px) 55px}
.breadcrumb{font-size:13px;color:#68727d;margin:0 0 18px}
.breadcrumb a{color:#566a7e}
.heading{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin-bottom:18px}
.heading h1{font-size:clamp(25px,2.2vw,34px);letter-spacing:-.035em;font-weight:600;margin:0 0 5px}
.heading .note{margin:0;font-size:13px}
.status-pill{display:inline-flex;align-items:center;gap:7px;background:#e9eff5;color:#2a527b;border-radius:20px;padding:6px 12px;font-size:12px;white-space:nowrap}
.status-pill:before{content:"";width:6px;height:6px;background:#527aa0;border-radius:50%}
.workspace{display:grid;grid-template-columns:minmax(0,1fr) 284px;gap:16px;align-items:start}
.writing{min-width:0}.card{margin:0 0 14px;padding:clamp(18px,2vw,26px);border-color:#e3e4e4;border-radius:10px;box-shadow:0 3px 14px rgba(35,45,55,.025)}
.card h2{font-size:16px;font-weight:650;margin:0 0 22px}
.card label{font-size:13px;color:#5b6269;font-weight:550;margin:14px 0 7px}
.card label:first-child{margin-top:0}
input,textarea{border-color:#d9dddf;border-radius:6px;padding:12px 14px;transition:border-color .15s,box-shadow .15s}
input:focus,textarea:focus,.editor:focus{outline:none;border-color:#6286ad;box-shadow:0 0 0 3px rgba(53,103,159,.11)}
#title{font-size:24px;letter-spacing:-.02em;font-weight:550;padding:14px 15px}
#excerpt{min-height:88px}
.editor{min-height:260px;background:#fff;border-color:#d9dddf;border-radius:0 0 6px 6px;padding:26px clamp(18px,3vw,40px);font-size:17px;line-height:1.85}
.editor p{margin:0 0 1.1em}.editor h2{font-size:25px;line-height:1.35;margin:1.6em 0 .7em}
.toolbar{background:#f8f9f9;border-color:#d9dddf;gap:3px;padding:7px}
.toolbar button{font-size:13px;border:0;background:transparent;border-radius:5px;padding:8px 10px}
.toolbar button:hover,.toolbar button:focus-visible{background:#e8eef4;color:#284b79}
.rail{position:sticky;top:26px;display:flex;flex-direction:column;gap:15px}
.rail-card{background:#fff;border:1px solid #e2e4e5;border-radius:10px;padding:21px}
.rail-card h2{font-size:14px;font-weight:650;margin:0 0 16px}
.rail-card .note{font-size:12px;line-height:1.55}
.rail-card .actions{display:grid;gap:9px;margin:16px 0 0}
.rail-card .actions button{width:100%;font-size:13px;line-height:1.4;text-align:center;padding:11px 9px}
.rail-card .actions button.secondary{background:#fff;border-color:#d1d9e2}
.rail-card .actions button.secondary:hover{background:#f0f5f9}
.languages{margin:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.languages a{padding:9px 4px;text-align:center;font-size:13px;border-radius:6px}
.rail-card details summary{cursor:pointer;font-size:14px;font-weight:600;list-style-position:inside}
.rail-card details label{font-size:12px;margin:15px 0 6px}
.rail-card details textarea{min-height:85px}
.rail-card details input,.rail-card details textarea{font-size:13px}
.rail-card details p{font-size:12px;color:#666}
.notice{margin:0 0 20px;font-size:13px}
.preview{max-width:820px;margin-top:24px;padding:clamp(25px,4vw,60px);border-color:#e3e4e4}
.preview h2{font-size:30px;letter-spacing:-.03em}.preview article{font-size:17px;line-height:1.85}
.rail .meta{font-size:12px;line-height:1.6;overflow-wrap:anywhere;color:#68727d}
@media(max-width:1100px){.workspace{grid-template-columns:minmax(0,1fr) 235px;gap:14px}.main{padding:28px 22px}.rail-card{padding:15px}}
@media(max-width:900px){.workspace{grid-template-columns:minmax(0,1fr)}.rail{position:static;display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.rail-card:first-child{grid-column:1/-1}.rail-card .actions{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.shell{display:block}.side{position:static;height:auto;padding:15px;border-bottom:1px solid #ddd}.side .logout{position:static;margin-top:10px}.brand{margin:0 0 8px}.side nav{display:flex;gap:4px;overflow:auto}.side nav a{white-space:nowrap}.main{padding:22px 14px 70px}.heading{margin-bottom:18px}.rail{display:flex}.rail-card .actions{grid-template-columns:1fr 1fr}.card{padding:18px}.editor{padding:18px;min-height:240px}#title{font-size:21px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
.side-create{width:100%;text-align:left;background:transparent;color:#284b79;border-radius:12px}.side-create:hover{background:#e8eef5}.side form{margin:0}\n
.delete-language-button{margin-top:12px;width:100%;background:#fff;color:#a34b4b;border:1px solid #e8d5d5;border-radius:14px;font-size:12px;padding:10px}.delete-language-button:hover{background:#fff4f4}.delete-language-button:disabled{opacity:.4;cursor:not-allowed}
/* Shared approved admin navigation */
body{font-size:15px;color:#25313d;font-family:system-ui,-apple-system,sans-serif}
.card,.rail-card,.preview{border-radius:20px;box-shadow:0 5px 20px rgba(37,52,72,.045)}
input,textarea,.languages a{border-radius:14px}
.toolbar{border-radius:16px 16px 0 0}.editor{border-radius:0 0 16px 16px}
.rail-card details summary{padding:10px 14px;border:1px solid #d7dde3;border-radius:14px;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px}
.rail-card details summary::-webkit-details-marker{display:none}
.rail-card details summary:after{content:"";width:9px;height:9px;border-right:1.6px solid currentColor;border-bottom:1.6px solid currentColor;transform:rotate(45deg);margin-right:4px}
.rail-card details[open] summary:after{transform:rotate(225deg)}
.rail-card details summary:hover{background:#f8fafc;border-color:#9db2ca}
.rail-card .actions button,.languages a{border-radius:14px}

.shell{grid-template-columns:230px minmax(0,1fr)}
.side{position:sticky;top:0;height:100vh;min-height:100vh;padding:32px 18px;background:#fbfaf8;border-right:1px solid #e3e3e1;display:flex;flex-direction:column}
.side .brand{font-size:21px;font-weight:700;letter-spacing:normal;margin:0 12px 48px;line-height:1.55;color:#25313d}
.side .brand small{display:block;font-size:13px;font-weight:400;letter-spacing:0;color:#8290a4;margin-top:0}
.side nav{display:block}
.side nav a,.side nav .side-create{display:block;width:100%;text-align:left;font:inherit;font-size:16px;font-weight:400;padding:13px 16px;border:0;border-radius:20px;margin:0 0 6px;background:transparent;color:#25313d;cursor:pointer}
.side nav a.active,.side nav a:hover,.side nav .side-create:hover{background:#e8eef5;color:#284b79}
.side-bottom{margin-top:auto;padding:20px 4px 0;border-top:1px solid #e4e7eb}
.side-bottom .site-link{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;margin:0 0 8px;border-radius:16px;color:#284b79;font-size:16px}
.side-bottom .site-link:hover{background:#e8eef5}
.side-bottom .site-link span{font-size:17px;color:#6e8299}
.side-bottom .logout{position:static;bottom:auto;left:auto;margin:0}
.side-bottom .logout button{display:block;width:100%;text-align:left;padding:12px 14px;border:1px solid #d8e0e8;border-radius:16px;background:white;color:#284b79;font-size:16px;font-weight:400}
.side-bottom .logout button:hover{background:#eef3f8}
@media(max-width:760px){.shell{display:block}.side{position:static;height:auto;min-height:0;padding:16px;border-right:0;border-bottom:1px solid #ddd}.side .brand{margin:0 0 10px}.side nav{display:flex;gap:4px;overflow-x:auto}.side nav a,.side nav .side-create{white-space:nowrap;margin:0;padding:10px}.side-bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0 0;margin-top:12px}.side-bottom .site-link{margin:0}.side-bottom .logout button{width:auto}}
/* Sidebar geometry and typography aligned with the publications catalog. */
.shell{grid-template-columns:230px minmax(0,1fr)}
.side{padding:32px 18px;background:#fbfaf8;border-color:#e3e3e1}
.side .brand{font-size:21px;font-weight:700;letter-spacing:normal;margin:0 12px 48px;line-height:1.55}
.side .brand small{font-size:12px;color:#7c8793}
.side nav a.active{font-weight:400}
.side nav a,.side nav .side-create{font-size:16px;font-weight:400}
.side-bottom .site-link,.side-bottom .logout button{font-size:16px}
@media(max-width:760px){.shell{display:block}.side{padding:16px}.side .brand{margin:0 0 10px}}
/* Match the catalog sidebar exactly, regardless of legacy editor styles. */
.side{width:100%;min-width:0}
.side nav{display:flex;flex-direction:column;align-items:stretch;gap:0;overflow:visible}
.side nav form{display:block;width:100%;margin:0}
.side nav a,.side nav .side-create{box-sizing:border-box;min-height:52px;display:flex;align-items:center;width:100%;padding:13px 16px;margin:0 0 6px;border-radius:20px;line-height:1.55}
.side nav .side-create{appearance:none}
.side nav a.active{background:#e8eef5;color:#284b79}
.side-bottom{width:100%}
.side-bottom .site-link{min-height:52px}
.side-bottom .logout button{min-height:54px}
@media(min-width:761px){.side{position:sticky;top:0;height:100vh;min-height:100vh}.side-bottom{margin-top:auto}}
@media(max-width:760px){.side nav{flex-direction:row;overflow-x:auto}.side nav form{width:auto;flex:none}.side nav a,.side nav .side-create{width:auto;white-space:nowrap}.side-bottom{margin-top:12px}}

.editor-language-top{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px;flex-wrap:wrap}.editor-language-top>span{font-size:13px;color:#68727d}.editor-language-top .languages{display:flex;gap:8px}.editor-language-top .languages a{min-width:55px}.title-count{text-align:right;color:#7b8793;font-size:12px;margin-top:6px}.extra-seo{padding-top:16px}.extra-seo h2{margin:4px 0 12px}.rail-card details .delete-language-button{margin-top:16px}

/* Visual editor alignment — 18 Nov 2026 */
.top-fields{grid-template-columns:minmax(0,1fr) minmax(220px,42%);column-gap:24px;row-gap:12px;align-items:start}
.top-title{grid-column:1;grid-row:1;display:flex;flex-direction:column;align-self:stretch;min-width:0}
.top-title label,.top-cover h2{display:block;margin:0 0 9px;font-size:14px;font-weight:600;line-height:22px;color:#29313c}
#title{display:block;width:100%;height:98px;min-height:98px;resize:none;overflow-y:auto;padding:13px 15px;font-size:23px;line-height:1.4;letter-spacing:-.02em;font-weight:550}
.top-date{margin-top:auto;max-width:290px;padding-top:22px}
.top-date label{margin-bottom:7px}.top-date input{min-height:49px}
.top-cover{grid-column:2;grid-row:1;min-width:0}
.top-cover .cover-image,.top-cover .cover-placeholder{display:block;width:100%;aspect-ratio:4/3;height:auto;object-fit:cover;border-radius:12px}
.top-cover .cover-placeholder{display:grid}
.cover-upload-area{grid-column:2;grid-row:2;min-width:0}
.cover-upload-area .cover-upload{margin:0}
.cover-upload-area .file-picker{display:flex;align-items:center;gap:9px;width:100%;min-height:49px;margin:0;padding:7px 11px;border:1px solid #d9dddf;border-radius:14px;background:#fff;cursor:pointer;font-size:12px;font-weight:400}
.file-picker #cover-file-label{display:inline-flex;flex:none;align-items:center;justify-content:center;border:1px solid #bbc8d7;border-radius:8px;padding:6px 10px;color:#284b79;background:#f7f9fc}
.file-picker #cover-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#596777}
.cover-upload-area input[type=file]{position:absolute;width:1px;height:1px;padding:0;opacity:0;overflow:hidden;clip-path:inset(50%)}
.cover-upload-area .cover-upload button{width:100%;min-height:49px;margin-top:8px}
.rail-card .extra-seo{padding-top:0}
.rail-card .extra-seo label:first-of-type{margin-top:0}
.rail-card:has(.extra-seo)>h2{margin-bottom:14px}
.preview-details .preview{padding:clamp(22px,3vw,42px);max-width:none}
.preview .preview-hero{grid-template-columns:minmax(0,1fr) 27%;gap:6%;align-items:center;min-height:0;padding:0 0 24px;border-bottom:1px solid #b5b5b5}
.preview .preview-hero h2{font:700 clamp(23px,2.4vw,36px)/1.17 Arial,Helvetica,sans-serif;letter-spacing:-.025em;margin:0 0 18px;overflow-wrap:anywhere}
.preview .preview-date{display:block;font:400 clamp(15px,1.4vw,20px)/1.3 Arial,Helvetica,sans-serif;margin:0;color:#242424}
.preview .preview-hero img{display:block;width:100%;height:auto;aspect-ratio:4/3;border:1px solid rgba(16,16,16,.35);box-shadow:4px 5px 0 rgba(16,16,16,.11);border-radius:0;object-fit:cover}
.preview .preview-article{width:85%;margin:0 auto;padding-top:36px;font:400 clamp(17px,1.55vw,23px)/1.42 Arial,Helvetica,sans-serif;overflow-wrap:anywhere}
.preview .preview-article p{line-height:1.42;margin:0 0 20px}
.preview .preview-article h2{font-size:1.45em;line-height:1.18;margin:32px 0 15px}
.preview .preview-article h3{font-size:1.24em;line-height:1.2;margin:28px 0 14px}
.preview .preview-article blockquote{border-left:2px solid #333;padding-left:18px;font-style:italic;margin:24px 0}
@media(max-width:1050px){.top-fields{column-gap:14px}.preview .preview-hero{gap:22px}.preview-details .preview{padding:22px}}

/* Editor deletion control: one border, no nested button styling. */
.rail-card .delete-panel{width:100%;margin-top:12px;padding:0;border:0;background:transparent}
.rail-card .delete-panel>summary{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:52px;padding:13px 16px;border:1px solid #e8c6c6;border-radius:14px;background:#fff;color:#ad3434;font-size:14px;font-weight:600;list-style:none}
.rail-card .delete-panel>summary:hover{background:#fff7f7;border-color:#dbaaaa}
.rail-card .delete-panel[open]>summary{border-radius:14px 14px 0 0;border-bottom-color:#f1dddd}
.rail-card .delete-panel[open] .delete-choices{border:1px solid #e8c6c6;border-top:0;border-radius:0 0 14px 14px;padding:12px;gap:8px;background:#fff}
.rail-card .delete-choices .delete-choice{width:100%;min-height:42px;margin:0;background:#fff5f5;color:#b12e2e;border:1px solid #e9bcbc;border-radius:10px;font-size:13px;font-weight:500;line-height:1.3;padding:10px 4px}
.rail-card .delete-choices .delete-choice:hover:not(:disabled){background:#ffe7e7}
.rail-card .delete-choices .delete-choice:disabled{background:#f1f2f3;color:#9ba1a9;border-color:#e2e5e8;cursor:not-allowed}
.rail-card .delete-panel>summary:focus-visible,.rail-card .delete-choice:focus-visible{outline:2px solid #284b79;outline-offset:2px}


/* Compact desktop editor header: two independently aligned columns */
.top-fields{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(240px,36%)!important;column-gap:clamp(18px,3vw,34px)!important;row-gap:0!important;align-items:start!important}
.top-left{grid-column:1;min-width:0;display:flex;flex-direction:column;gap:22px}
.top-right{grid-column:2;min-width:0;display:flex;flex-direction:column;align-items:stretch;gap:10px}
.top-title{display:block;grid-column:auto;grid-row:auto;align-self:auto;min-width:0}
.top-title label{display:block;margin:0 0 9px}
#title{height:96px;min-height:96px;width:100%}
.top-date{grid-column:auto;grid-row:auto;max-width:360px;width:100%;margin:0;padding:0}
.top-date label{margin:0 0 9px}
.top-date input{width:100%;max-width:360px}
.top-cover{grid-column:auto;grid-row:auto;min-width:0;width:100%;max-width:310px;margin:0}
.top-cover h2{margin:0 0 9px}
.top-cover .cover-image,.top-cover .cover-placeholder{display:block;width:100%;max-width:310px;height:auto;max-height:232.5px;aspect-ratio:4/3;object-fit:cover;border-radius:12px}
.top-cover .cover-placeholder{display:grid}
.cover-upload-area{grid-column:auto;grid-row:auto;min-width:0;width:100%;max-width:310px;margin:0}
.cover-upload-area .cover-upload{margin:0}
.cover-upload-area .file-picker{min-height:40px;padding:5px 8px;border-radius:10px}
.file-picker #cover-file-label{padding:5px 7px}
.cover-upload-area .cover-upload button{min-height:40px;margin-top:6px;padding:8px 10px}
@media(min-width:761px) and (max-width:1080px){.top-fields{grid-template-columns:minmax(0,1fr) minmax(200px,38%)!important;column-gap:16px!important}.top-cover,.cover-upload-area,.top-cover .cover-image,.top-cover .cover-placeholder{max-width:275px}}
/* Compact preview typography for long-form articles */
.preview-details .preview{padding:clamp(20px,2.4vw,30px)}
.preview .preview-hero{grid-template-columns:minmax(0,1fr) minmax(150px,25%);gap:clamp(16px,3vw,35px);padding-bottom:19px}
.preview .preview-hero h2{font-size:clamp(20px,1.65vw,26px);font-weight:700;line-height:1.25;letter-spacing:-.015em;margin:0 0 11px}
.preview .preview-date{font-size:14px;line-height:1.4}
.preview .preview-article{width:100%;max-width:none;margin:0;padding:24px 0 0;font-size:16px;line-height:1.65}
.preview .preview-article p{font-size:inherit;line-height:inherit;margin:0 0 16px}
.preview .preview-article h2{font-size:1.45em;line-height:1.3}
.preview .preview-article h3{font-size:1.22em;line-height:1.35}
.preview .preview-article li{line-height:1.6}
@media(min-width:761px) and (max-width:1050px){.preview .preview-hero{grid-template-columns:minmax(0,1fr) 25%}.preview .preview-article{font-size:15px}}

/* Mac-friendly article writing controls */
.writing .toolbar{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:10px 12px;background:#f7f8f9;border-color:#dce2e7;border-radius:12px 12px 0 0}
.toolbar-group{display:flex;align-items:center;gap:3px;padding-right:8px;border-right:1px solid #dce2e7}
.toolbar-group:last-child{padding-right:0;border-right:0}
.writing .toolbar button{display:inline-flex;align-items:center;justify-content:center;min-height:34px;min-width:34px;padding:6px 9px;border:1px solid transparent;border-radius:7px;background:transparent;color:#253344;font-size:13px;white-space:nowrap}
.writing .toolbar button:hover,.writing .toolbar button:focus-visible{background:#e7eef6;border-color:#bdcde0;outline:none}
.writing .toolbar button:focus-visible{outline:2px solid #365e91;outline-offset:1px}
.writing .editor{min-height:360px;line-height:1.7;padding:25px 27px;outline:none;overflow-wrap:anywhere}
.writing .editor:focus{box-shadow:inset 0 0 0 2px #b7cce5}
.writing .editor p{margin:0 0 15px}
.writing .editor h2{font-size:1.55em;line-height:1.3;margin:25px 0 13px}
.writing .editor h3{font-size:1.25em;line-height:1.4;margin:21px 0 12px}
.writing .editor ul,.writing .editor ol{padding-left:26px;margin:0 0 16px}
.writing .editor li{margin:4px 0}
.writing .editor blockquote{border-left:3px solid #58799b;padding:6px 18px;margin:18px 0;background:#f7f9fb}
.writing .editor a,.preview .preview-article a{color:#27598c;text-decoration:underline;text-underline-offset:3px}
.writing .editor a:hover,.preview .preview-article a:hover{color:#183c64}
.writing .editor:empty:before{content:"Начните писать или вставьте текст из Word, ChatGPT или Заметок…";color:#9aa5af;pointer-events:none}

/* Reliable writing workspace and navigation */
.editor-meta{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:7px 20px;padding:8px 14px;border:1px solid #dce2e7;border-bottom:none;background:#fff;color:#5d6b78;font-size:12px}
#editor-save-status{color:#476789}
.toolbar [aria-pressed="true"]{background:#dce8f5!important;border-color:#9fb9d9!important;color:#173e6a!important}
.editor-outline-panel{margin:0 0 18px;border:1px solid #e1e4e8;border-radius:12px;background:#fff}
.editor-outline-panel details summary{cursor:pointer;padding:12px 16px;font-weight:600;font-size:14px}
#editor-outline{display:flex;flex-direction:column;gap:3px;padding:0 12px 12px}
#editor-outline>span{color:#78838f;font-size:13px}
.outline-item{display:block;text-align:left;max-width:100%;white-space:normal;border:0!important;border-radius:6px!important;background:transparent!important;color:#32445b!important;font-size:13px!important;padding:6px 12px!important}
.outline-item:hover,.outline-item:focus-visible{background:#e9f0f8!important}
.outline-item.h3{padding-left:25px!important;color:#657386!important}
.editor-link-dialog{border:1px solid #d5dfe8;border-radius:16px;box-shadow:0 22px 85px #14243c3d;background:white;color:#23364c;padding:24px;width:min(480px,calc(100vw - 30px));max-height:calc(100vh - 50px)}
.editor-link-dialog::backdrop{background:rgba(9,25,42,.45)}
.editor-link-dialog h2{font-size:22px;margin:0 0 18px}
.editor-link-dialog label{display:block;font-size:13px;font-weight:600;margin:12px 0 5px}
.editor-link-dialog input{display:block;width:100%;border:1px solid #bfcdd9;border-radius:9px;padding:10px 12px;background:white}
.editor-link-dialog input:focus-visible{outline:2px solid #5e8abf;outline-offset:1px}
.link-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:22px}
.link-actions button{font-size:13px;padding:9px 12px}
.preview .preview-article ul,.preview .preview-article ol{padding-left:27px;margin:0 0 18px}
.preview .preview-article li{margin:5px 0}
.preview .preview-article blockquote{border-left:3px solid #58799b;margin:20px 0;padding:5px 18px}
.preview .preview-article a{color:#27598c;text-decoration:underline;text-underline-offset:3px}
.preview .preview-article strong{font-weight:700}
.preview .preview-article em{font-style:italic}

.archive-field{max-width:360px;width:100%}.archive-field label{margin:0 0 7px}.archive-field input{max-width:160px;font-variant-numeric:tabular-nums}

/* Compact article metadata under the title */
.top-left{gap:11px!important}
.top-title{margin-bottom:0!important}
.archive-field,.top-date{margin:0!important;padding:0!important}
.archive-field label,.top-date label{margin:0 0 6px!important}
.archive-field input,.top-date input{min-height:48px!important}

/* Single compact metadata row under article title */
.top-left{gap:9px!important}
.article-meta-row{display:grid;grid-template-columns:150px minmax(0,220px);align-items:start;gap:14px;margin:0;padding:0}
.article-meta-row .archive-field,.article-meta-row .top-date{width:100%;max-width:none;min-width:0;margin:0!important;padding:0!important}
.article-meta-row .archive-field label,.article-meta-row .top-date label{margin:0 0 6px!important;font-size:13px;line-height:20px}
.article-meta-row .archive-field input,.article-meta-row .top-date input{width:100%;max-width:none;min-width:0;min-height:45px!important;height:45px;padding:9px 12px}
.article-meta-row .archive-field input{font-variant-numeric:tabular-nums}
@media(min-width:761px) and (max-width:1100px){.article-meta-row{grid-template-columns:minmax(95px,130px) minmax(0,185px);gap:10px}}

/* Persisted vs. unpublished vs. unsaved publication states */
.publication-statuses{display:flex;gap:8px;justify-content:flex-end;align-items:center;flex-wrap:wrap;max-width:65%}
.publication-change-pill,.publication-dirty-pill{display:inline-flex;align-items:center;border-radius:18px;padding:6px 11px;font-size:12px;font-weight:500;line-height:1.45}
.publication-change-pill{color:#775718;background:#fbf1dc}
.publication-dirty-pill{color:#8c4b28;background:#fff0e9}
.publication-change-pill[hidden],.publication-dirty-pill[hidden]{display:none!important}
@media(max-width:960px){.publication-statuses{max-width:none;justify-content:flex-start}.heading{flex-wrap:wrap}}

`;
// Delete choices are rendered from existing published and working languages.
function page(body:string,status=200):Response{const headers=new Headers(securityHeaders());headers.set('Content-Type','text/html; charset=utf-8');headers.set('Content-Security-Policy',"default-src 'none'; connect-src 'self'; img-src 'self' blob:; style-src 'unsafe-inline'; script-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><link rel="icon" href="/admin-icons/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/admin-icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/admin-icons/favicon-16x16.png"><link rel="apple-touch-icon" sizes="180x180" href="/admin-icons/apple-touch-icon.png"><title>Редактор — Белла Рыбка</title><style>${styles}${adminSidebarCss}</style></head><body>${body}</body></html>`,{status,headers})}
export async function onRequestGet({request,env}:Context):Promise<Response>{
 if(!env.DB||!env.ADMIN_PASSWORD_HASH)return page('<p>Редактор не настроен.</p>',503);
 if(!await authenticated(request,env))return new Response(null,{status:303,headers:{Location:'/admin/','Cache-Control':'no-store'}});
 const url=new URL(request.url),isNew=url.searchParams.get('new')==='1',id=isNew?'':url.searchParams.get('id'),lang=url.searchParams.get('lang')||'ru';
 if((!id&&!isNew)||!['ru','en','fr'].includes(lang))return page('<p>Неверный адрес статьи.</p>',400);
 const columns=(await env.DB.prepare("PRAGMA table_info(articles)").all<{name:string}>()).results||[];
 if(!columns.some(c=>c.name==='cover_key'))await env.DB.prepare('ALTER TABLE articles ADD COLUMN cover_key TEXT').run();
 const rows=isNew?{results:[{id:'',slug:'',cover_alt:'',cover_key:null,lang:null,title:null,excerpt:null,body_json:null,seo_title:null,seo_description:null,published_at:null,status:null} as Row]}:await env.DB.prepare('SELECT a.id,a.slug,a.cover_alt,a.cover_key,t.lang,t.title,t.excerpt,t.body_json,t.seo_title,t.seo_description,t.published_at,t.status FROM articles a LEFT JOIN article_translations t ON a.id=t.article_id WHERE a.id=?').bind(id).all<Row>();
 if(!rows.results?.length)return page('<p>Статья не найдена.</p>',404);
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS article_working_versions (article_id TEXT NOT NULL,lang TEXT NOT NULL,title TEXT NOT NULL DEFAULT '',body_json TEXT NOT NULL DEFAULT '',excerpt TEXT NOT NULL DEFAULT '',seo_title TEXT NOT NULL DEFAULT '',seo_description TEXT NOT NULL DEFAULT '',seo_title_manual INTEGER NOT NULL DEFAULT 0,seo_description_manual INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(article_id,lang))").run();
 const workingCols=(await env.DB.prepare('PRAGMA table_info(article_working_versions)').all<{name:string}>()).results||[];
 if(!workingCols.some(c=>c.name==='published_at'))await env.DB.prepare('ALTER TABLE article_working_versions ADD COLUMN published_at TEXT').run();
 await ensureArchiveNumbers(env.DB);
 await backfillArchiveNumbers(env.DB);
 const currentArchiveNumber=isNew?null:await assignedArchiveNumber(env.DB,id as string);
 const suggestedArchiveNumber=currentArchiveNumber??await nextArchiveNumber(env.DB);
 const r=rows.results[0],published=rows.results.find(x=>x.lang===lang);
 const working=isNew?null:await env.DB.prepare('SELECT * FROM article_working_versions WHERE article_id=? AND lang=?').bind(id,lang).first<any>();
 const t=working?{...published,...working,status:published?.status||'draft'}:published;

 const seoTitleValue=String(t?.seo_title||''),seoDescriptionValue=String(t?.seo_description||'');
 const generatedTitle=seoTitleValue===automaticTitle(t?.title)||seoTitleValue===automaticTitle(published?.title);
 const generatedDescription=seoDescriptionValue===automaticDescription(t?.body_json)||seoDescriptionValue===automaticDescription(published?.body_json);
 const seoTitleManual=seoTitleValue!==''&&!generatedTitle&&(working?Number(working.seo_title_manual)===1:true);
 const seoDescriptionManual=seoDescriptionValue!==''&&!generatedDescription&&(working?Number(working.seo_description_manual)===1:true);
 const hasPublished=published?.status==='published';
 const unpublishedChanges=Boolean(hasPublished&&working&&(
  working.title!==published?.title||working.body_json!==published?.body_json||
  working.seo_title!==published?.seo_title||working.seo_description!==published?.seo_description||
  (working.published_at&&working.published_at!==published?.published_at?.slice(0,10))
 ));
 const baseStatus=hasPublished?'Опубликовано':isNew?'Новая статья':'Черновик';
 const savedStatus=unpublishedChanges?'Сохранены неопубликованные изменения':'';

 const existingLangs=new Set<string>(rows.results.filter(x=>!!x.lang).map(x=>x.lang as string));
 if(!isNew){
  const savedLangs=await env.DB.prepare('SELECT lang FROM article_working_versions WHERE article_id=?').bind(id).all<{lang:string}>();
  for(const item of savedLangs.results||[])existingLangs.add(item.lang);
 }
 const languageOptions=['ru','en','fr'].map(l=>`<button class="delete-choice" type="submit" form="delete-language-${l}" ${existingLangs.size>1&&existingLangs.has(l)?'':'disabled'}>${l.toUpperCase()}</button>`).join('');
 const deletionMenu=isNew?'':`<details class="delete-panel"><summary>Удалить</summary><div class="delete-choices"><button type="submit" form="archive-article-form" class="delete-choice">Всю статью</button>${languageOptions}</div></details>`;
 const tabs=['ru','en','fr'].map(l=>`<a class="${l===lang?'active':''}" href="${isNew?`/admin/edit?new=1&lang=${l}`:`/admin/edit?id=${encodeURIComponent(id)}&lang=${l}`}">${l.toUpperCase()}</a>`).join('');
 const saved=url.searchParams.get('saved')==='1'?'<p class="notice">Изменения сохранены.</p>':url.searchParams.get('removed')==='1'?'<p class="notice">Языковая версия удалена. Остальные версии статьи сохранены.</p>':'';
 const body=`<div class="shell">${adminSidebar(isNew?'new':'all')}<main class="main"><p class="breadcrumb"><a href="/admin/">Публикации</a> / Редактирование</p><header class="heading"><div><h1>${isNew?'Новая публикация':'Редактор статьи'}</h1></div><div class="publication-statuses"><span class="status-pill">${baseStatus}</span><span id="pending-publication-status" class="publication-change-pill" ${unpublishedChanges?'':'hidden'}>${savedStatus||'Сохранены неопубликованные изменения'}</span><span id="unsaved-publication-status" class="publication-dirty-pill" hidden>Есть несохранённые изменения</span></div></header>${saved}<div class="mobile-editor-message">Редактор доступен только с вашего MacBook.</div><form id="article-form" method="post" action="/admin/save"><input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="lang" value="${esc(lang)}"><input type="hidden" name="body_json" id="body-json"><input type="hidden" name="excerpt" value=""><div class="workspace"><div class="writing"><section class="card"><div class="editor-language-top"><span>Язык публикации</span><div class="languages">${tabs}</div></div><div class="top-fields">
<div class="top-left">
<div class="top-title"><label for="title">Заголовок</label><textarea id="title" name="title" rows="2" maxlength="50" placeholder="Название статьи">${esc(t?.title)}</textarea><div class="title-count"><span id="title-counter">0 / 50</span></div></div>
<div class="article-meta-row">
<div class="archive-field"><label for="archive-number">Архивный номер</label><input id="archive-number" type="text" inputmode="numeric" pattern="[0-9]{1,6}" name="archive_number" maxlength="6" required value="${String(suggestedArchiveNumber).padStart(3,'0')}" aria-label="Архивный номер статьи"></div>
<div class="top-date"><label for="published-at">Дата публикации</label><input id="published-at" type="date" name="published_at" value="${esc(working?.published_at??t?.published_at?.slice(0,10)??'')}"></div>
</div>
</div>
<div class="top-right">
<div class="top-cover"><h2>Обложка 4:3</h2>${r.cover_key?`<img class="cover-image" src="/admin/cover-preview?id=${encodeURIComponent(id)}" alt="Обложка статьи">`: '<div class="cover-placeholder">Загрузите обложку статьи</div>'}</div>
<div class="cover-upload-area">${isNew?'<p class="note">Обложку можно добавить после первого сохранения.</p>':`<div class="cover-upload"><label for="cover-file" class="file-picker"><span id="cover-file-label">Выбрать файл</span><span id="cover-file-name">Файл не выбран</span></label><input type="file" id="cover-file" name="image" form="cover-upload-form" accept="image/jpeg,image/png,image/webp" aria-label="Выбрать обложку" required><button type="submit" form="cover-upload-form" class="secondary">Загрузить обложку</button></div>`}</div>
</div>
</div></section><section class="card"><h2>Содержание</h2><div class="toolbar" role="toolbar" aria-label="Форматирование текста">
<div class="toolbar-group" aria-label="Начертание"><button type="button" data-command="bold" title="Жирный (⌘B)" aria-label="Жирный"><strong>Ж</strong></button><button type="button" data-command="italic" title="Курсив (⌘I)" aria-label="Курсив"><em>К</em></button><button type="button" data-command="underline" title="Подчёркнутый (⌘U)" aria-label="Подчёркнутый"><u>Ч</u></button><button type="button" data-command="strikeThrough" title="Зачёркнутый" aria-label="Зачёркнутый"><s>А</s></button></div>
<div class="toolbar-group" aria-label="Структура"><button type="button" data-command="formatBlock" data-value="p" title="Обычный абзац">Текст</button><button type="button" data-command="formatBlock" data-value="h2" title="Заголовок второго уровня">Заголовок 2</button><button type="button" data-command="formatBlock" data-value="h3" title="Заголовок третьего уровня">Заголовок 3</button><button type="button" data-command="formatBlock" data-value="blockquote" title="Цитата">Цитата</button></div>
<div class="toolbar-group" aria-label="Списки"><button type="button" data-command="insertUnorderedList" title="Маркированный список">• Список</button><button type="button" data-command="insertOrderedList" title="Нумерованный список">1. Список</button></div>
<div class="toolbar-group" aria-label="Ссылки"><button type="button" data-command="createLink" title="Добавить ссылку к выделенному тексту (⌘K)">Ссылка</button><button type="button" data-command="unlink" title="Убрать ссылку">Без ссылки</button></div>
<div class="toolbar-group" aria-label="История"><button type="button" data-command="undo" title="Отменить (⌘Z)">↶</button><button type="button" data-command="redo" title="Повторить (⌘⇧Z)">↷</button></div>
</div><div class="editor-meta" aria-live="polite"><span id="editor-statistics">0 слов · 0 знаков</span><span id="editor-save-status" role="status">Изменения сохраняются по кнопке «Сохранить»</span></div><div id="editor" class="editor" contenteditable="true" role="textbox" aria-label="Текст статьи" aria-multiline="true"></div><textarea id="initial-body" hidden>${esc(t?.body_json||'{"type":"doc","html":""}' )}</textarea></section><details class="preview-details" id="preview-details"><summary>Предпросмотр</summary><section id="preview" class="preview" data-published-date="${esc(published?.published_at?.slice(0,10)??'')}" aria-live="polite"></section></details></div><aside class="rail" aria-label="Параметры публикации"><section class="rail-card"><h2>Управление</h2><div class="actions"><button type="submit" name="action" value="draft">Сохранить</button><button class="secondary" type="submit" name="action" value="publish">${published?.status==="published"?"Опубликовать изменения":"Опубликовать"}</button>${isNew?'':'<button class="secondary" type="submit" name="action" value="unpublish">Снять с публикации</button>'}</div>${deletionMenu}</section><section class="rail-card"><h2>SEO</h2><div class="extra-seo"><input type="hidden" id="seo-title-manual" name="seo_title_manual" value="${Number(seoTitleManual)}"><label for="seo-title">SEO-заголовок</label><input id="seo-title" name="seo_title" maxlength="200" data-manual="seo-title-manual" value="${esc(t?.seo_title)}"><input type="hidden" id="seo-description-manual" name="seo_description_manual" value="${Number(seoDescriptionManual)}"><label for="seo-description">SEO-описание</label><textarea id="seo-description" name="seo_description" maxlength="320" data-manual="seo-description-manual">${esc(t?.seo_description)}</textarea></div></section></aside></div></form><form id="cover-upload-form" method="post" action="/admin/cover" enctype="multipart/form-data"><input type="hidden" name="id" value="${esc(id)}"></form>${isNew?'':['ru','en','fr'].map(l=>`<form id="delete-language-${l}" class="delete-action-form" method="post" action="/admin/delete-language"><input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="lang" value="${l}"></form>`).join('')+`<form id="archive-article-form" class="delete-action-form" method="post" action="/admin/article-action"><input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="action" value="archive"></form>`}
<dialog id="editor-link-dialog" class="editor-link-dialog" aria-labelledby="editor-link-heading"><form id="editor-link-form" method="dialog"><h2 id="editor-link-heading">Гиперссылка</h2><label for="editor-link-text">Текст ссылки</label><input id="editor-link-text" name="link-text" required maxlength="500"><label for="editor-link-url">Адрес (https:// или mailto:)</label><input id="editor-link-url" name="link-url" required spellcheck="false" placeholder="https://example.com" maxlength="2048"><div class="link-actions"><button type="button" id="editor-link-remove" class="secondary">Убрать ссылку</button><button type="button" class="secondary" id="editor-link-cancel">Отмена</button><button type="submit">Применить</button></div></form></dialog><p id="editor-error" class="danger" role="alert"></p></main></div><script src="/admin-editor.js" defer></script><script src="/admin-editor-enhancements.js" defer></script>`;
 return page(body);
}
