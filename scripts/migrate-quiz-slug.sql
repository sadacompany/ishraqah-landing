-- Add quiz_slug column to quiz_submissions
ALTER TABLE quiz_submissions ADD COLUMN IF NOT EXISTS quiz_slug VARCHAR(50) DEFAULT 'panic';
