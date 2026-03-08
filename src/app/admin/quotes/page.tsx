'use client';

import { useState } from 'react';
import { useStore } from '@/lib/hooks/useStore';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { quotes as staticQuotes } from '@/data/quotes';
import { generateId } from '@/lib/store';
import type { StoredQuote } from '@/lib/types';

export default function AdminQuotesPage() {
  const { items: localQuotes, add, update, remove } = useStore<StoredQuote>('quotes');
  const [editing, setEditing] = useState<StoredQuote | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const allQuotes = [
    ...staticQuotes.map((q) => ({ ...q, source: 'static' as const })),
    ...localQuotes,
  ];

  const openNew = () => {
    setEditing({ id: '', text: '', source: 'local' });
    setIsNew(true);
  };

  const openEdit = (q: StoredQuote) => {
    setEditing({ ...q });
    setIsNew(false);
  };

  const save = () => {
    if (!editing) return;
    if (isNew) {
      add({ ...editing, id: generateId(), source: 'local' });
    } else {
      update(editing.id, editing);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-light">{allQuotes.length} اقتباس</p>
        <button
          onClick={openNew}
          className="px-4 py-2 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors"
        >
          + اقتباس جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allQuotes.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-cream-dark/30 p-4">
            <p className="text-sm text-charcoal leading-relaxed mb-3">❝ {q.text}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${q.source === 'static' ? 'text-teal' : 'text-bronze'}`}>
                {q.source === 'static' ? 'ثابت' : 'محلي'}
              </span>
              {q.source === 'local' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(q as StoredQuote)}
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
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? 'اقتباس جديد' : 'تعديل الاقتباس'}>
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">نص الاقتباس</label>
              <textarea
                value={editing.text}
                onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 resize-none"
              />
            </div>
            <button
              onClick={save}
              disabled={!editing.text.trim()}
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
        title="حذف الاقتباس"
        message="هل أنت متأكد من حذف هذا الاقتباس؟"
      />
    </div>
  );
}
