export function StatsCard({
  title,
  value,
  icon,
  color = 'bronze',
}: {
  title: string;
  value: number;
  icon: string;
  color?: 'bronze' | 'teal' | 'rose';
}) {
  const colors = {
    bronze: 'bg-bronze-glow/30 text-bronze',
    teal: 'bg-teal-pale text-teal',
    rose: 'bg-red-50 text-rose-soft',
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-cream-dark/30">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-charcoal">{value}</p>
          <p className="text-xs text-charcoal-light">{title}</p>
        </div>
      </div>
    </div>
  );
}
