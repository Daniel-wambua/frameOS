'use client';

/**
 * components/MacFrame.tsx
 *
 * Renders a macOS-style window chrome around the provided image.
 *
 * Frame rendering logic:
 * – Title bar height is fixed at 38px to match real macOS proportions.
 * – Traffic-light buttons use the exact system colours: red #FF5F57, yellow #FEBC2E, green #28C840.
 * – Light theme: white title bar + light grey image area background.
 * – Dark theme: #1e1e1e title bar + #2d2d2d image area background.
 * – Border radius is passed in from FrameConfig and applied to the outer wrapper.
 *   Inner corners are clipped by overflow-hidden on the wrapper.
 */

interface MacFrameProps {
  imageUrl: string;
  theme: 'light' | 'dark';
  borderRadius: number;
}

export default function MacFrame({ imageUrl, theme, borderRadius }: MacFrameProps) {
  const isDark = theme === 'dark';

  const outerStyle: React.CSSProperties = {
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    // Subtle border that adapts to theme
    boxShadow: isDark
      ? '0 0 0 1px rgba(255,255,255,0.08), 0 32px 64px -16px rgba(0,0,0,0.7)'
      : '0 0 0 1px rgba(0,0,0,0.12), 0 32px 64px -16px rgba(0,0,0,0.3)',
  };

  const titleBarStyle: React.CSSProperties = {
    height: 38,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    background: isDark ? '#3a3a3c' : '#ececec',
    position: 'relative',
    userSelect: 'none',
  };

  const contentStyle: React.CSSProperties = {
    background: isDark ? '#1c1c1e' : '#ffffff',
    lineHeight: 0, // eliminates phantom inline gap below img
  };

  return (
    <div style={outerStyle}>
      {/* Title bar */}
      <div style={titleBarStyle}>
        {/* Traffic-light buttons */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <TrafficLight color="#FF5F57" label="Close" />
          <TrafficLight color="#FEBC2E" label="Minimize" />
          <TrafficLight color="#28C840" label="Maximize" />
        </div>

        {/* Centred window title */}
        <span
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 13,
            fontWeight: 500,
            color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          screenshot.png
        </span>
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
// TrafficLight – single macOS window button
// ---------------------------------------------------------------------------
interface TrafficLightProps {
  color: string;
  label: string;
}

function TrafficLight({ color, label }: TrafficLightProps) {
  return (
    <div
      aria-label={label}
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: color,
        flexShrink: 0,
      }}
    />
  );
}
