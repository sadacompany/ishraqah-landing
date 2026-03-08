import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export async function GET() {
  const result = await pool.query(
    'SELECT id, text, hidden, created_at as "createdAt" FROM quotes ORDER BY created_at DESC'
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id, text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'نص الاقتباس مطلوب' }, { status: 400 });
    }

    await pool.query('INSERT INTO quotes (id, text) VALUES ($1, $2)', [id, text]);
    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
