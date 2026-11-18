// The public cover remains in articles.cover_key until an explicit Publish action.
// pending_cover_key is private working media shared by RU/EN/FR editors.
export async function ensurePendingCoverColumn(db:D1Database):Promise<void>{
 const columns=(await db.prepare('PRAGMA table_info(articles)').all<{name:string}>()).results||[];
 if(!columns.some(col=>col.name==='pending_cover_key')){
  try{await db.prepare('ALTER TABLE articles ADD COLUMN pending_cover_key TEXT').run()}
  catch(error){
   // Parallel editor requests may both attempt the one-time migration.
   const after=(await db.prepare('PRAGMA table_info(articles)').all<{name:string}>()).results||[];
   if(!after.some(col=>col.name==='pending_cover_key'))throw error;
  }
 }
}
