import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export async function GET() {
  const result = await pool.query(
    `SELECT id, slug, title, excerpt, content, category, category_label as "categoryLabel",
            featured, hidden, read_time as "readTime", created_at as "createdAt", updated_at as "updatedAt"
     FROM articles ORDER BY created_at DESC`
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { id, slug, title, excerpt, content, category, categoryLabel, featured, readTime } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: 'العنوان والمحتوى مطلوبان' }, { status: 400 });
    }

    const finalSlug = slug || title.replace(/\s+/g, '-').toLowerCase();

    await pool.query(
      `INSERT INTO articles (id, slug, title, excerpt, content, category, category_label, featured, read_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, finalSlug, title, excerpt || '', content, category, categoryLabel, featured || false, readTime || 3]
    );

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
