-- Ishraqah Database Schema

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consultations (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  type VARCHAR(100) DEFAULT '',
  text TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'archived')),
  answer TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  answered_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS quiz_submissions (
  id VARCHAR(64) PRIMARY KEY,
  answers JSONB NOT NULL,
  total_score INTEGER NOT NULL,
  result_title VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  wants_follow_up BOOLEAN DEFAULT FALSE,
  ip_address VARCHAR(45) DEFAULT '',
  user_agent TEXT DEFAULT '',
  country VARCHAR(100) DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guestbook_entries (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  category_label VARCHAR(100) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  hidden BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(500) DEFAULT '',
  read_time INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotes (
  id VARCHAR(64) PRIMARY KEY,
  text TEXT NOT NULL,
  hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  path VARCHAR(500) NOT NULL,
  ip_address VARCHAR(45) DEFAULT '',
  user_agent TEXT DEFAULT '',
  country VARCHAR(100) DEFAULT '',
  referrer TEXT DEFAULT '',
  session_id VARCHAR(64) DEFAULT '',
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_email ON consultations(email);
CREATE INDEX IF NOT EXISTS idx_consultations_created ON consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_created ON quiz_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_status ON guestbook_entries(status);
CREATE INDEX IF NOT EXISTS idx_guestbook_created ON guestbook_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_created ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
