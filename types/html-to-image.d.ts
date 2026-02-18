declare module 'html-to-image' {
  export interface Options {
    width?: number;
    height?: number;
    canvasWidth?: number;
    canvasHeight?: number;
    pixelRatio?: number;
    backgroundColor?: string;
    style?: Partial<CSSStyleDeclaration>;
    quality?: number;
    cacheBust?: boolean;
    includeQueryParams?: boolean;
    imagePlaceholder?: string;
    skipFonts?: boolean;
    preferredFontFormat?: string;
    fontEmbedCSS?: string;
    skipAutoScale?: boolean;
    type?: string;
    filter?: (node: HTMLElement) => boolean;
  }

  export function toPng(node: HTMLElement, options?: Options): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export function toBlob(node: HTMLElement, options?: Options): Promise<Blob | null>;
  export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
  export function toCanvas(node: HTMLElement, options?: Options): Promise<HTMLCanvasElement>;
  export function toPixelData(node: HTMLElement, options?: Options): Promise<Uint8ClampedArray>;
}
