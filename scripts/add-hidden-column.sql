-- Add hidden column to articles and quotes tables (run on existing databases)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS hidden BOOLEAN DEFAULT FALSE;
