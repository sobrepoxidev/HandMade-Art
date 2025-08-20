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
    <div className="inline-flex flex-nowrap items-center gap-1.5 text-sm rounded-md border border-black px-0.5 py-0.5 shadow-xs">
      {/* Selector de divisas */}
      <select
        className="border-none bg-transparent px-1 py-0.5 focus:outline-none focus:ring-0 text-black font-medium"
        value={currency}
        onChange={e => {
          setCurrency(e.target.value.toUpperCase());
          setResult(null);          // obliga nueva conversión
        }}
      >
        <option value="CRC">CRC</option>  {/* moneda local */}
        <option value="EUR">EUR</option>
        <option value="JPY">JPY</option>
        <option value="GBP">GBP</option>
        <option value="CNY">CNY</option>
        <option value="AUD">AUD</option>
        <option value="CAD">CAD</option>
        <option value="CHF">CHF</option>
        <option value="HKD">HKD</option>
        <option value="SEK">SEK</option>
        <option value="MXN">MXN</option>

      </select>

      {/* Botón convertir */}
      <button
        onClick={onConvert}
        disabled={disabled}
        title="Convertir"
        className="p-1 rounded border border-transparent bg-black hover:border-teal-800 hover:bg-teal-600 hover:text-white transition-colors disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin font-bold text-white" />
        ) : (
          <RefreshCcw className="h-4 w-4 font-bold text-white" />
        )}
      </button>

      {/* Resultado */}
      <div className="min-w-[7rem] font-semibold text-black">
        {result ? (
          result.currency && result.converted ? (
            new Intl.NumberFormat('es-CR', {
              style: 'currency',
              currency: result.currency,
            }).format(result.converted)
          ) : (
            <span className="text-red-500">{locale === 'es' ? 'Error en conversión' : 'Conversion error'}</span>
          )
        ) : (
          <span className="flex items-center gap-1 text-gray-600"><ArrowLeft className="h-3 w-3" />{locale === 'es' ? 'Convertir' : 'Convert'}</span>
        )}
      </div>
    </div>
  );
}
