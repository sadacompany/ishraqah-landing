'use client';

import { useState } from 'react';
import { useStore } from '@/lib/hooks/useStore';
import { EmptyState } from '@/components/admin/EmptyState';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { articles as staticArticles, categoryLabels } from '@/data/articles';
import { generateId } from '@/lib/store';
import type { StoredArticle } from '@/lib/types';

const emptyArticle: Omit<StoredArticle, 'id' | 'source'> = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  category: 'psychology',
  categoryLabel: 'علم النفس',
  featured: false,
  readTime: 3,
};

export default function AdminArticlesPage() {
  const { items: localArticles, add, update, remove } = useStore<StoredArticle>('articles');
  const [editing, setEditing] = useState<StoredArticle | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const allArticles = [
    ...staticArticles.map((a) => ({ ...a, source: 'static' as const })),
    ...localArticles,
  ];

  const openNew = () => {
    setEditing({ ...emptyArticle, id: '', source: 'local' });
    setIsNew(true);
  };

  const openEdit = (a: StoredArticle) => {
    setEditing({ ...a });
    setIsNew(false);
  };

  const save = () => {
    if (!editing) return;
    if (isNew) {
      add({
        ...editing,
        id: generateId(),
        slug: editing.slug || editing.title.replace(/\s+/g, '-').toLowerCase(),
        source: 'local',
      });
    } else {
      update(editing.id, editing);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-light">{allArticles.length} مقال</p>
        <button
          onClick={openNew}
          className="px-4 py-2 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors"
        >
          + مقال جديد
        </button>
      </div>

      {allArticles.length === 0 ? (
        <EmptyState title="لا توجد مقالات" description="أضف مقالاً جديداً من الزر أعلاه" />
      ) : (
        <div className="space-y-3">
          {allArticles.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-cream-dark/30 p-4 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-charcoal truncate">{a.title}</h3>
                  {a.featured && (
                    <span className="text-xs bg-bronze-glow/30 text-bronze px-2 py-0.5 rounded-full">مميز</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal-light">
                  <span className="bg-cream-warm px-2 py-0.5 rounded">{a.categoryLabel}</span>
                  <span>{a.readTime} دقائق</span>
                  <span className={a.source === 'static' ? 'text-teal' : 'text-bronze'}>{a.source === 'static' ? 'ثابت' : 'محلي'}</span>
                </div>
              </div>
              {a.source === 'local' && (
                <div className="flex items-center gap-2 mr-4">
                  <button
                    onClick={() => openEdit(a as StoredArticle)}
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
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? 'مقال جديد' : 'تعديل المقال'}
      >
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">العنوان</label>
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">الرابط (slug)</label>
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30"
                placeholder="يتم إنشاؤه تلقائياً من العنوان"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">المقتطف</label>
              <textarea
                value={editing.excerpt}
                onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">المحتوى</label>
              <textarea
                value={editing.content}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">التصنيف</label>
                <select
                  value={editing.category}
                  onChange={(e) => {
                    const cat = e.target.value as StoredArticle['category'];
                    setEditing({ ...editing, category: cat, categoryLabel: categoryLabels[cat] || cat });
                  }}
                  className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30"
                >
                  {Object.entries(categoryLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">وقت القراءة (دقائق)</label>
                <input
                  type="number"
                  value={editing.readTime}
                  onChange={(e) => setEditing({ ...editing, readTime: parseInt(e.target.value) || 3 })}
                  min={1}
                  className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="rounded"
              />
              مقال مميز
            </label>
            <button
              onClick={save}
              disabled={!editing.title.trim()}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors disabled:opacity-50"
            >
              حفظ
            </button>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { remove(deleteId); setDeleteId(null); } }}
        title="حذف المقال"
        message="هل أنت متأكد من حذف هذا المقال؟"
      />
    </div>
  );
}
