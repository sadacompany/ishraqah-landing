'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ArticlePreview } from './ArticlePreview';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ContentEditor({ value, onChange, disabled }: ContentEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Push to undo stack on significant changes
  const pushUndo = useCallback(() => {
    setUndoStack((prev) => [...prev.slice(-49), value]);
    setRedoStack([]);
  }, [value]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((s) => [...s, value]);
    onChange(prev);
  }, [undoStack, value, onChange]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((s) => s.slice(0, -1));
    setUndoStack((s) => [...s, value]);
    onChange(next);
  }, [redoStack, value, onChange]);

  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    pushUndo();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start + text.length;
      textarea.selectionEnd = start + text.length;
    });
  }, [value, onChange, pushUndo]);

  const wrapSelection = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    pushUndo();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    // If already wrapped, unwrap
    const textBefore = value.substring(Math.max(0, start - before.length), start);
    const textAfter = value.substring(end, end + after.length);
    if (textBefore === before && textAfter === after) {
      const newValue = value.substring(0, start - before.length) + selected + value.substring(end + after.length);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.selectionStart = start - before.length;
        textarea.selectionEnd = end - before.length;
      });
      return;
    }

    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    });
  }, [value, onChange, pushUndo]);

  const prefixLines = useCallback((prefix: string, toggle: boolean = true) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    pushUndo();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const selectedText = value.substring(lineStart, lineEnd);
    const lines = selectedText.split('\n');

    const allPrefixed = toggle && lines.every((l) => !l.trim() || l.trimStart().startsWith(prefix));

    const transformed = lines
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;
        if (allPrefixed) {
          return trimmed.startsWith(prefix) ? trimmed.substring(prefix.length) : trimmed;
        }
        return trimmed.startsWith(prefix) ? trimmed : `${prefix}${trimmed}`;
      })
      .join('\n');

    const newValue = value.substring(0, lineStart) + transformed + value.substring(lineEnd);
    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
    });
  }, [value, onChange, pushUndo]);

  const handleBold = useCallback(() => wrapSelection('**', '**'), [wrapSelection]);
  const handleItalic = useCallback(() => wrapSelection('*', '*'), [wrapSelection]);

  const handleHeading = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    pushUndo();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const line = value.substring(lineStart, lineEnd).trim();
    const isHeading = line.startsWith('**') && line.endsWith('**');

    const newLine = isHeading ? line.slice(2, -2) : `**${line}**`;
    const newValue = value.substring(0, lineStart) + newLine + value.substring(lineEnd);
    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
    });
  }, [value, onChange, pushUndo]);

  const handleBulletList = useCallback(() => prefixLines('- '), [prefixLines]);

  const handleNumberedList = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    pushUndo();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const selectedText = value.substring(lineStart, lineEnd);
    const lines = selectedText.split('\n');

    const allNumbered = lines.every((l) => !l.trim() || /^\d+\.\s/.test(l.trim()));

    const transformed = lines
      .map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return line;
        if (allNumbered) {
          return trimmed.replace(/^\d+\.\s/, '');
        }
        return /^\d+\.\s/.test(trimmed) ? trimmed : `${i + 1}. ${trimmed}`;
      })
      .join('\n');

    const newValue = value.substring(0, lineStart) + transformed + value.substring(lineEnd);
    onChange(newValue);

    requestAnimationFrame(() => textarea.focus());
  }, [value, onChange, pushUndo]);

  const handleQuote = useCallback(() => prefixLines('> '), [prefixLines]);

  const handleDivider = useCallback(() => {
    insertAtCursor('\n\n---\n\n');
  }, [insertAtCursor]);

  const handleLink = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    pushUndo();

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    if (selected) {
      const newValue = value.substring(0, start) + `[${selected}](الرابط)` + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.selectionStart = start + selected.length + 3;
        textarea.selectionEnd = start + selected.length + 3 + 'الرابط'.length;
      });
    } else {
      const placeholder = '[نص الرابط](الرابط)';
      const newValue = value.substring(0, start) + placeholder + value.substring(end);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.selectionStart = start + 1;
        textarea.selectionEnd = start + 1 + 'نص الرابط'.length;
      });
    }
  }, [value, onChange, pushUndo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== textareaRef.current) return;
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key === 'b') {
        e.preventDefault();
        handleBold();
      } else if (mod && e.key === 'i') {
        e.preventDefault();
        handleItalic();
      } else if (mod && e.key === 'k') {
        e.preventDefault();
        handleLink();
      } else if (mod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (mod && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        insertAtCursor('  ');
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleBold, handleItalic, handleLink, handleUndo, handleRedo, insertAtCursor]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && mode === 'edit') {
      textarea.style.height = 'auto';
      textarea.style.height = Math.max(500, textarea.scrollHeight) + 'px';
    }
  }, [value, mode]);

  const toolbarGroups = [
    {
      items: [
        { label: 'عنوان فرعي', shortcut: '', onClick: handleHeading, icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        )},
        { label: 'عريض', shortcut: '⌘B', onClick: handleBold, icon: (
          <span className="text-xs font-black">B</span>
        )},
        { label: 'مائل', shortcut: '⌘I', onClick: handleItalic, icon: (
          <span className="text-xs font-medium italic">I</span>
        )},
      ],
    },
    {
      items: [
        { label: 'قائمة نقطية', shortcut: '', onClick: handleBulletList, icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        )},
        { label: 'قائمة مرقمة', shortcut: '', onClick: handleNumberedList, icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6h11M10 12h11M10 18h11" />
            <text x="2" y="8" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">1</text>
            <text x="2" y="14" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">2</text>
            <text x="2" y="20" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">3</text>
          </svg>
        )},
        { label: 'اقتباس', shortcut: '', onClick: handleQuote, icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )},
      ],
    },
    {
      items: [
        { label: 'رابط', shortcut: '⌘K', onClick: handleLink, icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )},
        { label: 'فاصل', shortcut: '', onClick: handleDivider, icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M3 12h18" />
          </svg>
        )},
      ],
    },
    {
      items: [
        { label: 'تراجع', shortcut: '⌘Z', onClick: handleUndo, icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
          </svg>
        ), disabled: undoStack.length === 0 },
        { label: 'إعادة', shortcut: '⇧⌘Z', onClick: handleRedo, icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" />
          </svg>
        ), disabled: redoStack.length === 0 },
      ],
    },
  ];

  return (
    <div className="border border-cream-dark/30 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-cream-dark/30 bg-cream-warm/50 px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          {mode !== 'preview' && toolbarGroups.map((group, gi) => (
            <div key={gi} className="flex items-center">
              {gi > 0 && <div className="w-px h-5 bg-cream-dark/30 mx-1" />}
              {group.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  disabled={disabled || ('disabled' in item && item.disabled)}
                  title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
                  className="w-8 h-8 flex items-center justify-center text-charcoal hover:bg-cream-dark/20 rounded-lg transition-colors disabled:opacity-30"
                >
                  {item.icon}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-0.5 bg-cream-warm rounded-lg p-0.5">
          {(['edit', 'split', 'preview'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                mode === m
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-charcoal-light hover:text-charcoal'
              }`}
            >
              {m === 'edit' ? 'تعديل' : m === 'split' ? 'مقسم' : 'معاينة'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor / Preview */}
      {mode === 'edit' && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            pushUndo();
            onChange(e.target.value);
          }}
          disabled={disabled}
          className="w-full min-h-[500px] px-5 py-4 text-sm leading-[2] bg-white focus:outline-none resize-none disabled:opacity-50 font-[inherit]"
          placeholder="اكتب محتوى المقال هنا...

** نص عريض ** — للعناوين والنصوص المهمة
* نص مائل * — للتأكيد
- عنصر قائمة — لقوائم نقطية
1. عنصر — لقوائم مرقمة
> اقتباس — لنصوص مقتبسة
[نص](رابط) — لإضافة روابط
--- — فاصل أفقي"
        />
      )}

      {mode === 'preview' && (
        <div className="min-h-[500px] px-5 py-4">
          <ArticlePreview content={value} />
        </div>
      )}

      {mode === 'split' && (
        <div className="flex min-h-[500px] divide-x divide-cream-dark/30">
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                pushUndo();
                onChange(e.target.value);
              }}
              disabled={disabled}
              className="w-full h-full min-h-[500px] px-5 py-4 text-sm leading-[2] bg-white focus:outline-none resize-none disabled:opacity-50 font-[inherit]"
              placeholder="اكتب محتوى المقال هنا..."
            />
          </div>
          <div className="flex-1 min-w-0 px-5 py-4 overflow-auto bg-cream-warm/20">
            <ArticlePreview content={value} />
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-cream-dark/30 bg-cream-warm/30 px-3 py-1.5">
        <div className="flex items-center gap-4 text-[11px] text-charcoal-light/70">
          <span>⌘B عريض</span>
          <span>⌘I مائل</span>
          <span>⌘K رابط</span>
          <span>⌘Z تراجع</span>
        </div>
        <div className="text-[11px] text-charcoal-light/70">
          {value.trim() ? value.trim().split(/\s+/).length : 0} كلمة
        </div>
      </div>
    </div>
  );
}
