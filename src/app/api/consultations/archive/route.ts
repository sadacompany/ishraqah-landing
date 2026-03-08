import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  const result = await pool.query(
    `SELECT id, type, text, answer, created_at as "createdAt"
     FROM consultations
     WHERE status = 'archived' AND answer IS NOT NULL AND answer != ''
     ORDER BY created_at DESC`
  );

  const consultations = result.rows.map((c) => ({
    id: c.id,
    title: c.type || 'استشارة',
    question: c.text,
    answer: c.answer,
    category: c.type || 'عامة',
  }));

  return NextResponse.json(consultations);
}
