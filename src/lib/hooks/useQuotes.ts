'use client';

import { useApiResource } from './useStore';
import type { StoredQuote } from '../types';

export function useQuotes() {
  const { items: quotes, ...rest } = useApiResource<StoredQuote>('/api/quotes');
  return { quotes, ...rest };
}
