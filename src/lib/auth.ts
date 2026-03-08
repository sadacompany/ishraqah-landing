import { getSetting, setSetting } from './store';

const SESSION_KEY = 'ishraqah_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function isSetupComplete(): boolean {
  return getSetting<boolean>('setupComplete') === true;
}

export async function setupPassword(password: string): Promise<void> {
  const hash = await hashPassword(password);
  setSetting('passwordHash', hash);
  setSetting('setupComplete', true);
  createSession();
}

export async function login(password: string): Promise<boolean> {
  const storedHash = getSetting<string>('passwordHash');
  if (!storedHash) return false;
  const hash = await hashPassword(password);
  if (hash === storedHash) {
    createSession();
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    return Date.now() - session.createdAt < SESSION_DURATION;
  } catch {
    return false;
  }
}

function createSession(): void {
  const session = {
    token: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const storedHash = getSetting<string>('passwordHash');
  if (!storedHash) return false;
  const currentHash = await hashPassword(currentPassword);
  if (currentHash !== storedHash) return false;
  const newHash = await hashPassword(newPassword);
  setSetting('passwordHash', newHash);
  return true;
}
