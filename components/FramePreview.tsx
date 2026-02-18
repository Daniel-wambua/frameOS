'use client';

/**
 * components/FramePreview.tsx
 *
 * Renders the full composited output: gradient background + selected frame + image.
 *
 * Frame rendering logic:
 * – The outer div (forwarded ref) is what html-to-image captures for export.
 *   It carries the gradient background and applies the user-configured padding.
 * – The inner frame component is chosen via a switch on config.frameStyle.
 * – Max-width is capped so very wide images don't overflow the viewport;
 *   the frame itself scales naturally because the <img> inside is 100% wide.
 */

import { forwardRef } from 'react';
import type { FrameConfig } from '@/lib/types';
import { GRADIENT_CSS } from '@/lib/types';
import MacFrame from './MacFrame';
import WindowsFrame from './WindowsFrame';
import MinimalFrame from './MinimalFrame';
import BrowserFrame from './BrowserFrame';
import PhoneFrame from './PhoneFrame';
import TabletFrame from './TabletFrame';

interface FramePreviewProps {
  imageUrl: string;
  config: FrameConfig;
}

// forwardRef is required so that page.tsx can hold a ref to this DOM node
// for the html-to-image capture without lifting DOM knowledge into the parent.
const FramePreview = forwardRef<HTMLDivElement, FramePreviewProps>(
  ({ imageUrl, config }, ref) => {
    const { frameStyle, theme, gradient, padding, borderRadius, imageScale, bgColor, useCustomBg } = config;

    const outerStyle: React.CSSProperties = {
      padding: `${padding}px`,
      // Gradient or solid colour via inline style – never Tailwind classes (purge-safe).
      background: useCustomBg ? bgColor : GRADIENT_CSS[gradient],
      maxWidth: '860px',
      maxHeight: '100%',
      width: '100%',
      borderRadius: '1rem',
      // Shrink the preview to fit the available canvas height without scrolling.
      boxSizing: 'border-box',
    };

    // imageScale shrinks the frame within the padding area (100% = full width).
    const scaleWrapperStyle: React.CSSProperties = {
      width: `${imageScale}%`,
      margin: '0 auto',
    };

    // Select the correct frame component based on the user's choice.
    function renderFrame() {
      switch (frameStyle) {
        case 'macos':
          return <MacFrame imageUrl={imageUrl} theme={theme} borderRadius={borderRadius} />;
        case 'windows':
          return <WindowsFrame imageUrl={imageUrl} theme={theme} borderRadius={borderRadius} />;
        case 'minimal':
          return <MinimalFrame imageUrl={imageUrl} theme={theme} borderRadius={borderRadius} />;
        case 'browser':
          return <BrowserFrame imageUrl={imageUrl} theme={theme} borderRadius={borderRadius} />;
        case 'phone':
          return <PhoneFrame imageUrl={imageUrl} theme={theme} borderRadius={borderRadius} />;
        case 'tablet':
          return <TabletFrame imageUrl={imageUrl} theme={theme} borderRadius={borderRadius} />;
      }
    }

    return (
      // This is the node captured by html-to-image on export.
      <div ref={ref} style={outerStyle}>
        <div style={scaleWrapperStyle}>
          {renderFrame()}
        </div>
      </div>
    );
  }
);

FramePreview.displayName = 'FramePreview';

export default FramePreview;
