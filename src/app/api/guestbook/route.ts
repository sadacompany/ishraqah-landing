import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  const isAdmin = !!session.adminId;

  const query = isAdmin
    ? 'SELECT id, name, message, status, created_at as "createdAt" FROM guestbook_entries ORDER BY created_at DESC'
    : `SELECT id, name, message, status, created_at as "createdAt" FROM guestbook_entries WHERE status = 'approved' ORDER BY created_at DESC`;

  const result = await pool.query(query);
  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  try {
    const { id, name, message } = await request.json();
    if (!name || !message) {
      return NextResponse.json({ error: 'الاسم والرسالة مطلوبان' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO guestbook_entries (id, name, message) VALUES ($1, $2, $3)',
      [id, name, message]
    );

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
