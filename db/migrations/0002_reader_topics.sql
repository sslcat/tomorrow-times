-- Rebuild with foreign keys disabled by the migration runner, after a consistent backup.
-- Only official article discussions are unique; readers may create multiple linked topics.
CREATE TABLE threads_new (id TEXT PRIMARY KEY, article_id TEXT REFERENCES articles(id), author_id TEXT REFERENCES users(id), title TEXT NOT NULL, section TEXT NOT NULL, official INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, hidden INTEGER NOT NULL DEFAULT 0);
INSERT INTO threads_new SELECT * FROM threads;
DROP TABLE threads;
ALTER TABLE threads_new RENAME TO threads;
CREATE UNIQUE INDEX threads_official_article ON threads(article_id) WHERE official=1;
CREATE INDEX threads_activity ON threads(hidden,updated_at DESC,id);
