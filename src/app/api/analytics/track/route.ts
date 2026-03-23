import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getClientIP, getCountryFromIP } from '@/lib/geo';

export async function POST(request: Request) {
  try {
    const { path, referrer, durationSeconds } = await request.json();
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const country = await getCountryFromIP(ip);
    const pagePath = path || '/';

    // Check if this IP already visited this page today
    const existing = await pool.query(
      `SELECT id FROM page_views
       WHERE ip_address = $1 AND path = $2 AND DATE(created_at) = CURRENT_DATE
       LIMIT 1`,
      [ip, pagePath]
    );

    if (existing.rows.length > 0) {
      // Update duration if longer
      if (durationSeconds && durationSeconds > 0) {
        await pool.query(
          `UPDATE page_views SET duration_seconds = GREATEST(duration_seconds, $1)
           WHERE id = $2`,
          [durationSeconds, existing.rows[0].id]
        );
      }
      return NextResponse.json({ ok: true });
    }

    await pool.query(
      `INSERT INTO page_views (path, ip_address, user_agent, country, referrer, session_id, duration_seconds)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [pagePath, ip, userAgent, country, referrer || '', '', durationSeconds || 0]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
