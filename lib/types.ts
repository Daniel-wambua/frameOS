/**
 * Shared type definitions for FrameOS.
 * Centralised here so that page.tsx and every component
 * import from one source of truth without circular deps.
 */

export type FrameStyle   = 'macos' | 'windows' | 'minimal' | 'browser' | 'phone' | 'tablet';
export type Theme        = 'light' | 'dark';
export type Gradient     = 'purple-blue' | 'orange-pink' | 'green-teal' | 'slate';

/**
 * Store screenshot format presets for the Phone frame.
 * 'free' = no constraint (export at pixelRatio 2×).
 * All others export at the exact pixel dimensions required by the store.
 */
export type PhonePreset =
  | 'free'
  | 'appstore-67'
  | 'appstore-65'
  | 'appstore-55'
  | 'playstore'
  | 'playstore-xl';

export interface PhonePresetInfo {
  label: string;
  store: 'App Store' | 'Play Store';
  width: number;
  height: number;
  /** Short device label shown in the badge */
  device: string;
}

export const PHONE_PRESETS: Record<Exclude<PhonePreset, 'free'>, PhonePresetInfo> = {
  'appstore-67':  { label: '6.7" — Required',  store: 'App Store',  device: 'iPhone 15 Pro Max',   width: 1290, height: 2796 },
  'appstore-65':  { label: '6.5" — Required',  store: 'App Store',  device: 'iPhone 14 Plus',      width: 1242, height: 2688 },
  'appstore-55':  { label: '5.5" — Legacy',    store: 'App Store',  device: 'iPhone 8 Plus',       width: 1242, height: 2208 },
  'playstore':    { label: 'Standard 9:16',    store: 'Play Store', device: 'Android standard',    width: 1080, height: 1920 },
  'playstore-xl': { label: 'Galaxy tall 9:20', store: 'Play Store', device: 'Galaxy S24 Ultra',    width: 1080, height: 2400 },
};

/** Full set of appearance options passed to the frame preview. */
export interface FrameConfig {
  frameStyle: FrameStyle;
  theme: Theme;
  gradient: Gradient;
  /** Padding (px) between the outer background edge and the frame chrome. Range 8–64. */
  padding: number;
  /** Border-radius (px) applied to the frame chrome. Range 0–32. */
  borderRadius: number;
  /** Scale (%) of the image within its padding area. Range 50–100. */
  imageScale: number;
  /** Solid hex colour used when useCustomBg is true. */
  bgColor: string;
  /** When true the bgColor overrides the gradient. */
  useCustomBg: boolean;
  /**
   * Active store screenshot format preset when frameStyle === 'phone'.
   * 'free' = standard 2× export; any other value = exact store pixel dimensions.
   */
  phonePreset: PhonePreset;
}

/**
 * Map of gradient key → CSS `background` property value.
 * Using raw CSS instead of Tailwind utility classes avoids the JIT purge
 * problem where dynamically-assembled class strings are not detected by
 * Tailwind's static scanner and are stripped from the production CSS bundle.
 */
export const GRADIENT_CSS: Record<Gradient, string> = {
  'purple-blue': 'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #2563eb 100%)',
  'orange-pink': 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #db2777 100%)',
  'green-teal':  'linear-gradient(135deg, #34d399 0%, #22c55e 50%, #14b8a6 100%)',
  'slate':       'linear-gradient(135deg, #64748b 0%, #334155 50%, #0f172a 100%)',
};

/** Human-readable labels for the gradient selector. */
export const GRADIENT_LABELS: Record<Gradient, string> = {
  'purple-blue': 'Cosmic',
  'orange-pink': 'Sunset',
  'green-teal':  'Forest',
  'slate':       'Midnight',
};
