'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import {
  ArrowRight,
  Clock,
  ExternalLink,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';

type Destination = 'gam' | 'rest';

interface ShippingRate {
  firstKg: number;
  additionalKg: number;
  days: string;
}

interface DestinationCopy {
  name: string;
  short: string;
  description: string;
}

const SHIPPING_RATES: Record<Destination, ShippingRate> = {
  gam: { firstKg: 2100, additionalKg: 1200, days: '1-2' },
  rest: { firstKg: 2850, additionalKg: 1300, days: '2-4' },
};

const REST_TO_REST_RATE: ShippingRate = {
  firstKg: 3650,
  additionalKg: 1500,
  days: '3-5',
};

const withTax = (amount: number) => Math.round(amount * 1.13);
const toUSD = (colones: number) => (colones / 500).toFixed(2);
const formatCRC = (amount: number) => amount.toLocaleString('es-CR');

export default function ShippingClient() {
  const locale = useLocale();
  const isEs = locale === 'es';
  const [destination, setDestination] = useState<Destination>('gam');

  const currentRate = SHIPPING_RATES[destination];
  const firstKgWithTax = withTax(currentRate.firstKg);
  const additionalKgWithTax = withTax(currentRate.additionalKg);

  const destinations: Record<Destination, DestinationCopy> = {
    gam: {
      name: isEs ? 'Gran Área Metropolitana' : 'Greater Metropolitan Area',
      short: 'GAM',
      description: isEs
        ? 'San José, Alajuela, Cartago, Heredia y alrededores.'
        : 'San José, Alajuela, Cartago, Heredia and nearby areas.',
    },
    rest: {
      name: isEs ? 'Resto de Costa Rica' : 'Rest of Costa Rica',
      short: isEs ? 'Fuera de GAM' : 'Outside GAM',
      description: isEs
        ? 'Guanacaste, Puntarenas, Limón y zonas rurales.'
        : 'Guanacaste, Puntarenas, Limón and rural areas.',
    },
  };

  const rateRows = [
    {
      label: 'GAM a GAM',
      rate: SHIPPING_RATES.gam,
    },
    {
      label: isEs ? 'GAM al resto del país' : 'GAM to the rest of CR',
      rate: SHIPPING_RATES.rest,
    },
    {
      label: isEs ? 'Fuera de GAM a fuera de GAM' : 'Outside GAM to outside GAM',
      rate: REST_TO_REST_RATE,
    },
  ];

  const steps = [
    {
      icon: PackageCheck,
      title: isEs ? 'Pedido confirmado' : 'Order confirmed',
      body: isEs
        ? 'Reservamos la pieza y revisamos el peso antes de prepararla.'
        : 'We reserve the piece and review its weight before preparing it.',
    },
    {
      icon: ShieldCheck,
      title: isEs ? 'Empaque protegido' : 'Protected packing',
      body: isEs
        ? 'Cada artículo se envuelve a mano para proteger talla, barniz y bordes.'
        : 'Each item is hand-wrapped to protect carving, finish and edges.',
    },
    {
      icon: Truck,
      title: isEs ? 'Entrega por EMS' : 'EMS delivery',
      body: isEs
        ? 'Correos de Costa Rica entrega en la dirección indicada.'
        : 'Correos de Costa Rica delivers to the address provided.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF6EF] text-[#2D2D2D]">
      <section className="border-b border-[#E8E4E0]">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-4 py-12 sm:px-8 md:py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.58fr)] lg:px-12">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 border border-[#E8E4E0] bg-[#F5F1EB] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
              <Truck className="h-4 w-4" aria-hidden />
              {isEs ? 'Envíos nacionales' : 'National shipping'}
            </div>
            <h1 className="max-w-[12ch] font-display text-[clamp(40px,7vw,68px)] font-medium leading-[0.96] tracking-[-0.01em] text-[#2D2D2D]">
              {isEs ? 'Calculá tu envío.' : 'Calculate shipping.'}
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-[#4A4A4A] md:text-[17px]">
              {isEs
                ? 'Enviamos piezas únicas a todo Costa Rica con Correos de Costa Rica EMS. El costo final se confirma en checkout según peso, dirección y método de entrega.'
                : 'We ship one-of-a-kind pieces across Costa Rica with Correos de Costa Rica EMS. The final cost is confirmed at checkout based on weight, address and delivery method.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                locale={locale}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#F5F1EB] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1A1A1A]"
              >
                {isEs ? 'Comprar piezas' : 'Shop pieces'}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                locale={locale}
                className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-[#E8E4E0] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#2D2D2D] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#A08848]"
              >
                {isEs ? 'Consultar envío' : 'Ask about shipping'}
              </Link>
            </div>
          </div>

          <aside className="border border-[#E8E4E0] bg-[#F5F1EB] shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)]">
            <div className="border-b border-[#E8E4E0] bg-[#2D2D2D] px-5 py-4 text-[#F5F1EB]">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em]">
                <PackageCheck className="h-5 w-5 text-[#C9A962]" aria-hidden />
                {isEs ? 'Estimador rápido' : 'Quick estimate'}
              </h2>
            </div>
            <div className="space-y-6 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]">
                  {isEs ? 'Origen' : 'Origin'}
                </p>
                <div className="mt-2 flex items-start gap-3 border border-[#E8E4E0] bg-[#FAF6EF] p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#A08848]" aria-hidden />
                  <div>
                    <p className="font-medium text-[#2D2D2D]">San José, GAM</p>
                    <p className="text-sm leading-relaxed text-[#6B6459]">
                      {isEs ? 'Taller Handmade Art.' : 'Handmade Art workshop.'}
                    </p>
                  </div>
                </div>
              </div>

              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]">
                  {isEs ? 'Destino' : 'Destination'}
                </legend>
                <div className="mt-2 grid gap-3">
                  {(['gam', 'rest'] as Destination[]).map((item) => {
                    const selected = destination === item;

                    return (
                      <label
                        key={item}
                        className={`flex cursor-pointer items-start gap-3 border p-4 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          selected
                            ? 'border-[#A08848] bg-[#FAF6EF]'
                            : 'border-[#E8E4E0] bg-[#F5F1EB] hover:border-[#C9A962]/45'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping-destination"
                          value={item}
                          checked={selected}
                          onChange={() => setDestination(item)}
                          className="mt-1 h-4 w-4 accent-[#A08848]"
                        />
                        <span>
                          <span className="block font-medium text-[#2D2D2D]">
                            {destinations[item].name}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-[#6B6459]">
                            {destinations[item].description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="border border-[#E8E4E0] bg-[#FAF6EF] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]">
                  {isEs ? 'Primer kilogramo' : 'First kilogram'}
                </p>
                <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <span className="font-display text-4xl font-semibold tabular-nums text-[#A08848]">
                    CRC {formatCRC(firstKgWithTax)}
                  </span>
                  <span className="pb-1 text-sm text-[#6B6459]">
                    USD {toUSD(firstKgWithTax)}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 border-t border-[#E8E4E0] pt-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                    <Clock className="h-4 w-4 text-[#2F5F3E]" aria-hidden />
                    <span>
                      {currentRate.days} {isEs ? 'días hábiles' : 'business days'}
                    </span>
                  </div>
                  <p className="text-sm text-[#4A4A4A]">
                    <span className="font-medium text-[#2D2D2D]">
                      {isEs ? 'Kg adicional:' : 'Additional kg:'}
                    </span>{' '}
                    CRC {formatCRC(additionalKgWithTax)}
                  </p>
                </div>
              </div>

              <p className="border border-[#4A7C59]/25 bg-[#4A7C59]/10 p-4 text-sm leading-relaxed text-[#2D2D2D]">
                {isEs
                  ? 'La mayoría de piezas pesa menos de 1 kg. Si comprás varias obras, el checkout agrupa el peso para calcular el envío correcto.'
                  : 'Most pieces weigh under 1 kg. If you buy several works, checkout groups the weight to calculate the correct shipping.'}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[0.45fr_0.55fr] lg:px-12">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
            {isEs ? 'Proceso de entrega' : 'Delivery process'}
          </p>
          <h2 className="mt-3 max-w-[12ch] font-display text-[clamp(28px,4vw,42px)] font-medium leading-tight tracking-[-0.005em] text-[#2D2D2D]">
            {isEs ? 'Listo para llegar bien.' : 'Packed to arrive well.'}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="border border-[#E8E4E0] bg-[#FAF6EF] p-5 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <Icon className="h-5 w-5 text-[#A08848]" aria-hidden />
                  <span className="font-display text-2xl font-medium text-[#C9A962]">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-display text-xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4A4A4A]">{step.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#E8E4E0] bg-[#F5F1EB]">
        <div className="mx-auto grid max-w-screen-xl gap-8 px-4 py-16 sm:px-8 lg:grid-cols-[0.38fr_0.62fr] lg:px-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
              {isEs ? 'Tarifas EMS' : 'EMS rates'}
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
              {isEs ? 'Referencia rapida' : 'Quick reference'}
            </h2>
            <p className="mt-4 max-w-[44ch] text-sm leading-relaxed text-[#4A4A4A]">
              {isEs
                ? 'Precios con IVA incluido para el primer kilogramo. El checkout confirma la tarifa exacta antes de pagar.'
                : 'Prices include tax for the first kilogram. Checkout confirms the exact rate before payment.'}
            </p>
          </div>
          <div className="overflow-hidden border border-[#E8E4E0] bg-[#FAF6EF]">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[#E8E4E0] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#6B6459]">
              <span>{isEs ? 'Ruta' : 'Route'}</span>
              <span>{isEs ? 'Costo' : 'Cost'}</span>
              <span>{isEs ? 'Tiempo' : 'Time'}</span>
            </div>
            {rateRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[#E8E4E0] px-4 py-4 text-sm last:border-b-0"
              >
                <span className="font-medium text-[#2D2D2D]">{row.label}</span>
                <span className="font-display font-semibold tabular-nums text-[#A08848]">
                  CRC {formatCRC(withTax(row.rate.firstKg))}
                </span>
                <span className="text-[#6B6459]">
                  {row.rate.days} {isEs ? 'días' : 'days'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-screen-xl flex-col items-start justify-between gap-6 border border-[#F5F1EB]/12 bg-[#1A1A1A] p-6 text-[#F5F1EB] md:flex-row md:items-center md:p-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A962]">
              EMS Correos de Costa Rica
            </p>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-[#B5AC9D]">
              {isEs
                ? 'Usamos un operador nacional conocido para cuidar la entrega y dar seguimiento cuando la pieza sale del taller.'
                : 'We use a known national carrier to protect delivery and provide tracking once the piece leaves the workshop.'}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="https://correos.go.cr/servicio-ems/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#C9A962] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#1A1A1A] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#A08848] hover:text-[#F5F1EB]"
            >
              {isEs ? 'Ver Correos EMS' : 'View Correos EMS'}
              <ExternalLink className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              locale={locale}
              className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-[#F5F1EB]/30 px-5 py-2.5 text-sm font-semibold tracking-wide text-[#F5F1EB] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#F5F1EB]/10"
            >
              {isEs ? 'Hablar con nosotros' : 'Talk to us'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
