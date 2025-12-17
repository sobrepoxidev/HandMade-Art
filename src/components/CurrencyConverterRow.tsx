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
    <div className="inline-flex flex-nowrap items-center gap-2 text-sm rounded-lg border border-[#E8E4E0] px-2 py-1.5 bg-white shadow-sm">
      {/* Selector de divisas */}
      <select
        className="border-none bg-transparent px-1 py-0.5 focus:outline-none focus:ring-0 text-[#2D2D2D] font-medium text-sm"
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
        className="p-1.5 rounded-md bg-[#2D2D2D] hover:bg-[#C9A962] transition-colors disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        ) : (
          <RefreshCcw className="h-4 w-4 text-white" />
        )}
      </button>

      {/* Resultado */}
      <div className="min-w-[5rem] font-semibold text-[#2D2D2D]">
        {result ? (
          result.currency && result.converted ? (
            <span className="text-[#C9A962]">
              {new Intl.NumberFormat('es-CR', {
                style: 'currency',
                currency: result.currency,
              }).format(result.converted)}
            </span>
          ) : (
            <span className="text-[#C44536] text-xs">{locale === 'es' ? 'Error' : 'Error'}</span>
          )
        ) : (
          <span className="flex items-center gap-1 text-[#9C9589] text-xs">
            <ArrowLeft className="h-3 w-3" />
            {locale === 'es' ? 'Ver' : 'View'}
          </span>
        )}
      </div>
    </div>
  );
}
