import { ImageResponse } from 'next/og';
import pool from '@/lib/db';

export const runtime = 'nodejs';
export const alt = 'إشراقة نفسية';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await pool.query(
    'SELECT title, category_label as "categoryLabel" FROM articles WHERE slug = $1',
    [slug]
  );
  const article = result.rows[0];
  const title = article?.title || 'إشراقة نفسية';
  const category = article?.categoryLabel || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FAF8F5',
          padding: 60,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {category && (
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                color: '#8B6F4E',
                marginBottom: 20,
              }}
            >
              {category}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              fontSize: 52,
              fontWeight: 700,
              color: '#2C2825',
              lineHeight: 1.4,
              maxWidth: '90%',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
              <g stroke="#8B6F4E" strokeLinecap="round">
                <line x1="32" y1="24" x2="32" y2="12" strokeWidth="2.2" opacity="0.9" />
                <line x1="32" y1="24" x2="32" y2="12" strokeWidth="2.2" opacity="0.9" transform="rotate(-30 32 36)" />
                <line x1="32" y1="24" x2="32" y2="12" strokeWidth="2.2" opacity="0.9" transform="rotate(30 32 36)" />
              </g>
              <path d="M 16 36 A 16 16 0 0 1 48 36" fill="#8B6F4E" opacity="0.85" />
              <path d="M 8 36 Q 20 42 32 36 Q 44 30 56 36" stroke="#8B6F4E" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
            </svg>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#8B6F4E' }}>
              إشراقة نفسية
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: '#9B9590' }}>
            eshraqaa.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
