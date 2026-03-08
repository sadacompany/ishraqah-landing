'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { generateId } from '@/lib/store';
import { apiGet, apiPost } from '@/lib/api-client';
import type { GuestbookEntry } from '@/lib/types';

export default function GuestbookPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiGet<GuestbookEntry[]>('/api/guestbook')
      .then(setEntries)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiPost('/api/guestbook', { id: generateId(), name, message });
      setSubmitted(true);
      setName('');
      setMessage('');
    } catch {
      alert('حدث خطأ. حاول مرة أخرى.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">بصمة الزوار</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
          بصمة الزوار
        </h1>
        <p className="mt-3 text-charcoal-light leading-relaxed">
          شاركنا رأيك وانطباعك. نقدر كل ملاحظاتكم وتعليقاتكم.
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      {/* Existing Messages */}
      <div className="space-y-4 mb-10">
        {entries.map((msg) => (
          <div
            key={msg.id}
            className="bg-white rounded-2xl p-6 border border-cream-dark/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-bronze-glow/30 flex items-center justify-center">
                <span className="text-bronze text-xs font-bold">
                  {msg.name[0]}
                </span>
              </div>
              <span className="text-sm font-medium text-charcoal">
                {msg.name}
              </span>
            </div>
            <p className="text-sm text-charcoal-light leading-relaxed">
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      {/* Leave a Message */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-dark/30">
        <h2 className="text-lg font-bold text-charcoal mb-4">
          اترك بصمتك
        </h2>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-teal-pale flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-teal"
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
            <p className="text-sm text-charcoal-light">
              شكراً لمشاركتك! تم استلام رسالتك وستظهر بعد المراجعة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                الاسم
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمك أو اسم مستعار"
                className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                رسالتك
              </label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="شاركنا رأيك أو انطباعك..."
                className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors disabled:opacity-50"
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
