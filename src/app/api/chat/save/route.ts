import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { name, contact, conversation } = await request.json();

    if (!conversation) {
      return NextResponse.json({ error: 'المحادثة مطلوبة' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const text = conversation
      .map((msg: { role: string; content: string }) =>
        msg.role === 'user' ? `الزائر: ${msg.content}` : `المساعد: ${msg.content}`
      )
      .join('\n\n');

    await pool.query(
      `INSERT INTO consultations (id, name, email, type, text, source)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, name || '', contact || '', 'محادثة فورية', text, 'chat']
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error saving chat consultation:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
