'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export function AdminTopbar({ title }: { title: string }) {
  const { logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-cream-dark/30 flex items-center justify-between px-6">
      <h2 className="text-lg font-bold text-charcoal">{title}</h2>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-charcoal-light hover:text-red-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        تسجيل الخروج
      </button>
    </header>
  );
}
