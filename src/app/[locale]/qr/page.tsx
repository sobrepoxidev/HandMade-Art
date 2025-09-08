'use client';

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import {
  CheckCircle,
  Copy,
  Download,
  Share2,
  Loader2,
} from 'lucide-react';


/**
 * ------------------------------------------------------------------
 * QRGenerator
 * ------------------------------------------------------------------
 * • Pure client-side QR generator built with qrcode.react + Tailwind.
 * • Validates that the URL is http/https, limits length to 3000 chars.
 * • Allows custom foreground / background colours.
 * • Lets the user copy, download (PNG) or share the QR via Web Share
 *   API with a WhatsApp fallback.
 * • Uses React.memo to avoid unnecessary re-renders once generated.
 * ------------------------------------------------------------------
 */
const QRGenerator: React.FC = React.memo(() => {
  // ──────────────────────── state ─────────────────────────
  const [url, setUrl] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  // ──────────────────────── refs ──────────────────────────
  const qrRef = useRef<HTMLDivElement>(null);

  // ─────────────────────── helpers ────────────────────────
  const isValidUrl = (str: string): boolean => {
    try {
      const tmp = new URL(str.trim());
      return tmp.protocol === 'http:' || tmp.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // ───────────────────── handlers ─────────────────────────
  const handleCopyUrl = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  }, [url]);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleGenerate = () => {
    if (!url) {
      setError('Por favor ingresa una URL');
      return;
    }
    if (!isValidUrl(url)) {
      setError('Ingresa una URL válida que empiece con http:// o https://');
      return;
    }
    if (url.length > 3000) {
      setError('La URL es demasiado larga (máx. 3000 caracteres)');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setShowQR(true);
      setIsLoading(false);
    }, 400);
  };

  const handleDownload = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) {
      toast.error('No se pudo generar el código QR');
      return;
    }

    // Mostrar notificación de carga
    const toastId = toast.loading('Preparando descarga...');
  
    // 1️⃣ Generamos un Blob (más eficiente que toDataURL)
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Error al generar el archivo', { id: toastId });
        return;
      }
  
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `codigo-qr-${Date.now()}.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
  
      // Disparar el evento de descarga
      link.click();

      // Actualizar notificación a éxito
      toast.success('¡Código QR descargado!', { 
        id: toastId,
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
        icon: '✅',
      });
  
      // Limpieza
      setTimeout(() => {
        URL.revokeObjectURL(url);
        link.remove();
      }, 500);
    }, 'image/png');
  }, []);

  const handleShare = useCallback(async () => {
    if (!url || !qrRef.current) return;
  
    // 1) Tomar el canvas y pasarlo a Blob PNG
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
  
    canvas.toBlob(async (blob) => {
      if (!blob) return;
  
      const file = new File([blob], 'qr.png', { type: 'image/png' });
      const safeUrl = url.replace(/[\r\n]+/g, '');
  
      const shareData: ShareData = {
        title: 'Código QR',
        text: `Escanea este código QR:\n${safeUrl}`,
        files: [file],
      };
  
      try {
        // 2) Sólo si el navegador puede compartir archivos
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share(shareData);
        } else {
          // 3) Fallback a texto vía wa.me
          window.open(
            `https://wa.me/?text=${encodeURIComponent(safeUrl)}`,
            '_blank',
            'noopener,noreferrer'
          );
        }
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    }, 'image/png');
  }, [url]);

  // ──────────────────────── render ────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Toaster para notificaciones */}
      
      <div className="mx-auto max-w-md rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-sm md:max-w-2xl">
        {/* heading */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
            Generador de Código QR
          </h1>
          <p className="text-sm text-gray-600">
            Crea códigos QR personalizados en segundos
          </p>
        </div>

        <div className="space-y-6">
          {/* url input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                URL del sitio web
              </label>
              {isCopied && (
                <span className="inline-flex items-center text-xs text-green-600">
                  <CheckCircle className="mr-1 h-3.5 w-3.5" />
                  Copiado
                </span>
              )}
            </div>

            <div className="relative flex rounded-lg shadow-sm">
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setUrl(e.target.value);
                  setShowQR(false);
                }}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  e.key === 'Enter' && handleGenerate()
                }
                placeholder="https://ejemplo.com"
                aria-invalid={!!error}
                aria-describedby={error ? 'url-error' : undefined}
                className={`block w-full flex-1 rounded-lg border p-3 pr-10 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 sm:text-sm ${
                  error ? 'border-red-300' : 'border-gray-300 hover:border-blue-300'
                }`}
              />
              {url && (
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  aria-label="Copiar URL"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-blue-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}
            </div>

            {error && (
              <p id="url-error" className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* colour pickers */}
          <div className="grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="fgColor"
                className="block text-sm font-medium text-gray-700"
              >
                Color del código
              </label>
              <div className="flex items-center space-x-3">
                <input
                  id="fgColor"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  aria-label="Seleccionar color del código QR"
                  className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  {fgColor.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="bgColor"
                className="block text-sm font-medium text-gray-700"
              >
                Color de fondo
              </label>
              <div className="flex items-center space-x-3">
                <input
                  id="bgColor"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  aria-label="Seleccionar color de fondo"
                  className="h-10 w-10 cursor-pointer rounded-lg border border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  {bgColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className={`flex w-full items-center justify-center rounded-md py-3 px-4 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading
                ? 'cursor-not-allowed bg-blue-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando…
              </>
            ) : (
              'Generar Código QR'
            )}
          </button>

          {/* qr preview */}
          {showQR && (
            <div className="space-y-6">
              <div className="relative">
                <div
                  ref={qrRef}
                  className="mx-auto flex justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-inner transition-all hover:shadow-md"
                >
                  <QRCodeCanvas
                    value={url}
                    size={256}
                    level="H"
                    fgColor={fgColor}
                    bgColor={bgColor}
                    includeMargin
                    imageSettings={{
                      src: '/images/logo-icon.png',
                      width: 40,
                      height: 40,
                      excavate: true,
                    }}
                  />
                </div>
                <div className="absolute -top-3 -right-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  {url.length} caracteres
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={handleDownload}
                  onTouchEnd={(e) => {
                    // Prevent ghost clicks on mobile
                    e.preventDefault();
                    handleDownload();
                  }}
                  className="group flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-gray-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 active:scale-95 active:bg-gray-100"
                >
                  <Download className="h-5 w-5" />
                  <span>Descargar PNG</span>
                </button>
                <button
                  onClick={handleShare}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 font-medium text-white transition-all hover:shadow-lg hover:shadow-green-100 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2"
                >
                  <Share2 className="h-5 w-5" />
                  Compartir
                </button>
              </div>

              <p className="mt-4 text-center text-xs text-gray-500">
                Tu código QR es compatible con cualquier lector estándar.
              </p>
            </div>
          )}

          <footer className="border-t border-gray-100 pt-6 text-center">
            <p className="text-xs text-gray-500">
              Genera códigos QR ilimitados, gratis y sin publicidad.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
});

QRGenerator.displayName = 'QRGenerator';
export default QRGenerator;