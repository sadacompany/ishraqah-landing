import Link from 'next/link';
import { quizzes } from '@/data/quiz';

const colorMap: Record<string, { bg: string; bgLight: string; text: string; border: string; btnBg: string; btnHover: string }> = {
  teal: {
    bg: 'bg-teal-pale/50',
    bgLight: 'bg-teal-pale/30',
    text: 'text-teal',
    border: 'border-teal-pale',
    btnBg: 'bg-teal',
    btnHover: 'hover:bg-teal-light',
  },
  bronze: {
    bg: 'bg-bronze-glow/40',
    bgLight: 'bg-bronze-glow/20',
    text: 'text-bronze',
    border: 'border-bronze-glow',
    btnBg: 'bg-bronze',
    btnHover: 'hover:bg-bronze-light',
  },
  'rose-soft': {
    bg: 'bg-rose-soft/20',
    bgLight: 'bg-rose-soft/10',
    text: 'text-rose-soft',
    border: 'border-rose-soft/30',
    btnBg: 'bg-rose-soft',
    btnHover: 'hover:bg-rose-soft/80',
  },
};

export default function SelfTestPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">اختبر نفسك</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">اختبر نفسك</h1>
        <p className="mt-3 text-charcoal-light text-sm leading-relaxed max-w-2xl">
          اختبارات توعوية مجانية لتقييم صحتك النفسية
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      {/* Disclaimer */}
      <div className="bg-bronze-glow/30 rounded-xl p-4 mb-10">
        <p className="text-xs text-charcoal-light leading-relaxed">
          هذه الاختبارات لأغراض توعوية وتثقيفية فقط، ولا تُعد تشخيصاً طبياً. إذا كنت تعاني من أعراض مستمرة، يُرجى مراجعة مختص.
        </p>
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const colors = colorMap[quiz.color] || colorMap.teal;
          return (
            <div
              key={quiz.slug}
              className={`bg-white rounded-2xl border ${colors.border} overflow-hidden transition-shadow hover:shadow-lg`}
            >
              <div className={`${colors.bg} p-6 flex items-center justify-center`}>
                <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm`}>
                  <svg
                    className={`w-8 h-8 ${colors.text}`}
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={quiz.icon} />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-charcoal mb-2">{quiz.title}</h2>
                <p className="text-sm text-charcoal-light leading-relaxed mb-4 line-clamp-3">
                  {quiz.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-charcoal-light mb-5">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {quiz.questions.length} أسئلة
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {Math.ceil(quiz.questions.length * 0.5)} دقائق
                  </span>
                </div>
                <Link
                  href={`/self-test/${quiz.slug}`}
                  className={`block text-center w-full px-5 py-3 text-sm font-medium text-white ${colors.btnBg} ${colors.btnHover} rounded-xl transition-colors`}
                >
                  ابدأ الاختبار
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
