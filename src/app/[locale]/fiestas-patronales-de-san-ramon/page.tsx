import type { Metadata } from "next";
type tParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'es' ? 'Fiestas Patronales de San Ramón 2025 | Handmade Art' : 'San Ramón Patronal Festivities 2025 | Handmade Art',
    description: locale === 'es'
      ? 'Descubre todo sobre las Fiestas Patronales de San Ramón 2025 del 21 al 31 de Agosto. Handmade Art estará presente con sus artesanías únicas en este evento centenario.'
      : 'Discover everything about the San Ramón Patronal Festivities 2025 from August 21-31. Handmade Art will be present with its unique crafts at this centenary event.',
    keywords: locale === 'es'
      ? ['fiestas san ramón', 'fiestas patronales 2025', 'san ramón costa rica', 'artesanías costa rica', 'handmade art', 'entrada de los santos', 'eventos culturales costa rica']
      : ['san ramon festival', 'patronal festivities 2025', 'san ramon costa rica', 'costa rica crafts', 'handmade art', 'entrance of saints', 'cultural events costa rica'],
    alternates: {
      canonical: 'https://handmadeart.com/fiestas-de-san-ramon',
    },
    openGraph: {
      title: locale === 'es' ? 'Fiestas Patronales de San Ramón 2025 | Handmade Art' : 'San Ramón Patronal Festivities 2025 | Handmade Art',
      description: locale === 'es'
        ? 'Descubre todo sobre las Fiestas Patronales de San Ramón 2025 del 21 al 31 de Agosto. Handmade Art estará presente con sus artesanías únicas en este evento centenario.'
        : 'Discover everything about the San Ramón Patronal Festivities 2025 from August 21-31. Handmade Art will be present with its unique crafts at this centenary event.',
      url: 'https://handmadeart.com/fiestas-de-san-ramon',
      siteName: 'Handmade Art',
      images: [
        {
          url: '/banner-fiestas-san-ramon.webp',
          width: 1200,
          height: 630,
          alt: locale === 'es' ? 'Fiestas Patronales de San Ramón 2025' : 'San Ramón Patronal Festivities 2025',
        },
      ],
      locale: locale === 'es' ? 'es_CR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: locale === 'es' ? 'Fiestas Patronales de San Ramón 2025 | Handmade Art' : 'San Ramón Patronal Festivities 2025 | Handmade Art',
      description: locale === 'es'
        ? 'Descubre todo sobre las Fiestas Patronales de San Ramón 2025 del 21 al 31 de Agosto. Handmade Art estará presente con sus artesanías únicas en este evento centenario.'
        : 'Discover everything about the San Ramón Patronal Festivities 2025 from August 21-31. Handmade Art will be present with its unique crafts at this centenary event.',
      images: ['/banner-fiestas-san-ramon.webp'],
    },
  };
}

