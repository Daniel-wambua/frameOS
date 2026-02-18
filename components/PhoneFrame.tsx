'use client';

/**
 * components/PhoneFrame.tsx
 *
 * Samsung Galaxy-style Android phone bezel.
 *
 * Proportions based on Galaxy S24 Ultra:
 *   – Very thin side bezels (~6px), slightly thicker top/bottom (~10px)
 *   – Flat display edges (no notch, no dynamic island)
 *   – Single punch-hole camera centred at the top of the screen
 *   – Status bar: time (left), status icons (right)
 *   – Bottom: ultra-thin home indicator
 *   – Subtle side-rail highlight for the aluminium frame
 *
 * Light theme: platinum/silver bezel
 * Dark theme:  Phantom Black bezel
 */

interface PhoneFrameProps {
  imageUrl: string;
  theme: 'light' | 'dark';
  borderRadius: number;
}

export default function PhoneFrame({ imageUrl, theme, borderRadius }: PhoneFrameProps) {
  const isDark = theme === 'dark';

  // Samsung Phantom Black vs Platinum Silver
  const bezelColor   = isDark ? '#0d0d0d' : '#b0b4ba';
  const bezelEdge    = isDark ? '#2a2a2e' : '#d8dade'; // side rail highlight
  const screenBg     = isDark ? '#000000' : '#ffffff';
  const statusText   = isDark ? 'rgba(255,255,255,0.90)' : 'rgba(0,0,0,0.85)';
  const indicatorBg  = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.15)';

  // Galaxy S-series: corner radius ≈ 44–50px on the bezel, slightly less on screen
  const outerRadius  = Math.max(borderRadius, 46);
  const screenRadius = Math.max(outerRadius - 7, 40);

  // Very thin bezels mirroring Samsung's flat-edge flagship design
  const BEZEL_SIDE = 6;
  const BEZEL_TOP  = 10;
  const BEZEL_BOT  = 10;

  const outer: React.CSSProperties = {
    borderRadius: `${outerRadius}px`,
    overflow: 'hidden',
    background: bezelColor,
    paddingLeft:   BEZEL_SIDE,
    paddingRight:  BEZEL_SIDE,
    paddingTop:    BEZEL_TOP,
    paddingBottom: BEZEL_BOT,
    boxShadow: isDark
      ? [
          `0 0 0 1px rgba(255,255,255,0.04)`,
          `inset 0 0 0 1px ${bezelEdge}`,
          `0 4px 6px -1px rgba(0,0,0,0.6)`,
          `0 32px 64px -12px rgba(0,0,0,0.90)`,
        ].join(', ')
      : [
          `0 0 0 1px rgba(0,0,0,0.10)`,
          `inset 0 0 0 1px rgba(255,255,255,0.50)`,
          `0 4px 6px -1px rgba(0,0,0,0.18)`,
          `0 32px 64px -12px rgba(0,0,0,0.30)`,
        ].join(', '),
  };

  const screen: React.CSSProperties = {
    borderRadius: `${screenRadius}px`,
    overflow: 'hidden',
    background: screenBg,
    position: 'relative',
  };

  return (
    <div style={outer}>
      <div style={screen}>

        {/* ── Status bar ─────────────────────────────────────────────── */}
        <div style={{
          height: 40,
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
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: statusText,
            letterSpacing: '-0.01em',
            fontFamily: 'system-ui, sans-serif',
          }}>
            9:41
          </span>

          {/* Punch-hole camera – centred */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 12,
            height: 12,
            background: isDark ? '#0a0a0a' : '#111111',
            borderRadius: '50%',
            boxShadow: isDark
              ? 'inset 0 0 0 1.5px rgba(255,255,255,0.10), 0 0 0 1px rgba(0,0,0,0.8)'
              : 'inset 0 0 0 1.5px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.25)',
          }} />

          {/* Status icons (right side) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {/* Signal bars */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
              <rect x="0"    y="7"   width="2.6" height="4"  rx="0.5" fill={statusText}/>
              <rect x="4.1"  y="4.5" width="2.6" height="6.5" rx="0.5" fill={statusText}/>
              <rect x="8.2"  y="2"   width="2.6" height="9"  rx="0.5" fill={statusText}/>
              <rect x="12.4" y="0"   width="2.6" height="11" rx="0.5" fill={statusText}/>
            </svg>
            {/* Wifi */}
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
              <circle cx="7" cy="9.5" r="1.2" fill={statusText}/>
              <path d="M4.2 7.2C5 6.3 6 5.8 7 5.8s2 .5 2.8 1.4" stroke={statusText} strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M1.8 5C3.2 3.2 5 2.3 7 2.3s3.8.9 5.2 2.7" stroke={statusText} strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M0 2.8C1.9.9 4.3 0 7 0s5.1.9 7 2.8" stroke={statusText} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {/* Battery (Samsung pill style) */}
            <svg width="20" height="11" viewBox="0 0 20 11" fill="none" aria-hidden="true">
              <rect x="0.5" y="0.5" width="17" height="10" rx="2.5" stroke={statusText} strokeWidth="1"/>
              <rect x="1.5" y="1.5" width="13" height="8" rx="1.5" fill={statusText}/>
              <path d="M18.5 3.5v4" stroke={statusText} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* ── Screenshot ─────────────────────────────────────────────── */}
        <div style={{ lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Framed screenshot"
            style={{ display: 'block', width: '100%', maxWidth: '100%' }}
          />
        </div>

        {/* ── Navigation bar / home indicator ────────────────────────── */}
        <div style={{
          height: 28,
          background: screenBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}>
          {/* Samsung gesture pill */}
          <div style={{ width: 100, height: 4, borderRadius: 3, background: indicatorBg }} />
        </div>

      </div>
    </div>
  );
}
