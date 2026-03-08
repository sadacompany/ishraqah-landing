import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Logo size={40} className="text-bronze-light" />
              <h3 className="text-lg font-bold text-white">إشراقة نفسية</h3>
            </div>
            <p className="text-sm text-cream-dark/80 leading-relaxed">
              نشر الوعي النفسي والتربوي من خلال الاستشارات والمؤلفات. نسعى
              لتقديم محتوى علمي موثوق يساعد الأفراد والأسر.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'السيرة الذاتية', href: '/cv' },
                { label: 'المقالات', href: '/articles' },
                { label: 'المؤلفات', href: '/books' },
                { label: 'بصمة الزوار', href: '/guestbook' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-dark/70 hover:text-bronze-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">خدماتنا</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'استشارة جديدة', href: '/consultations/new' },
                { label: 'أرشيف الاستشارات', href: '/consultations/archive' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-dark/70 hover:text-bronze-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              <a
                href="https://twitter.com/Ranyah_alwadyah"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-cream-dark/70 hover:text-bronze-light transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @Ranyah_alwadyah
              </a>
              <Link
                href="/guestbook"
                className="flex items-center gap-2 text-sm text-cream-dark/70 hover:text-bronze-light transition-colors"
              >
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
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                بصمة الزوار
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-cream-dark/10 mt-12 pt-8 text-center">
          <p className="text-xs text-cream-dark/50">
            جميع الحقوق محفوظة لموقع إشراقة نفسية &copy;{' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