export default async function FiestasSanRamonPage({ params }: { params: tParams }) {
  const { locale } = await params;
  return (
    <main className="min-h-screen text-gray-950">
      {/* Hero section with event banner */}
      <section className="relative h-64 bg-blue-900 text-white">
        <div className="container mx-auto h-full flex flex-col justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{locale === 'es' ? 'Fiestas Patronales de San Ramón 2025' : 'San Ramón Patronal Festivities 2025'}</h1>
          <p className="text-xl mb-8">{locale === 'es' ? '21 al 31 de Agosto - Celebrando 100 años de tradición' : 'August 21-31 - Celebrating 100 years of tradition'}</p>

        </div>
      </section>

      {/* Main content section */}
      <section className="py-6 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">{locale === 'es' ? 'Eventos y Actividades' : 'Events and Activities'}</h2>

        {/* Programación completa por días */}
        <div className="space-y-3">
          {/* Jueves 21 de agosto */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900 border-b pb-2">
              {locale === 'es' ? 'Jueves 21 de agosto (2025)' : 'Thursday, August 21 (2025)'}
            </h3>
            <div className="grid gap-3 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 am</span>
                <span>{locale === 'es' ? 'Santa Misa en el Centro' : 'Holy Mass at the Center'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">9:00 am</span>
                <span>{locale === 'es' ? 'Rosario por la vida • Apertura de la cocina en los Ranchos' : 'Rosary for life • Opening of kitchen at the Ranchos'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">10:00 am</span>
                <span>{locale === 'es' ? 'Hora Santa por las Embarazadas' : 'Holy Hour for Pregnant Women'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">2:00 pm</span>
                <span>{locale === 'es' ? 'Bingo Pesetero' : 'Bingo Game'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">6:00 pm</span>
                <span>{locale === 'es' ? 'Santa Misa en el Centro' : 'Holy Mass at the Center'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                <span>{locale === 'es' ? 'Bendición de ranchos y servidores • Tarima: Jeison Montero y su Banda' : 'Blessing of ranchos and servers • Stage: Jeison Montero and his Band'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">8:00 pm</span>
                <span>{locale === 'es' ? 'Exhibición Equina' : 'Equestrian Exhibition'}</span>
              </div>
            </div>
          </div>

          {/* Viernes 22 de agosto */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900 border-b pb-2">
              {locale === 'es' ? 'Viernes 22 de agosto' : 'Friday, August 22'}
            </h3>
            <div className="grid gap-3 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 am</span>
                <span>{locale === 'es' ? 'Santa Misa en el Centro' : 'Holy Mass at the Center'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">9:00 am</span>
                <span>{locale === 'es' ? 'Apertura de la cocina en los Ranchos' : 'Opening of kitchen at the Ranchos'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">4:00 pm</span>
                <span>{locale === 'es' ? 'Monchitour' : 'Monchitour'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">5:00 pm</span>
                <span>{locale === 'es' ? 'Tarima: Grupo Hermanos Varela' : 'Stage: Hermanos Varela Group'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                <span>{locale === 'es' ? 'Tarima: Show Ranchero con Gaby Arias' : 'Stage: Ranchero Show with Gaby Arias'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">8:00 pm</span>
                <span>{locale === 'es' ? 'Tarima: Grupo Los Parranderos' : 'Stage: Los Parranderos Group'}</span>
              </div>
            </div>
          </div>

          {/* Sábado 23 de agosto */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900 border-b pb-2">
              {locale === 'es' ? 'Sábado 23 de agosto' : 'Saturday, August 23'}
            </h3>
            <div className="grid gap-3 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">9:00 am</span>
                <span>{locale === 'es' ? 'Tarima: SINEM • Apertura de la cocina en los Ranchos' : 'Stage: SINEM • Opening of kitchen at the Ranchos'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">10:00 am</span>
                <span>{locale === 'es' ? 'Bingo Pesetero • Monchitour' : 'Bingo Game • Monchitour'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">11:30 am</span>
                <span>{locale === 'es' ? 'Tarima: Dance Sould Studio 21' : 'Stage: Dance Sould Studio 21'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">12:00 pm</span>
                <span>{locale === 'es' ? 'Tarima: Bingo ROES — Valor del cartón: ¢1000' : 'Stage: ROES Bingo — Card value: ¢1000'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                <span>{locale === 'es' ? 'Tarima: Noche de chicas — Priscilla Guzmán, Daysel Núñez, Hazel Alfaro, Fer Campos' : 'Stage: Girls Night — Priscilla Guzmán, Daysel Núñez, Hazel Alfaro, Fer Campos'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">8:00 pm</span>
                <span>{locale === 'es' ? 'Tarima: Grupo Retro hits' : 'Stage: Retro Hits Group'}</span>
              </div>
            </div>
          </div>

          {/* Domingo 24 de agosto */}
           <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
             <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900 border-b pb-2">
               {locale === 'es' ? 'Domingo 24 de agosto' : 'Sunday, August 24'}
             </h3>
             <div className="grid gap-3 text-sm sm:text-base">
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">10:00 am</span>
                 <span className="font-semibold text-red-600">{locale === 'es' ? 'Desfile de Boyeros desde Casa Pastoral' : 'Oxcart Parade from Pastoral House'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">12:00 pm</span>
                 <span className="font-semibold text-red-600">{locale === 'es' ? 'Pasada Desfile de Boyeros frente al templo parroquial' : 'Oxcart Parade passing in front of the parish temple'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">2:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Anny y su Show' : 'Stage: Anny and her Show'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Martinson' : 'Stage: Martinson'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">8:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Papel y Lápiz' : 'Stage: Papel y Lápiz'}</span>
               </div>
             </div>
           </div>

           {/* Lunes 25 de agosto */}
           <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
             <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900 border-b pb-2">
               {locale === 'es' ? 'Lunes 25 de agosto' : 'Monday, August 25'}
             </h3>
             <div className="grid gap-3 text-sm sm:text-base">
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">12:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: LINSA' : 'Stage: LINSA'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">2:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Grupo de danza "Promesa de la tierra" • Bingo Pesetero' : 'Stage: Dance Group "Promesa de la tierra" • Bingo Game'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">3:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Fourth Dimensión' : 'Stage: Fourth Dimensión'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">4:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Manuel Sarem' : 'Stage: Manuel Sarem'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">5:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Grupo de baile "Al son del café" y grupo de baile folclórico "Cambray"' : 'Stage: Dance Group "Al son del café" and folkloric dance group "Cambray"'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Concurso de canto ROES (alternando con el grupo Punto de Fuga)' : 'Stage: ROES Singing Contest (alternating with Punto de Fuga group)'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">8:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Arte Musical Naranjeño' : 'Stage: Arte Musical Naranjeño'}</span>
               </div>
             </div>
           </div>

           {/* Martes 26 de agosto */}
           <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
             <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900 border-b pb-2">
               {locale === 'es' ? 'Martes 26 de agosto' : 'Tuesday, August 26'}
             </h3>
             <div className="grid gap-3 text-sm sm:text-base">
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">3:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Colegio Patriarca' : 'Stage: Colegio Patriarca'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">4:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Hermanas Sandoval • Monchitour' : 'Stage: Hermanas Sandoval • Monchitour'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">5:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Grupo Coral Óleo' : 'Stage: Grupo Coral Óleo'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Rondalla CINDEA La Paz' : 'Stage: Rondalla CINDEA La Paz'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:30 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Especial de Sabina con Alejandro Oviedo y los conductores Suicidas' : 'Stage: Sabina Special with Alejandro Oviedo and los conductores Suicidas'}</span>
               </div>
             </div>
           </div>

           {/* Miércoles 27 de agosto */}
           <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
             <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900 border-b pb-2">
               {locale === 'es' ? 'Miércoles 27 de agosto' : 'Wednesday, August 27'}
             </h3>
             <div className="grid gap-3 text-sm sm:text-base">
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">10:30 am</span>
                 <span>{locale === 'es' ? 'Tarima: Presentación del Kinder El Grillito' : 'Stage: Kinder El Grillito Presentation'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">11:00 am</span>
                 <span>{locale === 'es' ? 'Tarima: Presentación del Kinder Felicita Ramirez' : 'Stage: Kinder Felicita Ramirez Presentation'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">11:30 am</span>
                 <span>{locale === 'es' ? 'Tarima: Presentación de la Escuela de Enseñanza Especial' : 'Stage: Special Education School Presentation'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">12:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Grupo Diamante Musical' : 'Stage: Grupo Diamante Musical'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">4:00 pm</span>
                 <span>{locale === 'es' ? 'Monchitour • Tarima: Mogik • Tarima: Grupo coral "Voces doradas"' : 'Monchitour • Stage: Mogik • Stage: Coral Group "Voces doradas"'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Los Tenores Griegos' : 'Stage: Los Tenores Griegos'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">8:30 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Retro Band' : 'Stage: Retro Band'}</span>
               </div>
             </div>
           </div>

           {/* Jueves 28 de agosto */}
           <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
             <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900 border-b pb-2">
               {locale === 'es' ? 'Jueves 28 de agosto' : 'Thursday, August 28'}
             </h3>
             <div className="grid gap-3 text-sm sm:text-base">
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">12:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Micrófono abierto con Tatú' : 'Stage: Open microphone with Tatú'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">4:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Show Urbano WOLFTOX • Monchitour' : 'Stage: Urban Show WOLFTOX • Monchitour'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">4:30 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Cantante Urbano Mante' : 'Stage: Urban Singer Mante'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">5:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Show Urbano Víctor Barrantes Y.Y' : 'Stage: Urban Show Víctor Barrantes Y.Y'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Grupo Musical Entre Amigos' : 'Stage: Grupo Musical Entre Amigos'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">8:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Los Hicsos' : 'Stage: Los Hicsos'}</span>
               </div>
             </div>
           </div>

           {/* Viernes 29 de agosto */}
           <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
             <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-900 border-b pb-2">
               {locale === 'es' ? 'Viernes 29 de agosto' : 'Friday, August 29'}
             </h3>
             <div className="grid gap-3 text-sm sm:text-base">
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">1:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Sabadito alegre del adulto mayor con DJNANDO' : 'Stage: Happy Saturday for seniors with DJNANDO'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">2:00 pm</span>
                 <span>{locale === 'es' ? 'Monchitour • Bingo Pesetero' : 'Monchitour • Bingo Game'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">3:30 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Concurso del Churro Gigante de Industrias Rosales' : 'Stage: Giant Churro Contest by Industrias Rosales'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Son del Puerto' : 'Stage: Son del Puerto'}</span>
               </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                 <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">8:00 pm</span>
                 <span>{locale === 'es' ? 'Tarima: Los Vargas Brothers' : 'Stage: Los Vargas Brothers'}</span>
               </div>
             </div>
           </div>

          {/* Sábado 30 de agosto - Entrada de los Santos */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-md p-4 sm:p-6 border-2 border-yellow-300">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-orange-800 border-b pb-2">
              {locale === 'es' ? 'Sábado 30 de agosto - ENTRADA DE LOS SANTOS' : 'Saturday, August 30 - ENTRANCE OF THE SAINTS'}
            </h3>
            <div className="grid gap-3 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-orange-200 text-orange-800 rounded px-2 py-1 font-bold text-xs sm:text-sm w-fit">9:00 am</span>
                <span className="font-bold text-orange-800">{locale === 'es' ? '🎉 ENTRADA DE LOS SANTOS 🎉' : '🎉 ENTRANCE OF THE SAINTS 🎉'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">11:00 am</span>
                <span>{locale === 'es' ? 'Tarima: Marimba Huetar' : 'Stage: Marimba Huetar'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">12:00 pm</span>
                <span>{locale === 'es' ? 'Tarima: Impacto Azul — "P-O-L-I-C-I-A, Policía – Policía"' : 'Stage: Impacto Azul — "P-O-L-I-C-E, Police – Police"'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                <span>{locale === 'es' ? 'Tarima: Fiesta del Acetato Neón con Álvaro Zamora' : 'Stage: Neon Acetate Party with Álvaro Zamora'}</span>
              </div>
            </div>
          </div>

          {/* Domingo 31 de agosto - Día Patronal */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-4 sm:p-6 border-2 border-blue-300">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-800 border-b pb-2">
              {locale === 'es' ? 'Domingo 31 de agosto - DÍA PATRONAL' : 'Sunday, August 31 - PATRONAL DAY'}
            </h3>
            <div className="grid gap-3 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-green-200 text-green-800 rounded px-2 py-1 font-bold text-xs sm:text-sm w-fit">6:00 am</span>
                <span className="font-semibold text-green-700">{locale === 'es' ? '🏃‍♂️ Carrera de Atletismo 12va Edición' : '🏃‍♂️ 12th Edition Athletics Race'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-purple-200 text-purple-800 rounded px-2 py-1 font-bold text-xs sm:text-sm w-fit">10:15 am</span>
                <span className="font-bold text-purple-800">{locale === 'es' ? '⛪ Procesión con San Ramón alrededor del parque MAB' : '⛪ Procession with San Ramón around MAB park'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-purple-200 text-purple-800 rounded px-2 py-1 font-bold text-xs sm:text-sm w-fit">11:00 am</span>
                <span className="font-bold text-purple-800">{locale === 'es' ? '⛪ Santa Misa Patronal — Presidio Monseñor Bartolomé Bulgués Oller' : '⛪ Patronal Holy Mass — Presided by Monsignor Bartolomé Bulgués Oller'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-medium text-xs sm:text-sm w-fit">7:00 pm</span>
                <span>{locale === 'es' ? 'Tarima: La Solución' : 'Stage: La Solución'}</span>
              </div>
            </div>
          </div>

          {/* Nota especial */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm sm:text-base text-yellow-800">
              <strong>{locale === 'es' ? 'Nota especial:' : 'Special note:'}</strong> {locale === 'es' ? 'Gran rifa del carro Toyota BZ4x, raspado de ollas y comparsa Fuerza Latina Ramonense.' : 'Grand raffle of Toyota BZ4x car, pot scratching and Fuerza Latina Ramonense parade.'}
            </p>
          </div>
        </div>

        {/* Handmade Art participation section */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-blue-900">{locale === 'es' ? 'Handmade Art en las Fiestas' : 'Handmade Art at the Festivities'}</h3>
          <p className="mb-4">
            {locale === 'es' ? 'Estaremos presentes con nuestra colección de artesanías únicas durante todos los días del evento (21-31 de Agosto), en un stand especial ubicado en la Plaza de Artesanías. Descubre piezas exclusivas inspiradas en la cultura de San Ramón, incluyendo:' : 'We will be present with our unique collection of handicrafts throughout the event (August 21-31), in a special stand located at the Crafts Plaza. Discover exclusive pieces inspired by San Ramón culture, including:'}
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>{locale === 'es' ? 'Chorreadores de café tradicionales' : 'Traditional coffee makers'}</li>
            <li>{locale === 'es' ? 'Espejos con temática nacional' : 'Nacional mirrors'}</li>
            <li>{locale === 'es' ? 'Instrumentos musicales artesanales como ukelele y mandolina' : 'Artisanal musical instruments such as ukelele and mandolin'}</li>
            <li>{locale === 'es' ? 'Ediciones únicas para coleccionistas' : 'Unique editions for collectors'}</li>
          </ul>
          <p className="font-medium text-blue-800">
            {locale === 'es' ? '¡Handmade Art te espera con sorpresas especiales y descuentos exclusivos durante las fiestas!' : 'Handmade Art awaits you with special surprises and exclusive discounts during the festivities!'}
          </p>
        </div>

        {/* Location and contact section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-blue-900">{locale === 'es' ? 'Ubicación y Contacto' : 'Location and Contact'}</h3>
          <p className="mb-4">
            {locale === 'es' ? 'Las Fiestas Patronales se realizan en el centro de San Ramón, Alajuela, Costa Rica. Nuestro stand de Handmade Art estará ubicado en la Plaza de Artesanías, frente al Parque Central.' : 'The Patronal Festivities take place in downtown San Ramón, Alajuela, Costa Rica. Our Handmade Art stand will be located at the Crafts Plaza, in front of Central Park.'}
          </p>
          <p>
            {locale === 'es' ? 'Horario: 9:00 AM - 9:00 PM (21-31 de Agosto)' : 'Hours: 9:00 AM - 9:00 PM (August 21-31)'}
            <br />
            {locale === 'es' ? 'Contacto: ' : 'Contact: '}
            <a href="mailto:info@handmadeart.store" className="text-blue-600 hover:text-blue-800 underline">
              info@handmadeart.store
            </a>
            {' | '}
            <a 
              href="https://wa.me/50684237555" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-green-600 hover:text-green-800 underline"
            >
              +506 8423 7555
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}