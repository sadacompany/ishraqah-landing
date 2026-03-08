'use client';

import Link from 'next/link';
import { ConsultationCard } from '@/components/ConsultationCard';
import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api-client';

interface ArchiveConsultation {
  id: string;
  title: string;
  question: string;
  answer: string;
  category: string;
}

export default function ConsultationArchivePage() {
  const [consultations, setConsultations] = useState<ArchiveConsultation[]>([]);

  useEffect(() => {
    apiGet<ArchiveConsultation[]>('/api/consultations/archive')
      .then(setConsultations)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
        <span className="text-charcoal">الأرشيف</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
          أرشيف الاستشارات
        </h1>
        <p className="mt-3 text-charcoal-light max-w-xl leading-relaxed">
          استشارات منشورة سابقاً بعد حذف أي معلومات شخصية. نشاركها بهدف التوعية
          والاستفادة العامة.
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {consultations.map((c) => (
          <ConsultationCard key={c.id} consultation={c} />
        ))}
      </div>

      <div className="mt-10 bg-bronze-glow/30 rounded-2xl p-6 sm:p-8 text-center">
        <h3 className="text-lg font-bold text-charcoal mb-2">
          هل تحتاج استشارة شخصية؟
        </h3>
        <p className="text-sm text-charcoal-light mb-4">
          لا تتردد في إرسال استشارتك. جميع الاستشارات تُعامل بسرية تامة.
        </p>
        <Link
          href="/consultations/new"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors"
        >
          أرسل استشارتك
        </Link>
      </div>
    </div>
  );
}
