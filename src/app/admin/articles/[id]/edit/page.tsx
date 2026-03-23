'use client';

import { useState, useEffect, use } from 'react';
import { apiGet } from '@/lib/api-client';
import { ArticleEditor } from '@/components/admin/ArticleEditor';
import type { StoredArticle } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: Props) {
  const { id } = use(params);
  const [article, setArticle] = useState<StoredArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet<StoredArticle[]>('/api/articles')
      .then((articles) => {
        const found = articles.find((a) => a.id === id);
        if (found) {
          setArticle(found);
        } else {
          setError('المقال غير موجود');
        }
      })
      .catch(() => setError('فشل تحميل المقال'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-20 text-charcoal-light">
        {error || 'المقال غير موجود'}
      </div>
    );
  }

  return <ArticleEditor mode="edit" initialData={article} />;
}
