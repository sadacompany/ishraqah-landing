'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Logo } from '@/components/Logo';

export default function AdminLoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const ok = await login(email, password);
      if (ok) {
        window.location.href = '/admin';
        return;
      } else {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size={64} className="mx-auto text-charcoal mb-4" />
          <h1 className="text-2xl font-bold text-charcoal">إشراقة</h1>
          <p className="text-sm text-charcoal-light mt-1">تسجيل الدخول للوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-cream-dark/30 space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
              placeholder="أدخل كلمة المرور"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 text-sm font-medium text-white bg-charcoal hover:bg-charcoal-light rounded-xl transition-colors disabled:opacity-50"
          >
            {submitting ? '...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
