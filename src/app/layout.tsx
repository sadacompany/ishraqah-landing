import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { LayoutShell } from '@/components/LayoutShell';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'إشراقة نفسية | نشر الوعي النفسي والتربوي',
    template: '%s | إشراقة نفسية',
  },
  description:
    'إشراقة نفسية - منصة متخصصة في نشر الوعي النفسي والتربوي، تقدم استشارات نفسية ومقالات تربوية ومحتوى توعوي بإشراف الأستاذة رانية طه الودية',
  keywords: [
    'إشراقة نفسية',
    'استشارات نفسية',
    'تربية',
    'علم النفس',
    'رانية طه الودية',
    'وعي نفسي',
    'تطوير ذات',
    'إرشاد أسري',
  ],
  openGraph: {
    title: 'إشراقة نفسية',
    description: 'نشر الوعي النفسي والتربوي من خلال الاستشارات والمؤلفات',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'إشراقة نفسية',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@Ranyah_alwadyah',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className={`${tajawal.className} min-h-screen flex flex-col`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
