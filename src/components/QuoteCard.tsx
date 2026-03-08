interface QuoteCardProps {
  quote: { id: string; text: string };
}

export function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-cream-dark/30 hover:border-bronze-glow/50 transition-colors flex flex-col">
      <div className="text-bronze text-4xl font-bold leading-none mb-3 opacity-30">
        &ldquo;
      </div>
      <p className="text-charcoal leading-relaxed text-base flex-1">
        {quote.text}
      </p>
      <div className="mt-4 pt-4 border-t border-cream-dark/30">
        <p className="text-xs text-charcoal-light">خربشات قلم - رانية الودية</p>
      </div>
    </div>
  );
}
