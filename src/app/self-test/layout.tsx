import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'اختبر نفسك - اختبارات نفسية مجانية',
  description:
    'اختبارات نفسية توعوية مجانية لتقييم مستوى القلق والاكتئاب ونوبات الهلع',
  alternates: {
    canonical: 'https://ishraqah.life/self-test',
  },
  openGraph: {
    title: 'اختبر نفسك - اختبارات نفسية مجانية | إشراقة وعي',
    description: 'اختبارات نفسية توعوية مجانية لتقييم مستوى القلق والاكتئاب ونوبات الهلع. نتائج فورية مع توصيات مخصصة',
    type: 'website',
  },
};

export default function SelfTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
