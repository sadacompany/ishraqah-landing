import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import pool from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session.adminId) {
    return NextResponse.json({ authenticated: false });
  }

  const result = await pool.query('SELECT id, email, name FROM admin_users WHERE id = $1', [session.adminId]);
  if (result.rows.length === 0) {
    session.destroy();
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, admin: result.rows[0] });
}
