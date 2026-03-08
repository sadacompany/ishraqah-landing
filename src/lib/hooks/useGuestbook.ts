'use client';

import { useStore } from './useStore';
import type { GuestbookEntry } from '../types';

export function useGuestbook() {
  return useStore<GuestbookEntry>('guestbook');
}
