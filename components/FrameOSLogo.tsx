'use client';

/**
 * components/FrameOSLogo.tsx
 *
 * Inline SVG logo for the FrameOS header.
 * The icon uses a violet→blue gradient that is self-contained in the SVG
 * (no Tailwind dependency) so it renders correctly in both light and dark mode.
 * The wordmark text honours the current colour scheme via Tailwind classes.
 *
 * Usage:
 *   <FrameOSLogo />            — default size
 *   <FrameOSLogo iconSize={28} /> — larger icon
 */

interface FrameOSLogoProps {
  iconSize?: number;
}

export default function FrameOSLogo({ iconSize = 28 }: FrameOSLogoProps) {
  // Unique gradient ID per instance to avoid SVG ID collisions if the logo
  // is ever rendered more than once on a page.
  const gradId = 'fos-grad';

  return (
    <div className="flex items-center gap-2.5 select-none" aria-label="FrameOS">

      {/* Icon mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="32" height="32" rx="8" fill={`url(#${gradId})`} />

        {/* Outer frame */}
        <rect x="4" y="6" width="24" height="20" rx="4" stroke="white" strokeWidth="1.6" strokeOpacity="0.9" />

        {/* Inner screen inset */}
        <rect x="8" y="11" width="16" height="12" rx="2" stroke="white" strokeWidth="1.1" strokeOpacity="0.45" />

        {/* Chrome dots */}
        <circle cx="9"    cy="9" r="1.1" fill="white" fillOpacity="0.9" />
        <circle cx="12.6" cy="9" r="1.1" fill="white" fillOpacity="0.55" />
        <circle cx="16.2" cy="9" r="1.1" fill="white" fillOpacity="0.3" />

        {/* Screenshot content preview lines */}
        <rect x="10" y="15"   width="12"  height="1.8" rx="0.9" fill="white" fillOpacity="0.35" />
        <rect x="10" y="18.5" width="7.5" height="1.8" rx="0.9" fill="white" fillOpacity="0.22" />
      </svg>

      {/* Wordmark */}
      <span className="font-bold text-[17px] tracking-tight leading-none text-neutral-900 dark:text-white">
        Frame
        <span
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          OS
        </span>
      </span>
    </div>
  );
}
