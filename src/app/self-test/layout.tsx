import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'اختبار نوبات الهلع المجاني',
  description:
    'اختبر نفسك مجاناً - اختبار نوبات الهلع والقلق. تقييم ذاتي سريع لمعرفة مستوى أعراض الهلع لديك. 8 أسئلة علمية مع نتائج فورية',
  alternates: {
    canonical: 'https://ishraqah.life/self-test',
  },
  openGraph: {
    title: 'اختبار نوبات الهلع المجاني | إشراقة نفسية',
    description: 'اختبار ذاتي مجاني لتقييم أعراض نوبات الهلع والقلق. 8 أسئلة مع نتائج فورية',
    type: 'website',
  },
};

export default function SelfTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
