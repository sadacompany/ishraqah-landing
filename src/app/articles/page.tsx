import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { articles, categoryLabels } from '@/data/articles';

export const metadata: Metadata = {
  title: 'المقالات',
  description:
    'مقالات متخصصة في علم النفس والتربية والعلاقات الزوجية وتطوير الذات',
};

export default function ArticlesPage() {
  const categories = Object.entries(categoryLabels);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">المقالات</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
          المقالات
        </h1>
        <p className="mt-3 text-charcoal-light max-w-xl">
          مقالات متخصصة في علم النفس والتربية والعلاقات، مكتوبة بأسلوب علمي
          مبسط وموثوق.
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      {/* Category Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1.5 text-xs font-medium text-white bg-bronze rounded-full">
          الكل ({articles.length})
        </span>
        {categories.map(([key, label]) => {
          const count = articles.filter((a) => a.category === key).length;
          return (
            <span
              key={key}
              className="px-3 py-1.5 text-xs font-medium text-charcoal-light bg-cream-warm hover:bg-cream-dark rounded-full transition-colors cursor-default"
            >
              {label} ({count})
            </span>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
