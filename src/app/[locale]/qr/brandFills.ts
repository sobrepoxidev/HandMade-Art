/**
 * Extensible registry of decorative fills for the 1:1.5 "poster" QR band.
 *
 * Each fill paints ONLY the band region (never the QR matrix or its quiet
 * zone), so the QR always scans. Adding a new brand = add one entry to
 * BRAND_FILLS.
 */

export type BrandFillId = 'flat' | 'ai-solutions';

export interface BandPaintOpts {
  /** QR code (foreground) color chosen by the user. */
  fg: string;
  /** QR background color chosen by the user. */
  bg: string;
  /** Optional accent override; falls back to the brand palette accent. */
  accent?: string;
  /** Optional caption / tagline override. */
  caption?: string;
  /** Preloaded band artwork (when `BrandFill.image` is set and loaded). */
  bandImage?: HTMLImageElement | null;
  /** Preloaded square background (when `BrandFill.squareImage` is set and loaded). */
  squareImage?: HTMLImageElement | null;
}

export interface BrandFill {
  id: BrandFillId;
  label: string;
  /** Whether the UI should expose a caption input for this fill. */
  supportsCaption: boolean;
  /** Optional band artwork (2:1) drawn instead of the procedural band when loaded. */
  image?: string;
  /** Optional square background (1:1) drawn behind a centered QR card. */
  squareImage?: string;
  /** Reference palette (used for swatches and as defaults). */
  palette: { bg: string; ink: string; accent: string };
  /** Paints the band at the given rect. */
  paintBand: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    opts: BandPaintOpts,
  ) => void;
  /** Paints the full-frame square background for the 1:1 branded layout. */
  paintSquareBackground?: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    opts: BandPaintOpts,
  ) => void;
}

