import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getClientIP, getCountryFromIP } from '@/lib/geo';

export async function POST(request: Request) {
  try {
    const { path, referrer, sessionId, durationSeconds } = await request.json();
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const country = await getCountryFromIP(ip);

    await pool.query(
      `INSERT INTO page_views (path, ip_address, user_agent, country, referrer, session_id, duration_seconds)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [path || '/', ip, userAgent, country, referrer || '', sessionId || '', durationSeconds || 0]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
