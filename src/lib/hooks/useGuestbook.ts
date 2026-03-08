'use client';

import { useApiResource } from './useStore';
import type { GuestbookEntry } from '../types';

export function useGuestbook() {
  return useApiResource<GuestbookEntry>('/api/guestbook');
}
