'use client';

import { useState } from 'react';
import { useQuotes } from '@/lib/hooks/useQuotes';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { generateId } from '@/lib/store';
import type { StoredQuote } from '@/lib/types';

export default function AdminQuotesPage() {
  const { quotes, loading, add, update, remove } = useQuotes();
  const [editing, setEditing] = useState<StoredQuote | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openNew = () => {
    setEditing({ id: '', text: '', hidden: false });
    setIsNew(true);
  };

  const openEdit = (q: StoredQuote) => {
    setEditing({ ...q });
    setIsNew(false);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (isNew) {
        await add({ ...editing, id: generateId() });
      } else {
        await update(editing.id, { text: editing.text });
      }
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const toggleHidden = async (q: StoredQuote) => {
    setActionLoading(q.id);
    try {
      await update(q.id, { hidden: !q.hidden } as Partial<StoredQuote>);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-light">
          {quotes.length} اقتباس
          {quotes.filter(q => q.hidden).length > 0 && (
            <span className="text-charcoal-light/60 mr-1">
              ({quotes.filter(q => q.hidden).length} مخفي)
            </span>
          )}
        </p>
        <button
          onClick={openNew}
          className="px-4 py-2 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors"
        >
          + اقتباس جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quotes.map((q) => (
          <div key={q.id} className={`bg-white rounded-xl border border-cream-dark/30 p-4 ${q.hidden ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-2 mb-3">
              <p className="text-sm text-charcoal leading-relaxed flex-1">{q.text}</p>
              {q.hidden && (
                <span className="shrink-0 text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">مخفي</span>
              )}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => toggleHidden(q)}
                disabled={actionLoading === q.id}
                className={`text-xs px-2 py-1 rounded transition-colors disabled:opacity-50 ${
                  q.hidden
                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                    : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                }`}
              >
                {actionLoading === q.id ? 'جاري...' : q.hidden ? 'إظهار' : 'إخفاء'}
              </button>
              <button
                onClick={() => openEdit(q)}
                className="text-xs px-2 py-1 bg-cream-warm text-charcoal rounded hover:bg-cream-dark transition-colors"
              >
                تعديل
              </button>
              <button
                onClick={() => setDeleteId(q.id)}
                className="text-xs px-2 py-1 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => !saving && setEditing(null)} title={isNew ? 'اقتباس جديد' : 'تعديل الاقتباس'}>
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">نص الاقتباس</label>
              <textarea
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                rows={4}
                disabled={saving}
                className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 resize-none disabled:opacity-50"
              />
            </div>
            <button
              onClick={save}
              disabled={!editing.text.trim() || saving}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        )}
      </Modal>

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
        title="حذف الاقتباس"
        message="هل أنت متأكد من حذف هذا الاقتباس؟"
        loading={deleting}
      />
    </div>
  );
}
