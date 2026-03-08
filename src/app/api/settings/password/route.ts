import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { requireAuth } from '@/lib/require-auth';
import { getSession } from '@/lib/session';

export async function PATCH(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  const session = await getSession();
  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'كلمة المرور الحالية والجديدة مطلوبتان' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 });
  }

  const result = await pool.query('SELECT password_hash FROM admin_users WHERE id = $1', [session.adminId]);
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
  }

  const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 401 });
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [newHash, session.adminId]);

  return NextResponse.json({ ok: true });
}
