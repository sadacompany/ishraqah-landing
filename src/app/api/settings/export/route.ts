import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const [consultations, quizResults, guestbook, articles, quotes] = await Promise.all([
    pool.query('SELECT * FROM consultations ORDER BY created_at DESC'),
    pool.query('SELECT * FROM quiz_submissions ORDER BY created_at DESC'),
    pool.query('SELECT * FROM guestbook_entries ORDER BY created_at DESC'),
    pool.query('SELECT * FROM articles ORDER BY created_at DESC'),
    pool.query('SELECT * FROM quotes ORDER BY created_at DESC'),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    consultations: consultations.rows,
    quizResults: quizResults.rows,
    guestbook: guestbook.rows,
    articles: articles.rows,
    quotes: quotes.rows,
  };

  return NextResponse.json(data);
}
