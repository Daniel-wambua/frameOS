import type { Config } from 'tailwindcss';

const config: Config = {
  // dark: class strategy — the `dark` class is toggled on the root wrapper div
  // in page.tsx, enabling dark: variants throughout all children automatically.
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'frame': '0 25px 60px -10px rgba(0,0,0,0.4)',
        'panel': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
