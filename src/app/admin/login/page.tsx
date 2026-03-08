'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AdminLoginPage() {
  const { setupDone, login, setup, loading } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!setupDone) {
        if (password.length < 6) {
          setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
          setSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('كلمتا المرور غير متطابقتين');
          setSubmitting(false);
          return;
        }
        await setup(password);
        router.replace('/admin');
      } else {
        const ok = await login(password);
        if (ok) {
          router.replace('/admin');
        } else {
          setError('كلمة المرور غير صحيحة');
        }
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
          <div className="w-16 h-16 mx-auto rounded-2xl bg-charcoal flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-bronze-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-charcoal">إشراقة نفسية</h1>
          <p className="text-sm text-charcoal-light mt-1">
            {setupDone ? 'تسجيل الدخول للوحة التحكم' : 'إعداد كلمة المرور لأول مرة'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-cream-dark/30 space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
              placeholder={setupDone ? 'أدخل كلمة المرور' : 'أنشئ كلمة مرور (6 أحرف على الأقل)'}
            />
          </div>

          {!setupDone && (
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 text-sm bg-cream-warm border border-cream-dark/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-bronze/30 focus:border-bronze transition-colors"
                placeholder="أعد إدخال كلمة المرور"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 text-sm font-medium text-white bg-charcoal hover:bg-charcoal-light rounded-xl transition-colors disabled:opacity-50"
          >
            {submitting ? '...' : setupDone ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </button>
        </form>
      </div>
    </div>
  );
}
