-- Gidy Profile Database Schema (SQLite)
-- For PostgreSQL, swap TEXT PRIMARY KEY → UUID, and use JSONB instead of TEXT for JSON columns.

-- Core profile table
CREATE TABLE IF NOT EXISTS profiles (
  id          TEXT PRIMARY KEY,            -- e.g. 'user_001' or UUID
  data        TEXT NOT NULL,               -- JSON blob: name, bio, title, socials, experience, stats
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Skills table (normalized for endorsement queries)
CREATE TABLE IF NOT EXISTS skills (
  id            TEXT PRIMARY KEY,
  profile_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  level         INTEGER NOT NULL DEFAULT 50 CHECK (level BETWEEN 0 AND 100),
  endorsements  INTEGER NOT NULL DEFAULT 0
);

-- Index for fast profile skill lookups
CREATE INDEX IF NOT EXISTS idx_skills_profile ON skills(profile_id);

-- Endorsement audit log (optional: tracks who endorsed what)
CREATE TABLE IF NOT EXISTS endorsements (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  skill_id    TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  endorsed_by TEXT NOT NULL,              -- IP or user ID (for rate limiting)
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
