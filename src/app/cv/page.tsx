import type { Metadata } from 'next';
import Link from 'next/link';
import { FounderBio } from '@/components/FounderBio';

export const metadata: Metadata = {
  title: 'السيرة الذاتية',
  description:
    'السيرة الذاتية للأستاذة رانية طه الودية - مستشارة نفسية وتربوية',
};

export default function CVPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">السيرة الذاتية</span>
      </nav>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
            السيرة الذاتية
          </h1>
          <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
        </div>

        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-cream-dark/30">
          <FounderBio variant="full" />
        </div>
      </div>
    </div>
  );
}
