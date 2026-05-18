import { Link } from '@/i18n/navigation';
import { Facebook, Instagram, Phone, Mail, ExternalLink, Youtube } from 'lucide-react';

export default function Footer({ locale }: { locale: string }) {
  return (
    <footer className="bg-[#1A1A1A] text-[#F5F1EB] pt-16 pb-10 px-4 border-t border-[#C9A962]/20">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
          {/* Brand block — wider, editorial */}
          <div className="md:col-span-4 space-y-5">
            <Link
              href="/"
              aria-label={locale === 'es' ? 'Handmade Art — inicio' : 'Handmade Art — home'}
              className="inline-block group"
            >
              <span className="font-display text-2xl text-[#F5F1EB] tracking-[-0.005em]">
                Handmade <span className="text-[#C9A962]">Art</span>
              </span>
            </Link>
            <p className="text-[#B5AC9D] text-[14px] leading-relaxed max-w-sm">
              {locale === 'es'
                ? 'Piezas únicas talladas a mano en Costa Rica. Cada compra apoya un programa de reinserción social y laboral.'
                : 'One-of-a-kind pieces hand-carved in Costa Rica. Every purchase supports a social and labor reintegration program.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span aria-hidden className="block w-8 h-px bg-[#C9A962]/60" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#C9A962]/80">
                {locale === 'es' ? 'San Ramón · Costa Rica' : 'San Ramón · Costa Rica'}
              </span>
            </div>
          </div>

          {/* Contact */}
          <nav
            aria-label={locale === 'es' ? 'Contacto' : 'Contact'}
            className="md:col-span-3"
          >
            <h2 className="font-display text-base text-[#F5F1EB] mb-4 tracking-[-0.005em]">
              {locale === 'es' ? 'Contacto' : 'Contact'}
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@handmadeart.store"
                  className="inline-flex items-center text-[#B5AC9D] hover:text-[#C9A962] transition-colors duration-200 group"
                >
                  <Mail className="w-4 h-4 mr-2.5 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                  <span className="text-[13.5px]">info@handmadeart.store</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+50684237555"
                  className="inline-flex items-center text-[#B5AC9D] hover:text-[#C9A962] transition-colors duration-200 group"
                >
                  <Phone className="w-4 h-4 mr-2.5 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                  <span className="text-[13.5px] tabular-nums">+506 8423 7555</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Links */}
          <nav
            aria-label={locale === 'es' ? 'Enlaces' : 'Links'}
            className="md:col-span-2"
          >
            <h2 className="font-display text-base text-[#F5F1EB] mb-4 tracking-[-0.005em]">
              {locale === 'es' ? 'Tienda' : 'Shop'}
            </h2>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link href="/products" className="text-[#B5AC9D] hover:text-[#C9A962] transition-colors duration-200">
                  {locale === 'es' ? 'Catálogo' : 'Catalog'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#B5AC9D] hover:text-[#C9A962] transition-colors duration-200">
                  {locale === 'es' ? 'Nuestra historia' : 'Our story'}
                </Link>
              </li>
              <li>
                <Link href="/reinsercion-sociolaboral" className="text-[#B5AC9D] hover:text-[#C9A962] transition-colors duration-200">
                  {locale === 'es' ? 'Reinserción social' : 'Social impact'}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-[#B5AC9D] hover:text-[#C9A962] transition-colors duration-200">
                  {locale === 'es' ? 'Envíos' : 'Shipping'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#B5AC9D] hover:text-[#C9A962] transition-colors duration-200">
                  {locale === 'es' ? 'Contacto' : 'Contact'}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal */}
          <nav
            aria-label={locale === 'es' ? 'Legal' : 'Legal'}
            className="md:col-span-1"
          >
            <h2 className="font-display text-base text-[#F5F1EB] mb-4 tracking-[-0.005em]">
              {locale === 'es' ? 'Legal' : 'Legal'}
            </h2>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link href="/privacy-policies" className="text-[#B5AC9D] hover:text-[#C9A962] transition-colors duration-200">
                  {locale === 'es' ? 'Privacidad' : 'Privacy'}
                </Link>
              </li>
              <li>
                <Link href="/conditions-service" className="text-[#B5AC9D] hover:text-[#C9A962] transition-colors duration-200">
                  {locale === 'es' ? 'Términos' : 'Terms'}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div className="md:col-span-2">
            <h2 className="font-display text-base text-[#F5F1EB] mb-4 tracking-[-0.005em]">
              {locale === 'es' ? 'Síguenos' : 'Follow us'}
            </h2>
            <ul className="flex flex-wrap gap-2.5">
              <li>
                <a
                  href="https://www.facebook.com/share/1Au8nNA2ho/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="grid place-items-center w-11 h-11 bg-[#2D2D2D] hover:bg-[#C9A962] rounded-sm transition-colors duration-200 group border border-[#C9A962]/20 hover:border-[#C9A962]"
                >
                  <Facebook className="w-4 h-4 text-[#C9A962] group-hover:text-[#1A1A1A] transition-colors" strokeWidth={1.5} aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/handmadeart.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid place-items-center w-11 h-11 bg-[#2D2D2D] hover:bg-[#C9A962] rounded-sm transition-colors duration-200 group border border-[#C9A962]/20 hover:border-[#C9A962]"
                >
                  <Instagram className="w-4 h-4 text-[#C9A962] group-hover:text-[#1A1A1A] transition-colors" strokeWidth={1.5} aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@handmadeart.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="grid place-items-center w-11 h-11 bg-[#2D2D2D] hover:bg-[#C9A962] rounded-sm transition-colors duration-200 group border border-[#C9A962]/20 hover:border-[#C9A962]"
                >
                  <svg className="w-4 h-4 text-[#C9A962] group-hover:text-[#1A1A1A] transition-colors" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.93a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04.64z" fill="currentColor" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@handmadeartcr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="grid place-items-center w-11 h-11 bg-[#2D2D2D] hover:bg-[#C9A962] rounded-sm transition-colors duration-200 group border border-[#C9A962]/20 hover:border-[#C9A962]"
                >
                  <Youtube className="w-4 h-4 text-[#C9A962] group-hover:text-[#1A1A1A] transition-colors" strokeWidth={1.5} aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/50684237555"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={locale === 'es' ? 'WhatsApp (abre en nueva ventana)' : 'WhatsApp (opens in new window)'}
                  className="grid place-items-center w-11 h-11 bg-[#2D2D2D] hover:bg-[#25D366] rounded-sm transition-colors duration-200 group border border-[#C9A962]/20 hover:border-[#25D366]"
                >
                  <svg className="w-4 h-4 text-[#C9A962] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Hairline divider */}
        <div className="w-full h-px bg-[#C9A962]/20 mt-14 mb-6" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px]">
          <p className="text-[#B5AC9D]/80">
            © {new Date().getFullYear()} Handmade Art.{' '}
            <span className="text-[#B5AC9D]/60">
              {locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
            </span>
          </p>
          <p className="text-[#B5AC9D]/60 flex flex-wrap items-center gap-1.5">
            {locale === 'es' ? 'Desarrollado por' : 'Built by'}
            <Link
              href="https://sobrepoxi.com"
              target="_blank"
              rel="author noopener noreferrer"
              className="text-[#A08848] hover:text-[#C9A962] transition-colors inline-flex items-center gap-1"
            >
              Sobrepoxi
              <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.75} aria-hidden />
            </Link>
            ·
            <Link
              href="https://portfolio-bryam.vercel.app/"
              target="_blank"
              rel="author noopener noreferrer"
              className="text-[#B5AC9D] hover:text-[#F5F1EB] transition-colors inline-flex items-center gap-1"
            >
              Bryam López
              <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.75} aria-hidden />
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
