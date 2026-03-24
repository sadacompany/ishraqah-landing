import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'الاستشارات',
  description:
    'خدمة الاستشارات النفسية والتربوية - أرسل استشارتك أو تابعها بسرية تامة',
};

export default function ConsultationsPage() {
  const services = [
    {
      title: 'استشارة جديدة',
      desc: 'أرسل استشارتك النفسية أو التربوية بسرية تامة واحصل على رد متخصص من المستشارة.',
      href: '/consultations/new',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4v16m8-8H4"
        />
      ),
      color: 'bronze' as const,
    },
    {
      title: 'متابعة استشارة',
      desc: 'إذا سبق وأرسلت استشارة، يمكنك متابعتها والاطلاع على الرد من خلال رقم الاستشارة.',
      href: '/consultations/follow-up',
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      ),
      color: 'teal' as const,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">الاستشارات</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
          الاستشارات
        </h1>
        <p className="mt-3 text-charcoal-light max-w-xl leading-relaxed">
          خدمة الاستشارات النفسية والتربوية تُقدم بسرية تامة واحترافية عالية.
          الاستشارة هي البذرة التي إن استثمرتها أنبتت شجرة تُظلك.
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {services.map((service) => (
          <Link
            key={service.href}
            href={service.href}
            className="group flex items-start gap-6 bg-white rounded-2xl p-6 sm:p-8 border border-cream-dark/30 hover:border-bronze-glow hover:shadow-md transition-[border-color,box-shadow] duration-200"
          >
            <div
              className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${
                service.color === 'bronze'
                  ? 'bg-bronze-glow/30'
                  : service.color === 'teal'
                    ? 'bg-teal-pale'
                    : 'bg-cream-warm'
              }`}
            >
              <svg
                className={`w-6 h-6 ${
                  service.color === 'bronze'
                    ? 'text-bronze'
                    : service.color === 'teal'
                      ? 'text-teal'
                      : 'text-charcoal-light'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {service.icon}
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-charcoal group-hover:text-bronze transition-colors">
                {service.title}
              </h2>
              <p className="mt-2 text-sm text-charcoal-light leading-relaxed">
                {service.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
