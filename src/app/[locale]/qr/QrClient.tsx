'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import {
  CheckCircle,
  Copy,
  Download,
  Link as LinkIcon,
  Palette,
  QrCode,
  Ruler,
  Share2,
} from 'lucide-react';

const MAX_URL_LENGTH = 3000;
const MIN_SIDE = 120;
const MAX_SIDE = 1280;
const PREVIEW_MAX = 300;

const ASPECT_PRESETS = [
  { label: '1:1', w: 1, h: 1 },
  { label: '4:3', w: 4, h: 3 },
  { label: '3:4', w: 3, h: 4 },
  { label: '16:9', w: 16, h: 9 },
  { label: '9:16', w: 9, h: 16 },
] as const;

const COPY = {
  es: {
    eyebrow: 'Herramienta interna',
    title: 'Generador de código QR',
    lead: 'Crea un QR limpio para fichas de producto, pagos, campañas o enlaces de tienda.',
    urlLabel: 'URL del sitio web',
    urlPlaceholder: 'https://handmadeart.store/es/products',
    copyUrl: 'Copiar URL',
    copied: 'Copiado',
    fgLabel: 'Color del código',
    bgLabel: 'Color de fondo',
    hexAria: 'Valor hexadecimal del color',
    hexPlaceholder: '#000000',
    sizeTitle: 'Tamaño y forma',
    widthLabel: 'Ancho',
    heightLabel: 'Alto',
    aspectLabel: 'Proporción',
    squareReset: 'Cuadrado',
    nonSquareWarn: 'Un QR muy alargado puede costar de escanear. Mantenlo cerca de 1:1 para mejor lectura.',
    generate: 'Generar código QR',
    previewTitle: 'Vista previa',
    previewEmpty: 'Ingresá una URL válida y generá el QR para verlo aquí.',
    download: 'Descargar PNG',
    share: 'Compartir',
    helper: 'Compatible con lectores QR estándar. Para impresión, mantené buen contraste entre código y fondo.',
    footer: 'El QR se genera en tu navegador. No se envía la URL a un servidor.',
    errors: {
      required: 'Ingresá una URL.',
      invalid: 'Usá una URL válida que empiece con http:// o https://.',
      tooLong: 'La URL es demasiado larga. Máximo 3000 caracteres.',
      noCanvas: 'No se pudo generar el código QR.',
      noFile: 'No se pudo preparar el archivo PNG.',
    },
    toast: {
      copied: 'URL copiada.',
      downloaded: 'Código QR descargado.',
      downloadLoading: 'Preparando descarga...',
      shareTitle: 'Código QR',
      shareText: 'Escaneá este código QR:',
    },
  },
  en: {
    eyebrow: 'Internal tool',
    title: 'QR code generator',
    lead: 'Create a clean QR for product cards, payments, campaigns or store links.',
    urlLabel: 'Website URL',
    urlPlaceholder: 'https://handmadeart.store/en/products',
    copyUrl: 'Copy URL',
    copied: 'Copied',
    fgLabel: 'Code color',
    bgLabel: 'Background color',
    hexAria: 'Hex color value',
    hexPlaceholder: '#000000',
    sizeTitle: 'Size & shape',
    widthLabel: 'Width',
    heightLabel: 'Height',
    aspectLabel: 'Aspect ratio',
    squareReset: 'Square',
    nonSquareWarn: 'A very stretched QR can be hard to scan. Keep it close to 1:1 for best reading.',
    generate: 'Generate QR code',
    previewTitle: 'Preview',
    previewEmpty: 'Enter a valid URL and generate the QR to see it here.',
    download: 'Download PNG',
    share: 'Share',
    helper: 'Compatible with standard QR readers. For print, keep strong contrast between code and background.',
    footer: 'The QR is generated in your browser. The URL is not sent to a server.',
    errors: {
      required: 'Enter a URL.',
      invalid: 'Use a valid URL starting with http:// or https://.',
      tooLong: 'The URL is too long. Maximum 3000 characters.',
      noCanvas: 'The QR code could not be generated.',
      noFile: 'The PNG file could not be prepared.',
    },
    toast: {
      copied: 'URL copied.',
      downloaded: 'QR code downloaded.',
      downloadLoading: 'Preparing download...',
      shareTitle: 'QR code',
      shareText: 'Scan this QR code:',
    },
  },
} as const;

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function sanitizeForShare(value: string): string {
  return value.trim().replace(/[\r\n]+/g, '');
}

