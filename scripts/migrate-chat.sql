-- Migration: Add chat-related columns to consultations table
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'form';
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS solved BOOLEAN DEFAULT FALSE;
