interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-charcoal-light text-sm sm:text-base max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-0.5 w-12 bg-bronze rounded-full ${centered ? 'mx-auto' : ''}`}
      />
    </div>
  );
}
