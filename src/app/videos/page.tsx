import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'الفيديو',
  description: 'فيديوهات توعوية وتثقيفية في المجال النفسي والتربوي',
};

const videos = [
  {
    id: '1',
    title: 'مهارات التعامل مع الضغوط النفسية',
    description:
      'فيديو توعوي يتناول أهم المهارات والتقنيات للتعامل مع الضغوط النفسية اليومية وكيفية تحويلها لطاقة إيجابية.',
    category: 'الصحة النفسية',
  },
  {
    id: '2',
    title: 'أساليب تربوية فعالة',
    description:
      'فيديو تثقيفي حول أفضل الأساليب التربوية الحديثة للتعامل مع الأطفال وبناء علاقة صحية معهم.',
    category: 'التربية',
  },
];

export default function VideosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">الفيديو</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal">
          لثقافتك
        </h1>
        <p className="mt-3 text-charcoal-light max-w-xl leading-relaxed">
          فيديوهات توعوية وتثقيفية في المجال النفسي والتربوي
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl overflow-hidden border border-cream-dark/30"
          >
            <div className="aspect-video bg-gradient-to-br from-cream-warm to-cream-dark flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-bronze mr-[-2px]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="p-6">
              <span className="inline-block px-2.5 py-1 text-[11px] font-medium text-teal bg-teal-pale rounded-full mb-3">
                {video.category}
              </span>
              <h3 className="text-base font-bold text-charcoal mb-2">
                {video.title}
              </h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
