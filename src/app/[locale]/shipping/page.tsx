import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { buildMetadata } from '@/lib/metadata';
import type { Metadata } from "next";

type tParams = Promise<{ id: string, locale: string }>;
export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  const title = currentLocale === "es" ? "Envíos" : "Shipping";
  
  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/shipping`,
    title: title,
  });
}

export default async function ShippingPage() {
  const t = await getTranslations('shipping');

  // Calcular precios con IVA (13%)
  const calculateWithTax = (price: string) => {
    const numericPrice = parseFloat(price.replace('₡', '').replace('.', '').replace(',', ''));
    const withTax = numericPrice * 1.13;
    return `₡${withTax.toLocaleString('es-CR')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-teal-800 sm:text-4xl">{t('title')}</h1>
          <p className="mt-4 text-lg text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Sección de tarifas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
          <div className="bg-teal-600 text-white py-4 px-6">
            <h2 className="text-xl font-semibold">{t('nationalService')} - {t('rates')}</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('branch')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('destination')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('firstKg')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('additionalKg')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('firstKg')} + IVA
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('additionalKg')} + IVA
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('gam')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('gam')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡2.100,00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡1.200,00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateWithTax('₡2.100,00')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateWithTax('₡1.200,00')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('gam')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('restOfCountry')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡2.850,00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡1.300,00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateWithTax('₡2.850,00')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateWithTax('₡1.300,00')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('restOfCountry')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('gam')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡2.850,00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡1.300,00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateWithTax('₡2.850,00')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateWithTax('₡1.300,00')}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('restOfCountry')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('restOfCountry')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡3.650,00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₡1.500,00</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateWithTax('₡3.650,00')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateWithTax('₡1.500,00')}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-gray-50">
            <p className="text-sm text-gray-600 italic">{t('taxNote')}</p>
          </div>
        </div>

        {/* Sección de plazos de entrega */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Envíos Courier y Telegramas */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 text-white py-4 px-6">
              <h2 className="text-xl font-semibold">{t('courierAndTelegrams')}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('from')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('urban')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('rural')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('exceptions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('gam')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('daysPlus')}1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('daysPlus')}3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('everyDays')} 15 {t('days')}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('restOfCountry')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('daysPlus')}1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('daysPlus')}3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('everyDays')} 15 {t('days')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Correspondencia Ordinaria */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white py-4 px-6">
              <h2 className="text-xl font-semibold">{t('ordinaryMail')}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('from')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('urban')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('rural')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('exceptions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('gam')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('daysPlus')}5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('daysPlus')}5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('everyDays')} 16 {t('days')}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('restOfCountry')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('daysPlus')}5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('daysPlus')}5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t('everyDays')} 16 {t('days')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Enlaces a más información */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
          <div className="bg-teal-600 text-white py-4 px-6">
            <h2 className="text-xl font-semibold">{t('moreInfo')}</h2>
          </div>
          
          <div className="p-6">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="https://correos.go.cr/servicio-ems/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('officialSite')} - {t('emsService')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="https://correos.go.cr/plazos-entrega/#1575566701405-a7035c6b-0f9c" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('deliverySchedules')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="https://correos.go.cr/plazos-entrega/#1577826251883-9f312b4d-a559" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-teal-600 hover:text-teal-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{t('restrictedAreas')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Nota informativa */}
        <div className="bg-teal-50 border-l-4 border-teal-600 p-4 mb-10">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-teal-700">
                {t('weUse')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
