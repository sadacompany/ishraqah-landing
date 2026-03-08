'use client';

import { useState } from 'react';
import { useGuestbook } from '@/lib/hooks/useGuestbook';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

export default function AdminGuestbookPage() {
  const { items, update, remove } = useGuestbook();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? items : items.filter((e) => e.status === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filter === f ? 'bg-charcoal text-white' : 'bg-white text-charcoal-light border border-cream-dark/30 hover:bg-cream-warm'
            }`}
          >
            {f === 'all' ? 'الكل' : f === 'pending' ? 'قيد الانتظار' : f === 'approved' ? 'معتمدة' : 'مرفوضة'}
            {' '}({f === 'all' ? items.length : items.filter((e) => e.status === f).length})
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="لا توجد رسائل" description="ستظهر رسائل الزوار هنا عند إرسالها من الموقع" />
      ) : (
        <div className="space-y-3">
          {sorted.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl border border-cream-dark/30 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bronze-glow/30 flex items-center justify-center">
                    <span className="text-bronze text-xs font-bold">{entry.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{entry.name}</p>
                    <p className="text-xs text-charcoal-light">{new Date(entry.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
                <StatusBadge status={entry.status} />
              </div>
              <p className="text-sm text-charcoal leading-relaxed mb-4">{entry.message}</p>
              <div className="flex items-center gap-2">
                {entry.status === 'pending' && (
                  <>
                    <button
                      onClick={() => update(entry.id, { status: 'approved' })}
                      className="text-xs px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                    >
                      موافقة
                    </button>
                    <button
                      onClick={() => update(entry.id, { status: 'rejected' })}
                      className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      رفض
                    </button>
                  </>
                )}
                {entry.status === 'approved' && (
                  <button
                    onClick={() => update(entry.id, { status: 'rejected' })}
                    className="text-xs px-3 py-1.5 bg-cream-warm text-charcoal rounded-lg hover:bg-cream-dark transition-colors"
                  >
                    إلغاء الموافقة
                  </button>
                )}
                {entry.status === 'rejected' && (
                  <button
                    onClick={() => update(entry.id, { status: 'approved' })}
                    className="text-xs px-3 py-1.5 bg-cream-warm text-charcoal rounded-lg hover:bg-cream-dark transition-colors"
                  >
                    موافقة
                  </button>
                )}
                <button
                  onClick={() => setDeleteId(entry.id)}
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
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await remove(deleteId); setDeleteId(null); } }}
        title="حذف الرسالة"
        message="هل أنت متأكد من حذف هذه الرسالة؟"
      />
    </div>
  );
}
