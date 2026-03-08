'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !authenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [authenticated, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated && pathname !== '/admin/login') {
    return null;
  }

  return <>{children}</>;
}
