'use client';

import { useQuizResults } from '@/lib/hooks/useQuizResults';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useState } from 'react';

export default function AdminQuizPage() {
  const { items, remove } = useQuizResults();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Distribution stats
  const distribution = {
    none: items.filter((q) => q.totalScore <= 6).length,
    mild: items.filter((q) => q.totalScore >= 7 && q.totalScore <= 13).length,
    moderate: items.filter((q) => q.totalScore >= 14 && q.totalScore <= 18).length,
    notable: items.filter((q) => q.totalScore >= 19).length,
  };

  const avgScore = items.length > 0
    ? (items.reduce((sum, q) => sum + q.totalScore, 0) / items.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{items.length}</p>
          <p className="text-xs text-charcoal-light">إجمالي الاختبارات</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{distribution.none}</p>
          <p className="text-xs text-emerald-700">لا أعراض</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{distribution.mild}</p>
          <p className="text-xs text-amber-700">أعراض خفيفة</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{distribution.moderate}</p>
          <p className="text-xs text-orange-700">أعراض متوسطة</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{distribution.notable}</p>
          <p className="text-xs text-red-700">أعراض ملحوظة</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-cream-dark/30 p-4">
        <p className="text-sm text-charcoal-light">متوسط الدرجات: <span className="font-bold text-charcoal">{avgScore}</span> من 24</p>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="لا توجد نتائج" description="ستظهر نتائج الاختبار هنا عند إكماله من الموقع" />
      ) : (
        <div className="space-y-3">
          {sorted.map((q) => {
            const color = q.totalScore <= 6 ? 'emerald' : q.totalScore <= 13 ? 'amber' : q.totalScore <= 18 ? 'orange' : 'red';
            return (
              <div key={q.id} className="bg-white rounded-xl border border-cream-dark/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-100`}>
                      <span className={`text-sm font-bold text-${color}-600`}>{q.totalScore}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{q.resultTitle}</p>
                      <p className="text-xs text-charcoal-light">{new Date(q.createdAt).toLocaleDateString('ar-SA')} · الدرجة: {q.totalScore}/24</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteId(q.id)}
                    className="text-xs px-2 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    حذف
                  </button>
                </div>
                {(q.ipAddress || q.country || q.userAgent) && (
                  <div className="mt-3 pt-3 border-t border-cream-dark/20 text-xs text-charcoal-light space-y-1">
                    {q.ipAddress && <p>IP: <span dir="ltr">{q.ipAddress}</span></p>}
                    {q.country && <p>الدولة: {q.country}</p>}
                    {q.userAgent && <p className="truncate">المتصفح: <span dir="ltr">{q.userAgent.slice(0, 80)}...</span></p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await remove(deleteId); setDeleteId(null); } }}
        title="حذف النتيجة"
        message="هل أنت متأكد من حذف هذه النتيجة؟"
      />
    </div>
  );
}