function clampSide(value: number): number {
  if (Number.isNaN(value)) return MIN_SIDE;
  return Math.min(MAX_SIDE, Math.max(MIN_SIDE, Math.round(value)));
}

// Accepts "#abc", "abc", "#aabbcc", "aabbcc" → normalized "#AABBCC" (or null if invalid).
function normalizeHex(value: string): string | null {
  let v = value.trim();
  if (!v) return null;
  if (!v.startsWith('#')) v = `#${v}`;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    v = `#${v.slice(1).split('').map((c) => c + c).join('')}`;
  }
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v.toUpperCase() : null;
}

interface ColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
  hexAria: string;
  placeholder: string;
}

function ColorField({ id, label, value, onChange, hexAria, placeholder }: ColorFieldProps) {
  const [draft, setDraft] = useState(value.toUpperCase());

  // Keep the text field in sync when the value changes from the picker or a preset.
  useEffect(() => {
    setDraft(value.toUpperCase());
  }, [value]);

  const handleDraft = (raw: string) => {
    setDraft(raw);
    const norm = normalizeHex(raw);
    if (norm) onChange(norm);
  };

  const commit = () => {
    const norm = normalizeHex(draft);
    if (norm) {
      onChange(norm);
      setDraft(norm);
    } else {
      setDraft(value.toUpperCase());
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]"
      >
        <Palette className="h-4 w-4 text-[#A08848]" strokeWidth={1.5} aria-hidden />
        {label}
      </label>
      <div className="flex min-h-[48px] items-center gap-2 border border-[#E8E4E0] bg-[#FAF6EF] px-2.5">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="h-9 w-9 shrink-0 cursor-pointer rounded-sm border border-[#E8E4E0] bg-transparent"
        />
        <input
          type="text"
          inputMode="text"
          spellCheck={false}
          autoComplete="off"
          aria-label={hexAria}
          value={draft}
          placeholder={placeholder}
          maxLength={7}
          onChange={(event) => handleDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit();
            }
          }}
          className="w-full min-w-0 bg-transparent text-sm font-medium uppercase tabular-nums text-[#2D2D2D] outline-none placeholder:text-[#6B6459]/70"
        />
      </div>
    </div>
  );
}

