'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getAll } from '@/lib/store';
import type { ConsultationRequest } from '@/lib/types';

export default function FollowUpPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ConsultationRequest | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const consultations = getAll<ConsultationRequest>('consultations');
    const found = consultations.find(
      (c) => c.id === query.trim() || (c.email && c.email === query.trim())
    );
    setResult(found || null);
    setSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/consultations"
          className="hover:text-bronze transition-colors"
        >
          الاستشارات
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">متابعة استشارة</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">متابعة استشارة</h1>
        <p className="mt-3 text-charcoal-light text-sm leading-relaxed">
          أدخل رقم استشارتك أو بريدك الإلكتروني لمتابعة حالة استشارتك والاطلاع
          على الرد.
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

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

      <div className="mt-6 bg-cream-warm rounded-2xl p-6 text-center">
        <p className="text-sm text-charcoal-light">
          لم تُرسل استشارة بعد؟{' '}
          <Link
            href="/consultations/new"
            className="text-bronze hover:text-bronze-light font-medium"
          >
            أرسل استشارتك الآن
          </Link>
        </p>
      </div>
    </div>
  );
}
