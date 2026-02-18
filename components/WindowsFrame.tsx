'use client';

/**
 * components/WindowsFrame.tsx
 *
 * Renders a Windows 11-style window chrome around the provided image.
 *
 * Frame rendering logic:
 * – Title bar is 32px tall, very minimal, matching Win11 fluent design principles.
 * – Window controls (minimize / maximise / close) use Unicode glyphs placed in
 *   right-aligned buttons; close button turns red on hover via inline state.
 * – Light theme: #f3f3f3 title bar. Dark theme: #202020 title bar.
 * – Border radius comes from FrameConfig; Win11 typically uses 8px rounded frames.
 */

import { useState } from 'react';

interface WindowsFrameProps {
  imageUrl: string;
  theme: 'light' | 'dark';
  borderRadius: number;
}

export default function WindowsFrame({ imageUrl, theme, borderRadius }: WindowsFrameProps) {
  const isDark = theme === 'dark';

  const outerStyle: React.CSSProperties = {
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    boxShadow: isDark
      ? '0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px -16px rgba(0,0,0,0.7)'
      : '0 0 0 1px rgba(0,0,0,0.10), 0 32px 64px -16px rgba(0,0,0,0.25)',
  };

  const titleBarStyle: React.CSSProperties = {
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    background: isDark ? '#202020' : '#f3f3f3',
    userSelect: 'none',
    position: 'relative',
  };

  const titleTextStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 400,
    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.70)',
    letterSpacing: 0,
  };

  const contentStyle: React.CSSProperties = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    lineHeight: 0,
  };

  return (
    <div style={outerStyle}>
      {/* Title bar */}
      <div style={titleBarStyle}>
        {/* App icon placeholder + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Small coloured square as app icon proxy */}
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)',
              flexShrink: 0,
            }}
          />
          <span style={titleTextStyle}>screenshot.png – Photos</span>
        </div>

        {/* Window chrome buttons */}
        <div style={{ display: 'flex', height: '100%' }}>
          <WinButton
            glyph="&#xE949;"
            label="Minimize"
            isDark={isDark}
            hoverBg={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
          />
          <WinButton
            glyph="&#xE923;"
            label="Maximize"
            isDark={isDark}
            hoverBg={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
          />
          <WinButton
            glyph="&#xE8BB;"
            label="Close"
            isDark={isDark}
            hoverBg="#c42b1c"
            hoverColor="#ffffff"
          />
        </div>
      </div>

      {/* Image content area */}
      <div style={contentStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Framed screenshot"
          style={{ display: 'block', width: '100%', maxWidth: '100%' }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WinButton – single Windows 11 title-bar button
// ---------------------------------------------------------------------------
interface WinButtonProps {
  glyph: string;
  label: string;
  isDark: boolean;
  hoverBg: string;
  hoverColor?: string;
}

function WinButton({ glyph, label, isDark, hoverBg, hoverColor }: WinButtonProps) {
  const [hovered, setHovered] = useState(false);

  const style: React.CSSProperties = {
    width: 46,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    background: hovered ? hoverBg : 'transparent',
    transition: 'background 0.1s',
    // Segoe Fluent Icons / MDL2 Assets for the glyph; falls back to system symbol font
    fontFamily: '"Segoe Fluent Icons", "Segoe MDL2 Assets", system-ui',
    fontSize: 10,
    color: hovered && hoverColor
      ? hoverColor
      : isDark
      ? 'rgba(255,255,255,0.85)'
      : 'rgba(0,0,0,0.80)',
  };

  return (
    <div
      aria-label={label}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span dangerouslySetInnerHTML={{ __html: glyph }} />
    </div>
  );
}
