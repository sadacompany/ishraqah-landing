'use client';

import { useMemo } from 'react';
import { useStore } from './useStore';
import { articles as staticArticles } from '@/data/articles';
import type { StoredArticle } from '../types';

export function useArticles() {
  const { items: localArticles, add, update, remove } = useStore<StoredArticle>('articles');

  const allArticles = useMemo(() => [
    ...staticArticles.map((a) => ({ ...a, source: 'static' as const })),
    ...localArticles,
  ], [localArticles]);

  return { articles: allArticles, localArticles, add, update, remove };
}
