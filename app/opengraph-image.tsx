/**
 * app/opengraph-image.tsx
 *
 * Next.js built-in OG image generation — served as image/png at /opengraph-image
 * Renders at 1200×630, compatible with every social platform (Facebook, Twitter/X,
 * LinkedIn, Discord, Slack, iMessage, WhatsApp, etc.)
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'FrameOS – Screenshot Framing Engine';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f11 0%, #0f0f2a 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow blobs */}
        <div style={{
          position: 'absolute', left: 80, top: 135,
          width: 440, height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', right: 80, top: 135,
          width: 400, height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
        }} />

        {/* Card */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(30,27,75,0.55)',
          border: '1.5px solid rgba(255,255,255,0.09)',
          borderRadius: 32,
          padding: '56px 72px',
          gap: 24,
        }}>
          {/* Logo mark */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72, height: 72,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
            marginBottom: 4,
          }}>
            {/* simplified frame icon */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="3"/>
              <line x1="2" y1="8" x2="22" y2="8"/>
              <circle cx="5.5" cy="6" r="0.8" fill="white" stroke="none"/>
              <circle cx="8.5" cy="6" r="0.8" fill="white" stroke="none"/>
              <circle cx="11.5" cy="6" r="0.8" fill="white" stroke="none"/>
            </svg>
          </div>

          {/* Title */}
          <div style={{
            fontSize: 56, fontWeight: 800, letterSpacing: '-1px',
            background: 'linear-gradient(90deg, #c4b5fd 0%, #93c5fd 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            lineHeight: 1.1,
          }}>
            FrameOS
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: 22, color: 'rgba(255,255,255,0.65)',
            fontWeight: 400, letterSpacing: '0.01em', textAlign: 'center',
            maxWidth: 540,
          }}>
            Screenshot Framing Engine
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            {['macOS', 'Windows', 'Browser', 'Phone', 'Tablet'].map((label) => (
              <div key={label} style={{
                fontSize: 14, fontWeight: 600,
                color: 'rgba(196,181,253,0.9)',
                background: 'rgba(124,58,237,0.22)',
                border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: 999,
                padding: '5px 16px',
              }}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Footer domain */}
        <div style={{
          position: 'absolute', bottom: 32,
          fontSize: 16, color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.05em',
        }}>
          frameos.app
        </div>
      </div>
    ),
    { ...size },
  );
}
