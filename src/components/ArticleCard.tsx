import Link from 'next/link';
import type { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'featured') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-cream-dark/30 hover:border-bronze-glow hover:shadow-lg transition-[border-color,box-shadow] duration-200"
      >
        <div className="h-48 bg-gradient-to-br from-bronze-glow/40 to-teal-pale/40 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-bronze"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
        <div className="p-6">
          <span className="inline-block px-2.5 py-1 text-[11px] font-medium text-teal bg-teal-pale rounded-full mb-3">
            {article.categoryLabel}
          </span>
          <h3 className="text-lg font-bold text-charcoal group-hover:text-bronze transition-colors leading-relaxed mb-2">
            {article.title}
          </h3>
          <p className="text-sm text-charcoal-light leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-charcoal-light">
              {article.readTime} دقائق قراءة
            </span>
            <span className="text-xs text-bronze font-medium group-hover:translate-x-[-4px] transition-transform">
              اقرأ المزيد ←
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex gap-4 p-4 bg-white rounded-xl border border-cream-dark/30 hover:border-bronze-glow hover:shadow-sm transition-[border-color,box-shadow] duration-200"
      >
        <div className="shrink-0 w-12 h-12 rounded-xl bg-bronze-glow/30 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-bronze"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-charcoal group-hover:text-bronze transition-colors leading-relaxed">
            {article.title}
          </h3>
          <span className="text-xs text-charcoal-light">
            {article.categoryLabel}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block bg-white rounded-2xl p-6 border border-cream-dark/30 hover:border-bronze-glow hover:shadow-md transition-[border-color,box-shadow] duration-200"
    >
      <span className="inline-block px-2.5 py-1 text-[11px] font-medium text-teal bg-teal-pale rounded-full mb-3">
        {article.categoryLabel}
      </span>
      <h3 className="text-lg font-bold text-charcoal group-hover:text-bronze transition-colors leading-relaxed mb-2">
        {article.title}
      </h3>
      <p className="text-sm text-charcoal-light leading-relaxed line-clamp-3">
        {article.excerpt}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-charcoal-light">
          {article.readTime} دقائق قراءة
        </span>
        <span className="text-xs text-bronze font-medium group-hover:translate-x-[-4px] transition-transform">
          اقرأ المزيد ←
        </span>
      </div>
    </Link>
  );
}
