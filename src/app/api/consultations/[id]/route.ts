import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (body.status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(body.status);
  }
  if (body.answer !== undefined) {
    fields.push(`answer = $${idx++}`);
    values.push(body.answer);
    fields.push(`answered_at = $${idx++}`);
    values.push(new Date().toISOString());
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'لا توجد حقول للتحديث' }, { status: 400 });
  }

  values.push(id);
  await pool.query(
    `UPDATE consultations SET ${fields.join(', ')} WHERE id = $${idx}`,
    values
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  await pool.query('DELETE FROM consultations WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
