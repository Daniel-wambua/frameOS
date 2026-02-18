'use client';

/**
 * components/PhoneFrame.tsx
 *
 * Generic flagship Android phone frame — looks unmistakably like a phone.
 *
 * Design decisions:
 *   – Thick aluminium side body (18px sides) so the device silhouette registers
 *   – Visible top chin (52px) housing status bar + punch-hole camera
 *   – Visible bottom chin (48px) with gesture pill
 *   – Physical volume buttons (left) + power button (right) as raised DOM elements
 *   – Outer bevel / rail effect via box-shadow
 *   – Corner radius defaults to 52px to match modern flagship curve
 *
 * Light theme: platinum/silver aluminium
 * Dark theme:  Phantom Black
 */

interface PhoneFrameProps {
  imageUrl: string;
  theme: 'light' | 'dark';
  borderRadius: number;
}

export default function PhoneFrame({ imageUrl, theme, borderRadius }: PhoneFrameProps) {
  const isDark = theme === 'dark';

  const bodyColor    = isDark ? '#0e0e0e' : '#c2c5cb';
  const railColor    = isDark ? '#2c2c30' : '#e2e4e8';
  const btnColor     = isDark ? '#1e1e22' : '#b0b3ba';
  const screenBg     = isDark ? '#000000' : '#ffffff';
  const statusText   = isDark ? 'rgba(255,255,255,0.90)' : 'rgba(0,0,0,0.85)';
  const indicatorBg  = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)';
  const chinBg       = isDark ? '#0b0b0b' : '#bbbfc6';

  const outerRadius  = Math.max(borderRadius, 52);
  const screenRadius = Math.max(outerRadius - 10, 44);

  // Body bezels — thick enough to look like a real phone shell
  const BEZEL_SIDE = 18;
  const BEZEL_TOP  = 52;
  const BEZEL_BOT  = 48;

  // Physical button sizes
  const VOL_W  = 4;
  const VOL_H  = 36;
  const PWR_W  = 4;
  const PWR_H  = 56;

  const outerStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: `${outerRadius}px`,
    background: bodyColor,
    paddingLeft:   BEZEL_SIDE,
    paddingRight:  BEZEL_SIDE,
    paddingTop:    BEZEL_TOP,
    paddingBottom: BEZEL_BOT,
    boxShadow: isDark
      ? [
          `inset 0 0 0 1.5px ${railColor}`,
          `inset 0 1px 0 rgba(255,255,255,0.06)`,
          `0 0 0 1px rgba(0,0,0,0.7)`,
          `0 8px 16px -4px rgba(0,0,0,0.7)`,
          `0 40px 80px -16px rgba(0,0,0,0.95)`,
        ].join(', ')
      : [
          `inset 0 0 0 1.5px ${railColor}`,
          `inset 0 1px 0 rgba(255,255,255,0.70)`,
          `0 0 0 1px rgba(0,0,0,0.14)`,
          `0 8px 16px -4px rgba(0,0,0,0.22)`,
          `0 40px 80px -16px rgba(0,0,0,0.35)`,
        ].join(', '),
  };

  // ── Volume buttons (left side) ──────────────────────────────────────────
  const volBtnBase: React.CSSProperties = {
    position: 'absolute',
    left: -VOL_W,
    width: VOL_W,
    borderRadius: '2px 0 0 2px',
    background: btnColor,
    boxShadow: isDark
      ? `-1px 0 0 rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)`
      : `-1px 0 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)`,
  };

  // ── Power button (right side) ───────────────────────────────────────────
  const pwrBtnStyle: React.CSSProperties = {
    position: 'absolute',
    right: -PWR_W,
    width: PWR_W,
    height: PWR_H,
    top: '38%',
    borderRadius: '0 2px 2px 0',
    background: btnColor,
    boxShadow: isDark
      ? `1px 0 0 rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)`
      : `1px 0 0 rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)`,
  };

  const screenStyle: React.CSSProperties = {
    borderRadius: `${screenRadius}px`,
    overflow: 'hidden',
    background: screenBg,
    position: 'relative',
  };

  return (
    <div style={outerStyle}>

      {/* ── Volume up ──────────────────────────────────────────────────── */}
      <div style={{ ...volBtnBase, top: '22%', height: VOL_H }} />
      {/* ── Volume down ────────────────────────────────────────────────── */}
      <div style={{ ...volBtnBase, top: '32%', height: VOL_H }} />
      {/* ── Power / lock ───────────────────────────────────────────────── */}
      <div style={pwrBtnStyle} />

      {/* ── Screen ─────────────────────────────────────────────────────── */}
      <div style={screenStyle}>

        {/* Status bar */}
        <div style={{
          height: 44,
          background: screenBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 20,
          paddingRight: 16,
          position: 'relative',
          userSelect: 'none',
        }}>
          {/* Time */}
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: statusText,
            letterSpacing: '-0.01em',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            9:41
          </span>

          {/* Punch-hole camera – centred */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 13,
            height: 13,
            background: isDark ? '#080808' : '#0d0d0d',
            borderRadius: '50%',
            boxShadow: isDark
              ? 'inset 0 0 0 1.5px rgba(255,255,255,0.08), 0 0 0 1.5px rgba(0,0,0,0.9)'
              : 'inset 0 0 0 1.5px rgba(0,0,0,0.12), 0 0 0 1.5px rgba(0,0,0,0.20)',
          }} />

          {/* Status icons */}
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

        {/* Screenshot content */}
        <div style={{ lineHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Framed screenshot"
            style={{ display: 'block', width: '100%', maxWidth: '100%' }}
          />
        </div>

        {/* Navigation / gesture bar */}
        <div style={{
          height: 32,
          background: screenBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ width: 108, height: 4, borderRadius: 3, background: indicatorBg }} />
        </div>

      </div>

      {/* ── Top chin label area — speaker grille dots ───────────────── */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 3,
        alignItems: 'center',
      }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)',
          }} />
        ))}
      </div>

      {/* ── Bottom chin — USB-C port dots ──────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 3,
        alignItems: 'center',
      }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.12)',
          }} />
        ))}
      </div>

    </div>
  );
}
