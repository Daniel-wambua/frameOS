'use client';

/**
 * components/PhoneFrame.tsx
 *
 * iPhone 16 Pro style frame.
 *
 * Details matched to the reference:
 *  – Flat titanium sides (Natural Titanium light / Black Titanium dark)
 *  – Dynamic Island: rounded pill at top-centre of screen
 *  – Left side: Action button (top-left) + Volume Up + Volume Down
 *  – Right side: Power / Side button (tall, centred)
 *  – Bottom chin: USB-C port + flanking speaker grille dots
 *  – Corner radius ~58px (iPhone Pro curve)
 *  – Moderate bezels: 12px sides, 14px top, 20px bottom
 *  – Status bar: time left · Dynamic Island space · icons right
 */

interface PhoneFrameProps {
  imageUrl: string;
  theme: 'light' | 'dark';
  borderRadius: number;
}

export default function PhoneFrame({ imageUrl, theme, borderRadius }: PhoneFrameProps) {
  const isDark = theme === 'dark';

  // Titanium palette
  const titaniumBody  = isDark ? '#2b2b2d' : '#a9aaac';   // Black / Natural titanium
  const titaniumRail  = isDark ? '#3e3e42' : '#c8c9cb';   // slightly lighter rail
  const titaniumBtn   = isDark ? '#222224' : '#9a9b9d';   // buttons slightly darker
  const screenBg      = isDark ? '#000000' : '#f8f8f8';
  const statusText    = isDark ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.86)';
  const indicatorBg   = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.20)';
  const diColor       = isDark ? '#0a0a0a' : '#0d0d0d';   // Dynamic Island pill

  const outerRadius   = Math.max(borderRadius, 58);
  const screenRadius  = Math.max(outerRadius - 8, 52);

  // iPhone-style bezels — thin sides, moderate top/bottom chin
  const BEZEL_SIDE = 12;
  const BEZEL_TOP  = 14;
  const BEZEL_BOT  = 20;

  const outerStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: `${outerRadius}px`,
    background: titaniumBody,
    paddingLeft:   BEZEL_SIDE,
    paddingRight:  BEZEL_SIDE,
    paddingTop:    BEZEL_TOP,
    paddingBottom: BEZEL_BOT,
    // Flat-side titanium look: subtle inset rail + strong drop shadow
    boxShadow: isDark
      ? [
          `inset 0 0 0 1px ${titaniumRail}`,
          `inset 0 1px 0 rgba(255,255,255,0.07)`,
          `0 0 0 1px rgba(0,0,0,0.75)`,
          `0 8px 20px -4px rgba(0,0,0,0.65)`,
          `0 40px 80px -12px rgba(0,0,0,0.95)`,
        ].join(', ')
      : [
          `inset 0 0 0 1px ${titaniumRail}`,
          `inset 0 1px 0 rgba(255,255,255,0.80)`,
          `0 0 0 1px rgba(0,0,0,0.12)`,
          `0 8px 20px -4px rgba(0,0,0,0.18)`,
          `0 40px 80px -12px rgba(0,0,0,0.28)`,
        ].join(', '),
  };

  // ── Shared button style factory ────────────────────────────────────────
  const btnStyle = (
    side: 'left' | 'right',
    top: string,
    width: number,
    height: number,
    radius: string,
  ): React.CSSProperties => ({
    position: 'absolute',
    [side]: -width,
    top,
    width,
    height,
    borderRadius: radius,
    background: titaniumBtn,
    boxShadow: isDark
      ? side === 'left'
        ? `-1px 0 0 rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`
        : `1px 0 0 rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`
      : side === 'left'
        ? `-1px 0 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.55)`
        : `1px 0 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.55)`,
  });

  return (
    <div style={outerStyle}>

      {/* ── Left side: Action button (small, top) ─────────────────────── */}
      <div style={btnStyle('left', '14%', 4, 28, '2px 0 0 2px')} />

      {/* ── Left side: Volume Up ──────────────────────────────────────── */}
      <div style={btnStyle('left', '22%', 4, 44, '2px 0 0 2px')} />

      {/* ── Left side: Volume Down ────────────────────────────────────── */}
      <div style={btnStyle('left', '33%', 4, 44, '2px 0 0 2px')} />

      {/* ── Right side: Power / Side button ──────────────────────────── */}
      <div style={btnStyle('right', '28%', 4, 72, '0 2px 2px 0')} />

      {/* ── Screen ────────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: `${screenRadius}px`,
        overflow: 'hidden',
        background: screenBg,
        position: 'relative',
      }}>

        {/* Status bar */}
        <div style={{
          height: 50,
          background: screenBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 22,
          paddingRight: 18,
          position: 'relative',
          userSelect: 'none',
        }}>
          {/* Time — left */}
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: statusText,
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
          }}>
            9:41
          </span>

          {/* Dynamic Island — centred pill ─────────────────────────── */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 110,
            height: 32,
            background: diColor,
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            // subtle inner glow
            boxShadow: `0 0 0 1.5px rgba(${isDark ? '255,255,255,0.06' : '0,0,0,0.10'})`,
          }}>
            {/* Front camera dot */}
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isDark ? '#1a1a1a' : '#111',
              boxShadow: `inset 0 0 0 2px rgba(${isDark ? '255,255,255,0.10' : '0,0,0,0.20'})`,
            }} />
          </div>

          {/* Status icons — right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {/* Signal */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
              <rect x="0"    y="7"   width="2.6" height="4"   rx="0.5" fill={statusText}/>
              <rect x="4.1"  y="4.5" width="2.6" height="6.5" rx="0.5" fill={statusText}/>
              <rect x="8.2"  y="2"   width="2.6" height="9"   rx="0.5" fill={statusText}/>
              <rect x="12.4" y="0"   width="2.6" height="11"  rx="0.5" fill={statusText}/>
            </svg>
            {/* WiFi */}
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
              <circle cx="7" cy="9.5" r="1.2" fill={statusText}/>
              <path d="M4.2 7.2C5 6.3 6 5.8 7 5.8s2 .5 2.8 1.4" stroke={statusText} strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M1.8 5C3.2 3.2 5 2.3 7 2.3s3.8.9 5.2 2.7" stroke={statusText} strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M0 2.8C1.9.9 4.3 0 7 0s5.1.9 7 2.8" stroke={statusText} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {/* Battery */}
            <svg width="20" height="11" viewBox="0 0 20 11" fill="none" aria-hidden="true">
              <rect x="0.5" y="0.5" width="17" height="10" rx="2.5" stroke={statusText} strokeWidth="1"/>
              <rect x="1.5" y="1.5" width="13" height="8" rx="1.5" fill={statusText}/>
              <path d="M18.5 3.5v4" stroke={statusText} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Screenshot */}
        <div style={{ lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Framed screenshot"
            style={{ display: 'block', width: '100%', maxWidth: '100%' }}
          />
        </div>

        {/* Home indicator */}
        <div style={{
          height: 34,
          background: screenBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ width: 120, height: 5, borderRadius: 3, background: indicatorBg }} />
        </div>

      </div>

      {/* ── Bottom chin: USB-C + speaker grilles ─────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: BEZEL_BOT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}>
        {/* Left speaker dots */}
        {[0,1,2,3].map(i => (
          <div key={`ls${i}`} style={{
            width: 3, height: 3, borderRadius: '50%',
            background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
          }} />
        ))}
        {/* USB-C port */}
        <div style={{
          width: 24, height: 8, borderRadius: 4,
          background: isDark ? '#060606' : '#888',
          margin: '0 4px',
          boxShadow: isDark
            ? 'inset 0 1px 2px rgba(0,0,0,0.9)'
            : 'inset 0 1px 2px rgba(0,0,0,0.35)',
        }} />
        {/* Right speaker dots */}
        {[0,1,2,3].map(i => (
          <div key={`rs${i}`} style={{
            width: 3, height: 3, borderRadius: '50%',
            background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
          }} />
        ))}
      </div>

    </div>
  );
}
