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

  const allowedFields: Record<string, string> = {
    slug: 'slug',
    title: 'title',
    excerpt: 'excerpt',
    content: 'content',
    category: 'category',
    categoryLabel: 'category_label',
    featured: 'featured',
    hidden: 'hidden',
    imageUrl: 'image_url',
    readTime: 'read_time',
  };

  for (const [key, col] of Object.entries(allowedFields)) {
    if (body[key] !== undefined) {
      fields.push(`${col} = $${idx++}`);
      values.push(body[key]);
    }
  }

  fields.push(`updated_at = $${idx++}`);
  values.push(new Date().toISOString());

  if (fields.length <= 1) {
    return NextResponse.json({ error: 'لا توجد حقول للتحديث' }, { status: 400 });
  }

  values.push(id);
  await pool.query(
    `UPDATE articles SET ${fields.join(', ')} WHERE id = $${idx}`,
    values
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  await pool.query('DELETE FROM articles WHERE id = $1', [id]);
  return NextResponse.json({ ok: true });
}
