'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { Truck, MapPin, Clock, Package, ChevronDown, ExternalLink } from 'lucide-react';

type Location = 'gam' | 'rest';

export default function ShippingPage() {
  const locale = useLocale();
  const isEs = locale === 'es';

  const [origin] = useState<Location>('gam'); // HandMade Art ships from GAM
  const [destination, setDestination] = useState<Location>('gam');
  const [isOpen, setIsOpen] = useState(false);

  // Shipping rates (without IVA)
  const rates = {
    'gam-gam': { firstKg: 2100, additionalKg: 1200, days: '1-2' },
    'gam-rest': { firstKg: 2850, additionalKg: 1300, days: '2-4' },
    'rest-gam': { firstKg: 2850, additionalKg: 1300, days: '2-4' },
    'rest-rest': { firstKg: 3650, additionalKg: 1500, days: '3-5' },
  };

  const key = `${origin}-${destination}` as keyof typeof rates;
  const currentRate = rates[key];
  const withIVA = Math.round(currentRate.firstKg * 1.13);
  const additionalWithIVA = Math.round(currentRate.additionalKg * 1.13);

  // Convert to USD (approximate rate)
  const toUSD = (colones: number) => (colones / 500).toFixed(2);

  const locations = {
    gam: {
      name: isEs ? 'Gran Área Metropolitana (GAM)' : 'Greater Metropolitan Area (GAM)',
      short: 'GAM',
      description: isEs
        ? 'San José, Alajuela, Cartago, Heredia y alrededores'
        : 'San José, Alajuela, Cartago, Heredia and surroundings'
    },
    rest: {
      name: isEs ? 'Resto del País' : 'Rest of Costa Rica',
      short: isEs ? 'Resto del País' : 'Rest of CR',
      description: isEs
        ? 'Guanacaste, Puntarenas, Limón y zonas rurales'
        : 'Guanacaste, Puntarenas, Limón and rural areas'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A962]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B55327]/5 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#2D2D2D] text-[#F5F1EB] px-4 py-2 rounded-full text-sm mb-6">
            <Truck className="w-4 h-4 text-[#C9A962]" />
            <span>{isEs ? 'Envíos a todo Costa Rica' : 'Shipping throughout Costa Rica'}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[#2D2D2D] mb-4">
            {isEs ? 'Calculá tu envío' : 'Calculate your shipping'}
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            {isEs
              ? 'Enviamos tus artesanías con amor a cualquier rincón de Costa Rica mediante Correos de Costa Rica (EMS).'
              : 'We ship your crafts with love anywhere in Costa Rica via Correos de Costa Rica (EMS).'}
          </p>
        </div>
      </section>

      {/* Shipping Calculator */}
      <section className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E8E4E0] overflow-hidden">
            {/* Header */}
            <div className="bg-[#2D2D2D] px-6 py-4">
              <h2 className="text-lg font-semibold text-[#F5F1EB] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#C9A962]" />
                {isEs ? '¿Cuánto cuesta mi envío?' : 'How much is my shipping?'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Origin - Fixed */}
              <div>
                <label className="block text-sm font-medium text-[#9C9589] mb-2">
                  {isEs ? 'Origen (nuestro taller)' : 'Origin (our workshop)'}
                </label>
                <div className="flex items-center gap-3 p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E4E0]">
                  <div className="w-10 h-10 bg-[#C9A962]/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#C9A962]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#2D2D2D]">San José, GAM</p>
                    <p className="text-sm text-[#9C9589]">{isEs ? 'Taller HandMade Art' : 'HandMade Art Workshop'}</p>
                  </div>
                </div>
              </div>

              {/* Destination - Selectable */}
              <div>
                <label className="block text-sm font-medium text-[#9C9589] mb-2">
                  {isEs ? '¿A dónde enviamos?' : 'Where do we ship?'}
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between gap-3 p-4 bg-white rounded-xl border-2 border-[#C9A962] hover:border-[#A08848] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#C9A962]/20 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-[#C9A962]" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-[#2D2D2D]">{locations[destination].name}</p>
                        <p className="text-sm text-[#9C9589]">{locations[destination].description}</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-[#C9A962] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#E8E4E0] shadow-lg z-10 overflow-hidden">
                      {(['gam', 'rest'] as Location[]).map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setDestination(loc);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-4 hover:bg-[#FAF8F5] transition-colors text-left ${
                            destination === loc ? 'bg-[#FAF8F5]' : ''
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            destination === loc ? 'bg-[#C9A962] text-white' : 'bg-[#E8E4E0] text-[#9C9589]'
                          }`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-[#2D2D2D]">{locations[loc].name}</p>
                            <p className="text-sm text-[#9C9589]">{locations[loc].description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Result */}
              <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] rounded-xl p-6 border border-[#E8E4E0]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[#9C9589] mb-1">{isEs ? 'Costo de envío (primer kg)' : 'Shipping cost (first kg)'}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-[#C9A962]">₡{withIVA.toLocaleString('es-CR')}</span>
                      <span className="text-lg text-[#9C9589]">≈ ${toUSD(withIVA)}</span>
                    </div>
                    <p className="text-xs text-[#9C9589] mt-1">{isEs ? 'IVA incluido' : 'Tax included'}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-[#E8E4E0]">
                    <Clock className="w-4 h-4 text-[#4A7C59]" />
                    <span className="text-sm font-medium text-[#2D2D2D]">
                      {currentRate.days} {isEs ? 'días hábiles' : 'business days'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E4E0]">
                  <p className="text-sm text-[#4A4A4A]">
                    <span className="font-medium">{isEs ? 'Kg adicional:' : 'Additional kg:'}</span>{' '}
                    ₡{additionalWithIVA.toLocaleString('es-CR')} (≈ ${toUSD(additionalWithIVA)})
                  </p>
                </div>
              </div>

              {/* Note */}
              <div className="flex items-start gap-3 p-4 bg-[#4A7C59]/10 rounded-xl border border-[#4A7C59]/20">
                <div className="w-6 h-6 bg-[#4A7C59] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <p className="text-sm text-[#2D2D2D]">
                  {isEs
                    ? 'La mayoría de nuestros productos pesan menos de 1kg. El costo exacto se calcula al finalizar tu compra.'
                    : 'Most of our products weigh less than 1kg. The exact cost is calculated at checkout.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Info Cards */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#2D2D2D] text-center mb-8">
            {isEs ? '¿Cómo funciona?' : 'How does it work?'}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 border border-[#E8E4E0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#C9A962]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-[#C9A962]">1</span>
              </div>
              <h3 className="font-semibold text-[#2D2D2D] mb-2">
                {isEs ? 'Hacé tu pedido' : 'Place your order'}
              </h3>
              <p className="text-sm text-[#4A4A4A]">
                {isEs
                  ? 'Elegí tus artesanías favoritas y completá tu compra en línea.'
                  : 'Choose your favorite crafts and complete your purchase online.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 border border-[#E8E4E0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#C9A962]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-[#C9A962]">2</span>
              </div>
              <h3 className="font-semibold text-[#2D2D2D] mb-2">
                {isEs ? 'Empacamos con cuidado' : 'We pack with care'}
              </h3>
              <p className="text-sm text-[#4A4A4A]">
                {isEs
                  ? 'Cada artesanía es empacada a mano para protegerla durante el envío.'
                  : 'Each craft is hand-packed to protect it during shipping.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 border border-[#E8E4E0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#C9A962]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-[#C9A962]">3</span>
              </div>
              <h3 className="font-semibold text-[#2D2D2D] mb-2">
                {isEs ? 'Recibí en tu puerta' : 'Receive at your door'}
              </h3>
              <p className="text-sm text-[#4A4A4A]">
                {isEs
                  ? 'Correos de Costa Rica te entrega directamente en tu domicilio.'
                  : 'Correos de Costa Rica delivers directly to your home.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Reference Table */}
      <section className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-[#E8E4E0] overflow-hidden">
            <div className="bg-[#FAF8F5] px-6 py-4 border-b border-[#E8E4E0]">
              <h3 className="font-semibold text-[#2D2D2D]">
                {isEs ? 'Resumen de tarifas' : 'Rate summary'}
              </h3>
            </div>
            <div className="divide-y divide-[#E8E4E0]">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#2D2D2D]">GAM → GAM</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#C9A962]">₡{Math.round(2100 * 1.13).toLocaleString('es-CR')}</span>
                  <span className="text-sm text-[#9C9589] ml-2">1-2 {isEs ? 'días' : 'days'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#2D2D2D]">GAM → {isEs ? 'Resto del país' : 'Rest of CR'}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#C9A962]">₡{Math.round(2850 * 1.13).toLocaleString('es-CR')}</span>
                  <span className="text-sm text-[#9C9589] ml-2">2-4 {isEs ? 'días' : 'days'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-4 bg-[#FAF8F5]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#2D2D2D]">{isEs ? 'Resto → Resto' : 'Rest → Rest'}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#C9A962]">₡{Math.round(3650 * 1.13).toLocaleString('es-CR')}</span>
                  <span className="text-sm text-[#9C9589] ml-2">3-5 {isEs ? 'días' : 'days'}</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#E8E4E0]">
              <p className="text-xs text-[#9C9589]">
                {isEs ? '* Precios con IVA incluido. Primer kilogramo.' : '* Prices include tax. First kilogram.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* More Info */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#2D2D2D] rounded-xl p-6 text-center">
            <p className="text-[#F5F1EB] mb-4">
              {isEs
                ? 'Utilizamos el servicio EMS de Correos de Costa Rica para garantizar la entrega segura de tus artesanías.'
                : 'We use the EMS service from Correos de Costa Rica to ensure safe delivery of your crafts.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="https://correos.go.cr/servicio-ems/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#C9A962] text-[#1A1A1A] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#D4C4A8] transition-colors"
              >
                {isEs ? 'Sitio oficial de Correos' : 'Official Correos site'}
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-transparent border border-[#C9A962] text-[#C9A962] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#C9A962] hover:text-[#1A1A1A] transition-colors"
              >
                {isEs ? '¿Preguntas? Contáctanos' : 'Questions? Contact us'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
