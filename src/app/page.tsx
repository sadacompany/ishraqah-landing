import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/SectionHeading';
import { ArticleCard } from '@/components/ArticleCard';
import { FounderBio } from '@/components/FounderBio';
import { ConsultationCard } from '@/components/ConsultationCard';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [articlesResult, featuredResult, consultationsResult] = await Promise.all([
    pool.query(`SELECT id, slug, title, excerpt, category, category_label as "categoryLabel", featured, image_url as "imageUrl", read_time as "readTime" FROM articles WHERE hidden = false ORDER BY created_at DESC LIMIT 7`),
    pool.query(`SELECT id, slug, title, excerpt, category, category_label as "categoryLabel", featured, image_url as "imageUrl", read_time as "readTime" FROM articles WHERE featured = true AND hidden = false ORDER BY created_at DESC LIMIT 3`),
    pool.query(`SELECT id, type as category, text as question, answer FROM consultations WHERE status = 'archived' AND answer != '' ORDER BY created_at DESC LIMIT 3`),
  ]);

  const articles = articlesResult.rows;
  const featuredArticles = featuredResult.rows;
  const consultations = consultationsResult.rows.map((c: { id: string; category: string; question: string; answer: string }) => ({
    id: c.id,
    title: c.category || 'استشارة',
    question: c.question,
    answer: c.answer,
    category: c.category || 'عامة',
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-warm to-cream">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-bronze-glow" />
          <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-teal-pale" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="animate-fade-in-up">
              <span className="inline-block px-3 py-1.5 text-xs font-medium text-bronze bg-bronze-glow/40 rounded-full mb-6">
                إشراقة نفسية
              </span>
            </div>
            <h1 className="animate-fade-in-up-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.4] sm:leading-[1.35]">
              <span className="text-bronze">إشراقة</span> لنشر الوعي النفسي والتربوي
            </h1>
            <p className="animate-fade-in-up-delay-2 mt-6 text-lg text-charcoal-light leading-relaxed max-w-xl">
              منصة متخصصة تساعدك على فهم ذاتك وتحسين حياتك النفسية والتربوية
              بمحتوى علمي موثوق وأساليب عملية.
            </p>
            <div className="animate-fade-in-up-delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/consultations/new"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors shadow-sm"
              >
                طلب استشارة
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-charcoal bg-white hover:bg-cream-warm rounded-xl transition-colors border border-cream-dark/50"
              >
                تصفح المقالات
              </Link>
              <Link
                href="/self-test"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-teal bg-teal-pale hover:bg-teal-pale/70 rounded-xl transition-colors"
              >
                اختبر نفسك
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="border-b border-cream-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '+20', label: 'سنة خبرة' },
              { value: '+350', label: 'مقال متخصص' },
              { value: '+200', label: 'استشارة' },
              { value: '+5000', label: 'مستفيد' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-bronze">
                  {stat.value}
                </div>
                <div className="text-xs text-charcoal-light mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="عن المستشارة"
            subtitle="رحلة متخصصة في نشر الوعي النفسي والتربوي"
          />
          <div className="mt-8">
            <FounderBio variant="homepage" />
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 sm:py-20 bg-cream-warm/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <SectionHeading
              title="مقالات مختارة"
              subtitle="مقالات في علم النفس والتربية والعلاقات"
            />
            <Link
              href="/articles"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-bronze hover:text-bronze-light transition-colors font-medium"
            >
              جميع المقالات
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.slice(0, 3).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="featured"
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {articles.slice(3, 7).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="compact"
              />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 text-sm text-bronze hover:text-bronze-light transition-colors font-medium"
            >
              جميع المقالات
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Consultation Pathways */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="الاستشارات"
            subtitle="نقدم لك خدمة الاستشارة النفسية والتربوية بسرية تامة"
            centered
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'استشارة جديدة',
                desc: 'أرسل استشارتك النفسية أو التربوية واحصل على رد متخصص.',
                href: '/consultations/new',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                ),
                color: 'bronze',
              },
              {
                title: 'متابعة استشارة',
                desc: 'تابع استشارتك السابقة واطلع على الرد.',
                href: '/consultations/follow-up',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                ),
                color: 'teal',
              },
              {
                title: 'أرشيف الاستشارات',
                desc: 'استعرض الاستشارات المنشورة للاستفادة منها.',
                href: '/consultations/archive',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                ),
                color: 'charcoal',
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-2xl p-6 border border-cream-dark/30 hover:border-bronze-glow hover:shadow-md transition-[border-color,box-shadow,color] duration-200 text-center"
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                    item.color === 'bronze'
                      ? 'bg-bronze-glow/30'
                      : item.color === 'teal'
                        ? 'bg-teal-pale'
                        : 'bg-cream-warm'
                  }`}
                >
                  <svg
                    className={`w-6 h-6 ${
                      item.color === 'bronze'
                        ? 'text-bronze'
                        : item.color === 'teal'
                          ? 'text-teal'
                          : 'text-charcoal-light'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-base font-bold text-charcoal group-hover:text-bronze transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-charcoal-light leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Book Highlight */}
      <section className="py-16 sm:py-20 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="shrink-0">
              <Image
                src="/book-cover.jpg"
                alt="كتاب إشراقة - رانية طه الودية"
                width={224}
                height={288}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="flex-1 text-center lg:text-right">
              <span className="inline-block px-3 py-1 text-xs font-medium text-bronze-light bg-bronze-light/10 rounded-full mb-4">
                المؤلفات
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold leading-relaxed">
                كتاب إشراقة
              </h2>
              <p className="mt-4 text-cream-dark/80 leading-relaxed max-w-xl">
                هو الكتاب الأول من نوعه الذي يجمع بين المعلومة النفسية الصحيحة
                بطريقة مركزة وواضحة، والمنهج التربوي السليم لحل ما يواجه
                الوالدين من مشكلات تربوية. وكذلك ينير درب الزوجين لأهم العقبات
                التي كثيراً ما تكون سبباً في تشويه سعادتهما وأفضل السبل لحلها.
              </p>
              <p className="mt-3 text-bronze-light text-sm">
                مستشارك الشخصي الذي يضفي إشراقة على حياتك
              </p>
              <Link
                href="/books"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm font-medium text-charcoal bg-white hover:bg-cream-warm rounded-xl transition-colors"
              >
                تعرف على الكتاب
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Test Teaser */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-pale/50 to-cream-warm rounded-2xl p-8 sm:p-12 border border-teal-pale">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0 w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                <svg
                  className="w-10 h-10 text-teal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="flex-1 text-center sm:text-right">
                <h3 className="text-xl font-bold text-charcoal">
                  اختبر نفسك: اختبار نوبات الهلع
                </h3>
                <p className="mt-2 text-charcoal-light text-sm leading-relaxed">
                  اختبار توعوي يساعدك على تقييم مدى تعرضك لأعراض نوبات الهلع.
                  نتائج فورية مع توصيات مخصصة.
                </p>
              </div>
              <Link
                href="/self-test"
                className="shrink-0 inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-teal hover:bg-teal-light rounded-xl transition-colors"
              >
                ابدأ الاختبار
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Consultations */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <SectionHeading
              title="من أرشيف الاستشارات"
              subtitle="استشارات منشورة للتوعية والاستفادة"
            />
            <Link
              href="/consultations/archive"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-bronze hover:text-bronze-light transition-colors font-medium"
            >
              عرض الأرشيف
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultations.map((c) => (
              <ConsultationCard key={c.id} consultation={c} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-bronze-glow/30 to-cream-warm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal leading-relaxed">
            هل تحتاج إلى استشارة نفسية أو تربوية؟
          </h2>
          <p className="mt-4 text-charcoal-light leading-relaxed">
            لا تتردد في طلب المساعدة. الاستشارة هي البذرة التي إن استثمرتها
            أنبتت شجرة تُظلك.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/consultations/new"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors shadow-sm"
            >
              أرسل استشارتك الآن
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-charcoal bg-white hover:bg-cream-warm rounded-xl transition-colors border border-cream-dark/50"
            >
              تعرف علينا
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
