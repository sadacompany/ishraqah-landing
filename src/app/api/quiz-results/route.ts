import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';
import { getClientIP, getCountryFromIP } from '@/lib/geo';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const result = await pool.query(
    `SELECT id, quiz_slug as "quizSlug", answers, total_score as "totalScore", result_title as "resultTitle",
            name, phone, email, wants_follow_up as "wantsFollowUp",
            ip_address as "ipAddress", user_agent as "userAgent", country,
            created_at as "createdAt"
     FROM quiz_submissions ORDER BY created_at DESC`
  );
  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  try {
    const { id, quizSlug, answers, totalScore, resultTitle, name, phone, email, wantsFollowUp } = await request.json();
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const country = await getCountryFromIP(ip);

    await pool.query(
      `INSERT INTO quiz_submissions (id, quiz_slug, answers, total_score, result_title, name, phone, email, wants_follow_up, ip_address, user_agent, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [id, quizSlug || 'panic', JSON.stringify(answers), totalScore, resultTitle, name || '', phone || '', email || '', wantsFollowUp || false, ip, userAgent, country]
    );

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
