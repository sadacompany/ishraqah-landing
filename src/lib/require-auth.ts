import { NextResponse } from 'next/server';
import { getSession } from './session';

export async function requireAuth() {
  const session = await getSession();
  if (!session.adminId) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  return null;
}
