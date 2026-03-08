'use client';

import Link from 'next/link';
import { useState } from 'react';
import { generateId } from '@/lib/store';
import { apiPost } from '@/lib/api-client';

export default function NewConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [consultationId, setConsultationId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-cream-dark/30 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-teal-pale flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-teal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-charcoal mb-3">
            تم إرسال استشارتك بنجاح
          </h2>
          <p className="text-charcoal-light text-sm leading-relaxed">
            شكراً لثقتك. سيتم الرد على استشارتك في أقرب وقت ممكن. يمكنك متابعة
            حالة استشارتك من خلال صفحة متابعة الاستشارات.
          </p>
          <p className="mt-3 text-sm font-medium text-bronze">رقم استشارتك: {consultationId}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/consultations/follow-up"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-bronze rounded-xl"
            >
              متابعة الاستشارة
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-charcoal bg-cream-warm rounded-xl"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <span className="text-charcoal">استشارة جديدة</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">استشارة جديدة</h1>
        <p className="mt-3 text-charcoal-light text-sm leading-relaxed">
          أرسل استشارتك النفسية أو التربوية بسرية تامة. جميع البيانات محمية ولن
          يتم نشرها.
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-dark/30">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              الاسم (اختياري)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="يمكنك استخدام اسم مستعار"
              className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              البريد الإلكتروني (اختياري)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="للتواصل معك بخصوص الاستشارة"
              className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              نوع الاستشارة
            </label>
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
              <strong className="text-charcoal">ملاحظة:</strong> جميع
              الاستشارات تُعامل بسرية تامة. في حال نشر الاستشارة في الأرشيف
              فإنه يتم حذف أي معلومات شخصية للحفاظ على الخصوصية.
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
    </div>
  );
}
