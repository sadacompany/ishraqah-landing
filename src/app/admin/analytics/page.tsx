'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '@/lib/api-client';
import type { AnalyticsSummary } from '@/lib/types';

const rangeOptions = [
  { key: '1d', label: 'اليوم' },
  { key: '7d', label: 'أسبوع' },
  { key: '30d', label: 'شهر' },
  { key: '90d', label: '3 أشهر' },
  { key: '1y', label: 'سنة' },
] as const;

type RangeKey = (typeof rangeOptions)[number]['key'];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>('30d');

  const fetchData = useCallback(async (r: RangeKey) => {
    setLoading(true);
    try {
      const result = await apiGet<AnalyticsSummary>(`/api/analytics?range=${r}`);
      setData(result);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-charcoal-light py-20">تعذر تحميل بيانات التحليلات</p>;
  }

  const maxViews = Math.max(...data.dailyViews.map((d) => Number(d.views)), 1);
  const cc = data.contentCounts;

  return (
    <div className="space-y-6">
      {/* Today's stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{data.todayViews.toLocaleString()}</p>
          <p className="text-xs text-charcoal-light">زيارات اليوم</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{data.todayUniqueVisitors.toLocaleString()}</p>
          <p className="text-xs text-charcoal-light">زوار اليوم</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{data.totalViews.toLocaleString()}</p>
          <p className="text-xs text-charcoal-light">إجمالي الزيارات</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{data.uniqueVisitors.toLocaleString()}</p>
          <p className="text-xs text-charcoal-light">إجمالي الزوار</p>
        </div>
      </div>

      {/* Content Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-bronze-glow/30 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-bronze">{cc.consultations}</p>
          <p className="text-xs text-charcoal-light">الاستشارات</p>
          {cc.pendingConsultations > 0 && (
            <p className="text-[10px] text-amber-600 mt-1">{cc.pendingConsultations} بانتظار الرد</p>
          )}
        </div>
        <div className="bg-teal-pale/50 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-teal">{cc.articles}</p>
          <p className="text-xs text-charcoal-light">المقالات</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-amber-600">{cc.quizSubmissions}</p>
          <p className="text-xs text-charcoal-light">نتائج الاختبار</p>
        </div>
        <div className="bg-red-50/50 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-rose-soft">{cc.guestbookEntries}</p>
          <p className="text-xs text-charcoal-light">بصمة الزوار</p>
        </div>
        <div className="bg-cream-warm rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-charcoal">{cc.quotes}</p>
          <p className="text-xs text-charcoal-light">الاقتباسات</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark/30 p-4 text-center">
          <p className="text-xl font-bold text-charcoal">{cc.articles + cc.consultations + cc.quizSubmissions + cc.guestbookEntries + cc.quotes}</p>
          <p className="text-xs text-charcoal-light">إجمالي المحتوى</p>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white rounded-xl border border-cream-dark/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-charcoal">الزيارات</h3>
          <div className="flex gap-1 bg-cream-warm rounded-lg p-1">
            {rangeOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setRange(opt.key)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  range === opt.key
                    ? 'bg-white text-charcoal font-medium shadow-sm'
                    : 'text-charcoal-light hover:text-charcoal'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-6 h-6 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data.dailyViews.length > 0 ? (
          <>
            <div className="flex items-end gap-[2px] h-40">
              {data.dailyViews.map((d) => {
                const height = (Number(d.views) / maxViews) * 100;
                return (
                  <div key={d.date} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                    <div className="hidden group-hover:block absolute -top-8 bg-charcoal text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                      {Number(d.views)} زيارة · {d.date}
                    </div>
                    <div
                      className="w-full bg-bronze/70 hover:bg-bronze rounded-t transition-colors cursor-default"
                      style={{ height: `${Math.max(height, 1)}%`, minHeight: '2px' }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-charcoal-light">{data.dailyViews[0]?.date}</span>
              <span className="text-[10px] text-charcoal-light">{data.dailyViews[data.dailyViews.length - 1]?.date}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-charcoal-light text-center py-10">لا توجد بيانات لهذه الفترة</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-cream-dark/30 p-5">
          <h3 className="text-sm font-bold text-charcoal mb-4">أكثر الصفحات زيارة</h3>
          {data.topPages.length === 0 ? (
            <p className="text-sm text-charcoal-light text-center py-4">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-2">
              {data.topPages.map((p, i) => (
                <div key={p.path} className="flex items-center justify-between p-2 bg-cream-warm/50 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs text-charcoal-light w-5">{i + 1}</span>
                    <span className="text-sm text-charcoal truncate" dir="ltr">{p.path}</span>
                  </div>
                  <span className="text-xs font-medium text-bronze mr-2">{Number(p.views).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-xl border border-cream-dark/30 p-5">
          <h3 className="text-sm font-bold text-charcoal mb-4">أكثر الدول زيارة</h3>
          {data.topCountries.length === 0 ? (
            <p className="text-sm text-charcoal-light text-center py-4">لا توجد بيانات بعد</p>
          ) : (
            <div className="space-y-2">
              {data.topCountries.map((c, i) => (
                <div key={c.country} className="flex items-center justify-between p-2 bg-cream-warm/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-charcoal-light w-5">{i + 1}</span>
                    <span className="text-sm text-charcoal">{c.country}</span>
                  </div>
                  <span className="text-xs font-medium text-bronze">{Number(c.views).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-white rounded-xl border border-cream-dark/30 p-5">
        <h3 className="text-sm font-bold text-charcoal mb-4">آخر الزوار</h3>
        {data.recentVisitors.length === 0 ? (
          <p className="text-sm text-charcoal-light text-center py-4">لا توجد زيارات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-charcoal-light border-b border-cream-dark/30">
                  <th className="text-right py-2 px-2">الصفحة</th>
                  <th className="text-right py-2 px-2">الدولة</th>
                  <th className="text-right py-2 px-2">IP</th>
                  <th className="text-right py-2 px-2">الوقت</th>
                </tr>
              </thead>
              <tbody>
                {data.recentVisitors.map((v, i) => (
                  <tr key={i} className="border-b border-cream-dark/10">
                    <td className="py-2 px-2 text-charcoal truncate max-w-[200px]" dir="ltr">{v.path}</td>
                    <td className="py-2 px-2 text-charcoal-light">{v.country || '-'}</td>
                    <td className="py-2 px-2 text-charcoal-light" dir="ltr">{v.ipAddress || '-'}</td>
                    <td className="py-2 px-2 text-charcoal-light text-xs">{new Date(v.createdAt).toLocaleString('ar-SA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
