import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await pool.query(
    `SELECT id, slug, title, excerpt, content, category, category_label as "categoryLabel",
            featured, read_time as "readTime", created_at as "createdAt"
     FROM articles WHERE slug = $1`,
    [slug]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'المقال غير موجود' }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}
