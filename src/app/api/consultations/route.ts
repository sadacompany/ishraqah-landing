import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';
import { getSession } from '@/lib/session';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const result = await pool.query(
    'SELECT id, name, email, type, text, status, answer, created_at as "createdAt", answered_at as "answeredAt" FROM consultations ORDER BY created_at DESC'
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  try {
    const { id, name, email, type, text } = await request.json();
    if (!text) {
      return NextResponse.json({ error: 'نص الاستشارة مطلوب' }, { status: 400 });
    }

    const session = await getSession();
    const isAdmin = !!session.adminId;

    await pool.query(
      'INSERT INTO consultations (id, name, email, type, text) VALUES ($1, $2, $3, $4, $5)',
      [id, name || '', email || '', type || '', text]
    );

    return NextResponse.json({ id, isAdmin });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
