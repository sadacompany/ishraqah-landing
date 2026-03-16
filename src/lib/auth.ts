import { apiFetch } from './api-client';

export async function login(email: string, password: string): Promise<boolean> {
  try {
    await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST' });
}

export async function checkAuth(): Promise<{ authenticated: boolean; admin?: { id: number; email: string; name: string } }> {
  return apiFetch('/api/auth/me');
}