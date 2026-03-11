'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiPost, apiPatch } from '@/lib/api-client';
import { generateId } from '@/lib/store';
import { ContentEditor } from './ContentEditor';
import { ImageUploader } from './ImageUploader';
import type { StoredArticle } from '@/lib/types';

const categoryLabels: Record<string, string> = {
  psychology: 'علم النفس',
  parenting: 'التربية',
  relationships: 'العلاقات الزوجية',
  'self-development': 'تطوير الذات',
};

interface ArticleEditorProps {
  mode: 'create' | 'edit';
  initialData?: StoredArticle;
}

export function ArticleEditor({ mode, initialData }: ArticleEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [category, setCategory] = useState<StoredArticle['category']>(initialData?.category || 'psychology');
  const [categoryLabel, setCategoryLabel] = useState(initialData?.categoryLabel || 'علم النفس');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [hidden, setHidden] = useState(initialData?.hidden || false);

  const [saving, setSaving] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Track unsaved changes
  useEffect(() => {
    if (!initialData) {
      setUnsavedChanges(!!title || !!content || !!excerpt || !!imageUrl);
    } else {
      setUnsavedChanges(
        title !== initialData.title ||
        slug !== initialData.slug ||
        excerpt !== initialData.excerpt ||
        content !== initialData.content ||
        imageUrl !== initialData.imageUrl ||
        category !== initialData.category ||
        featured !== initialData.featured ||
        hidden !== initialData.hidden
      );
    }
  }, [title, slug, excerpt, content, imageUrl, category, featured, hidden, initialData]);

  // Beforeunload warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [unsavedChanges]);

  const generateSlug = useCallback(() => {
    if (!slug && title) {
      setSlug(title.replace(/\s+/g, '-').toLowerCase());
    }
  }, [slug, title]);

  const handleSave = async (publish: boolean = false) => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const data = {
        title,
        slug: slug || title.replace(/\s+/g, '-').toLowerCase(),
        excerpt,
        content,
        imageUrl,
        category,
        categoryLabel,
        featured,
        hidden: publish ? false : hidden,
        readTime,
      };

      if (mode === 'create') {
        await apiPost('/api/articles', { ...data, id: generateId() });
      } else if (initialData) {
        await apiPatch(`/api/articles/${initialData.id}`, data);
      }

      setUnsavedChanges(false);
      router.push('/admin/articles');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/articles"
          className="text-sm text-charcoal-light hover:text-bronze transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة للمقالات
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={!title.trim() || saving}
            className="px-4 py-2 text-sm font-medium text-charcoal bg-cream-warm hover:bg-cream-dark/30 border border-cream-dark/30 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <div className="w-3.5 h-3.5 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />}
            حفظ
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={!title.trim() || saving}
            className="px-4 py-2 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            حفظ ونشر
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Main content area */}
        <div className="flex-1 min-w-0 space-y-4">
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={generateSlug}
              disabled={saving}
              placeholder="عنوان المقال"
              className="w-full px-4 py-3 text-xl font-bold bg-white border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 disabled:opacity-50"
            />
          </div>
          <div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              disabled={saving}
              placeholder="المقتطف — وصف مختصر يظهر في قائمة المقالات"
              className="w-full px-4 py-2.5 text-sm bg-white border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 resize-none disabled:opacity-50"
            />
          </div>
          <ContentEditor value={content} onChange={setContent} disabled={saving} />
        </div>

        {/* Sidebar */}
        <div className="w-72 shrink-0 space-y-5">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">صورة المقال</label>
            <ImageUploader value={imageUrl} onChange={setImageUrl} disabled={saving} />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">التصنيف</label>
            <select
              value={category}
              onChange={(e) => {
                const cat = e.target.value as StoredArticle['category'];
                setCategory(cat);
                setCategoryLabel(categoryLabels[cat] || cat);
              }}
              disabled={saving}
              className="w-full px-3 py-2 text-sm bg-white border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 disabled:opacity-50"
            >
              {Object.entries(categoryLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">وقت القراءة</label>
            <div className="px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl text-charcoal-light">
              {readTime} دقائق (تلقائي)
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">الرابط (slug)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={saving}
              placeholder="يتم إنشاؤه تلقائياً"
              dir="ltr"
              className="w-full px-3 py-2 text-sm bg-white border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 disabled:opacity-50"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                disabled={saving}
                className="rounded"
              />
              مقال مميز
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                disabled={saving}
                className="rounded"
              />
              مخفي
            </label>
          </div>

          <div className="pt-3 border-t border-cream-dark/30">
            <p className="text-xs text-charcoal-light">
              عدد الكلمات: <span className="text-charcoal font-medium">{wordCount}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
