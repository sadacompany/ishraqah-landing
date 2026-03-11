import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  try {
    const result = await pool.query('SELECT NOW() as now, current_database() as db');
    return NextResponse.json({
      status: 'ok',
      db: result.rows[0],
      hasDbUrl: !!dbUrl,
      dbUrlPrefix: dbUrl ? dbUrl.substring(0, 25) + '...' : 'NOT SET',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      status: 'error',
      message: err.message,
      hasDbUrl: !!dbUrl,
      dbUrlPrefix: dbUrl ? dbUrl.substring(0, 25) + '...' : 'NOT SET',
    }, { status: 500 });
  }
}
