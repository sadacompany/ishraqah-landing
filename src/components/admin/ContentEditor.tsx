'use client';

import { useState, useRef, useCallback } from 'react';
import { ArticlePreview } from './ArticlePreview';

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ContentEditor({ value, onChange, disabled }: ContentEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = useCallback((before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
    });
  }, [value, onChange]);

  const handleBold = useCallback(() => {
    wrapSelection('**', '**');
  }, [wrapSelection]);

  const handleHeading = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Find the line boundaries
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const line = value.substring(lineStart, lineEnd).trim();
    const wrapped = `**${line}**`;
    const newValue = value.substring(0, lineStart) + wrapped + value.substring(lineEnd);
    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = lineStart + 2;
      textarea.selectionEnd = lineStart + 2 + line.length;
    });
  }, [value, onChange]);

  const handleList = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const selectedText = value.substring(lineStart, lineEnd);
    const lines = selectedText.split('\n');
    const prefixed = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      return trimmed.startsWith('- ') ? trimmed : `- ${trimmed}`;
    }).join('\n');

    const newValue = value.substring(0, lineStart) + prefixed + value.substring(lineEnd);
    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
    });
  }, [value, onChange]);

  return (
    <div className="border border-cream-dark/30 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b border-cream-dark/30 bg-cream-warm/50 px-3 py-2">
        <div className="flex items-center gap-1">
          {mode === 'edit' && (
            <>
              <button
                type="button"
                onClick={handleBold}
                disabled={disabled}
                className="px-2.5 py-1 text-xs font-bold text-charcoal hover:bg-cream-dark/20 rounded-lg transition-colors disabled:opacity-50"
                title="نص عريض"
              >
                عريض
              </button>
              <button
                type="button"
                onClick={handleHeading}
                disabled={disabled}
                className="px-2.5 py-1 text-xs text-charcoal hover:bg-cream-dark/20 rounded-lg transition-colors disabled:opacity-50"
                title="عنوان فرعي"
              >
                عنوان فرعي
              </button>
              <button
                type="button"
                onClick={handleList}
                disabled={disabled}
                className="px-2.5 py-1 text-xs text-charcoal hover:bg-cream-dark/20 rounded-lg transition-colors disabled:opacity-50"
                title="قائمة نقطية"
              >
                قائمة
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 bg-cream-warm rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === 'edit'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            تعديل
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === 'preview'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            معاينة
          </button>
        </div>
      </div>

      {mode === 'edit' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full min-h-[500px] px-4 py-3 text-sm bg-white focus:outline-none resize-none disabled:opacity-50"
          placeholder="اكتب محتوى المقال هنا..."
          style={{ fieldSizing: 'content' } as React.CSSProperties}
        />
      ) : (
        <div className="min-h-[500px] px-4 py-3">
          <ArticlePreview content={value} />
        </div>
      )}
    </div>
  );
}
