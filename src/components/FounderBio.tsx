import Link from 'next/link';
import { founder } from '@/data/founder';

interface FounderBioProps {
  variant?: 'homepage' | 'full';
}

export function FounderBio({ variant = 'homepage' }: FounderBioProps) {
  if (variant === 'full') {
    return (
      <div className="space-y-8">
        <div className="flex items-start gap-6">
          <div className="shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-bronze-glow to-bronze-light/30 flex items-center justify-center">
            <span className="text-3xl text-bronze font-bold">ر</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-charcoal">{founder.name}</h2>
            <p className="text-bronze mt-1">{founder.title}</p>
            <p className="text-sm text-charcoal-light mt-1">
              {founder.degree} - {founder.university}
            </p>
            <p className="text-sm text-charcoal-light">{founder.honor}</p>
          </div>
        </div>
        <p className="text-charcoal-light leading-relaxed">{founder.bio}</p>

        <div>
          <h3 className="text-lg font-bold text-charcoal mb-4">
            الخبرات المهنية
          </h3>
          <ul className="space-y-2">
            {founder.experience.map((exp, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-bronze mt-2" />
                <span className="text-charcoal-light leading-relaxed">
                  {exp}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-charcoal mb-4">
            الشهادات والتدريب
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {founder.certifications.map((cert, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-cream-warm rounded-xl p-3"
              >
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-teal mt-2" />
                <span className="text-sm text-charcoal-light leading-relaxed">
                  {cert}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-charcoal mb-4">
            الدورات التدريبية
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {founder.courses.map((course, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-teal-pale/30 rounded-xl p-3"
              >
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-bronze mt-2" />
                <span className="text-sm text-charcoal-light leading-relaxed">
                  {course}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-10 border border-cream-dark/30">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-bronze-glow to-bronze-light/30 flex items-center justify-center">
          <span className="text-2xl text-bronze font-bold">ر</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-charcoal">{founder.name}</h3>
          <p className="text-bronze text-sm mt-1">{founder.title}</p>
          <p className="text-sm text-charcoal-light mt-1">
            {founder.degree} - {founder.university} ({founder.honor})
          </p>
          <p className="mt-4 text-charcoal-light text-sm leading-relaxed">
            {founder.bio}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {founder.certifications.slice(0, 4).map((cert, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[11px] text-teal bg-teal-pale rounded-full"
              >
                {cert}
              </span>
            ))}
          </div>
          <Link
            href="/cv"
            className="inline-flex items-center gap-1 mt-4 text-sm text-bronze hover:text-bronze-light transition-colors font-medium"
          >
            عرض السيرة الذاتية الكاملة
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
