import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const [totalViews, uniqueVisitors, topPages, topCountries, dailyViews, recentVisitors] = await Promise.all([
    pool.query('SELECT COUNT(*) as count FROM page_views'),
    pool.query('SELECT COUNT(DISTINCT ip_address) as count FROM page_views WHERE ip_address != \'\''),
    pool.query(
      `SELECT path, COUNT(*) as views
       FROM page_views
       GROUP BY path
       ORDER BY views DESC
       LIMIT 10`
    ),
    pool.query(
      `SELECT country, COUNT(*) as views
       FROM page_views
       WHERE country != ''
       GROUP BY country
       ORDER BY views DESC
       LIMIT 10`
    ),
    pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as views
       FROM page_views
       WHERE created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    ),
    pool.query(
      `SELECT path, ip_address as "ipAddress", country, user_agent as "userAgent", created_at as "createdAt"
       FROM page_views
       ORDER BY created_at DESC
       LIMIT 20`
    ),
  ]);

  return NextResponse.json({
    totalViews: parseInt(totalViews.rows[0].count),
    uniqueVisitors: parseInt(uniqueVisitors.rows[0].count),
    topPages: topPages.rows,
    topCountries: topCountries.rows,
    dailyViews: dailyViews.rows,
    recentVisitors: recentVisitors.rows,
  });
}
