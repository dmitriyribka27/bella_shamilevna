/** Shared sidebar for every authenticated admin view. */
export function adminSidebar(view:'all'|'trash'|'new'='all'):string {
 const active=(key:string)=>view===key?' class="active" aria-current="page"':'';
 return `<aside class="side admin-sidebar">
 <div class="brand">Белла Рыбка<small>Админ-панель</small></div>
 <nav aria-label="Разделы">
  <a${active('all')} href="/admin/">Все публикации</a>
  <a${active('new')} class="side-create${view==='new'?' active':''}" href="/admin/edit?new=1&amp;lang=ru">Новая публикация</a>
  <a${active('trash')} href="/admin/?view=trash">Корзина</a>
 </nav>
 <div class="side-bottom">
  <a class="site-link" href="/" target="_blank" rel="noopener noreferrer">Открыть сайт <span aria-hidden="true">↗</span></a>
  <form class="logout" action="/admin/logout" method="post"><button type="submit">Выйти</button></form>
 </div>
 </aside>`;
}
export const adminSidebarCss=`
@media(min-width:701px){.shell{grid-template-columns:230px minmax(0,1fr)}}
.admin-sidebar{box-sizing:border-box;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;min-height:100vh;width:100%;min-width:0;padding:32px 18px;background:#fbfaf8;border-right:1px solid #e3e3e1;color:#25313d;font:15px/1.55 system-ui,-apple-system,sans-serif}
.admin-sidebar .brand{display:block;margin:0 12px 48px;font-size:21px;font-weight:700;line-height:1.55;letter-spacing:normal;color:#25313d}
.admin-sidebar .brand small{display:block;margin:0;font-size:12px;font-weight:400;letter-spacing:normal;color:#7c8793}
.admin-sidebar nav{display:flex;flex-direction:column;align-items:stretch;gap:0;overflow:visible}
.admin-sidebar nav form{display:block;width:100%;margin:0}
.admin-sidebar nav a,.admin-sidebar nav .side-create{box-sizing:border-box;display:flex;align-items:center;width:100%;min-height:52px;margin:0 0 6px;padding:13px 16px;border:0;border-radius:20px;background:transparent;color:#25313d;font:400 16px/1.55 system-ui,-apple-system,sans-serif;text-align:left;text-decoration:none;cursor:pointer}
.admin-sidebar nav a.active,.admin-sidebar nav a:hover,.admin-sidebar nav .side-create.active,.admin-sidebar nav .side-create:hover{background:#e8eef5;color:#284b79}
.admin-sidebar .side-bottom{position:static;width:100%;margin-top:auto;padding:20px 4px 0;border-top:1px solid #e4e7eb}
.admin-sidebar .side-bottom .site-link{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:52px;margin:0 0 8px;padding:12px 14px;border-radius:16px;color:#284b79;font:400 16px/1.55 system-ui,-apple-system,sans-serif}
.admin-sidebar .side-bottom .site-link:hover{background:#e8eef5}
.admin-sidebar .side-bottom .site-link span{font-size:17px;color:#6e8299}
.admin-sidebar .side-bottom .logout{position:static;display:block;margin:0;left:auto;bottom:auto}
.admin-sidebar .side-bottom .logout button{box-sizing:border-box;display:block;width:100%;min-height:54px;padding:12px 14px;border:1px solid #d8e0e8;border-radius:16px;background:white;color:#284b79;font:400 16px/1.55 system-ui,-apple-system,sans-serif;text-align:left;cursor:pointer}
.admin-sidebar .side-bottom .logout button:hover{background:#eef3f8}
@media(max-width:700px){.shell{display:block}.admin-sidebar{position:static;height:auto;min-height:0;padding:16px;border-right:0;border-bottom:1px solid #e3e3e1}.admin-sidebar .brand{margin:0 0 10px}.admin-sidebar nav{flex-direction:row;gap:4px;overflow-x:auto}.admin-sidebar nav form{width:auto;flex:none}.admin-sidebar nav a,.admin-sidebar nav .side-create{width:auto;white-space:nowrap;min-height:44px;margin:0;padding:10px}.admin-sidebar .side-bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;padding:10px 0 0}.admin-sidebar .side-bottom .site-link{margin:0}.admin-sidebar .side-bottom .logout button{width:auto}}
`;
