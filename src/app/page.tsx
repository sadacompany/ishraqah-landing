import Image from 'next/image';
import Link from 'next/link';
import { SectionHeading } from '@/components/SectionHeading';
import { ArticleCard } from '@/components/ArticleCard';
import { FounderBio } from '@/components/FounderBio';
import { QuoteCard } from '@/components/QuoteCard';
import { quizzes } from '@/data/quiz';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [articlesResult, featuredResult, quotesResult] = await Promise.all([
    pool.query(`SELECT id, slug, title, excerpt, category, category_label as "categoryLabel", featured, image_url as "imageUrl", read_time as "readTime" FROM articles WHERE hidden = false ORDER BY created_at DESC LIMIT 7`),
    pool.query(`SELECT id, slug, title, excerpt, category, category_label as "categoryLabel", featured, image_url as "imageUrl", read_time as "readTime" FROM articles WHERE featured = true AND hidden = false ORDER BY created_at DESC LIMIT 3`),
    pool.query(`SELECT id, text FROM quotes WHERE hidden = false ORDER BY created_at DESC LIMIT 6`),
  ]);

  const articles = articlesResult.rows;
  const featuredArticles = featuredResult.rows;
  const quotes = quotesResult.rows;

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
                إشراقة وعي
              </span>
            </div>
            <h1 className="animate-fade-in-up-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.4] sm:leading-[1.35]">
              <span className="text-bronze">إشراقة وعي</span>
              <br />
              لتعزيز الوعي النفسي والتربوي
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
      <section className="bg-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '+15', label: 'سنة خبرة', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { value: '+350', label: 'مقال متخصص', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { value: '+200', label: 'استشارة', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
              { value: '+5000', label: 'مستفيد', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1">
                  <svg className="w-5 h-5 text-bronze-light" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">
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
            subtitle="رحلة متخصصة في تعزيز الوعي النفسي والتربوي"
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
                aria-hidden="true"
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
                aria-hidden="true"
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

      {/* خربشات قلم */}
      {quotes.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="خربشات قلم"
              subtitle="كلمات من القلب لإشراقة في حياتك"
              centered
            />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotes.map((q) => (
                <QuoteCard key={q.id} quote={q} />
              ))}
            </div>
          </div>
        </section>
      )}

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
          <SectionHeading
            title="اختبر نفسك"
            subtitle="اختبارات توعوية مجانية لتقييم صحتك النفسية"
          />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.map((quiz) => {
              const colorStyles: Record<string, { bg: string; iconText: string; border: string; btnBg: string; btnHover: string }> = {
                amber: { bg: 'bg-amber-50', iconText: 'text-amber-600', border: 'border-amber-200', btnBg: 'bg-amber-600', btnHover: 'hover:bg-amber-700' },
                teal: { bg: 'bg-teal-pale/40', iconText: 'text-teal', border: 'border-teal-pale', btnBg: 'bg-teal', btnHover: 'hover:bg-teal-light' },
                indigo: { bg: 'bg-indigo-50', iconText: 'text-indigo-500', border: 'border-indigo-200', btnBg: 'bg-indigo-500', btnHover: 'hover:bg-indigo-600' },
              };
              const cs = colorStyles[quiz.color] || colorStyles.teal;
              return (
                <div
                  key={quiz.slug}
                  className={`bg-white rounded-2xl border ${cs.border} p-6 transition-shadow hover:shadow-lg flex flex-col`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 shrink-0 rounded-xl ${cs.bg} flex items-center justify-center`}>
                      <svg
                        className={`w-6 h-6 ${cs.iconText}`}
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={quiz.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-charcoal">{quiz.title}</h3>
                  </div>
                  <p className="text-sm text-charcoal-light leading-relaxed mb-4 flex-1 line-clamp-2">
                    {quiz.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-charcoal-light mb-4">
                    <span>{quiz.questions.length} أسئلة</span>
                    <span>{Math.ceil(quiz.questions.length * 0.5)} دقائق</span>
                  </div>
                  <Link
                    href={`/self-test/${quiz.slug}`}
                    className={`block text-center w-full px-5 py-3 text-sm font-medium text-white ${cs.btnBg} ${cs.btnHover} rounded-xl transition-colors`}
                  >
                    ابدأ الاختبار
                  </Link>
                </div>
              );
            })}
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
