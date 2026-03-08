'use client';

import { useApiResource } from './useStore';
import type { ConsultationRequest } from '../types';

export function useConsultations() {
  return useApiResource<ConsultationRequest>('/api/consultations');
}
