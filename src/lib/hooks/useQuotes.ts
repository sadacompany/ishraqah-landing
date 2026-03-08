'use client';

import { useMemo } from 'react';
import { useStore } from './useStore';
import { quotes as staticQuotes } from '@/data/quotes';
import type { StoredQuote } from '../types';

export function useQuotes() {
  const { items: localQuotes, add, update, remove } = useStore<StoredQuote>('quotes');

  const allQuotes = useMemo(() => [
    ...staticQuotes.map((q) => ({ ...q, source: 'static' as const })),
    ...localQuotes,
  ], [localQuotes]);

  return { quotes: allQuotes, localQuotes, add, update, remove };
}
