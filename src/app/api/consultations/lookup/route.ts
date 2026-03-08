import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  if (!query) {
    return NextResponse.json({ error: 'مطلوب رقم الاستشارة أو البريد' }, { status: 400 });
  }

  const result = await pool.query(
    `SELECT id, name, email, type, text, status, answer, created_at as "createdAt", answered_at as "answeredAt"
     FROM consultations
     WHERE id = $1 OR email = $1
     ORDER BY created_at DESC`,
    [query]
  );

  return NextResponse.json(result.rows);
}
