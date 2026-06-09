/**
 * Extensible registry of decorative fills for the 1:1.5 "poster" QR band.
 *
 * Each fill paints ONLY the band region (never the QR matrix or its quiet
 * zone), at low contrast and with no finder-like triple squares — so the QR
 * always scans. Adding a new brand = add one entry to BRAND_FILLS.
 */

export type BrandFillId = 'flat' | 'ai-solutions';

export interface BandPaintOpts {
  /** QR code (foreground) color chosen by the user. */
  fg: string;
  /** QR background color chosen by the user. */
  bg: string;
  /** Optional accent override; falls back to the brand palette accent. */
  accent?: string;
  /** Optional caption line. */
  caption?: string;
}

export interface BrandFill {
  id: BrandFillId;
  label: string;
  /** Whether the UI should expose a caption input for this fill. */
  supportsCaption: boolean;
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
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Doodle motifs, drawn centered at the current canvas origin in a ~2s box.
function drawNode(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.beginPath();
  ctx.arc(-s * 0.6, 0, s * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(s * 0.6, 0, s * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-s * 0.45, 0);
  ctx.lineTo(s * 0.45, 0);
  ctx.stroke();
}

function drawBubble(ctx: CanvasRenderingContext2D, s: number): void {
  roundRectPath(ctx, -s * 0.6, -s * 0.5, s * 1.2, s * 0.8, s * 0.22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-s * 0.2, s * 0.3);
  ctx.lineTo(-s * 0.34, s * 0.6);
  ctx.lineTo(s * 0.02, s * 0.3);
  ctx.stroke();
}

function drawSparkle(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.62);
  ctx.lineTo(0, s * 0.62);
  ctx.moveTo(-s * 0.62, 0);
  ctx.lineTo(s * 0.62, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-s * 0.3, -s * 0.3);
  ctx.lineTo(s * 0.3, s * 0.3);
  ctx.moveTo(s * 0.3, -s * 0.3);
  ctx.lineTo(-s * 0.3, s * 0.3);
  ctx.stroke();
}

function drawPill(ctx: CanvasRenderingContext2D, s: number): void {
  roundRectPath(ctx, -s * 0.66, -s * 0.28, s * 1.32, s * 0.56, s * 0.28);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-s * 0.32, 0, s * 0.12, 0, Math.PI * 2);
  ctx.fill();
}

function drawArrow(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.beginPath();
  ctx.moveTo(-s * 0.6, s * 0.22);
  ctx.quadraticCurveTo(0, -s * 0.5, s * 0.56, -s * 0.02);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(s * 0.56, -s * 0.02);
  ctx.lineTo(s * 0.3, -s * 0.16);
  ctx.moveTo(s * 0.56, -s * 0.02);
  ctx.lineTo(s * 0.34, s * 0.2);
  ctx.stroke();
}

const MOTIFS = [drawNode, drawBubble, drawSparkle, drawPill, drawArrow];

// Tiles low-contrast doodles across the band (deterministic — no randomness).
function paintDoodleTexture(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  ink: string,
  accent: string,
): void {
  const cell = w / 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let r = 0; r * cell < h + cell; r++) {
    for (let c = 0; c * cell < w + cell; c++) {
      const cx = x + c * cell + cell * 0.5 + (r % 2) * cell * 0.5;
      const cy = y + r * cell + cell * 0.5;
      if (cx > x + w + cell || cy > y + h) continue;
      const motif = MOTIFS[(r * 3 + c * 7) % MOTIFS.length];
      const useAccent = (r + c) % 4 === 0;
      ctx.globalAlpha = useAccent ? 0.16 : 0.09;
      ctx.strokeStyle = useAccent ? accent : ink;
      ctx.fillStyle = useAccent ? accent : ink;
      ctx.lineWidth = Math.max(1.5, cell * 0.05);
      const rot = (((r * 7 + c * 13) % 24) - 12) * (Math.PI / 180);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      motif(ctx, cell * 0.42);
      ctx.restore();
    }
  }
  ctx.globalAlpha = 1;
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
    ctx.fillStyle = accent;
    ctx.fillRect(x + w * 0.5 - w * 0.05, y + h * 0.2, w * 0.1, Math.max(2, h * 0.012));
    if (opts.caption) {
      ctx.fillStyle = opts.fg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `600 ${Math.round(h * 0.14)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillText(opts.caption, x + w / 2, y + h * 0.52, w * 0.86);
    }
    ctx.restore();
  },
};

const aiSolutions: BrandFill = {
  id: 'ai-solutions',
  label: 'AI Solutions',
  supportsCaption: true,
  palette: { bg: '#0D1117', ink: '#FFFFFF', accent: '#2E6BF0' },
  paintBand(ctx, x, y, w, h, opts) {
    const accent = opts.accent || this.palette.accent;
    ctx.save();
    ctx.fillStyle = this.palette.bg;
    ctx.fillRect(x, y, w, h);

    paintDoodleTexture(ctx, x, y, w, h, '#FFFFFF', accent);

    const cx = x + w / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Wordmark.
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${Math.round(h * 0.17)}px ui-sans-serif, system-ui, sans-serif`;
    const word = 'AI Solutions';
    const wordY = y + h * 0.42;
    ctx.fillText(word, cx, wordY, w * 0.78);

    // Accent dot after the wordmark.
    const half = Math.min(ctx.measureText(word).width, w * 0.78) / 2;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(cx + half + h * 0.055, wordY - h * 0.045, Math.max(3, h * 0.024), 0, Math.PI * 2);
    ctx.fill();

    // Tagline / caption.
    ctx.fillStyle = 'rgba(255,255,255,0.74)';
    ctx.font = `500 ${Math.round(h * 0.082)}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillText(opts.caption || 'Automatización inteligente', cx, y + h * 0.64, w * 0.82);

    ctx.restore();
  },
};

/* --------------------------------- registry --------------------------------- */

export const BRAND_FILLS: Record<BrandFillId, BrandFill> = {
  flat,
  'ai-solutions': aiSolutions,
};

export const BRAND_FILL_LIST: BrandFill[] = [flat, aiSolutions];
