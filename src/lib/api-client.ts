export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function apiGet<T>(url: string) {
  return apiFetch<T>(url);
}

export function apiPost<T>(url: string, body: unknown) {
  return apiFetch<T>(url, { method: 'POST', body: JSON.stringify(body) });
}

export function apiPatch<T>(url: string, body: unknown) {
  return apiFetch<T>(url, { method: 'PATCH', body: JSON.stringify(body) });
}

export function apiDelete(url: string) {
  return apiFetch(url, { method: 'DELETE' });
}
