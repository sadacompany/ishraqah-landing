import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'المؤلفات',
  description: 'كتاب إشراقة - مستشارك الشخصي الذي يضفي إشراقة على حياتك',
};

export default function BooksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">المؤلفات</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
          المؤلفات
        </h1>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-cream-dark/30">
        <div className="flex flex-col lg:flex-row">
          {/* Book Cover */}
          <div className="lg:w-80 shrink-0 bg-gradient-to-br from-charcoal to-charcoal-light p-10 flex items-center justify-center">
            <Image
              src="/book-cover.jpg"
              alt="كتاب إشراقة - رانية طه الودية"
              width={240}
              height={340}
              className="rounded-xl shadow-2xl"
              priority
            />
          </div>

          {/* Book Details */}
          <div className="flex-1 p-8 sm:p-10">
            <span className="inline-block px-2.5 py-1 text-[11px] font-medium text-bronze bg-bronze-glow/40 rounded-full mb-4">
              الإصدار الأول
            </span>
            <h2 className="text-2xl font-bold text-charcoal mb-4">
              كتاب إشراقة
            </h2>
            <p className="text-charcoal-light leading-[2] mb-4">
              هو الكتاب الأول من نوعه الذي يجمع بين المعلومة النفسية الصحيحة
              بطريقة مركزة وواضحة، والمنهج التربوي السليم لحل ما يواجه الوالدين
              من مشكلات تربوية.
            </p>
            <p className="text-charcoal-light leading-[2] mb-4">
              وكذلك ينير درب الزوجين لأهم العقبات التي كثيراً ما تكون سبباً في
              تشويه سعادتهما وأفضل السبل لحلها.
            </p>
            <p className="text-bronze font-medium text-sm mb-6">
              مستشارك الشخصي الذي يضفي إشراقة على حياتك
            </p>

            <div className="border-t border-cream-dark/30 pt-6">
              <h3 className="text-sm font-bold text-charcoal mb-3">
                ما يتضمنه الكتاب:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'معلومات نفسية مبسطة وموثقة',
                  'أساليب تربوية علمية حديثة',
                  'حلول للمشكلات الزوجية الشائعة',
                  'نصائح لتحسين الصحة النفسية',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-bronze mt-2" />
                    <span className="text-sm text-charcoal-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-bronze-glow/30 flex items-center justify-center">
                  <span className="text-bronze text-xs font-bold">ر</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal">
                    رانية طه الودية
                  </p>
                  <p className="text-[10px] text-charcoal-light">
                    مستشارة نفسية وتربوية
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
