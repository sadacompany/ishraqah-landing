'use client';

import { useStore } from './useStore';
import type { ConsultationRequest } from '../types';

export function useConsultations() {
  return useStore<ConsultationRequest>('consultations');
}
