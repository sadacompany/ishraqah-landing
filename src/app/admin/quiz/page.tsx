'use client';

import { useQuizResults } from '@/lib/hooks/useQuizResults';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useState } from 'react';

export default function AdminQuizPage() {
  const { items, loading, remove } = useQuizResults();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const followUpCount = items.filter((q) => q.wantsFollowUp).length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
    </div>
  );

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

      <div className="flex gap-3">
        <div className="flex-1 bg-white rounded-xl border border-cream-dark/30 p-4">
          <p className="text-sm text-charcoal-light">متوسط الدرجات: <span className="font-bold text-charcoal">{avgScore}</span> من 24</p>
        </div>
        {followUpCount > 0 && (
          <div className="bg-teal-pale rounded-xl border border-teal-light/30 p-4">
            <p className="text-sm text-teal">
              <span className="font-bold">{followUpCount}</span> يرغبون بالمتابعة
            </p>
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="لا توجد نتائج" description="ستظهر نتائج الاختبار هنا عند إكماله من الموقع" />
      ) : (
        <div className="space-y-3">
          {sorted.map((q) => {
            const color = q.totalScore <= 6 ? 'emerald' : q.totalScore <= 13 ? 'amber' : q.totalScore <= 18 ? 'orange' : 'red';
            const hasContact = q.name || q.phone || q.email;
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

                {/* Contact & Device Info */}
                {(hasContact || q.country || q.userAgent) && (
                  <div className={`mt-3 pt-3 border-t border-cream-dark/20 flex flex-wrap items-center gap-2 ${q.wantsFollowUp ? 'bg-teal-pale/20 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl' : ''}`}>
                    {q.name && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-bronze-glow/30 text-charcoal px-3 py-1.5 rounded-full">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {q.name}
                      </span>
                    )}
                    {q.phone && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-teal-pale text-teal px-3 py-1.5 rounded-full" dir="ltr">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        {q.phone}
                      </span>
                    )}
                    {q.email && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-cream-warm text-charcoal-light px-3 py-1.5 rounded-full" dir="ltr">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        {q.email}
                      </span>
                    )}
                    {q.country && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
                        <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        {q.country}
                      </span>
                    )}
                    {q.userAgent && (() => {
                      const ua = q.userAgent;
                      const device = ua.includes('iPhone') ? 'iPhone'
                        : ua.includes('iPad') ? 'iPad'
                        : ua.includes('Android') ? 'Android'
                        : ua.includes('Macintosh') ? 'Mac'
                        : ua.includes('Windows') ? 'Windows'
                        : ua.includes('Linux') ? 'Linux'
                        : 'متصفح';
                      return (
                        <span className="inline-flex items-center gap-1.5 text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full">
                          <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                          </svg>
                          {device}
                        </span>
                      );
                    })()}
                    {q.wantsFollowUp && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] bg-teal text-white px-3 py-1.5 rounded-full font-medium">
                        يرغب بالمتابعة
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
        title="حذف النتيجة"
        message="هل أنت متأكد من حذف هذه النتيجة؟"
        loading={deleting}
      />
    </div>
  );
}