export default function QrClient() {
  const locale = useLocale();
  const copy = locale === 'es' ? COPY.es : COPY.en;

  const [url, setUrl] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [fgColor, setFgColor] = useState('#1A1A1A');
  const [bgColor, setBgColor] = useState('#FAF6EF');
  const [width, setWidth] = useState(280);
  const [height, setHeight] = useState(280);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);

  const trimmedUrl = url.trim();
  const characterCount = useMemo(() => trimmedUrl.length, [trimmedUrl]);
  const hasQr = generatedUrl.length > 0;

  // Square source canvas large enough for the longest requested side; export stretches it.
  const renderSize = Math.max(width, height);
  const ratio = width / height;
  const isNonSquare = ratio > 1.15 || ratio < 0.87;
  const previewWidth = ratio >= 1 ? PREVIEW_MAX : Math.round(PREVIEW_MAX * ratio);
  const previewHeight = ratio >= 1 ? Math.round(PREVIEW_MAX / ratio) : PREVIEW_MAX;

  useEffect(() => {
    if (!isCopied) return;
    const timer = window.setTimeout(() => setIsCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [isCopied]);

  const validateUrl = useCallback(() => {
    if (!trimmedUrl) return copy.errors.required;
    if (trimmedUrl.length > MAX_URL_LENGTH) return copy.errors.tooLong;
    if (!isValidHttpUrl(trimmedUrl)) return copy.errors.invalid;
    return '';
  }, [copy.errors.invalid, copy.errors.required, copy.errors.tooLong, trimmedUrl]);

  const handleGenerate = useCallback(() => {
    const nextError = validateUrl();
    if (nextError) {
      setError(nextError);
      setGeneratedUrl('');
      return;
    }

    setError('');
    setGeneratedUrl(trimmedUrl);
  }, [trimmedUrl, validateUrl]);

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setError('');
    setGeneratedUrl('');
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleGenerate();
    }
  };

  const applyAspect = useCallback(
    (w: number, h: number) => {
      const base = Math.max(width, height);
      if (w >= h) {
        setWidth(clampSide(base));
        setHeight(clampSide((base * h) / w));
      } else {
        setHeight(clampSide(base));
        setWidth(clampSide((base * w) / h));
      }
    },
    [width, height]
  );

  const handleCopyUrl = useCallback(async () => {
    if (!trimmedUrl) return;

    try {
      await navigator.clipboard.writeText(trimmedUrl);
      setIsCopied(true);
      toast.success(copy.toast.copied);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }, [copy.toast.copied, trimmedUrl]);

  const getQrCanvas = useCallback(() => {
    return qrRef.current?.querySelector('canvas') ?? null;
  }, []);

  // Draws the square source canvas onto a width×height canvas so the export honors the chosen shape.
  const buildExportCanvas = useCallback(() => {
    const source = getQrCanvas();
    if (!source) return null;

    const target = document.createElement('canvas');
    target.width = width;
    target.height = height;
    const ctx = target.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, width, height);
    return target;
  }, [getQrCanvas, width, height]);

  const handleDownload = useCallback(() => {
    const canvas = buildExportCanvas();
    if (!canvas) {
      toast.error(copy.errors.noCanvas);
      return;
    }

    const toastId = toast.loading(copy.toast.downloadLoading);

    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error(copy.errors.noFile, { id: toastId });
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `handmade-art-qr-${Date.now()}.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      toast.success(copy.toast.downloaded, { id: toastId });

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        link.remove();
      }, 500);
    }, 'image/png');
  }, [buildExportCanvas, copy.errors.noCanvas, copy.errors.noFile, copy.toast.downloadLoading, copy.toast.downloaded]);

  const handleShare = useCallback(() => {
    const canvas = buildExportCanvas();
    if (!canvas || !generatedUrl) {
      toast.error(copy.errors.noCanvas);
      return;
    }

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error(copy.errors.noFile);
        return;
      }

      const file = new File([blob], 'handmade-art-qr.png', { type: 'image/png' });
      const safeUrl = sanitizeForShare(generatedUrl);
      const shareData: ShareData = {
        title: copy.toast.shareTitle,
        text: `${copy.toast.shareText}\n${safeUrl}`,
        files: [file],
      };

      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share(shareData);
          return;
        }

        window.open(
          `https://wa.me/?text=${encodeURIComponent(safeUrl)}`,
          '_blank',
          'noopener,noreferrer'
        );
      } catch (err) {
        console.error('Error sharing QR:', err);
      }
    }, 'image/png');
  }, [buildExportCanvas, copy.errors.noCanvas, copy.errors.noFile, copy.toast.shareText, copy.toast.shareTitle, generatedUrl]);

  return (
    <main className="min-h-screen bg-[#FAF6EF] text-[#2D2D2D]">
      <section className="mx-auto grid min-h-[calc(100vh-112px)] max-w-screen-xl gap-8 px-4 py-10 sm:px-8 md:py-14 lg:grid-cols-[0.48fr_0.52fr] lg:px-12">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 border border-[#E8E4E0] bg-[#F5F1EB] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
            <QrCode className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            {copy.eyebrow}
          </div>

          <h1 className="font-display text-5xl font-medium leading-[0.98] text-[#2D2D2D] md:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-[#4A4A4A] md:text-[17px]">
            {copy.lead}
          </p>

          <div className="mt-8 border border-[#E8E4E0] bg-[#F5F1EB] p-5 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="qr-url"
                  className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]"
                >
                  {copy.urlLabel}
                </label>
                {isCopied && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2F5F3E]">
                    <CheckCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    {copy.copied}
                  </span>
                )}
              </div>

              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                <input
                  id="qr-url"
                  type="url"
                  value={url}
                  onChange={handleUrlChange}
                  onKeyDown={handleEnter}
                  placeholder={copy.urlPlaceholder}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'qr-url-error' : 'qr-url-help'}
                  className={`min-h-[48px] w-full rounded-sm border bg-[#FFFDF9] py-3 pl-10 pr-12 text-sm text-[#2D2D2D] outline-none transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-[#6B6459]/70 focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25 ${
                    error ? 'border-[#C44536]' : 'border-[#E8E4E0] hover:border-[#C9A962]/45'
                  }`}
                />
                {url && (
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    aria-label={copy.copyUrl}
                    className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-sm text-[#6B6459] transition-colors hover:bg-[#F5F1EB] hover:text-[#A08848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
                  >
                    <Copy className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  </button>
                )}
              </div>

              {error ? (
                <p id="qr-url-error" className="text-sm text-[#9F2D24]">
                  {error}
                </p>
              ) : (
                <p id="qr-url-help" className="text-xs text-[#6B6459]">
                  {characterCount}/{MAX_URL_LENGTH}
                </p>
              )}
            </div>

            <div className="mt-5 grid gap-4 border-t border-[#E8E4E0] pt-5 sm:grid-cols-2">
              <ColorField
                id="qr-fg"
                label={copy.fgLabel}
                value={fgColor}
                onChange={setFgColor}
                hexAria={copy.hexAria}
                placeholder={copy.hexPlaceholder}
              />
              <ColorField
                id="qr-bg"
                label={copy.bgLabel}
                value={bgColor}
                onChange={setBgColor}
                hexAria={copy.hexAria}
                placeholder={copy.hexPlaceholder}
              />
            </div>

            <div className="mt-5 border-t border-[#E8E4E0] pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]">
                  <Ruler className="h-4 w-4 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                  {copy.sizeTitle}
                </span>
                <span className="text-sm font-medium tabular-nums text-[#2D2D2D]">
                  {width} × {height} px
                </span>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[#6B6459]">{copy.aspectLabel}:</span>
                {ASPECT_PRESETS.map((preset) => {
                  const active = Math.abs(ratio - preset.w / preset.h) < 0.02;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyAspect(preset.w, preset.h)}
                      aria-pressed={active}
                      className={`rounded-sm border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors ${
                        active
                          ? 'border-[#A08848] bg-[#A08848] text-[#F5F1EB]'
                          : 'border-[#E8E4E0] bg-[#FAF6EF] text-[#6B6459] hover:border-[#C9A962]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 flex items-center justify-between text-xs text-[#6B6459]">
                    <span>{copy.widthLabel}</span>
                    <span className="tabular-nums">{width} px</span>
                  </span>
                  <input
                    type="range"
                    min={MIN_SIDE}
                    max={MAX_SIDE}
                    step={8}
                    value={width}
                    onChange={(event) => setWidth(clampSide(Number(event.target.value)))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#E8E4E0] accent-[#A08848]"
                    aria-label={copy.widthLabel}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 flex items-center justify-between text-xs text-[#6B6459]">
                    <span>{copy.heightLabel}</span>
                    <span className="tabular-nums">{height} px</span>
                  </span>
                  <input
                    type="range"
                    min={MIN_SIDE}
                    max={MAX_SIDE}
                    step={8}
                    value={height}
                    onChange={(event) => setHeight(clampSide(Number(event.target.value)))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#E8E4E0] accent-[#A08848]"
                    aria-label={copy.heightLabel}
                  />
                </label>
              </div>

              {isNonSquare && (
                <p className="mt-3 text-xs leading-relaxed text-[#9A6B12]">
                  {copy.nonSquareWarn}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-5 py-3 text-sm font-semibold tracking-wide text-[#F5F1EB] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1EB]"
            >
              <QrCode className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              {copy.generate}
            </button>
          </div>
        </div>

        <aside className="flex flex-col justify-center">
          <div className="border border-[#E8E4E0] bg-[#F5F1EB] p-5 shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-medium text-[#2D2D2D]">
                {copy.previewTitle}
              </h2>
              {hasQr && (
                <span className="border border-[#E8E4E0] bg-[#FAF6EF] px-3 py-1 text-xs font-medium tabular-nums text-[#6B6459]">
                  {generatedUrl.length}
                </span>
              )}
            </div>

            <div
              ref={qrRef}
              className="grid min-h-[340px] place-items-center border border-[#E8E4E0] bg-[#FAF6EF] p-5"
              aria-live="polite"
            >
              {hasQr ? (
                <div className="border border-[#E8E4E0] bg-[#FFFDF9] p-3 sm:p-4">
                  <div style={{ width: previewWidth, height: previewHeight }}>
                    <QRCodeCanvas
                      value={generatedUrl}
                      size={renderSize}
                      level="H"
                      fgColor={fgColor}
                      bgColor={bgColor}
                      includeMargin
                      style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="max-w-[30ch] text-center">
                  <QrCode className="mx-auto h-10 w-10 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                  <p className="mt-4 text-sm leading-relaxed text-[#6B6459]">
                    {copy.previewEmpty}
                  </p>
                </div>
              )}
            </div>

            {hasQr && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] px-4 py-2.5 text-sm font-semibold tracking-wide text-[#2D2D2D] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#A08848] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
                >
                  <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  {copy.download}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#C9A962] px-4 py-2.5 text-sm font-semibold tracking-wide text-[#1A1A1A] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#A08848] hover:text-[#F5F1EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A08848]"
                >
                  <Share2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  {copy.share}
                </button>
              </div>
            )}

            <p className="mt-5 border-t border-[#E8E4E0] pt-4 text-sm leading-relaxed text-[#4A4A4A]">
              {copy.helper}
            </p>
            <p className="mt-3 text-xs text-[#6B6459]">{copy.footer}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
