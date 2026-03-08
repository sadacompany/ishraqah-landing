'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAll, setAll, addItem, updateItem, removeItem, type StoreKey } from '../store';

export function useStore<T extends { id: string }>(key: StoreKey) {
  const [items, setItems] = useState<T[]>([]);

  const refresh = useCallback(() => {
    setItems(getAll<T>(key));
  }, [key]);

  useEffect(() => {
    refresh();
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.key === key || detail.key === 'all') refresh();
    };
    window.addEventListener('store-change', handler);
    return () => window.removeEventListener('store-change', handler);
  }, [key, refresh]);

  const add = useCallback((item: T) => {
    addItem(key, item);
    refresh();
  }, [key, refresh]);

  const update = useCallback((id: string, updates: Partial<T>) => {
    updateItem<T>(key, id, updates);
    refresh();
  }, [key, refresh]);

  const remove = useCallback((id: string) => {
    removeItem<T>(key, id);
    refresh();
  }, [key, refresh]);

  const replace = useCallback((newItems: T[]) => {
    setAll(key, newItems);
    refresh();
  }, [key, refresh]);

  return { items, add, update, remove, replace, refresh };
}
