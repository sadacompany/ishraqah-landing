import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export async function DELETE() {
  const authError = await requireAuth();
  if (authError) return authError;

  await pool.query('DELETE FROM page_views');

  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';

  // Map range to interval and grouping
  let interval: string;
  let dateFormat: string;
  switch (range) {
    case '1d':
      interval = '1 day';
      dateFormat = 'YYYY-MM-DD HH24:00';
      break;
    case '7d':
      interval = '7 days';
      dateFormat = 'YYYY-MM-DD';
      break;
    case '30d':
      interval = '30 days';
      dateFormat = 'YYYY-MM-DD';
      break;
    case '90d':
      interval = '90 days';
      dateFormat = 'YYYY-MM-DD';
      break;
    case '1y':
      interval = '365 days';
      dateFormat = 'YYYY-MM';
      break;
    default:
      interval = '30 days';
      dateFormat = 'YYYY-MM-DD';
  }

  const [
    totalViews,
    uniqueVisitors,
    todayViews,
    todayUniqueVisitors,
    topPages,
    topCountries,
    timelineViews,
    recentVisitors,
    articlesCount,
    consultationsCount,
    pendingConsultationsCount,
    quizCount,
    guestbookCount,
    quotesCount,
  ] = await Promise.all([
    pool.query('SELECT COUNT(*) as count FROM page_views'),
    pool.query("SELECT COUNT(DISTINCT ip_address) as count FROM page_views WHERE ip_address != ''"),
    pool.query("SELECT COUNT(*) as count FROM page_views WHERE DATE(created_at) = CURRENT_DATE"),
    pool.query("SELECT COUNT(DISTINCT ip_address) as count FROM page_views WHERE DATE(created_at) = CURRENT_DATE AND ip_address != ''"),
    pool.query(
      `SELECT path, COUNT(*) as views
       FROM page_views
       WHERE created_at >= NOW() - INTERVAL '${interval}'
       GROUP BY path
       ORDER BY views DESC
       LIMIT 10`
    ),
    pool.query(
      `SELECT country, COUNT(*) as views
       FROM page_views
       WHERE country != '' AND created_at >= NOW() - INTERVAL '${interval}'
       GROUP BY country
       ORDER BY views DESC
       LIMIT 10`
    ),
    pool.query(
      `SELECT TO_CHAR(created_at, '${dateFormat}') as date, COUNT(*) as views
       FROM page_views
       WHERE created_at >= NOW() - INTERVAL '${interval}'
       GROUP BY TO_CHAR(created_at, '${dateFormat}')
       ORDER BY date ASC`
    ),
    pool.query(
      `SELECT path, ip_address as "ipAddress", country, user_agent as "userAgent", created_at as "createdAt"
       FROM page_views
       ORDER BY created_at DESC
       LIMIT 20`
    ),
    pool.query('SELECT COUNT(*) as count FROM articles'),
    pool.query('SELECT COUNT(*) as count FROM consultations'),
    pool.query("SELECT COUNT(*) as count FROM consultations WHERE status = 'pending'"),
    pool.query('SELECT COUNT(*) as count FROM quiz_submissions'),
    pool.query('SELECT COUNT(*) as count FROM guestbook_entries'),
    pool.query('SELECT COUNT(*) as count FROM quotes'),
  ]);

  return NextResponse.json({
    totalViews: parseInt(totalViews.rows[0].count),
    uniqueVisitors: parseInt(uniqueVisitors.rows[0].count),
    todayViews: parseInt(todayViews.rows[0].count),
    todayUniqueVisitors: parseInt(todayUniqueVisitors.rows[0].count),
    topPages: topPages.rows,
    topCountries: topCountries.rows,
    dailyViews: timelineViews.rows,
    recentVisitors: recentVisitors.rows,
    contentCounts: {
      articles: parseInt(articlesCount.rows[0].count),
      consultations: parseInt(consultationsCount.rows[0].count),
      pendingConsultations: parseInt(pendingConsultationsCount.rows[0].count),
      quizSubmissions: parseInt(quizCount.rows[0].count),
      guestbookEntries: parseInt(guestbookCount.rows[0].count),
      quotes: parseInt(quotesCount.rows[0].count),
    },
  });
}
