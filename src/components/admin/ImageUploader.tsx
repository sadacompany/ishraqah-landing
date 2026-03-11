'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { apiUpload } from '@/lib/api-client';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUploader({ value, onChange, disabled }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('يجب أن يكون الملف صورة');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الملف يجب أن لا يتجاوز 5 ميجابايت');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const { url } = await apiUpload('/api/upload', file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'فشل رفع الصورة');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative">
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-cream-dark/30">
            <Image src={value} alt="صورة المقال" fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            disabled={disabled}
            className="absolute top-2 left-2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-red-500 text-sm shadow-sm transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-bronze bg-bronze-glow/10'
              : 'border-cream-dark/40 hover:border-bronze/50'
          } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-bronze border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-charcoal-light">جاري الرفع...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-charcoal-light/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-charcoal-light">اسحب صورة هنا أو اضغط للاختيار</span>
              <span className="text-[10px] text-charcoal-light/60">PNG, JPG حتى 5MB</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
            className="hidden"
          />
        </div>
      )}

      {!value && (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            disabled={disabled || uploading}
            placeholder="أو الصق رابط صورة..."
            dir="ltr"
            className="flex-1 px-3 py-1.5 text-xs bg-cream-warm border border-cream-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-bronze/30 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={disabled || uploading || !urlInput.trim()}
            className="px-3 py-1.5 text-xs bg-cream-warm border border-cream-dark/30 rounded-lg hover:bg-cream-dark/20 transition-colors disabled:opacity-50"
          >
            إضافة
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
