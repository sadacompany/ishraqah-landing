'use client';

import { useStore } from './useStore';
import type { QuizSubmission } from '../types';

export function useQuizResults() {
  return useStore<QuizSubmission>('quizResults');
}
