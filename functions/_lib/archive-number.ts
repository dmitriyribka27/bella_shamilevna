// Shared archive numbering for the admin. Deleted/archived articles do not reserve numbers.
export async function ensureArchiveNumbers(db:D1Database):Promise<void>{
 await db.prepare('CREATE TABLE IF NOT EXISTS admin_archived_articles (article_id TEXT PRIMARY KEY, archived_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)').run();
 await db.prepare('CREATE TABLE IF NOT EXISTS admin_article_numbers (number INTEGER PRIMARY KEY AUTOINCREMENT, article_id TEXT NOT NULL UNIQUE)').run();
 // Archived and permanently deleted records must never reserve a number.
 await db.prepare('DELETE FROM admin_article_numbers WHERE article_id IN (SELECT article_id FROM admin_archived_articles) OR article_id NOT IN (SELECT id FROM articles)').run();
}
export async function nextArchiveNumber(db:D1Database):Promise<number>{
 const used=(await db.prepare('SELECT number FROM admin_article_numbers ORDER BY number ASC').all<{number:number}>()).results||[];
 let next=1;
 for(const row of used){if(row.number<next)continue;if(row.number!==next)break;next++}
 return next;
}
export async function backfillArchiveNumbers(db:D1Database):Promise<void>{
 const missing=(await db.prepare(`SELECT a.id FROM articles a
 LEFT JOIN admin_article_numbers n ON n.article_id=a.id
 LEFT JOIN admin_archived_articles d ON d.article_id=a.id
 WHERE n.article_id IS NULL AND d.article_id IS NULL
 ORDER BY a.created_at ASC, a.id ASC`).all<{id:string}>()).results||[];
 for(const item of missing){
  const proposed=await nextArchiveNumber(db);
  await db.prepare('INSERT OR IGNORE INTO admin_article_numbers(number,article_id) VALUES (?,?)').bind(proposed,item.id).run();
 }
}
export async function assignedArchiveNumber(db:D1Database,articleId:string):Promise<number|null>{
 const row=await db.prepare('SELECT number FROM admin_article_numbers WHERE article_id=?').bind(articleId).first<{number:number}>();
 return row?.number??null;
}
