import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type tParams = Promise<{ locale: string }>;
export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  
  const pageTitle = currentLocale === 'es' ? 'Handmade Art en DMNTS Edición 8 | Emprendimiento Social' : 'Handmade Art in DMNTS Edition 8 | Social Entrepreneurship';
  const pageDescription = currentLocale === 'es' 
    ? 'Handmade Art participa en DMNTS Edición 8 para impulsar el Proyecto de Ley 24870 sobre reinserción sociolaboral en Costa Rica'
    : 'Handmade Art participates in DMNTS Edition 8 to promote Law Project 24870 on social and labor reintegration in Costa Rica';

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/dmnts`,
    title: pageTitle,
    description: pageDescription,
  });
}

export default async function DMNTSPage({ params }: { params: tParams }) {
  const { locale } = await params;
  const isSpanish = locale === 'es';

  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Banner principal */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 rounded-xl overflow-hidden">
          <Image 
            src="/dmnts/banner.webp" 
            alt={isSpanish ? "Handmade Art en DMNTS Edición 8" : "Handmade Art in DMNTS Edition 8"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {isSpanish ? "Handmade Art en DMNTS" : "Handmade Art in DMNTS"}
              </h1>
              <p className="text-lg md:text-xl">
                {isSpanish ? "Edición 8 - Teletica" : "Edition 8 - Teletica"}
              </p>
            </div>
          </div>
        </div>

        {/* Introducción */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">
            {isSpanish ? "Nuestra participación en DMNTS" : "Our participation in DMNTS"}
          </h2>
          <p className="text-lg mb-4">
            {isSpanish 
              ? "Handmade Art ha sido seleccionado para participar en la octava edición de DMNTS, el programa de emprendimiento más importante de Costa Rica transmitido por Teletica. Esta plataforma nos brinda la oportunidad de dar visibilidad a nuestro proyecto de reinserción sociolaboral y buscar alianzas estratégicas para impulsar el Proyecto de Ley 24870." 
              : "Handmade Art has been selected to participate in the eighth edition of DMNTS, Costa Rica's most important entrepreneurship program broadcast by Teletica. This platform gives us the opportunity to give visibility to our social reintegration project and seek strategic alliances to promote Law Project 24870."}
          </p>
          <p className="text-lg">
            {isSpanish 
              ? "Con más de 120 emprendimientos inscritos en esta edición, estamos orgullosos de formar parte de los proyectos seleccionados para mostrar nuestro impacto social y modelo de negocio sostenible." 
              : "With more than 120 ventures registered in this edition, we are proud to be among the projects selected to showcase our social impact and sustainable business model."}
          </p>
        </section>

        {/* Por qué participamos */}
        <section className="mb-12 bg-blue-50 p-6 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">
            {isSpanish ? "¿Por qué participamos?" : "Why are we participating?"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                {isSpanish ? "Visibilidad para el Proyecto de Ley 24870" : "Visibility for Law Project 24870"}
              </h3>
              <p className="mb-4">
                {isSpanish 
                  ? "DMNTS nos ofrece una plataforma nacional para dar a conocer la importancia del Proyecto de Ley 24870 sobre reinserción sociolaboral de personas en situación de vulnerabilidad." 
                  : "DMNTS offers us a national platform to raise awareness about the importance of Law Project 24870 on social and labor reintegration of people in vulnerable situations."}
              </p>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                {isSpanish ? "Formación y mentoría" : "Training and mentoring"}
              </h3>
              <p>
                {isSpanish 
                  ? "El programa nos brinda acceso a formación estratégica y mentoría de expertos que nos ayudarán a fortalecer nuestro modelo de negocio y maximizar nuestro impacto social." 
                  : "The program gives us access to strategic training and expert mentoring that will help us strengthen our business model and maximize our social impact."}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                {isSpanish ? "Alianzas estratégicas" : "Strategic alliances"}
              </h3>
              <p className="mb-4">
                {isSpanish 
                  ? "Buscamos establecer alianzas con actores clave del ecosistema emprendedor y social de Costa Rica para ampliar el alcance de nuestros programas de reinserción." 
                  : "We seek to establish alliances with key players in Costa Rica's entrepreneurial and social ecosystem to expand the reach of our reintegration programs."}
              </p>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                {isSpanish ? "Inversión para crecer" : "Investment to grow"}
              </h3>
              <p>
                {isSpanish 
                  ? "DMNTS ha impulsado inversiones por más de $550,000 en emprendimientos. Buscamos atraer inversión para expandir nuestros talleres de capacitación y crear más oportunidades laborales." 
                  : "DMNTS has driven investments of more than $550,000 in ventures. We seek to attract investment to expand our training workshops and create more job opportunities."}
              </p>
            </div>
          </div>
        </section>

        {/* Nuestro proyecto */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">
            {isSpanish ? "Nuestro proyecto en DMNTS" : "Our project in DMNTS"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <div className="text-3xl mb-2 text-blue-600">1</div>
              <h3 className="text-xl font-semibold mb-2">
                {isSpanish ? "Modelo de negocio sostenible" : "Sustainable business model"}
              </h3>
              <p>
                {isSpanish 
                  ? "Presentamos un modelo que combina la venta de artesanías de alta calidad con programas de capacitación y reinserción social." 
                  : "We present a model that combines the sale of high-quality handicrafts with training and social reintegration programs."}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <div className="text-3xl mb-2 text-blue-600">2</div>
              <h3 className="text-xl font-semibold mb-2">
                {isSpanish ? "Impacto social medible" : "Measurable social impact"}
              </h3>
              <p>
                {isSpanish 
                  ? "Demostramos cómo nuestros talleres han impactado positivamente en la vida de personas en situación de vulnerabilidad." 
                  : "We demonstrate how our workshops have positively impacted the lives of people in vulnerable situations."}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <div className="text-3xl mb-2 text-blue-600">3</div>
              <h3 className="text-xl font-semibold mb-2">
                {isSpanish ? "Escalabilidad del proyecto" : "Project scalability"}
              </h3>
              <p>
                {isSpanish 
                  ? "Presentamos nuestra visión para expandir el modelo a más comunidades y beneficiar a más personas en todo el país." 
                  : "We present our vision to expand the model to more communities and benefit more people throughout the country."}
              </p>
            </div>
          </div>
          <div className="relative w-full h-64 rounded-xl overflow-hidden">
            <Image 
              src="/dmnts/proyecto.webp" 
              alt={isSpanish ? "Proyecto Handmade Art en DMNTS" : "Handmade Art Project in DMNTS"}
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Por qué queremos ganar */}
        <section className="mb-12 bg-blue-50 p-6 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">
            {isSpanish ? "¿Por qué queremos ganar?" : "Why do we want to win?"}
          </h2>
          <p className="text-lg mb-4">
            {isSpanish 
              ? "Ganar DMNTS significaría mucho más que un reconocimiento para Handmade Art. Representaría una victoria para todas las personas en situación de vulnerabilidad que buscan una segunda oportunidad a través de la reinserción sociolaboral." 
              : "Winning DMNTS would mean much more than recognition for Handmade Art. It would represent a victory for all people in vulnerable situations who are seeking a second chance through social and labor reintegration."}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                {isSpanish ? "Impulso al Proyecto de Ley 24870" : "Boost to Law Project 24870"}
              </h3>
              <p>
                {isSpanish 
                  ? "El reconocimiento nos ayudaría a generar mayor apoyo político y social para la aprobación del Proyecto de Ley 24870, fundamental para institucionalizar los programas de reinserción." 
                  : "The recognition would help us generate greater political and social support for the approval of Law Project 24870, essential to institutionalize reintegration programs."}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                {isSpanish ? "Expansión de talleres" : "Workshop expansion"}
              </h3>
              <p>
                {isSpanish 
                  ? "Los recursos obtenidos nos permitirían expandir nuestros talleres de capacitación a más centros penitenciarios y comunidades vulnerables en todo Costa Rica." 
                  : "The resources obtained would allow us to expand our training workshops to more prisons and vulnerable communities throughout Costa Rica."}
              </p>
            </div>
          </div>
        </section>

        {/* Cómo apoyarnos */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-700">
            {isSpanish ? "¿Cómo puedes apoyarnos?" : "How can you support us?"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">📺</div>
              <h3 className="text-xl font-semibold mb-2">
                {isSpanish ? "Míranos en TD+2" : "Watch us on TD+2"}
              </h3>
              <p>
                {isSpanish 
                  ? "Sintoniza DMNTS todos los jueves a las 8:00 p.m. por TD+2 y apoya nuestro proyecto con tu voto." 
                  : "Tune in to DMNTS every Thursday at 8:00 p.m. on TD+2 and support our project with your vote."}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-xl font-semibold mb-2">
                {isSpanish ? "Síguenos en redes" : "Follow us on social media"}
              </h3>
              <p>
                {isSpanish 
                  ? "Sigue nuestras redes sociales y las de @dementescr para estar al tanto de nuestro progreso y compartir nuestro mensaje." 
                  : "Follow our social media and @dementescr to stay updated on our progress and share our message."}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-xl font-semibold mb-2">
                {isSpanish ? "Forma alianzas" : "Form alliances"}
              </h3>
              <p>
                {isSpanish 
                  ? "Si representas una empresa o institución, contáctanos para explorar posibles alianzas que impulsen la reinserción sociolaboral." 
                  : "If you represent a company or institution, contact us to explore possible alliances that promote social and labor reintegration."}
              </p>
            </div>
          </div>
        </section>

        {/* Llamado a la acción */}
        <section className="bg-blue-600 text-white p-8 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {isSpanish ? "Juntos podemos hacer la diferencia" : "Together we can make a difference"}
          </h2>
          <p className="text-lg mb-6">
            {isSpanish 
              ? "Tu apoyo es fundamental para que Handmade Art pueda seguir transformando vidas a través del arte y la capacitación." 
              : "Your support is essential for Handmade Art to continue transforming lives through art and training."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/reinsercion-sociolaboral"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {isSpanish ? "Conoce nuestro proyecto de reinserción" : "Learn about our reintegration project"}
            </Link>
            <a 
              href="https://www.instagram.com/handmadeart.store" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              {isSpanish ? "Síguenos en Instagram" : "Follow us on Instagram"}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}