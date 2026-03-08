interface ConsultationCardProps {
  consultation: { id: string; title: string; question: string; answer: string; category: string };
}

export function ConsultationCard({ consultation }: ConsultationCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-cream-dark/30 hover:border-teal-pale hover:shadow-sm transition-[border-color,box-shadow] duration-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-teal-pale flex items-center justify-center">
          <svg
            className="w-5 h-5 text-teal"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-charcoal text-sm">
            {consultation.title}
          </h3>
          <span className="text-[11px] text-charcoal-light">
            {consultation.category}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-cream-warm rounded-xl p-4">
          <p className="text-sm text-charcoal-light leading-relaxed line-clamp-3">
            {consultation.question}
          </p>
        </div>
        <div className="bg-teal-pale/30 rounded-xl p-4">
          <p className="text-sm text-charcoal leading-relaxed line-clamp-3">
            {consultation.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