/* ---------------------------------- helpers --------------------------------- */

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function withAlpha(hex: string, alpha: number): string {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map((c) => c + c).join('') : v;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// AI Solutions "Ai" monogram: a peak (A, no crossbar) + i stem + accent dot.
function drawAiMark(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  u: number,
  accent: string,
): void {
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = u * 0.15;

  // A — peak
  ctx.beginPath();
  ctx.moveTo(bx + u * 0.05, by + u * 0.9);
  ctx.lineTo(bx + u * 0.37, by + u * 0.12);
  ctx.lineTo(bx + u * 0.69, by + u * 0.9);
  ctx.stroke();

  // i — stem
  ctx.beginPath();
  ctx.moveTo(bx + u * 0.87, by + u * 0.9);
  ctx.lineTo(bx + u * 0.87, by + u * 0.4);
  ctx.stroke();

  // i — accent dot
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(bx + u * 0.87, by + u * 0.19, u * 0.105, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Cohesive low-contrast "node network" texture, kept to the margins so it never
// competes with the central lockup. Deterministic — no randomness.
const NETWORK_NODES: [number, number][] = [
  [0.07, 0.28], [0.15, 0.6], [0.05, 0.84], [0.23, 0.18], [0.19, 0.86],
  [0.31, 0.5], [0.93, 0.26], [0.85, 0.56], [0.95, 0.8], [0.77, 0.2],
  [0.81, 0.84], [0.69, 0.52], [0.5, 0.92], [0.38, 0.88], [0.62, 0.9],
];

function paintNodeNetwork(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  accent: string,
): void {
  const px = (nx: number) => x + nx * w;
  const py = (ny: number) => y + ny * h;

  // Edges between nearby nodes.
  ctx.lineWidth = Math.max(1, h * 0.0035);
  for (let i = 0; i < NETWORK_NODES.length; i++) {
    for (let j = i + 1; j < NETWORK_NODES.length; j++) {
      const a = NETWORK_NODES[i];
      const b = NETWORK_NODES[j];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (d > 0.23) continue;
      ctx.strokeStyle = withAlpha('#FFFFFF', 0.05);
      ctx.beginPath();
      ctx.moveTo(px(a[0]), py(a[1]));
      ctx.lineTo(px(b[0]), py(b[1]));
      ctx.stroke();
    }
  }

  // Nodes.
  for (let i = 0; i < NETWORK_NODES.length; i++) {
    const [nx, ny] = NETWORK_NODES[i];
    const isAccent = i % 5 === 0;
    ctx.fillStyle = isAccent ? withAlpha(accent, 0.55) : withAlpha('#FFFFFF', 0.13);
    ctx.beginPath();
    ctx.arc(px(nx), py(ny), isAccent ? h * 0.016 : h * 0.011, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ----------------------------------- fills ---------------------------------- */

const flat: BrandFill = {
  id: 'flat',
  label: 'Plano',
  supportsCaption: true,
  palette: { bg: '#FAF6EF', ink: '#2D2D2D', accent: '#C9A962' },
  paintBand(ctx, x, y, w, h, opts) {
    ctx.save();
    ctx.fillStyle = opts.bg;
    ctx.fillRect(x, y, w, h);
    const accent = opts.accent || this.palette.accent;
    if (opts.caption) {
      ctx.fillStyle = opts.fg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${Math.round(h * 0.15)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillText(opts.caption, x + w / 2, y + h * 0.46, w * 0.86);
    }
    ctx.fillStyle = accent;
    roundRectPath(ctx, x + w * 0.5 - w * 0.05, y + h * (opts.caption ? 0.66 : 0.5), w * 0.1, Math.max(3, h * 0.014), h * 0.01);
    ctx.fill();
    ctx.restore();
  },
};

const aiSolutions: BrandFill = {
  id: 'ai-solutions',
  label: 'AI Solutions',
  supportsCaption: true,
  image: '/qr/band_fill_ai_solutions.webp',
  squareImage: '/qr/bg_minimal_ai_solutions.webp',
  palette: { bg: '#0B0F1A', ink: '#FFFFFF', accent: '#2E6BF0' },
  // Full-frame square background (behind the centered QR card). Uses the artwork
  // when loaded; otherwise a procedural navy + node-network so it never breaks.
  paintSquareBackground(ctx, x, y, w, h, opts) {
    ctx.save();
    const img = opts.squareImage;
    const iw = img ? img.naturalWidth || img.width : 0;
    const ih = img ? img.naturalHeight || img.height : 0;
    ctx.fillStyle = '#0A0E16';
    ctx.fillRect(x, y, w, h);
    if (img && iw && ih) {
      const scale = Math.max(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    } else {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const grad = ctx.createRadialGradient(cx, cy, h * 0.1, cx, cy, w * 0.72);
      grad.addColorStop(0, '#1A2436');
      grad.addColorStop(1, '#0A0E16');
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
      paintNodeNetwork(ctx, x, y, w, h, opts.accent || this.palette.accent);
    }
    ctx.restore();
  },
  paintBand(ctx, x, y, w, h, opts) {
    const accent = opts.accent || this.palette.accent;
    ctx.save();

    // Preferred path: draw the full brand artwork (contain — no cropping; any
    // letterbox is filled with the artwork's own deep navy so it blends), plus a
    // crisp top accent line across the seam.
    const img = opts.bandImage;
    const iw = img ? img.naturalWidth || img.width : 0;
    const ih = img ? img.naturalHeight || img.height : 0;
    if (img && iw && ih) {
      ctx.fillStyle = '#0A0E16';
      ctx.fillRect(x, y, w, h);
      const scale = Math.min(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      ctx.fillStyle = accent;
      ctx.fillRect(x, y, w, Math.max(2, h * 0.007));
      ctx.restore();
      return;
    }

    // Fallback: procedural band (used if the artwork is missing or still loading).
    // Background — soft radial glow over deep navy (echoes the app icon depth).
    const cx = x + w / 2;
    const cy = y + h * 0.42;
    const grad = ctx.createRadialGradient(cx, cy, h * 0.08, cx, cy, w * 0.72);
    grad.addColorStop(0, '#1A2436');
    grad.addColorStop(1, '#0A0E16');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    // Top accent hairline — brand blue, also delineates QR / band.
    ctx.fillStyle = accent;
    ctx.fillRect(x, y, w, Math.max(2, h * 0.007));

    // Texture.
    paintNodeNetwork(ctx, x, y, w, h, accent);

    // ---- Brand lockup: [Ai mark] │ [AI Solutions + underline + tagline] ----
    const markSize = h * 0.46;
    const gap1 = h * 0.12; // mark → divider
    const gap2 = h * 0.12; // divider → text
    const dividerW = Math.max(1.5, h * 0.005);

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';

    const wordFont = `600 ${Math.round(h * 0.155)}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
    const tagFontSize = Math.round(h * 0.062);
    const tagFont = `500 ${tagFontSize}px ui-sans-serif, system-ui, sans-serif`;
    const word = 'AI Solutions';
    const tag = opts.caption || 'Automatización inteligente';

    ctx.font = wordFont;
    const wordW = ctx.measureText(word).width;
    ctx.font = tagFont;
    ctx.letterSpacing = `${Math.round(h * 0.012)}px`;
    const tagW = ctx.measureText(tag.toUpperCase()).width;
    ctx.letterSpacing = '0px';

    const textBlockW = Math.max(wordW, tagW);
    const totalW = markSize + gap1 + dividerW + gap2 + textBlockW;
    const scale = Math.min(1, (w * 0.9) / totalW);

    ctx.translate(cx, y + h * 0.44);
    ctx.scale(scale, scale);

    const startX = -totalW / 2;

    // Mark.
    drawAiMark(ctx, startX, -markSize / 2, markSize, accent);

    // Divider.
    ctx.fillStyle = withAlpha('#FFFFFF', 0.16);
    ctx.fillRect(startX + markSize + gap1, -markSize * 0.42, dividerW, markSize * 0.84);

    const textX = startX + markSize + gap1 + dividerW + gap2;

    // Wordmark.
    ctx.fillStyle = '#FFFFFF';
    ctx.font = wordFont;
    ctx.fillText(word, textX, -h * 0.05);

    // Accent underline (short dash, like the brand logo).
    ctx.fillStyle = accent;
    roundRectPath(ctx, textX, h * 0.04, Math.min(textBlockW, h * 0.34), Math.max(2, h * 0.016), h * 0.01);
    ctx.fill();

    // Tagline.
    ctx.fillStyle = withAlpha('#FFFFFF', 0.62);
    ctx.font = tagFont;
    ctx.letterSpacing = `${Math.round(h * 0.012)}px`;
    ctx.fillText(tag.toUpperCase(), textX, h * 0.135);
    ctx.letterSpacing = '0px';

    ctx.restore();
  },
};

/* --------------------------------- registry --------------------------------- */

export const BRAND_FILLS: Record<BrandFillId, BrandFill> = {
  flat,
  'ai-solutions': aiSolutions,
};

export const BRAND_FILL_LIST: BrandFill[] = [flat, aiSolutions];
