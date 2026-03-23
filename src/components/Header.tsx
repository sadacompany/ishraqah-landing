'use client';

import Link from 'next/link';
import { useState } from 'react';
import { siteConfig } from '@/data/site';
import { Logo } from '@/components/Logo';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Logo size={40} className="text-bronze" />
            <div>
              <span className="text-lg font-bold text-charcoal leading-tight block">
                إشراقة وعي
              </span>
              <span className="text-xs text-charcoal-light hidden sm:block">
                تعزيز الوعي النفسي والتربوي
              </span>
            </div>
          </Link>

          {/* Desktop Nav - CSS-only dropdowns */}
          <nav className="hidden lg:flex items-center gap-1">
            {siteConfig.nav.map((item) =>
              item.children ? (
                <div key={item.href} className="relative group/dropdown">
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm text-charcoal-light hover:text-bronze transition-colors rounded-lg hover:bg-bronze-glow/30"
                  >
                    {item.label}
                    <svg
                      className="inline-block w-3 h-3 mr-1"
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Link>
                  <div className="invisible opacity-0 group-hover/dropdown:visible group-hover/dropdown:opacity-100 transition-[opacity,visibility] duration-150 absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-cream-dark/50 py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-charcoal-light hover:text-bronze hover:bg-bronze-glow/20 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm text-charcoal-light hover:text-bronze transition-colors rounded-lg hover:bg-bronze-glow/30"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/consultations/new"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors"
            >
              استشارة جديدة
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-charcoal-light hover:text-charcoal rounded-lg"
              aria-label="القائمة"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-cream-dark/50">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {siteConfig.nav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm text-charcoal-light hover:text-bronze hover:bg-bronze-glow/20 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pr-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2.5 text-sm text-charcoal-light/70 hover:text-bronze hover:bg-bronze-glow/10 rounded-lg transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-3 border-t border-cream-dark/50">
              <Link
                href="/consultations/new"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-3 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors"
              >
                استشارة جديدة
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
