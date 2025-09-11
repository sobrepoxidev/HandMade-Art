import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { buildMetadata } from '@/lib/metadata';
import type { Metadata } from "next";
type tParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  
  const pageTitle = currentLocale === 'es' ? 'Sobre Hand Made Art' : 'About Hand Made Art';

  return buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/about`,
    title: pageTitle,
  });
}

export default async function About({ params }: { params: tParams }) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-16">
            {/* Text Content */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
              <span className="inline-block mb-4 rounded-full bg-teal-100 px-4 py-1 text-sm font-medium text-teal-700">
                {locale === "es" ? "Nuestra misión" : "Our mission"}
              </span>
              <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                {locale === "es" ? "Sobre HandMade Art" : "About HandMade Art"}
              </h1>
              <p className="mb-2 sm:mb-8 text-lg text-gray-600">
                {locale === "es" ? "En HandMade Art nos apasiona promover y preservar las tradiciones artesanales. Nuestro objetivo es brindar un espacio en línea donde los artistas y artesanos privados de libertad puedan mostrar y vender sus creaciones únicas." : "At HandMade Art, we are passionate about promoting and preserving traditional crafts. Our goal is to provide an online platform where artists and artisans incarcerated can showcase and sell their unique creations."}
              </p>
              <div className="flex flex-col items-center justify-center sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="rounded-md bg-teal-600 px-6 py-3 text-white shadow transition hover:bg-teal-700 flex items-center justify-center gap-1"
                >
                  Explorar productos
                </Link>
              </div>
            </div>

            {/* Image placement */}
            <div className="aspect-[1500/1574] flex flex-col items-center justify-center sm:mt-7 mb-3">
              <Image
                src="/about/smoke.webp"
                alt="Artesanos trabajando"
                width={350}
                height={0}
                className="object-cover items-center justify-center lg:transform lg:rotate-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-8 pb-4 lg:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === "es" ? "Tradición y Arte" : "Tradition and Art"}
              </h3>
              <p className="text-gray-600">
                {locale === "es" ? "Explora nuestra amplia selección de artesanías hechas a mano en madera, barro, cerámica, tela y muchos otros materiales. Cada pieza es única y refleja la creatividad y habilidad de nuestros talentosos artesanos." : "Explore our wide selection of handmade crafts made of wood, clay, ceramics, fabric and many other materials. Each piece is unique and reflects the creativity and skill of our talented artisans."}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === "es" ? "Impacto Social" : "Social Impact"}
              </h3>
              <p className="text-gray-600">
                {locale === "es" ? "Cada compra que realices en nuestro sitio web apoya directamente a estos talentosos individuos y contribuye a mantener viva la artesanía tradicional." : "Every purchase you make on our website directly supports these talented individuals and helps preserve traditional craftsmanship."}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {locale === "es" ? "Calidad y Autenticidad" : "Quality and Authenticity"}
              </h3>
              <p className="text-gray-600">
                {locale === "es" ? "Todas nuestras piezas son creadas con el más alto nivel de artesanía y cuidado, garantizando productos únicos y de calidad." : "All our pieces are created with the highest level of craftsmanship and care, ensuring unique and high-quality products."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historia de la Iniciativa */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{locale === "es" ? "Nuestra Historia" : "Our History"}</h2>
            <div className="mt-2 h-1 w-24 bg-teal-600 mx-auto"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
              <Image
                src="/creators.webp"
                alt="Fundadores de Hand Made Art"
                width={500}
                height={0}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <p className="text-gray-700 mb-4">
                {locale === "es" ? "HandMade Art nació en 2018 como una idea entre amigos con una visión compartida: crear oportunidades para personas privadas de libertad a través del arte y la artesanía." : "HandMade Art was born in 2018 as an idea between friends with a shared vision: creating opportunities for incarcerated individuals through art and craftsmanship."}
              </p>
              <p className="text-gray-700 mb-4">
                {locale === "es" ? "Lo que comenzó como un pequeño proyecto con apenas cinco artesanos, ha crecido hasta convertirse en una plataforma que representa a más de cincuenta creadores talentosos, cada uno con su historia única y habilidades extraordinarias." : "What started as a small project with just five artisans has grown to become a platform representing more than fifty talented creators, each with their own unique story and extraordinary skills."}
              </p>
              <p className="text-gray-700">
                {locale === "es" ? "A lo largo de los años, hemos establecido alianzas estratégicas con instituciones penitenciarias, organizaciones sin fines de lucro y empresas comprometidas con la responsabilidad social, expandiendo nuestro alcance y fortaleciendo nuestro impacto." : "Over the years, we have established strategic alliances with prisons, non-profit organizations, and socially responsible companies, expanding our reach and strengthening our impact."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{locale === "es" ? "Misión, Visión y Valores" : "Mission, Vision and Values"}</h2>
            <div className="mt-2 h-1 w-24 bg-teal-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Misión */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-4">Misión</h3>
              <p className="text-gray-600 text-center">
                {locale === "es" ? "Proporcionar una plataforma que conecte el talento artesanal de personas privadas de libertad con un mercado que valore la autenticidad, calidad y la historia detrás de cada creación, contribuyendo a su reinserción social y económica." : "Provide a platform that connects the artisanal talent of incarcerated individuals with a market that values authenticity, quality, and the history behind each creation, contributing to their social and economic reintegration."}
              </p>
            </div>
            
            {/* Visión */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-4">Visión</h3>
              <p className="text-gray-600 text-center">
                {locale === "es" ? "Ser reconocidos como el principal referente en la promoción y comercialización de artesanías creadas por personas en proceso de reinserción, cambiando perspectivas y construyendo puentes entre diferentes realidades sociales." : "To be recognized as the principal reference in the promotion and commercialization of crafts created by individuals in the process of reintegration, changing perspectives and building bridges between different social realities."}
              </p>
            </div>
            
            {/* Valores */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-4">{locale === "es" ? "Valores" : "Values"}</h3>
              <ul className="text-gray-600">
                <li className="mb-2">• <strong>{locale === "es" ? "Dignidad" : "Dignity"}</strong>: {locale === "es" ? "Reconocemos el valor inherente de cada persona." : "We recognize the inherent value of each person."}</li>
                <li className="mb-2">• <strong>{locale === "es" ? "Transparencia" : "Transparency"}</strong>: {locale === "es" ? "Operamos con honestidad en todos los aspectos." : "We operate with honesty in all aspects."}</li>
                <li className="mb-2">• <strong>{locale === "es" ? "Calidad" : "Quality"}</strong>: {locale === "es" ? "Exigimos excelencia en cada pieza artesanal." : "We demand excellence in every artisanal piece."}</li>
                <li className="mb-2">• <strong>{locale === "es" ? "Inclusión" : "Inclusion"}</strong>: {locale === "es" ? "Creemos en segundas oportunidades para todos." : "We believe in second chances for everyone."}</li>
                <li>• <strong>{locale === "es" ? "Sostenibilidad" : "Sustainability"}</strong>: {locale === "es" ? "Trabajamos por un impacto duradero." : "We work for a lasting impact."}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{locale === "es" ? "Nuestro Equipo" : "Our Team"}</h2>
            <div className="mt-2 h-1 w-24 bg-teal-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {locale === "es" ? "Conozca a las personas comprometidas que hacen posible HandMade Art, un equipo multidisciplinario unido por el compromiso social." : "Meet the committed individuals who make HandMade Art possible, a multidisciplinary team united by social commitment."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="relative mx-auto w-40 h-40 rounded-full overflow-hidden mb-4">
                <Image
                    src="/home/face-m.webp"
                  alt="Directora Ejecutiva"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{locale === "es" ? "Mauricio Castro" : "Mauricio Castro"}</h3>
              <p className="text-gray-600">{locale === "es" ? "Director Ejecutivo" : "Executive Director"}</p>
              <p className="mt-2 text-sm text-gray-500">
                {locale === "es" ? "Fundador con 20 años de experiencia en emprendimientos sociales y desarrollo comunitario." : "Founder with 20 years of experience in social entrepreneurship and community development."}
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="relative mx-auto w-40 h-40 rounded-full overflow-hidden mb-4">
                <Image
                    src="/home/face-m.webp"
                  alt="Director Creativo"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{locale === "es" ? "Romny Castro" : "Romny Castro"}</h3>
              <p className="text-gray-600">{locale === "es" ? "Director de Operaciones" : "Operations Director"}</p>
              <p className="mt-2 text-sm text-gray-500">
                {locale === "es" ? "Director de Operaciones con 15 años de experiencia en gestión de proyectos y operaciones." : "Operations Director with 15 years of experience in project and operations management."}
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="relative mx-auto w-40 h-40 rounded-full overflow-hidden mb-4">
                <Image
                  src="/home/face-m.webp"
                  alt="Coordinadora de Programas"
                  width={160}
                  height={160}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{locale === "es" ? "Bryam López" : "Bryam López"}</h3>
              <p className="text-gray-600">{locale === "es" ? "Encargado área de IT" : "IT Manager"}</p>
              <p className="mt-2 text-sm text-gray-500">
                {locale === "es" ? "Encargado del área de IT con 2 años de experiencia en desarrollo web y software." : "IT Manager with 2 years of experience in web and software development."}
              </p>
            </div>
            
            
          </div>
        </div>
      </section>

      {/* Proceso de Trabajo */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{locale === "es" ? "Nuestro Proceso de Trabajo" : "Our Working Process"}</h2>
            <div className="mt-2 h-1 w-24 bg-teal-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {locale === "es" ? "Así es como trabajamos con nuestros artesanos para llevar sus creaciones desde los talleres hasta tu hogar." : "This is how we work with our artisans to bring their creations from the workshops to your home."}
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-teal-200"></div>
            
            {/* Step 1 */}
            <div className="relative mb-16">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-12 text-center md:text-right">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{locale === "es" ? "Capacitación" : "Training"}</h3>
                  <p className="text-gray-600">
                    {locale === "es" ? "Proporcionamos talleres de formación en diversas técnicas artesanales, facilitados por maestros artesanos y profesionales." : "We provide training workshops in various artisanal techniques, facilitated by master artisans and professionals."}
                  </p>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-teal-500 text-white font-bold">1</div>
                <div className="w-full md:w-1/2 md:pl-12 text-center md:text-left">
                  <Image
                    src="/img.webp"
                    alt="Capacitación de artesanos"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md mx-auto md:mx-0"
                  />
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative mb-16">
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pl-12 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{locale === "es" ? "Producción" : "Production"}</h3>
                  <p className="text-gray-600">
                    {locale === "es" ? "Los artesanos crean sus piezas en talleres dentro de los centros penitenciarios, con materiales y herramientas proporcionados por nuestro programa." : "Artisans create their pieces in workshops within prisons, with materials and tools provided by our program."}
                  </p>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-teal-500 text-white font-bold">2</div>
                <div className="w-full md:w-1/2 md:pr-12 text-center md:text-right">
                  <Image
                    src="/img.webp"
                    alt="Producción de artesanías"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md mx-auto md:ml-auto md:mr-0"
                  />
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative mb-16">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-12 text-center md:text-right">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{locale === "es" ? "Control de Calidad" : "Quality Control"}</h3>
                  <p className="text-gray-600">
                    {locale === "es" ? "Cada pieza es evaluada rigurosamente para garantizar los más altos estándares de calidad y autenticidad." : "Each piece is evaluated rigorously to ensure the highest standards of quality and authenticity."}
                  </p>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-teal-500 text-white font-bold">3</div>
                <div className="w-full md:w-1/2 md:pl-12 text-center md:text-left">
                  <Image
                    src="/img.webp"
                    alt="Control de calidad"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md mx-auto md:mx-0"
                  />
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pl-12 text-center md:text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{locale === "es" ? "Comercialización" : "Commercialization"}</h3>
                  <p className="text-gray-600">
                    {locale === "es" ? "Fotografiamos, catalogamos y presentamos cada pieza en nuestra plataforma online, conectando el trabajo de los artesanos con clientes de todo el mundo." : "We photograph, catalog, and present each piece on our online platform, connecting artisans' work with customers worldwide."}
                  </p>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-teal-500 text-white font-bold">4</div>
                <div className="w-full md:w-1/2 md:pr-12 text-center md:text-right">
                  <Image
                    src="/img.webp"
                    alt="Comercialización de productos"
                    width={300}
                    height={200}
                    className="rounded-lg shadow-md mx-auto md:ml-auto md:mr-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-teal-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">{locale === "es" ? "Únete a Nuestra Misión" : "Join Our Mission"}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {locale === "es" ? "Al comprar nuestras artesanías, no solo adquieres una pieza única y hermosa, sino que contribuyes directamente a la transformación de vidas." : "By purchasing our artisanal pieces, you don't just acquire a unique and beautiful piece, but you directly contribute to the transformation of lives."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/products"
              className="rounded-md bg-white text-teal-700 px-6 py-3 shadow transition hover:bg-gray-100 font-medium"
            >
              {locale === "es" ? "Explorar Productos" : "Explore Products"}
            </Link>
            <Link
              href="/impact"
              className="rounded-md bg-transparent border-2 border-white px-6 py-3 transition hover:bg-teal-600 font-medium"
            >
              {locale === "es" ? "Conocer Nuestro Impacto" : "Learn Our Impact"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}