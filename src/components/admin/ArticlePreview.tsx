'use client';

interface ArticlePreviewProps {
  content: string;
}

export function ArticlePreview({ content }: ArticlePreviewProps) {
  if (!content.trim()) {
    return (
      <div className="flex items-center justify-center h-full text-charcoal-light/50 text-sm">
        لا يوجد محتوى للمعاينة
      </div>
    );
  }

  const paragraphs = content.split('\n\n');

  return (
    <div className="article-content text-charcoal-light text-base leading-[2]">
      {paragraphs.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <h2 key={i} className="text-xl font-bold text-charcoal mt-8 mb-4">
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
  );
}
