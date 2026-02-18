import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const BASE_URL = 'https://frameos.app';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:  'FrameOS – Screenshot Framing Engine',
    template: '%s | FrameOS',
  },
  description:
    'Wrap any screenshot in a beautiful macOS, Windows, browser, phone, or tablet frame. ' +
    'Export at exact App Store and Google Play dimensions. Free, runs in your browser.',

  keywords: [
    'screenshot framing',
    'app store screenshot',
    'google play screenshot',
    'mockup generator',
    'macos frame',
    'phone mockup',
    'tablet mockup',
    'browser mockup',
    'screenshot tool',
    'png export',
  ],

  authors: [{ name: 'FrameOS' }],
  creator:  'FrameOS',
  publisher: 'FrameOS',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
  },

  // Open Graph
  openGraph: {
    type:        'website',
    url:         BASE_URL,
    siteName:    'FrameOS',
    title:       'FrameOS – Screenshot Framing Engine',
    description:
      'Wrap any screenshot in a beautiful frame and export it at exact App Store or Google Play dimensions. Free, runs in your browser.',
    images: [
      {
        url:    '/og-image.svg',
        width:   1200,
        height:  630,
        alt:    'FrameOS – Screenshot Framing Engine',
        type:   'image/svg+xml',
      },
    ],
    locale: 'en_US',
  },

  // Twitter / X Card
  twitter: {
    card:        'summary_large_image',
    title:       'FrameOS – Screenshot Framing Engine',
    description: 'Wrap screenshots in macOS, phone, or tablet frames and export at exact store dimensions.',
    images:      ['/og-image.svg'],
  },

  icons: {
    icon:     [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut:  '/icon.svg',
    apple:     '/icon.svg',
  },

  manifest: '/site.webmanifest',

  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
