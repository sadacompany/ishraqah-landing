import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { LayoutShell } from '@/components/LayoutShell';
import { OrganizationJsonLd, WebsiteJsonLd } from '@/components/JsonLd';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ishraqah.life'),
  title: {
    default: 'إشراقة نفسية | استشارات نفسية وتربوية ومقالات في الوعي النفسي',
    template: '%s | إشراقة نفسية',
  },
  description:
    'منصة إشراقة نفسية للاستشارات النفسية والتربوية. مقالات متخصصة في علم النفس، اختبارات نفسية مجانية، إرشاد أسري وتربوي بإشراف الأستاذة رانية طه الودية - مستشارة نفسية وتربوية',
  keywords: [
    'إشراقة نفسية',
    'استشارات نفسية',
    'مستشارة نفسية',
    'علم النفس',
    'تربية الأطفال',
    'إرشاد أسري',
    'الصحة النفسية',
    'اختبار نوبات الهلع',
    'القلق والتوتر',
    'تطوير الذات',
    'رانية طه الودية',
    'وعي نفسي',
    'علاج القلق',
    'مشاكل زوجية',
    'تربية المراهقين',
  ],
  alternates: {
    canonical: 'https://ishraqah.life',
  },
  openGraph: {
    title: 'إشراقة نفسية - استشارات نفسية وتربوية',
    description: 'منصة متخصصة في نشر الوعي النفسي والتربوي. استشارات نفسية، مقالات متخصصة، واختبارات نفسية مجانية',
    type: 'website',
    locale: 'ar_SA',
    url: 'https://ishraqah.life',
    siteName: 'إشراقة نفسية',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Ranyah_alwadyah',
    creator: '@Ranyah_alwadyah',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className={`${tajawal.className} min-h-screen flex flex-col`}>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <LayoutShell>{children}</LayoutShell>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var start = Date.now();
                window.addEventListener('beforeunload', function() {
                  var duration = Math.round((Date.now() - start) / 1000);
                  if (duration > 0 && navigator.sendBeacon) {
                    navigator.sendBeacon('/api/analytics/track', JSON.stringify({
                      path: location.pathname,
                      durationSeconds: duration,
                      sessionId: '',
                    }));
                  }
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
