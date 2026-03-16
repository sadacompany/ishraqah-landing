export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'إشراقة وعي',
    alternateName: 'Ishraqah Waie',
    url: 'https://ishraqah.life',
    description: 'منصة متخصصة في تعزيز الوعي النفسي والتربوي',
    founder: {
      '@type': 'Person',
      name: 'رانية طه الودية',
      jobTitle: 'مستشارة نفسية وتربوية',
    },
    sameAs: ['https://twitter.com/Ranyah_alwadyah'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'إشراقة وعي',
    url: 'https://ishraqah.life',
    inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ishraqah.life/articles?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
  readTime,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished?: string;
  readTime: number;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `https://ishraqah.life/articles/${slug}`,
    inLanguage: 'ar',
    author: {
      '@type': 'Person',
      name: 'رانية طه الودية',
      jobTitle: 'مستشارة نفسية وتربوية',
    },
    publisher: {
      '@type': 'Organization',
      name: 'إشراقة وعي',
      url: 'https://ishraqah.life',
    },
    datePublished: datePublished || '2024-01-01',
    timeRequired: `PT${readTime}M`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQJsonLd({ questions }: { questions: { question: string; answer: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
