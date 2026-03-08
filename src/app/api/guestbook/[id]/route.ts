import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const { status } = await request.json();
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 });
  }

  await pool.query('UPDATE guestbook_entries SET status = $1 WHERE id = $2', [status, id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  await pool.query('DELETE FROM guestbook_entries WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
