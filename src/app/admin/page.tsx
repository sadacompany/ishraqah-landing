'use client';

import { useStore } from '@/lib/hooks/useStore';
import { StatsCard } from '@/components/admin/StatsCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import type { ConsultationRequest, QuizSubmission, GuestbookEntry, StoredArticle, StoredQuote } from '@/lib/types';
import { articles } from '@/data/articles';
import { quotes } from '@/data/quotes';

export default function AdminDashboard() {
  const { items: consultations } = useStore<ConsultationRequest>('consultations');
  const { items: quizResults } = useStore<QuizSubmission>('quizResults');
  const { items: guestbookEntries } = useStore<GuestbookEntry>('guestbook');
  const { items: localArticles } = useStore<StoredArticle>('articles');
  const { items: localQuotes } = useStore<StoredQuote>('quotes');

  const totalArticles = articles.length + localArticles.length;
  const totalQuotes = quotes.length + localQuotes.length;
  const pendingGuestbook = guestbookEntries.filter((e) => e.status === 'pending').length;
  const pendingConsultations = consultations.filter((c) => c.status === 'pending').length;

  const recentConsultations = [...consultations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const recentGuestbook = [...guestbookEntries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="الاستشارات"
          value={consultations.length}
          icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          color="bronze"
        />
        <StatsCard
          title="نتائج الاختبار"
          value={quizResults.length}
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          color="teal"
        />
        <StatsCard
          title="بصمة الزوار"
          value={guestbookEntries.length}
          icon="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          color="rose"
        />
        <StatsCard
          title="المقالات"
          value={totalArticles}
          icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          color="bronze"
        />
      </div>

      {/* Alerts */}
      {(pendingConsultations > 0 || pendingGuestbook > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-700 text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>
              {pendingConsultations > 0 && `${pendingConsultations} استشارة بانتظار الرد`}
              {pendingConsultations > 0 && pendingGuestbook > 0 && ' · '}
              {pendingGuestbook > 0 && `${pendingGuestbook} رسالة بانتظار المراجعة`}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consultations */}
        <div className="bg-white rounded-xl border border-cream-dark/30 p-5">
          <h3 className="text-sm font-bold text-charcoal mb-4">آخر الاستشارات</h3>
          {recentConsultations.length === 0 ? (
            <p className="text-sm text-charcoal-light text-center py-6">لا توجد استشارات بعد</p>
          ) : (
            <div className="space-y-3">
              {recentConsultations.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-cream-warm/50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-charcoal truncate">{c.text.slice(0, 60)}...</p>
                    <p className="text-xs text-charcoal-light mt-0.5">{new Date(c.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Guestbook */}
        <div className="bg-white rounded-xl border border-cream-dark/30 p-5">
          <h3 className="text-sm font-bold text-charcoal mb-4">آخر رسائل الزوار</h3>
          {recentGuestbook.length === 0 ? (
            <p className="text-sm text-charcoal-light text-center py-6">لا توجد رسائل بعد</p>
          ) : (
            <div className="space-y-3">
              {recentGuestbook.map((g) => (
                <div key={g.id} className="flex items-center justify-between p-3 bg-cream-warm/50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-charcoal">{g.name}</p>
                    <p className="text-xs text-charcoal-light mt-0.5 truncate">{g.message.slice(0, 50)}...</p>
                  </div>
                  <StatusBadge status={g.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{totalQuotes}</p>
          <p className="text-xs text-charcoal-light">اقتباس</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{quizResults.length}</p>
          <p className="text-xs text-charcoal-light">اختبار مكتمل</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{guestbookEntries.filter(e => e.status === 'approved').length}</p>
          <p className="text-xs text-charcoal-light">رسالة معتمدة</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{consultations.filter(c => c.status === 'answered').length}</p>
          <p className="text-xs text-charcoal-light">استشارة تم الرد عليها</p>
        </div>
      </div>
    </div>
  );
}
