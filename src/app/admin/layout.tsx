'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminGuard } from '@/components/admin/AdminGuard';

const pageTitles: Record<string, string> = {
  '/admin': 'لوحة التحكم',
  '/admin/consultations': 'الاستشارات',
  '/admin/articles': 'المقالات',
  '/admin/quiz': 'نتائج الاختبار',
  '/admin/guestbook': 'بصمة الزوار',
  '/admin/quotes': 'خربشات قلم',
  '/admin/analytics': 'التحليلات',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const title = pageTitles[pathname]
    || (pathname.includes('/articles/new') ? 'مقال جديد' : null)
    || (pathname.includes('/articles/') && pathname.includes('/edit') ? 'تعديل المقال' : null)
    || 'لوحة التحكم';

  return (
    <AdminGuard>
      {isLoginPage ? (
        <main className="min-h-screen bg-cream">{children}</main>
      ) : (
        <div className="min-h-screen bg-cream flex">
          <AdminSidebar />
          <div className="flex-1 mr-64">
            <AdminTopbar title={title} />
            <main className="p-6">{children}</main>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}
