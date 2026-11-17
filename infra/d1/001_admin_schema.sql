-- BELLA SITE: Cloudflare D1 schema. Apply once after creating the D1 database.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  cover_key TEXT,
  cover_alt TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS article_translations (
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  lang TEXT NOT NULL CHECK(lang IN ('ru','en','fr')),
  title TEXT NOT NULL DEFAULT '',
  body_json TEXT NOT NULL DEFAULT '{"type":"doc","content":[]}',
  excerpt TEXT NOT NULL DEFAULT '',
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
  published_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(article_id,lang)
);
CREATE INDEX IF NOT EXISTS idx_translations_status ON article_translations(lang,status,published_at);
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON admin_sessions(expires_at);
CREATE TABLE IF NOT EXISTS login_attempts (
  ip_hash TEXT PRIMARY KEY,
  failures INTEGER NOT NULL DEFAULT 0,
  window_started_at TEXT NOT NULL,
  blocked_until TEXT
);
