'use client';

import { useApiResource } from './useStore';
import type { StoredArticle } from '../types';

export function useArticles() {
  const { items: articles, ...rest } = useApiResource<StoredArticle>('/api/articles');
  return { articles, ...rest };
}
