'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../api-client';

export function useApiResource<T extends { id: string }>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch<T[]>(endpoint);
      setItems(data);
    } catch {
      // API might not be available yet
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (item: Partial<T>) => {
    try {
      await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(item),
      });
      await refresh();
    } catch (err) {
      console.error('Failed to add item:', err);
      throw err;
    }
  }, [endpoint, refresh]);

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    try {
      await apiFetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      await refresh();
    } catch (err) {
      console.error('Failed to update item:', err);
      throw err;
    }
  }, [endpoint, refresh]);

  const remove = useCallback(async (id: string) => {
    try {
      await apiFetch(`${endpoint}/${id}`, { method: 'DELETE' });
      await refresh();
    } catch (err) {
      console.error('Failed to remove item:', err);
      throw err;
    }
  }, [endpoint, refresh]);

  return { items, loading, add, update, remove, refresh };
}
