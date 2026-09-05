'use client';

import { useState, useTransition } from 'react';
import { Loader2, RefreshCcw, ArrowLeft } from 'lucide-react';
import { useLocale } from 'next-intl';

type Props = {
  amount: number;
  defaultCurrency?: string;
};

export default function CurrencyConverterRow({
  amount,
  defaultCurrency = 'CRC',
}: Props) {
  const locale = useLocale();
  const [currency, setCurrency] = useState(defaultCurrency.toUpperCase());
  interface ConversionResult {
    currency: string;
    converted: number;
    rate: number;
    timestamp: string;
  }

  const [result, setResult] = useState<ConversionResult | null>(null);
  const [last, setLast] = useState<{ amt: number; cur: string } | null>(null);
  const [pending, start] = useTransition();

  /* true cuando está cargando o ya convertimos el mismo par amount/currency */
  const disabled: boolean =
    pending || (!!last && last.amt === amount && last.cur === currency);

  const onConvert = async () => {
    if (disabled) return;
    start(async () => {
      const res = await fetch(`/api/convert?amount=${amount}&to=${currency}`);
      const data = await res.json();
      setResult(data);
      setLast({ amt: amount, cur: currency });
    });
  };

  return (
    <div className="inline-flex flex-nowrap items-center gap-2 text-sm rounded-lg border border-[#3A2E24] px-2 py-1.5 bg-[#1E1813] shadow-sm">
      {/* Selector de divisas */}
      <select
        aria-label={locale === 'es' ? 'Moneda de conversión' : 'Conversion currency'}
        className="border-none bg-transparent px-1 py-0.5 focus:outline-none focus:ring-0 text-[#F1E7D6] font-medium text-sm"
        value={currency}
        onChange={e => {
          setCurrency(e.target.value.toUpperCase());
          setResult(null);
        }}
      >
        <option value="CRC">CRC</option>
        <option value="EUR">EUR</option>
        <option value="MXN">MXN</option>
        <option value="GBP">GBP</option>
        <option value="CAD">CAD</option>
        <option value="AUD">AUD</option>
        <option value="JPY">JPY</option>
        <option value="CNY">CNY</option>
        <option value="CHF">CHF</option>
        <option value="HKD">HKD</option>
        <option value="SEK">SEK</option>
      </select>

      {/* Botón convertir */}
      <button
        onClick={onConvert}
        disabled={disabled}
        title={locale === 'es' ? 'Convertir' : 'Convert'}
        className="p-1.5 rounded-md bg-[#E0A83A] hover:bg-[#F3C56B] transition-colors disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#161210]" />
        ) : (
          <RefreshCcw className="h-4 w-4 text-[#161210]" />
        )}
      </button>

      {/* Resultado */}
      <div className="min-w-[5rem] font-semibold text-[#F1E7D6]">
        {result ? (
          result.currency && result.converted ? (
            <span className="text-[#E0A83A]">
              {new Intl.NumberFormat('es-CR', {
                style: 'currency',
                currency: result.currency,
              }).format(result.converted)}
            </span>
          ) : (
            <span className="text-[#D9563B] text-xs">{locale === 'es' ? 'Error' : 'Error'}</span>
          )
        ) : (
          <span className="flex items-center gap-1 text-[#8C7F6E] text-xs">
            <ArrowLeft className="h-3 w-3" />
            {locale === 'es' ? 'Ver' : 'View'}
          </span>
        )}
      </div>
    </div>
  );
}
