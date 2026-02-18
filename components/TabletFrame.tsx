'use client';

/**
 * components/TabletFrame.tsx
 *
 * iPad-style tablet bezel frame.
 *
 * Proportions: thin uniform bezel (14px), large screen area, rounded corners.
 * Top bar: narrow status strip (time left, status icons right, front camera pill centre).
 * Bottom: home indicator bar + dock-style bottom edge.
 * Light theme: silver/white aluminium bezel.
 * Dark theme: space grey near-black bezel.
 */

interface TabletFrameProps {
  imageUrl: string;
  theme: 'light' | 'dark';
  borderRadius: number;
}

export default function TabletFrame({ imageUrl, theme, borderRadius }: TabletFrameProps) {
  const isDark = theme === 'dark';

  const bezelColor  = isDark ? '#1c1c1e' : '#c8cacf';
  const screenBg    = isDark ? '#000000' : '#f8f8f8';
  const statusText  = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(0,0,0,0.82)';
  const indicatorBg = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.16)';
  const bezelRadius = Math.max(borderRadius, 20);
  const bezelPad    = 14;

  const outer: React.CSSProperties = {
    borderRadius: `${bezelRadius}px`,
    overflow: 'hidden',
    background: bezelColor,
    padding: bezelPad,
    boxShadow: isDark
      ? '0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04), 0 48px 96px -20px rgba(0,0,0,0.85)'
      : '0 0 0 1px rgba(0,0,0,0.14), inset 0 0 0 1px rgba(255,255,255,0.55), 0 48px 96px -20px rgba(0,0,0,0.30)',
  };

  const screen: React.CSSProperties = {
    borderRadius: `${Math.max(bezelRadius - bezelPad, 6)}px`,
    overflow: 'hidden',
    background: screenBg,
    position: 'relative',
  };

  return (
    <div style={outer}>
      <div style={screen}>

        {/* Status bar */}
        <div style={{
          height: 36,
          background: screenBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 18,
          paddingRight: 14,
          position: 'relative',
          userSelect: 'none',
        }}>
          {/* Time */}
          <span style={{ fontSize: 12, fontWeight: 600, color: statusText, letterSpacing: '-0.01em' }}>9:41</span>

          {/* Front camera – centred pill */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 10,
            height: 10,
            background: isDark ? '#1a1a1c' : '#8e8e93',
            borderRadius: '50%',
            boxShadow: isDark ? 'inset 0 0 0 1.5px rgba(255,255,255,0.08)' : 'inset 0 0 0 1.5px rgba(0,0,0,0.18)',
          }} />

          {/* Status icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: statusText }}>
            {/* Signal */}
            <svg width="14" height="10" viewBox="0 0 14 10" fill={statusText} aria-hidden="true">
              <rect x="0"   y="6.5" width="2.5" height="3.5" rx="0.4"/>
              <rect x="3.8" y="4.5" width="2.5" height="5.5" rx="0.4"/>
              <rect x="7.6" y="2"   width="2.5" height="8"   rx="0.4"/>
              <rect x="11.4" y="0"  width="2.5" height="10"  rx="0.4"/>
            </svg>
            {/* Wifi */}
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
              <circle cx="7" cy="9.5" r="1.2" fill={statusText}/>
              <path d="M4.2 7.4C5 6.5 6 6 7 6s2 .5 2.8 1.4" stroke={statusText} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <path d="M1.8 5.2C3.2 3.4 5 2.5 7 2.5s3.8.9 5.2 2.7" stroke={statusText} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              <path d="M0 3C1.9 1.1 4.3 0 7 0s5.1 1.1 7 3" stroke={statusText} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            </svg>
            {/* Battery */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: 10, fontWeight: 500, color: statusText }}>100%</span>
              <svg width="22" height="11" viewBox="0 0 22 11" fill="none" aria-hidden="true">
                <rect x="0.5" y="0.5" width="19" height="10" rx="3" stroke={statusText} strokeWidth="1"/>
                <rect x="1.5" y="1.5" width="15" height="8" rx="1.5" fill={statusText}/>
                <path d="M20.5 3.5v4" stroke={statusText} strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Screenshot */}
        <div style={{ lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Framed screenshot" style={{ display: 'block', width: '100%', maxWidth: '100%' }} />
        </div>

        {/* Home indicator */}
        <div style={{ height: 24, background: screenBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 90, height: 4, borderRadius: 3, background: indicatorBg }} />
        </div>
      </div>
    </div>
  );
}
