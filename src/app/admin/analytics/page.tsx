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

const pageNames: Record<string, string> = {
  '/': 'الرئيسية',
  '/about': 'من نحن',
  '/cv': 'السيرة الذاتية',
  '/articles': 'المقالات',
  '/books': 'المؤلفات',
  '/videos': 'الفيديوهات',
  '/guestbook': 'بصمة الزوار',
  '/self-test': 'اختبر نفسك',
  '/consultations': 'الاستشارات',
  '/consultations/new': 'استشارة جديدة',
  '/consultations/follow-up': 'متابعة استشارة',
  '/consultations/archive': 'أرشيف الاستشارات',
  '/admin': 'لوحة التحكم',
};

const quizPageNames: Record<string, string> = {
  '/self-test/panic': 'اختبار نوبات الهلع',
  '/self-test/anxiety': 'اختبار القلق',
  '/self-test/depression': 'اختبار الاكتئاب',
};

function getPageName(path: string): string {
  if (pageNames[path]) return pageNames[path];
  if (quizPageNames[path]) return quizPageNames[path];
  if (path.startsWith('/articles/')) return 'مقال: ' + path.replace('/articles/', '');
  if (path.startsWith('/self-test/')) return 'اختبار: ' + path.replace('/self-test/', '');
  if (path.startsWith('/admin/')) return 'لوحة التحكم';
  return path;
}

const countryNames: Record<string, string> = {
  'Saudi Arabia': 'السعودية',
  'United States': 'الولايات المتحدة',
  'United Arab Emirates': 'الإمارات',
  'Kuwait': 'الكويت',
  'Qatar': 'قطر',
  'Bahrain': 'البحرين',
  'Oman': 'عُمان',
  'Yemen': 'اليمن',
  'Egypt': 'مصر',
  'Jordan': 'الأردن',
  'Iraq': 'العراق',
  'Syria': 'سوريا',
  'Lebanon': 'لبنان',
  'Palestine': 'فلسطين',
  'Libya': 'ليبيا',
  'Tunisia': 'تونس',
  'Algeria': 'الجزائر',
  'Morocco': 'المغرب',
  'Sudan': 'السودان',
  'Somalia': 'الصومال',
  'Mauritania': 'موريتانيا',
  'Djibouti': 'جيبوتي',
  'Comoros': 'جزر القمر',
  'Turkey': 'تركيا',
  'Iran': 'إيران',
  'Pakistan': 'باكستان',
  'India': 'الهند',
  'United Kingdom': 'بريطانيا',
  'Germany': 'ألمانيا',
  'France': 'فرنسا',
  'Canada': 'كندا',
  'Australia': 'أستراليا',
  'Malaysia': 'ماليزيا',
  'Indonesia': 'إندونيسيا',
  'Singapore': 'سنغافورة',
  'China': 'الصين',
  'Japan': 'اليابان',
  'South Korea': 'كوريا الجنوبية',
  'Netherlands': 'هولندا',
  'Sweden': 'السويد',
  'Norway': 'النرويج',
  'Italy': 'إيطاليا',
  'Spain': 'إسبانيا',
  'Russia': 'روسيا',
  'Brazil': 'البرازيل',
  'South Africa': 'جنوب أفريقيا',
  'Nigeria': 'نيجيريا',
  'Mexico': 'المكسيك',
};

function getCountryName(country: string): string {
  return countryNames[country] || country;
}

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
      <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label="جاري التحميل">
        <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        <span className="sr-only">جاري التحميل...</span>
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
          <p className="text-xs text-charcoal-light">خربشات قلم</p>
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
                    <span className="text-sm text-charcoal truncate">{getPageName(p.path)}</span>
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
                    <span className="text-sm text-charcoal">{getCountryName(c.country)}</span>
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
          <div className="space-y-2">
            {data.recentVisitors.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-cream-warm/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bronze-glow/40 flex items-center justify-center">
                    <svg className="w-4 h-4 text-bronze" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal font-medium">{getPageName(v.path)}</p>
                    <p className="text-xs text-charcoal-light">{v.country ? getCountryName(v.country) : 'غير معروف'}</p>
                  </div>
                </div>
                <span className="text-xs text-charcoal-light">{new Date(v.createdAt).toLocaleString('ar-SA')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
