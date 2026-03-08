import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const result = await pool.query(
    `SELECT id, slug, title, excerpt, content, category, category_label as "categoryLabel",
            featured, hidden, read_time as "readTime"
     FROM articles WHERE slug = $1`,
    [slug]
  );
  return result.rows[0] || null;
}

async function getRelatedArticles(category: string, excludeId: string) {
  const result = await pool.query(
    `SELECT id, slug, title, excerpt, category, category_label as "categoryLabel",
            featured, read_time as "readTime"
     FROM articles WHERE category = $1 AND id != $2 AND hidden = false LIMIT 3`,
    [category, excludeId]
  );
  return result.rows;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article || article.hidden) notFound();

  const relatedArticles = await getRelatedArticles(article.category, article.id);

  const paragraphs = article.content.split('\n\n');

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        slug={article.slug}
        readTime={article.readTime}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'الرئيسية', url: 'https://ishraqah.life' },
          { name: 'المقالات', url: 'https://ishraqah.life/articles' },
          { name: article.title, url: `https://ishraqah.life/articles/${article.slug}` },
        ]}
      />
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <Link href="/articles" className="hover:text-bronze transition-colors">
          المقالات
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{article.title}</span>
      </nav>

      <header className="mb-10">
        <span className="inline-block px-2.5 py-1 text-[11px] font-medium text-teal bg-teal-pale rounded-full mb-4">
          {article.categoryLabel}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal leading-[1.4]">
          {article.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-charcoal-light">
          <span>{article.readTime} دقائق قراءة</span>
          <span className="w-1 h-1 rounded-full bg-cream-dark" />
          <span>رانية طه الودية</span>
        </div>
        <div className="mt-6 h-px bg-cream-dark/50" />
      </header>

      <div className="article-content text-charcoal-light text-base sm:text-lg leading-[2]">
        {paragraphs.map((p: string, i: number) => {
          if (p.startsWith('**') && p.endsWith('**')) {
            return (
              <h2
                key={i}
                className="text-xl font-bold text-charcoal mt-8 mb-4"
              >
                {p.replace(/\*\*/g, '')}
              </h2>
            );
          }
          if (p.includes('**')) {
            const parts = p.split(/\*\*(.*?)\*\*/g);
            return (
              <p key={i}>
                {parts.map((part, j) =>
                  j % 2 === 1 ? (
                    <strong key={j} className="text-charcoal font-bold">
                      {part}
                    </strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </p>
            );
          }
          if (p.startsWith('- ')) {
            const items = p.split('\n').filter((l) => l.startsWith('- '));
            return (
              <ul key={i} className="list-none space-y-2 my-4">
                {items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-bronze mt-3" />
                    <span>{item.replace(/^- /, '')}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return <p key={i}>{p}</p>;
        })}
      </div>

      {/* Author */}
      <div className="mt-12 pt-8 border-t border-cream-dark/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bronze-glow to-bronze-light/30 flex items-center justify-center">
            <span className="text-bronze font-bold">ر</span>
          </div>
          <div>
            <p className="font-bold text-charcoal text-sm">
              رانية طه الودية
            </p>
            <p className="text-xs text-charcoal-light">
              مستشارة نفسية وتربوية
            </p>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-charcoal mb-6">
            مقالات ذات صلة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
