import { Link } from '@/i18n/navigation';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { getCategoryById, PRIMARY_NAV_CATEGORY_IDS } from '@/lib/content/categories';
import { PILLARS, getPillarPath } from '@/lib/content/pillars';

export default function Footer({ locale }: { locale: string }) {
  const localeKey: 'es' | 'en' = locale === 'es' ? 'es' : 'en';
  const primaryNav = PRIMARY_NAV_CATEGORY_IDS
    .map((id) => getCategoryById(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const englishSiteHref = locale === 'es' ? 'https://handmadeart.store/en' : 'https://artehechoamano.com/es';
  const englishSiteLabel = locale === 'es' ? 'English site' : 'Sitio en español';

  return (
    <footer className="bg-[#0F0C0A] text-[#C9BBA5] pt-16 pb-8 px-4 border-t border-[#3A2E24]">
      <div className="container mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          {/* Brand block */}
          <div className="space-y-5">
            <Link
              href="/"
              aria-label={locale === 'es' ? 'Handmade Art — inicio' : 'Handmade Art — home'}
              className="inline-block group"
            >
              <span className="font-display text-[32px] text-[#F1E7D6] tracking-[-0.005em]">
                Handmade Art
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed max-w-sm">
              {locale === 'es'
                ? 'Arte costarricense hecho a mano por artesanos de un programa de reinserción social. Taller en San Ramón, Alajuela. Envíos a todo el país y al exterior.'
                : 'Costa Rican handmade art made by artisans in a social reintegration program. Workshop in San Ramón, Alajuela. Shipping nationwide and abroad.'}
            </p>
            <span aria-hidden className="block w-12 h-[3px] bg-[#E0A83A]" />

            <ul className="flex flex-wrap gap-2.5 pt-1">
              <li>
                <a
                  href="https://www.facebook.com/share/1Au8nNA2ho/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="grid place-items-center w-11 h-11 bg-[#1E1813] hover:bg-[#E0A83A] rounded-sm transition-colors duration-200 group border border-[#3A2E24] hover:border-[#E0A83A]"
                >
                  <Facebook className="w-4 h-4 text-[#E0A83A] group-hover:text-[#161210] transition-colors" strokeWidth={1.5} aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/handmadeart.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid place-items-center w-11 h-11 bg-[#1E1813] hover:bg-[#E0A83A] rounded-sm transition-colors duration-200 group border border-[#3A2E24] hover:border-[#E0A83A]"
                >
                  <Instagram className="w-4 h-4 text-[#E0A83A] group-hover:text-[#161210] transition-colors" strokeWidth={1.5} aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@handmadeart.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="grid place-items-center w-11 h-11 bg-[#1E1813] hover:bg-[#E0A83A] rounded-sm transition-colors duration-200 group border border-[#3A2E24] hover:border-[#E0A83A]"
                >
                  <svg className="w-4 h-4 text-[#E0A83A] group-hover:text-[#161210] transition-colors" viewBox="0 0 24 24" fill="none" aria-hidden>
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
                  className="grid place-items-center w-11 h-11 bg-[#1E1813] hover:bg-[#E0A83A] rounded-sm transition-colors duration-200 group border border-[#3A2E24] hover:border-[#E0A83A]"
                >
                  <Youtube className="w-4 h-4 text-[#E0A83A] group-hover:text-[#161210] transition-colors" strokeWidth={1.5} aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/50684237555"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={locale === 'es' ? 'WhatsApp (abre en nueva ventana)' : 'WhatsApp (opens in new window)'}
                  className="grid place-items-center w-11 h-11 bg-[#1E1813] hover:bg-[#3C9A70] rounded-sm transition-colors duration-200 group border border-[#3A2E24] hover:border-[#3C9A70]"
                >
                  <svg className="w-4 h-4 text-[#E0A83A] group-hover:text-[#161210] transition-colors" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Tienda */}
          <nav aria-label={locale === 'es' ? 'Tienda' : 'Shop'}>
            <h2 className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#8C7F6E] mb-4">
              {locale === 'es' ? 'Tienda' : 'Shop'}
            </h2>
            <ul className="space-y-2.5 text-[13.5px]">
              {primaryNav.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/c/${cat.slugs[localeKey]}`} className="hover:text-[#E0A83A] transition-colors duration-200">
                    {cat.dbName[localeKey]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="hover:text-[#E0A83A] transition-colors duration-200">
                  {locale === 'es' ? 'Todo el catálogo' : 'Full catalog'}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Taller */}
          <nav aria-label={locale === 'es' ? 'Taller' : 'Workshop'}>
            <h2 className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#8C7F6E] mb-4">
              {locale === 'es' ? 'Taller' : 'Workshop'}
            </h2>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link href="/reinsercion-sociolaboral" className="hover:text-[#E0A83A] transition-colors duration-200">
                  {locale === 'es' ? 'El programa de reinserción' : 'The reintegration program'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E0A83A] transition-colors duration-200">
                  {locale === 'es' ? 'Los artesanos' : 'The artisans'}
                </Link>
              </li>
              <li>
                <Link href={locale === 'es' ? '/guias' : '/guides'} className="hover:text-[#E0A83A] transition-colors duration-200">
                  {locale === 'es' ? 'Guías y cuidado de la madera' : 'Guides and wood care'}
                </Link>
              </li>
              <li>
                <Link href="/feria-artesanias" className="hover:text-[#E0A83A] transition-colors duration-200">
                  {locale === 'es' ? 'Ferias y eventos' : 'Fairs and events'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E0A83A] transition-colors duration-200">
                  {locale === 'es' ? 'Pedidos a medida' : 'Custom orders'}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Descubrir — pillar landing pages (sitewide internal links so the
              country-level keyword pages receive link equity from every page). */}
          <nav aria-label={locale === 'es' ? 'Descubrir' : 'Discover'}>
            <h2 className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#8C7F6E] mb-4">
              {locale === 'es' ? 'Descubrir' : 'Discover'}
            </h2>
            <ul className="space-y-2.5 text-[13.5px]">
              {PILLARS.map((pillar) => (
                <li key={pillar.id}>
                  <Link
                    href={getPillarPath(pillar.id, localeKey)}
                    className="hover:text-[#E0A83A] transition-colors duration-200"
                  >
                    {pillar.h1[localeKey]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ayuda */}
          <nav aria-label={locale === 'es' ? 'Ayuda' : 'Help'}>
            <h2 className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#8C7F6E] mb-4">
              {locale === 'es' ? 'Ayuda' : 'Help'}
            </h2>
            <ul className="space-y-2.5 text-[13.5px]">
              <li>
                <Link href="/shipping" className="hover:text-[#E0A83A] transition-colors duration-200">
                  {locale === 'es' ? 'Envíos y devoluciones' : 'Shipping and returns'}
                </Link>
              </li>
              <li>
                <a href="mailto:info@handmadeart.store" className="hover:text-[#E0A83A] transition-colors duration-200">
                  info@handmadeart.store
                </a>
              </li>
              <li>
                <a href="tel:+50684237555" className="tabular-nums hover:text-[#E0A83A] transition-colors duration-200">
                  +506 8423 7555
                </a>
              </li>
              <li>
                <a
                  href={englishSiteHref}
                  className="hover:text-[#E0A83A] transition-colors duration-200"
                >
                  {englishSiteLabel}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Hairline divider */}
        <div className="w-full h-px bg-[#3A2E24] mt-14 mb-6" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px]">
          <p className="text-[#8C7F6E]">
            © {new Date().getFullYear()} Handmade Art · artehechoamano.com · handmadeart.store
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy-policies" className="text-[#8C7F6E] hover:text-[#E0A83A] transition-colors">
              {locale === 'es' ? 'Privacidad' : 'Privacy'}
            </Link>
            <Link href="/conditions-service" className="text-[#8C7F6E] hover:text-[#E0A83A] transition-colors">
              {locale === 'es' ? 'Términos' : 'Terms'}
            </Link>
            <span className="hidden sm:inline text-[#8C7F6E]">·</span>
            <p className="text-[#8C7F6E] flex flex-wrap items-center gap-1.5">
              {locale === 'es' ? 'Desarrollado por' : 'Built by'}
              <Link
                href="https://sobrepoxi.com"
                target="_blank"
                rel="author noopener noreferrer"
                className="text-[#E0A83A] hover:text-[#F3C56B] transition-colors"
              >
                Sobrepoxi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
