import { Link } from '@/i18n/navigation';
import { Facebook, Instagram, Phone, Mail, ExternalLink, Youtube, Heart } from 'lucide-react';

export default function Footer({ locale }: { locale: string }) {
  return (
    <footer className="bg-[#303030] text-white py-12 px-4 border-t-4 border-teal-500">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-teal-500 mr-2" />
              <span className="text-2xl font-bold">HandMade&nbsp;</span>
              <span className="text-2xl font-bold text-[#B55327]">Art</span>
            </div>
            <p className="text-gray-300 text-sm">
              {locale === 'es'
                ? 'Artesanía hecha a mano con amor y dedicación en Costa Rica'
                : 'Handcrafted with love and dedication in Costa Rica'}
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">
              {locale === 'es' ? 'Contacto' : 'Contact'}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@handmadeart.store"
                  className="flex items-center text-gray-300 hover:text-teal-400 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2 text-teal-500" />
                  info@handmadeart.store
                </a>
              </li>
              <li>
                <a
                  href="tel:+50684237555"
                  className="flex items-center text-gray-300 hover:text-teal-400 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2 text-teal-500" />
                  +506 8423 7555
                </a>
              </li>
            </ul>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">
              {locale === 'es' ? 'Enlaces' : 'Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-teal-400 transition-colors">
                  {locale === 'es' ? 'Productos' : 'Products'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-teal-400 transition-colors">
                  {locale === 'es' ? 'Nosotros' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-teal-400 transition-colors">
                  {locale === 'es' ? 'Contacto' : 'Contact'}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policies" className="text-gray-300 hover:text-teal-400 transition-colors">
                  {locale === 'es' ? 'Políticas de Privacidad' : 'Privacy Policies'}
                </Link>
              </li>
              <li>
                <Link href="/conditions-service" className="text-gray-300 hover:text-teal-400 transition-colors">
                  {locale === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">
              {locale === 'es' ? 'Síguenos' : 'Follow Us'}
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/share/1Au8nNA2ho/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3b5998] hover:bg-[#4c70ba] p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/handmadeart.store"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@handmadeart.store"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-800 p-2 rounded-full transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.93a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04.64z" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@handmadeartcr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ff0000] hover:bg-[#cc0000] p-2 rounded-full transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/50684237555"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#128C7E] p-2 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                </svg>
              </a>
            </div>
          </div>
        </div>


        <div className="border-t border-gray-700 mt-12 pt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">
            © {new Date().getFullYear()} HandMade Art. {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
          <p className="text-[.50rem] text-gray-500 flex flex-wrap items-center justify-center gap-1">
            {locale === 'es' ? 'Desarrollado por ' : 'Developed by '}
            <Link
              href="https://sobrepoxi.com"
              target="_blank"
              rel="author noopener noreferrer"
              className="font-semibold text-teal-400 hover:underline inline-flex items-center gap-1"
            >
              Sobrepoxi
              <ExternalLink className="w-3 h-3 text-teal-400" />
            </Link>
            {locale === 'es' ? ' — Desarrollador: ' : ' — Developer: '}
            <Link
              href="https://portfolio-bryam.vercel.app/"
              target="_blank"
              rel="author noopener noreferrer"
              className="text-teal-300 hover:underline inline-flex items-center gap-1"
            >
              Bryam López
              <ExternalLink className="w-3 h-3 text-teal-300" />
            </Link>
          </p>
        </div>

      </div>
    </footer>
  );
}
