'use client';

import React from 'react';

interface ArticlePreviewProps {
  content: string;
}

function renderInline(text: string) {
  // Process bold, italic, and links
  const parts: (string | React.ReactElement)[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Link: [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic: *text*
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

    const matches = [
      linkMatch ? { type: 'link', match: linkMatch, index: linkMatch.index! } : null,
      boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
      italicMatch ? { type: 'italic', match: italicMatch, index: italicMatch.index! } : null,
    ].filter(Boolean).sort((a, b) => a!.index - b!.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const first = matches[0]!;
    if (first.index > 0) {
      parts.push(remaining.substring(0, first.index));
    }

    if (first.type === 'bold') {
      parts.push(
        <strong key={key++} className="text-charcoal font-bold">
          {first.match![1]}
        </strong>
      );
    } else if (first.type === 'italic') {
      parts.push(
        <em key={key++} className="italic">
          {first.match![1]}
        </em>
      );
    } else if (first.type === 'link') {
      parts.push(
        <a
          key={key++}
          href={first.match![2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-bronze underline hover:text-bronze-light"
        >
          {first.match![1]}
        </a>
      );
    }

    remaining = remaining.substring(first.index + first.match![0].length);
  }

  return parts;
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
        const trimmed = p.trim();

        // Divider
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return <hr key={i} className="my-8 border-t border-cream-dark/40" />;
        }

        // Full-line heading (bold on its own)
        if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
          return (
            <h2 key={i} className="text-xl font-bold text-charcoal mt-8 mb-4">
              {trimmed.replace(/\*\*/g, '')}
            </h2>
          );
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          const quoteLines = trimmed.split('\n').map((l) => l.replace(/^>\s?/, ''));
          return (
            <blockquote
              key={i}
              className="border-r-4 border-bronze/40 pr-4 my-4 text-charcoal-light/80 italic"
            >
              {quoteLines.map((line, j) => (
                <p key={j}>{renderInline(line)}</p>
              ))}
            </blockquote>
          );
        }

        // Numbered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
          return (
            <ol key={i} className="list-none space-y-2 my-4 counter-reset-list">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-bronze-glow/30 text-bronze text-xs flex items-center justify-center mt-1.5 font-bold">
                    {j + 1}
                  </span>
                  <span>{renderInline(item.replace(/^\d+\.\s/, ''))}</span>
                </li>
              ))}
            </ol>
          );
        }

        // Bullet list
        if (trimmed.startsWith('- ')) {
          const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- '));
          return (
            <ul key={i} className="list-none space-y-2 my-4">
              {items.map((item, j) => (
                <li key={j} className="flex items-start gap-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-bronze mt-3" />
                  <span>{renderInline(item.replace(/^-\s/, ''))}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraph with inline formatting
        return <p key={i}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}
