const ITEMS = {
  es: [
    'Chorreadores de café',
    'Espejos tallados',
    'Esculturas',
    'Pinturas',
    'Jarras y cocina',
    'Instrumentos',
    'Cofres',
    'Decoración de pared',
  ],
  en: [
    'Coffee drippers',
    'Carved mirrors',
    'Sculptures',
    'Paintings',
    'Kitchenware',
    'Instruments',
    'Boxes',
    'Wall décor',
  ],
} as const;

export default function Marquee({ locale }: { locale: string }) {
  const items = locale === 'es' ? ITEMS.es : ITEMS.en;
  const line = items.join(' ◆ ') + ' ◆ ';

  return (
    <div
      className="flex h-14 items-center overflow-hidden whitespace-nowrap bg-[#E0A83A] text-[#161210]"
      aria-hidden="true"
    >
      <div className="hm-marquee-track flex shrink-0 pl-6 font-display text-[20px] sm:text-[22px]">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}
