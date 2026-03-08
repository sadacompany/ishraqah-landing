import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export async function POST(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const data = await request.json();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      if (data.consultations?.length) {
        for (const c of data.consultations) {
          await client.query(
            `INSERT INTO consultations (id, name, email, type, text, status, answer, created_at, answered_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT (id) DO NOTHING`,
            [c.id, c.name || '', c.email || '', c.type || '', c.text, c.status || 'pending', c.answer || '', c.created_at || c.createdAt, c.answered_at || c.answeredAt]
          );
        }
      }

      if (data.guestbook?.length) {
        for (const g of data.guestbook) {
          await client.query(
            `INSERT INTO guestbook_entries (id, name, message, status, created_at)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO NOTHING`,
            [g.id, g.name, g.message, g.status || 'pending', g.created_at || g.createdAt]
          );
        }
      }

      if (data.articles?.length) {
        for (const a of data.articles) {
          await client.query(
            `INSERT INTO articles (id, slug, title, excerpt, content, category, category_label, featured, read_time, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO NOTHING`,
            [a.id, a.slug, a.title, a.excerpt || '', a.content, a.category, a.category_label || a.categoryLabel, a.featured || false, a.read_time || a.readTime || 3, a.created_at || a.createdAt]
          );
        }
      }

      if (data.quotes?.length) {
        for (const q of data.quotes) {
          await client.query(
            `INSERT INTO quotes (id, text, created_at) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
            [q.id, q.text, q.created_at || q.createdAt || new Date().toISOString()]
          );
        }
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'فشل استيراد البيانات' }, { status: 500 });
  }
}
