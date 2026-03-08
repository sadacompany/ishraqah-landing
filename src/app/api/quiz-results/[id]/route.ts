import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  await pool.query('DELETE FROM quiz_submissions WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
