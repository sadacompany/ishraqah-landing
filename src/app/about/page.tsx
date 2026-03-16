import type { Metadata } from 'next';
import Link from 'next/link';
import { FounderBio } from '@/components/FounderBio';

export const metadata: Metadata = {
  title: 'من نحن',
  description:
    'إشراقة وعي - منصة متخصصة في تعزيز الوعي النفسي والتربوي من خلال الاستشارات والمؤلفات',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">من نحن</span>
      </nav>

      <div className="space-y-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
            من نحن
          </h1>
          <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-cream-dark/30">
          <h2 className="text-xl font-bold text-charcoal mb-4">
            رؤية الموقع
          </h2>
          <p className="text-charcoal-light leading-[2] text-base">
            إشراقة وعي منصة متخصصة تسعى لتعزيز الوعي النفسي والتربوي من خلال
            تقديم محتوى علمي موثوق ومتنوع يشمل المقالات المتخصصة والاستشارات
            النفسية والتربوية والمؤلفات والاختبارات التوعوية. نؤمن بأن الصحة
            النفسية ركيزة أساسية لحياة متوازنة ومثمرة، وأن التوعية هي الخطوة
            الأولى نحو حياة أفضل.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-cream-dark/30">
          <h2 className="text-xl font-bold text-charcoal mb-4">رسالتنا</h2>
          <p className="text-charcoal-light leading-[2] text-base">
            تقديم خدمات استشارية ومحتوى توعوي في المجالين النفسي والتربوي
            بأسلوب علمي مبسط وموثوق، يساعد الأفراد والأسر على فهم أنفسهم
            وأبنائهم وتحسين جودة حياتهم النفسية والاجتماعية.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-cream-dark/30">
          <h2 className="text-xl font-bold text-charcoal mb-6">
            ما نقدمه
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'الاستشارات النفسية والتربوية',
                desc: 'خدمة استشارية متخصصة بسرية تامة',
              },
              {
                title: 'المقالات العلمية',
                desc: 'مقالات متخصصة في علم النفس والتربية',
              },
              {
                title: 'الاختبارات التوعوية',
                desc: 'اختبارات ذاتية لتقييم الحالة النفسية',
              },
              {
                title: 'المؤلفات',
                desc: 'كتب متخصصة في المجال النفسي والتربوي',
              },
              {
                title: 'الفيديوهات التوعوية',
                desc: 'محتوى مرئي تثقيفي في موضوعات متنوعة',
              },
              {
                title: 'الدورات التدريبية',
                desc: 'برامج تدريبية في مجالات التربية وتطوير الذات',
              },
            ].map((service, i) => (
              <div key={i} className="bg-cream-warm rounded-xl p-4">
                <h3 className="font-bold text-charcoal text-sm mb-1">
                  {service.title}
                </h3>
                <p className="text-xs text-charcoal-light">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <FounderBio variant="homepage" />
      </div>
    </div>
  );
}
