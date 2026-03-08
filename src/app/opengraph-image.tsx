import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'إشراقة نفسية - لنشر الوعي النفسي والتربوي';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF8F5',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Sun icon */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 64 64"
          fill="none"
        >
          <g stroke="#8B6F4E" strokeLinecap="round">
            <line x1="32" y1="24" x2="32" y2="10" strokeWidth="2.2" opacity="0.9" />
            <line x1="32" y1="24" x2="32" y2="10" strokeWidth="2.2" opacity="0.9" transform="rotate(-30 32 36)" />
            <line x1="32" y1="24" x2="32" y2="10" strokeWidth="2.2" opacity="0.9" transform="rotate(30 32 36)" />
            <line x1="32" y1="24" x2="32" y2="12" strokeWidth="2.2" opacity="0.8" transform="rotate(-60 32 36)" />
            <line x1="32" y1="24" x2="32" y2="12" strokeWidth="2.2" opacity="0.8" transform="rotate(60 32 36)" />
          </g>
          <path d="M 16 36 A 16 16 0 0 1 48 36" fill="#8B6F4E" opacity="0.85" />
          <path d="M 8 36 Q 20 42 32 36 Q 44 30 56 36" stroke="#8B6F4E" strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
        </svg>

        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            color: '#8B6F4E',
            marginTop: 24,
          }}
        >
          إشراقة نفسية
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#6B6560',
            marginTop: 16,
          }}
        >
          لنشر الوعي النفسي والتربوي
        </div>

        <div
          style={{
            display: 'flex',
            width: 80,
            height: 3,
            backgroundColor: '#8B6F4E',
            borderRadius: 2,
            marginTop: 24,
            opacity: 0.5,
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 20,
            color: '#9B9590',
            marginTop: 20,
          }}
        >
          eshraqaa.com
        </div>
      </div>
    ),
    { ...size }
  );
}
