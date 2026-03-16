-- Add contact info columns to quiz_submissions
ALTER TABLE quiz_submissions ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT '';
ALTER TABLE quiz_submissions ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT '';
ALTER TABLE quiz_submissions ADD COLUMN IF NOT EXISTS email VARCHAR(255) DEFAULT '';
ALTER TABLE quiz_submissions ADD COLUMN IF NOT EXISTS wants_follow_up BOOLEAN DEFAULT FALSE;
