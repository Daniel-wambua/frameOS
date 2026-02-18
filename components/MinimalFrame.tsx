'use client';

/**
 * components/MinimalFrame.tsx
 *
 * Renders a clean, OS-agnostic frame: no window chrome, just padding, a
 * soft surface background, border-radius, and a depth shadow.
 *
 * Frame rendering logic:
 * – The outer wrapper provides background colour and border-radius.
 * – A subtle inner border is simulated via box-shadow rather than an outline
 *   so it stays inside the rounded corners and renders cleanly in the export.
 * – Light theme: white surface + medium grey shadow.
 * – Dark theme: #1e1e1e surface + deep shadow.
 */

interface MinimalFrameProps {
  imageUrl: string;
  theme: 'light' | 'dark';
  borderRadius: number;
}

export default function MinimalFrame({ imageUrl, theme, borderRadius }: MinimalFrameProps) {
  const isDark = theme === 'dark';

  const wrapperStyle: React.CSSProperties = {
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    background: isDark ? '#1c1c1e' : '#ffffff',
    boxShadow: isDark
      ? '0 0 0 1px rgba(255,255,255,0.07), 0 32px 72px -12px rgba(0,0,0,0.75)'
      : '0 0 0 1px rgba(0,0,0,0.09), 0 32px 72px -12px rgba(0,0,0,0.25)',
    lineHeight: 0,
  };

  return (
    <div style={wrapperStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Framed screenshot"
        style={{ display: 'block', width: '100%', maxWidth: '100%' }}
      />
    </div>
  );
}
