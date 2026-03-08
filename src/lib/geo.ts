export async function getCountryFromIP(ip: string): Promise<string> {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return '';
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country`, {
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const data = await res.json();
      return data.country || '';
    }
  } catch {
    // Silently fail - geo lookup is best-effort
  }
  return '';
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const real = request.headers.get('x-real-ip');
  if (real) return real;
  return '';
}
