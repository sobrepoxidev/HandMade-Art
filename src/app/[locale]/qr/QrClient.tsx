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
import type QRCodeStyling from 'qr-code-styling';
import type { CornerSquareType, DotType } from 'qr-code-styling';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import {
  CheckCircle,
  Copy,
  Download,
  Image as ImageIcon,
  Link as LinkIcon,
  Palette,
  QrCode,
  Share2,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { BRAND_FILLS, BRAND_FILL_LIST, type BrandFillId } from './brandFills';

const MAX_URL_LENGTH = 3000;
const PREVIEW_MAX = 320;

const SIZE_OPTIONS = [
  { label: 'S', value: 768 },
  { label: 'M', value: 1024 },
  { label: 'L', value: 1536 },
  { label: 'XL', value: 2048 },
] as const;

const DOT_OPTIONS: { value: DotType; key: 'square' | 'rounded' | 'dots' | 'classy' }[] = [
  { value: 'square', key: 'square' },
  { value: 'rounded', key: 'rounded' },
  { value: 'dots', key: 'dots' },
  { value: 'classy', key: 'classy' },
];

const EYE_OPTIONS: { value: CornerSquareType; key: 'square' | 'rounded' | 'dot' }[] = [
  { value: 'square', key: 'square' },
  { value: 'extra-rounded', key: 'rounded' },
  { value: 'dot', key: 'dot' },
];

const COPY = {
  es: {
    eyebrow: 'Herramienta interna',
    title: 'Generador de código QR',
    lead: 'Crea un QR limpio para fichas de producto, pagos, campañas o enlaces de tienda.',
    urlLabel: 'URL del sitio web',
    urlPlaceholder: 'https://handmadeart.store/es/products',
    copyUrl: 'Copiar URL',
    copied: 'Copiado',
    presetsLabel: 'Empezar con',
    presetSimple: 'Simple',
    presetLogo: 'Con logo',
    presetPoster: 'Póster',
    formatLabel: 'Formato',
    formatSquare: 'Cuadrado 1:1',
    formatTall: 'Vertical 1:1.5',
    fgLabel: 'Color del código',
    bgLabel: 'Color de fondo',
    hexAria: 'Valor hexadecimal del color',
    hexPlaceholder: '#000000',
    styleLabel: 'Estilo del código',
    modulesLabel: 'Módulos',
    eyesLabel: 'Ojos',
    modules: { square: 'Cuadrado', rounded: 'Redondeado', dots: 'Puntos', classy: 'Elegante' },
    eyes: { square: 'Cuadrado', rounded: 'Redondeado', dot: 'Punto' },
    sizeLabel: 'Tamaño',
    logoLabel: 'Logo (opcional)',
    logoAdd: 'Subir logo',
    logoRemove: 'Quitar',
    logoHint: 'Se incrusta al centro. Se procesa en tu navegador, no se sube.',
    fillLabel: 'Relleno de la banda',
    captionLabel: 'Texto (opcional)',
    captionPlaceholder: 'Escaneá para automatizar',
    generate: 'Generar código QR',
    previewTitle: 'Vista previa',
    previewEmpty: 'Ingresá una URL válida y generá el QR para verlo aquí.',
    download: 'Descargar PNG',
    share: 'Compartir',
    helper: 'El código se mantiene cuadrado y escaneable. La banda y el logo son decorativos: nunca tapan los módulos.',
    footer: 'El QR se genera en tu navegador. No se envía la URL a un servidor.',
    errors: {
      required: 'Ingresá una URL.',
      invalid: 'Usá una URL válida que empiece con http:// o https://.',
      tooLong: 'La URL es demasiado larga. Máximo 3000 caracteres.',
      noCanvas: 'No se pudo generar el código QR.',
      noFile: 'No se pudo preparar el archivo PNG.',
      logoType: 'El logo debe ser una imagen.',
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
    presetsLabel: 'Start with',
    presetSimple: 'Simple',
    presetLogo: 'With logo',
    presetPoster: 'Poster',
    formatLabel: 'Format',
    formatSquare: 'Square 1:1',
    formatTall: 'Portrait 1:1.5',
    fgLabel: 'Code color',
    bgLabel: 'Background color',
    hexAria: 'Hex color value',
    hexPlaceholder: '#000000',
    styleLabel: 'Code style',
    modulesLabel: 'Modules',
    eyesLabel: 'Eyes',
    modules: { square: 'Square', rounded: 'Rounded', dots: 'Dots', classy: 'Classy' },
    eyes: { square: 'Square', rounded: 'Rounded', dot: 'Dot' },
    sizeLabel: 'Size',
    logoLabel: 'Logo (optional)',
    logoAdd: 'Upload logo',
    logoRemove: 'Remove',
    logoHint: 'Embedded in the center. Processed in your browser, never uploaded.',
    fillLabel: 'Band fill',
    captionLabel: 'Text (optional)',
    captionPlaceholder: 'Scan to automate',
    generate: 'Generate QR code',
    previewTitle: 'Preview',
    previewEmpty: 'Enter a valid URL and generate the QR to see it here.',
    download: 'Download PNG',
    share: 'Share',
    helper: 'The code stays square and scannable. The band and logo are decorative and never cover the modules.',
    footer: 'The QR is generated in your browser. The URL is not sent to a server.',
    errors: {
      required: 'Enter a URL.',
      invalid: 'Use a valid URL starting with http:// or https://.',
      tooLong: 'The URL is too long. Maximum 3000 characters.',
      noCanvas: 'The QR code could not be generated.',
      noFile: 'The PNG file could not be prepared.',
      logoType: 'The logo must be an image.',
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

// Small segmented control used for format / module / eye / size / fill choices.
interface ChipGroupProps<T extends string | number> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

function ChipGroup<T extends string | number>({ label, options, value, onChange }: ChipGroupProps<T>) {
  return (
    <div>
      <span className="mb-1.5 block text-xs text-[#6B6459]">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-[#A08848] bg-[#A08848] text-[#F5F1EB]'
                  : 'border-[#E8E4E0] bg-[#FAF6EF] text-[#6B6459] hover:border-[#C9A962]'
              }`}
            >
              {option.label}
            </button>
          );
        })}
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
  const [dotType, setDotType] = useState<DotType>('square');
  const [eyeType, setEyeType] = useState<CornerSquareType>('square');
  const [size, setSize] = useState<number>(1024);
  const [format, setFormat] = useState<'square' | 'tall'>('square');
  const [logo, setLogo] = useState<string | null>(null);
  const [fillId, setFillId] = useState<BrandFillId>('ai-solutions');
  const [caption, setCaption] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  const qrRef = useRef<QRCodeStyling | null>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const composeToken = useRef(0);

  const trimmedUrl = url.trim();
  const characterCount = useMemo(() => trimmedUrl.length, [trimmedUrl]);
  const hasQr = generatedUrl.length > 0;

  const frameHeight = format === 'tall' ? Math.round(size * 1.5) : size;
  const previewScale = PREVIEW_MAX / Math.max(size, frameHeight);
  const previewWidth = Math.round(size * previewScale);
  const previewHeight = Math.round(frameHeight * previewScale);

  // Create the QRCodeStyling instance on the client only (avoids SSR window access).
  useEffect(() => {
    let cancelled = false;
    void import('qr-code-styling').then(({ default: QRCodeStylingCtor }) => {
      if (cancelled || qrRef.current) return;
      qrRef.current = new QRCodeStylingCtor({
        type: 'canvas',
        qrOptions: { errorCorrectionLevel: 'H' },
      });
      if (hiddenRef.current) qrRef.current.append(hiddenRef.current);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isCopied) return;
    const timer = window.setTimeout(() => setIsCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [isCopied]);

  // Renders the styled QR and composites it (+ optional brand band) onto the canvas.
  const recompose = useCallback(async () => {
    const instance = qrRef.current;
    const canvas = canvasRef.current;
    if (!instance || !canvas || !generatedUrl) return;

    const token = ++composeToken.current;
    const w = size;

    instance.update({
      data: generatedUrl,
      width: w,
      height: w,
      margin: Math.round(w * 0.06),
      image: logo ?? undefined,
      qrOptions: { errorCorrectionLevel: 'H' },
      dotsOptions: { type: dotType, color: fgColor },
      cornersSquareOptions: { type: eyeType, color: fgColor },
      cornersDotOptions: { type: 'square', color: fgColor },
      backgroundOptions: { color: bgColor },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.25, margin: Math.round(w * 0.012) },
    });

    let blob: Blob | null = null;
    try {
      blob = (await instance.getRawData('png')) as Blob | null;
    } catch {
      blob = null;
    }
    if (!blob || token !== composeToken.current) return;

    const bitmap = await createImageBitmap(blob);
    if (token !== composeToken.current) {
      bitmap.close();
      return;
    }

    const h = format === 'tall' ? Math.round(w * 1.5) : w;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return;
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, w);
    bitmap.close();

    if (format === 'tall') {
      BRAND_FILLS[fillId].paintBand(ctx, 0, w, w, h - w, {
        fg: fgColor,
        bg: bgColor,
        caption: caption.trim() || undefined,
      });
    }
  }, [generatedUrl, size, fgColor, bgColor, dotType, eyeType, logo, format, fillId, caption]);

  useEffect(() => {
    void recompose();
  }, [recompose]);

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
    if (event.key === 'Enter') handleGenerate();
  };

  const applyPreset = (preset: 'simple' | 'logo' | 'poster') => {
    if (preset === 'simple') {
      setFormat('square');
      setDotType('square');
      setEyeType('square');
      setLogo(null);
      setFgColor('#1A1A1A');
      setBgColor('#FAF6EF');
    } else if (preset === 'logo') {
      setFormat('square');
      setDotType('rounded');
      setEyeType('extra-rounded');
    } else {
      setFormat('tall');
      setFillId('ai-solutions');
      setDotType('rounded');
      setEyeType('extra-rounded');
    }
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(copy.errors.logoType);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

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

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasQr) {
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
  }, [copy.errors.noCanvas, copy.errors.noFile, copy.toast.downloadLoading, copy.toast.downloaded, hasQr]);

  const handleShare = useCallback(() => {
    const canvas = canvasRef.current;
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
  }, [copy.errors.noCanvas, copy.errors.noFile, copy.toast.shareText, copy.toast.shareTitle, generatedUrl]);

  const activeFill = BRAND_FILLS[fillId];

  return (
    <main className="min-h-screen bg-[#FAF6EF] text-[#2D2D2D]">
      <div ref={hiddenRef} aria-hidden className="pointer-events-none fixed -left-[9999px] top-0 opacity-0" />
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

            {/* Presets */}
            <div className="mt-5 border-t border-[#E8E4E0] pt-5">
              <span className="mb-1.5 block text-xs text-[#6B6459]">{copy.presetsLabel}</span>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { id: 'simple', label: copy.presetSimple },
                  { id: 'logo', label: copy.presetLogo },
                  { id: 'poster', label: copy.presetPoster },
                ] as const).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] px-3 py-1.5 text-xs font-medium text-[#6B6459] transition-colors hover:border-[#C9A962] hover:text-[#A08848]"
                  >
                    {preset.id === 'poster' && <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />}
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format + size */}
            <div className="mt-5 grid gap-4 border-t border-[#E8E4E0] pt-5 sm:grid-cols-2">
              <ChipGroup
                label={copy.formatLabel}
                value={format}
                onChange={setFormat}
                options={[
                  { value: 'square', label: copy.formatSquare },
                  { value: 'tall', label: copy.formatTall },
                ]}
              />
              <ChipGroup
                label={copy.sizeLabel}
                value={size}
                onChange={setSize}
                options={SIZE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              />
            </div>

            {/* Colors */}
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

            {/* Module + eye style */}
            <div className="mt-5 grid gap-4 border-t border-[#E8E4E0] pt-5 sm:grid-cols-2">
              <ChipGroup
                label={copy.modulesLabel}
                value={dotType}
                onChange={setDotType}
                options={DOT_OPTIONS.map((o) => ({ value: o.value, label: copy.modules[o.key] }))}
              />
              <ChipGroup
                label={copy.eyesLabel}
                value={eyeType}
                onChange={setEyeType}
                options={EYE_OPTIONS.map((o) => ({ value: o.value, label: copy.eyes[o.key] }))}
              />
            </div>

            {/* Logo */}
            <div className="mt-5 border-t border-[#E8E4E0] pt-5">
              <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]">
                <ImageIcon className="h-4 w-4 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                {copy.logoLabel}
              </span>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-[#E8E4E0] bg-[#FAF6EF] px-3 py-2 text-xs font-medium text-[#6B6459] transition-colors hover:border-[#C9A962] hover:text-[#A08848]">
                  <Upload className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                  {copy.logoAdd}
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="sr-only" />
                </label>
                {logo && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt="" className="h-9 w-9 rounded-sm border border-[#E8E4E0] object-contain" />
                    <button
                      type="button"
                      onClick={() => setLogo(null)}
                      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-medium text-[#9F2D24] transition-colors hover:bg-[#F5E9E7]"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                      {copy.logoRemove}
                    </button>
                  </>
                )}
              </div>
              <p className="mt-2 text-xs text-[#6B6459]">{copy.logoHint}</p>
            </div>

            {/* Brand band fill (tall only) */}
            {format === 'tall' && (
              <div className="mt-5 border-t border-[#E8E4E0] pt-5">
                <ChipGroup
                  label={copy.fillLabel}
                  value={fillId}
                  onChange={setFillId}
                  options={BRAND_FILL_LIST.map((f) => ({ value: f.id, label: f.label }))}
                />
                {activeFill.supportsCaption && (
                  <div className="mt-3">
                    <label htmlFor="qr-caption" className="mb-1.5 block text-xs text-[#6B6459]">
                      {copy.captionLabel}
                    </label>
                    <input
                      id="qr-caption"
                      type="text"
                      value={caption}
                      maxLength={48}
                      onChange={(event) => setCaption(event.target.value)}
                      placeholder={copy.captionPlaceholder}
                      className="min-h-[44px] w-full rounded-sm border border-[#E8E4E0] bg-[#FFFDF9] px-3 py-2 text-sm text-[#2D2D2D] outline-none transition-colors placeholder:text-[#6B6459]/70 focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25"
                    />
                  </div>
                )}
              </div>
            )}

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
                  {size} × {frameHeight}
                </span>
              )}
            </div>

            <div
              className="grid min-h-[360px] place-items-center border border-[#E8E4E0] bg-[#FAF6EF] p-5"
              aria-live="polite"
            >
              <div className={hasQr ? 'border border-[#E8E4E0] bg-[#FFFDF9] p-3 sm:p-4' : 'hidden'}>
                <canvas
                  ref={canvasRef}
                  data-qr-output
                  style={{ width: previewWidth, height: previewHeight, display: 'block' }}
                />
              </div>
              {!hasQr && (
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
