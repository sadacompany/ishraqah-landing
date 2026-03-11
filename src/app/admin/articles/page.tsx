'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useArticles } from '@/lib/hooks/useArticles';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { StoredArticle } from '@/lib/types';

export default function AdminArticlesPage() {
  const router = useRouter();
  const { articles, loading, update, remove } = useArticles();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toggleHidden = async (a: StoredArticle) => {
    setActionLoading(a.id);
    try {
      await update(a.id, { hidden: !a.hidden } as Partial<StoredArticle>);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-light">
          {articles.length} مقال
          {articles.filter(a => a.hidden).length > 0 && (
            <span className="text-charcoal-light/60 mr-1">
              ({articles.filter(a => a.hidden).length} مخفي)
            </span>
          )}
        </p>
        <button
          onClick={() => router.push('/admin/articles/new')}
          className="px-4 py-2 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors"
        >
          + مقال جديد
        </button>
      </div>

      {articles.length === 0 ? (
        <EmptyState title="لا توجد مقالات" description="أضف مقالاً جديداً من الزر أعلاه" />
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className={`bg-white rounded-xl border border-cream-dark/30 p-4 flex items-center justify-between ${a.hidden ? 'opacity-50' : ''}`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-charcoal truncate">{a.title}</h3>
                  {a.featured && (
                    <span className="text-xs bg-bronze-glow/30 text-bronze px-2 py-0.5 rounded-full">مميز</span>
                  )}
                  {a.hidden && (
                    <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">مخفي</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal-light">
                  <span className="bg-cream-warm px-2 py-0.5 rounded">{a.categoryLabel}</span>
                  <span>{a.readTime} دقائق</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mr-4">
                <button
                  onClick={() => toggleHidden(a)}
                  disabled={actionLoading === a.id}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                    a.hidden
                      ? 'bg-green-50 text-green-600 hover:bg-green-100'
                      : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  }`}
                >
                  {actionLoading === a.id ? 'جاري...' : a.hidden ? 'إظهار' : 'إخفاء'}
                </button>
                <button
                  onClick={() => router.push(`/admin/articles/${a.id}/edit`)}
                  className="text-xs px-3 py-1.5 bg-cream-warm text-charcoal rounded-lg hover:bg-cream-dark transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => setDeleteId(a.id)}
                  className="text-xs px-2 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => !deleting && setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            setDeleting(true);
            try {
              await remove(deleteId);
              setDeleteId(null);
            } finally {
              setDeleting(false);
            }
          }
        }}
        title="حذف المقال"
        message="هل أنت متأكد من حذف هذا المقال؟"
        loading={deleting}
      />
    </div>
  );
}
