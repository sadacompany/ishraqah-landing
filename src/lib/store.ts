const KEYS = {
  consultations: 'ishraqah_consultations',
  quizResults: 'ishraqah_quiz_results',
  guestbook: 'ishraqah_guestbook',
  articles: 'ishraqah_articles',
  quotes: 'ishraqah_quotes',
  settings: 'ishraqah_admin_settings',
  session: 'ishraqah_session',
} as const;

export type StoreKey = keyof typeof KEYS;

function getStorageKey(key: StoreKey): string {
  return KEYS[key];
}

export function getAll<T>(key: StoreKey): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getStorageKey(key));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setAll<T>(key: StoreKey, items: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getStorageKey(key), JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('store-change', { detail: { key } }));
}

export function addItem<T>(key: StoreKey, item: T): void {
  const items = getAll<T>(key);
  items.push(item);
  setAll(key, items);
}

export function updateItem<T extends { id: string }>(key: StoreKey, id: string, updates: Partial<T>): void {
  const items = getAll<T>(key);
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    setAll(key, items);
  }
}

export function removeItem<T extends { id: string }>(key: StoreKey, id: string): void {
  const items = getAll<T>(key);
  setAll(key, items.filter((item) => item.id !== id));
}

export function getSetting<T>(field: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (!raw) return null;
    const settings = JSON.parse(raw);
    return settings[field] ?? null;
  } catch {
    return null;
  }
}

export function setSetting(field: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  let settings: Record<string, unknown> = {};
  try {
    const raw = localStorage.getItem(KEYS.settings);
    if (raw) settings = JSON.parse(raw);
  } catch { /* empty */ }
  settings[field] = value;
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  for (const [key, storageKey] of Object.entries(KEYS)) {
    if (key === 'session') continue;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) data[key] = JSON.parse(raw);
    } catch { /* empty */ }
  }
  return JSON.stringify(data, null, 2);
}

export function importAllData(json: string): void {
  const data = JSON.parse(json);
  for (const [key, storageKey] of Object.entries(KEYS)) {
    if (key === 'session' || key === 'settings') continue;
    if (data[key]) {
      localStorage.setItem(storageKey, JSON.stringify(data[key]));
    }
  }
  window.dispatchEvent(new CustomEvent('store-change', { detail: { key: 'all' } }));
}

export function clearAllData(): void {
  for (const [key, storageKey] of Object.entries(KEYS)) {
    if (key === 'settings' || key === 'session') continue;
    localStorage.removeItem(storageKey);
  }
  window.dispatchEvent(new CustomEvent('store-change', { detail: { key: 'all' } }));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
