-- Optional one-time schema migration for staged article covers.
-- The application also applies this migration lazily for existing Production D1.
-- Execute only once if applying SQL manually; PRAGMA table_info(articles) can verify the column.
ALTER TABLE articles ADD COLUMN pending_cover_key TEXT;
