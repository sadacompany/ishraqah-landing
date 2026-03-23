'use client';

import { useEffect, useRef, useCallback } from 'react';

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap
  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', trapFocus);

      // Focus the dialog after render
      requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trapFocus);

      // Restore focus
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trapFocus);
    };
  }, [open, trapFocus]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col focus:outline-none"
      >
        <div className="flex items-center justify-between p-5 border-b border-cream-dark/30">
          <h3 id="modal-title" className="text-lg font-bold text-charcoal">{title}</h3>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="text-charcoal-light hover:text-charcoal p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-bronze/50"
          >
            <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
