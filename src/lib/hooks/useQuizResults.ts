'use client';

import { useApiResource } from './useStore';
import type { QuizSubmission } from '../types';

export function useQuizResults() {
  return useApiResource<QuizSubmission>('/api/quiz-results');
}
