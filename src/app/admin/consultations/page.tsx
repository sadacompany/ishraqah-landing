'use client';

import { useState } from 'react';
import { useConsultations } from '@/lib/hooks/useConsultations';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { EmptyState } from '@/components/admin/EmptyState';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { ConsultationRequest } from '@/lib/types';

export default function AdminConsultationsPage() {
  const { items, loading, update, remove } = useConsultations();
  const [selected, setSelected] = useState<ConsultationRequest | null>(null);
  const [answer, setAnswer] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const filtered = filter === 'all' ? items : items.filter((c) => c.status === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openAnswer = (c: ConsultationRequest) => {
    setSelected(c);
    setAnswer(c.answer || '');
  };

  const submitAnswer = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await update(selected.id, { answer, status: 'answered' });
      setSelected(null);
      setAnswer('');
    } finally {
      setSaving(false);
    }
  };

  const archive = async (id: string) => {
    setActionLoading(id);
    try {
      await update(id, { status: 'archived' });
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
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'pending', 'answered', 'archived'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filter === f ? 'bg-charcoal text-white' : 'bg-white text-charcoal-light border border-cream-dark/30 hover:bg-cream-warm'
            }`}
          >
            {f === 'all' ? 'الكل' : f === 'pending' ? 'قيد الانتظار' : f === 'answered' ? 'تم الرد' : 'مؤرشف'}
            {' '}({f === 'all' ? items.length : items.filter((c) => c.status === f).length})
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="لا توجد استشارات" description="ستظهر الاستشارات هنا عند إرسالها من الموقع" />
      ) : (
        <div className="space-y-3">
          {sorted.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-cream-dark/30 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-charcoal-light">{c.type || 'عامة'}</span>
                  </div>
                  <p className="text-xs text-charcoal-light">
                    {c.name || 'مجهول'} · {new Date(c.createdAt).toLocaleDateString('ar-SA')}
                    {c.email && ` · ${c.email}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {c.status === 'pending' && (
                    <button
                      onClick={() => openAnswer(c)}
                      className="text-xs px-3 py-1.5 bg-teal text-white rounded-lg hover:bg-teal-light transition-colors"
                    >
                      الرد
                    </button>
                  )}
                  {c.status === 'answered' && (
                    <>
                      <button
                        onClick={() => openAnswer(c)}
                        className="text-xs px-3 py-1.5 bg-cream-warm text-charcoal rounded-lg hover:bg-cream-dark transition-colors"
                      >
                        تعديل الرد
                      </button>
                      <button
                        onClick={() => archive(c.id)}
                        disabled={actionLoading === c.id}
                        className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === c.id ? 'جاري...' : 'أرشفة'}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setDeleteId(c.id)}
                    className="text-xs px-2 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
              <p className="text-sm text-charcoal leading-relaxed bg-cream-warm/50 rounded-lg p-3">{c.text}</p>
              {c.answer && (
                <div className="mt-3 bg-teal-pale/30 rounded-lg p-3">
                  <p className="text-xs font-medium text-teal mb-1">الرد:</p>
                  <p className="text-sm text-charcoal leading-relaxed">{c.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => !saving && setSelected(null)} title="الرد على الاستشارة">
        {selected && (
          <div className="space-y-4">
            <div className="bg-cream-warm/50 rounded-lg p-3">
              <p className="text-sm text-charcoal leading-relaxed">{selected.text}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">الرد</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                disabled={saving}
                className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-colors resize-none disabled:opacity-50"
                placeholder="اكتب الرد هنا..."
              />
            </div>
            <button
              onClick={submitAnswer}
              disabled={!answer.trim() || saving}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-teal hover:bg-teal-light rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'جاري الحفظ...' : 'حفظ الرد'}
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
        title="حذف الاستشارة"
        message="هل أنت متأكد من حذف هذه الاستشارة؟ لا يمكن التراجع عن هذا الإجراء."
        loading={deleting}
      />
    </div>
  );
}
