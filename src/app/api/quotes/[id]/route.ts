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

  if (body.text !== undefined) {
    fields.push(`text = $${idx++}`);
    values.push(body.text);
  }
  if (body.hidden !== undefined) {
    fields.push(`hidden = $${idx++}`);
    values.push(body.hidden);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'لا توجد حقول للتحديث' }, { status: 400 });
  }

  values.push(id);
  await pool.query(`UPDATE quotes SET ${fields.join(', ')} WHERE id = $${idx}`, values);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  await pool.query('DELETE FROM quotes WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
