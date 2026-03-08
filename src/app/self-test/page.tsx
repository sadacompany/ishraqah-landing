'use client';

import Link from 'next/link';
import { useState } from 'react';
import { panicQuiz } from '@/data/quiz';
import { addItem, generateId } from '@/lib/store';
import type { QuizSubmission } from '@/lib/types';

export default function SelfTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = panicQuiz.questions.length;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalScore = newAnswers.reduce((sum, a) => sum + a, 0);
      const resultObj = panicQuiz.results.find(
        (r) => totalScore >= r.range[0] && totalScore <= r.range[1]
      );
      const submission: QuizSubmission = {
        id: generateId(),
        answers: newAnswers,
        totalScore,
        resultTitle: resultObj?.title || '',
        createdAt: new Date().toISOString(),
      };
      addItem('quizResults', submission);
      setShowResults(true);
    }
  };

  const totalScore = answers.reduce((sum, a) => sum + a, 0);
  const result = panicQuiz.results.find(
    (r) => totalScore >= r.range[0] && totalScore <= r.range[1]
  );

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const progress = ((currentQuestion + (showResults ? 1 : 0)) / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav className="text-sm text-charcoal-light mb-8">
        <Link href="/" className="hover:text-bronze transition-colors">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">اختبر نفسك</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">{panicQuiz.title}</h1>
        <p className="mt-3 text-charcoal-light text-sm leading-relaxed">
          {panicQuiz.description}
        </p>
        <div className="mt-4 h-0.5 w-12 bg-bronze rounded-full" />
      </div>

      {/* Disclaimer */}
      <div className="bg-bronze-glow/30 rounded-xl p-4 mb-8">
        <p className="text-xs text-charcoal-light leading-relaxed">
          {panicQuiz.disclaimer}
        </p>
      </div>

      {!showResults ? (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-dark/30">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-charcoal-light mb-2">
              <span>
                السؤال {currentQuestion + 1} من {totalQuestions}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-cream-warm rounded-full overflow-hidden">
              <div
                className="h-full bg-bronze rounded-full transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="animate-fade-in-up" key={currentQuestion}>
            <h2 className="text-lg font-bold text-charcoal leading-relaxed mb-6">
              {panicQuiz.questions[currentQuestion].text}
            </h2>

            <div className="space-y-3">
              {panicQuiz.questions[currentQuestion].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full text-right px-5 py-4 text-sm bg-cream-warm hover:bg-bronze-glow/30 border border-cream-dark/30 hover:border-bronze-glow rounded-xl transition-[background-color,border-color] duration-200"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-dark/30 animate-fade-in-up">
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                result?.color === 'emerald'
                  ? 'bg-emerald-100'
                  : result?.color === 'amber'
                    ? 'bg-amber-100'
                    : result?.color === 'orange'
                      ? 'bg-orange-100'
                      : 'bg-red-100'
              }`}
            >
              <span
                className={`text-2xl font-bold ${
                  result?.color === 'emerald'
                    ? 'text-emerald-600'
                    : result?.color === 'amber'
                      ? 'text-amber-600'
                      : result?.color === 'orange'
                        ? 'text-orange-600'
                        : 'text-red-600'
                }`}
              >
                {totalScore}/{totalQuestions * 3}
              </span>
            </div>
            <h2 className="text-xl font-bold text-charcoal">{result?.title}</h2>
          </div>

          <div className="bg-cream-warm rounded-xl p-6 mb-6">
            <p className="text-charcoal-light text-sm leading-[2]">
              {result?.description}
            </p>
          </div>

          <div className="bg-teal-pale/30 rounded-xl p-4 mb-6">
            <p className="text-xs text-charcoal-light leading-relaxed">
              <strong className="text-charcoal">تذكير:</strong>{' '}
              {panicQuiz.disclaimer}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={reset}
              className="flex-1 px-5 py-3 text-sm font-medium text-charcoal bg-cream-warm hover:bg-cream-dark rounded-xl transition-colors"
            >
              إعادة الاختبار
            </button>
            <Link
              href="/consultations/new"
              className="flex-1 text-center px-5 py-3 text-sm font-medium text-white bg-bronze hover:bg-bronze-light rounded-xl transition-colors"
            >
              طلب استشارة
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
