'use client';

import Link from 'next/link';
import { useState } from 'react';
import { generateId } from '@/lib/store';
import { apiPost, apiGet } from '@/lib/api-client';
import type { ConsultationRequest } from '@/lib/types';

type Tab = 'new' | 'follow-up';

export default function NewConsultationPage() {
  const [tab, setTab] = useState<Tab>('new');

  // New consultation state
  const [submitted, setSubmitted] = useState(false);
  const [consultationId, setConsultationId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Follow-up state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ConsultationRequest[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const id = generateId();
      await apiPost('/api/consultations', { id, name, email, type, text });
      setConsultationId(id);
      setSubmitted(true);
    } catch {
      alert('حدث خطأ. حاول مرة أخرى.');
    }
    setSubmitting(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiGet<ConsultationRequest[]>(`/api/consultations/lookup?q=${encodeURIComponent(query.trim())}`);
      setResults(data);
    } catch {
      setResults([]);
    }
    setSearched(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-cream-dark/30 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-teal-pale flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-charcoal mb-3">تم إرسال استشارتك بنجاح</h2>
          <p className="text-charcoal-light text-sm leading-relaxed">
            شكراً لثقتك. سيتم الرد على استشارتك في أقرب وقت ممكن.
          </p>
          <p className="mt-3 text-sm font-medium text-bronze">رقم استشارتك: {consultationId}</p>
          <p className="mt-1 text-xs text-charcoal-light">احتفظ بهذا الرقم لمتابعة استشارتك لاحقاً</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { setTab('follow-up'); setQuery(consultationId); setSubmitted(false); }}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-bronze rounded-xl"
            >
              متابعة الاستشارة
            </button>
            <Link href="/" className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-charcoal bg-cream-warm rounded-xl">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const result = results[0] || null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">الرئيسية</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">الاستشارات</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">الاستشارات</h1>
        <p className="mt-3 text-charcoal-light text-sm leading-relaxed">
          أرسل استشارتك النفسية أو التربوية بسرية تامة، أو تابع استشارة سابقة.
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream-warm rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab('new')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            tab === 'new' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-light hover:text-charcoal'
          }`}
        >
          استشارة جديدة
        </button>
        <button
          onClick={() => setTab('follow-up')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            tab === 'follow-up' ? 'bg-white text-charcoal shadow-sm' : 'text-charcoal-light hover:text-charcoal'
          }`}
        >
          متابعة استشارة
        </button>
      </div>

      {tab === 'new' ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-dark/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">الاسم (اختياري)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="يمكنك استخدام اسم مستعار"
                className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">البريد الإلكتروني (اختياري)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="للتواصل معك بخصوص الاستشارة"
                className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">نوع الاستشارة</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
              >
                <option value="">اختر نوع الاستشارة</option>
                <option value="psychological">نفسية</option>
                <option value="parenting">تربوية</option>
                <option value="marital">زوجية</option>
                <option value="self-development">تطوير ذات</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                نص الاستشارة <span className="text-rose-soft">*</span>
              </label>
              <textarea
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="اكتب استشارتك هنا بالتفصيل..."
                className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors resize-none"
              />
            </div>

            <div className="bg-teal-pale/30 rounded-xl p-4">
              <p className="text-xs text-charcoal-light leading-relaxed">
                <strong className="text-charcoal">ملاحظة:</strong> جميع الاستشارات تُعامل بسرية تامة. في حال نشر الاستشارة في الأرشيف فإنه يتم حذف أي معلومات شخصية للحفاظ على الخصوصية.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors disabled:opacity-50"
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال الاستشارة'}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-dark/30">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  رقم الاستشارة أو البريد الإلكتروني
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="أدخل رقم الاستشارة أو البريد الإلكتروني"
                  className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 text-sm font-medium text-white bg-teal hover:bg-teal-light rounded-xl transition-colors"
              >
                البحث عن الاستشارة
              </button>
            </form>
          </div>

          {searched && (
            <div className="mt-6">
              {result ? (
                <div className="bg-white rounded-2xl p-6 border border-cream-dark/30">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.status === 'answered' ? 'bg-teal-pale text-teal' :
                      result.status === 'archived' ? 'bg-gray-100 text-gray-600' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {result.status === 'answered' ? 'تم الرد' : result.status === 'archived' ? 'مؤرشف' : 'قيد الانتظار'}
                    </span>
                    <span className="text-xs text-charcoal-light">{new Date(result.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="bg-cream-warm/50 rounded-xl p-4 mb-4">
                    <p className="text-xs font-medium text-charcoal-light mb-1">استشارتك:</p>
                    <p className="text-sm text-charcoal leading-relaxed">{result.text}</p>
                  </div>
                  {result.answer ? (
                    <div className="bg-teal-pale/30 rounded-xl p-4">
                      <p className="text-xs font-medium text-teal mb-1">الرد:</p>
                      <p className="text-sm text-charcoal leading-relaxed">{result.answer}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-charcoal-light text-center py-4">لم يتم الرد بعد. يُرجى المراجعة لاحقاً.</p>
                  )}
                </div>
              ) : (
                <div className="bg-cream-warm rounded-2xl p-6 text-center">
                  <p className="text-sm text-charcoal-light">لم يتم العثور على استشارة بهذا الرقم أو البريد الإلكتروني.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
