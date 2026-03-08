'use client';

import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api-client';
import type { AnalyticsSummary } from '@/lib/types';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<AnalyticsSummary>('/api/analytics')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-charcoal-light py-20">تعذر تحميل بيانات التحليلات</p>;
  }

  const maxViews = Math.max(...data.dailyViews.map((d) => Number(d.views)), 1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-cream-dark/30 p-5 text-center">
          <p className="text-3xl font-bold text-charcoal">{data.totalViews.toLocaleString()}</p>
          <p className="text-xs text-charcoal-light mt-1">إجمالي الزيارات</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark/30 p-5 text-center">
          <p className="text-3xl font-bold text-charcoal">{data.uniqueVisitors.toLocaleString()}</p>
          <p className="text-xs text-charcoal-light mt-1">زوار فريدون</p>
        </div>
      </div>

      {/* Daily Chart */}
      {data.dailyViews.length > 0 && (
        <div className="bg-white rounded-xl border border-cream-dark/30 p-5">
          <h3 className="text-sm font-bold text-charcoal mb-4">الزيارات اليومية (آخر 30 يوم)</h3>
          <div className="flex items-end gap-1 h-32">
            {data.dailyViews.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-bronze/70 rounded-t"
                  style={{ height: `${(Number(d.views) / maxViews) * 100}%`, minHeight: '2px' }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-charcoal-light">{data.dailyViews[0]?.date?.slice(5)}</span>
            <span className="text-[10px] text-charcoal-light">{data.dailyViews[data.dailyViews.length - 1]?.date?.slice(5)}</span>
          </div>
        </div>
      )}

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
