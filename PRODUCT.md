# Design Context — HandmadeArt.store

> The full system lives in **`DESIGN.md`** at the repo root. This file is the
> short brand-context summary consumed by the `impeccable` skill before it
> writes code. Read both — DESIGN.md for the rules, this for the soul.

## Users

Compradores de arte hecho a mano (madera tallada, resina, piezas únicas)
en Costa Rica y mercado internacional (USD). Públicos: regalo emocional,
decoración premium, coleccionistas, turismo cultural. Llegan desde
Google y redes, comparan piezas, valoran historia y oficio sobre marca.
**Cada compra apoya un programa de reinserción social y laboral** —
las piezas las hacen residentes en rehabilitación. Esto NO es
storytelling de marketing: es la razón de ser del negocio.

## Brand personality

Voz: cálida, reposada, con orgullo del oficio. Tres palabras:
**artesanal, premium, honesto**. Meta emocional: que la pieza digital
se sienta tan tangible como la real — que se vea la veta, el grano,
el reflejo del barniz, las virutas de la mesa.

## Aesthetic direction — "Rustic-Premium"

Editorial de oficio impreso sobre papel cremoso, **no e-commerce**.
Combinamos:

- **Material rústico** del hero (`public/home/hero.webp`): chiaroscuro
  cálido, madera tallada (jaguar, mono, rana), virutas, herramientas
  borrosas en penumbra, terrosos saturados.
- **Rigor editorial** del logo (HM serif blanco sobre charcoal):
  tipografía elegante, espacio negativo generoso, sin ornamento.
- **Modernidad funcional** porque es **una tienda con razón social,
  no una revista**: los CTAs son legibles, los precios prominentes,
  el flujo de compra simple. El estilo enmarca el producto; no lo
  oculta.

### Referencias

- **Aesop** — chiaroscuro, cream, serif restrained, big breathing room
- **Margaret Howell** — calm e-commerce, paper-cream, unhurried pace
- **Toast** — handcraft aesthetics, warm tones, real photography
- **Kinfolk** — typographic rhythm, generous spacing, single accent
- **Hermès home** — premium sin gritar, sin gold-gradient CTAs

### Anti-referencias (NUNCA parecernos a)

- Shopify default themes — chips negros rectangulares, blue CTAs, todo gris
- Dashboard tech (Notion / Linear / Vercel marketing) — frío, clínico
- Dark mode "tech" — somos cálidos, no LED
- "Luxury" tropes — gold gradients, glass, particles, embossed leather
- Flyer festivo (pink-purple-blue gradients) — somos atemporales
- Decoración excesiva — bordes redondeados grandes, sombras dramáticas,
  texturas obvias

## Design principles

1. **Material sobre interfaz** — la imagen del producto manda;
   el chrome desaparece. Cero cards-dentro-de-cards.
2. **Calma tipográfica** — pocas escalas, mucho aire, jerarquía por
   peso/color/posición, no por tamaño. Frank Ruhl Libre en todos los
   titulares.
3. **Detalle artesanal** — bordes finos (2px), sombras tintadas walnut
   (no neutras), transiciones suaves con ease-out-quart. Hover insinúa,
   no grita.
4. **Dorado escaso** — el #C9A962 aparece como subrayado, sello, o
   confirmación. Nunca como fondo grande ni gradiente.
5. **Neutros tintados, cero fríos** — sin gris frío Tailwind, sin
   negro puro, sin blanco puro. Paper cream `#FAF6EF` reemplaza al
   blanco. Walnut deep #5C4530 reemplaza al gris oscuro.
6. **Comercio sin pena** — somos una tienda. CTAs prominentes, precios
   claros, stock visible, "Add to cart" funcional. La elegancia no
   sacrifica conversión.
7. **Materialidad** — usar textura sutil (paper grain SVG) donde
   refuerce la sensación de papel, no de pantalla. Reservar para hero,
   footer, y secciones de storytelling.

## Theme

**Light-only.** Backgrounds tibios, no blanco puro. La paleta dark
existe (charcoal/walnut) pero es para superficies seleccionadas
(footer, hero overlay, secciones de impacto), no para "dark mode".

## Lo que `impeccable craft` debe recordar siempre

- Cuando dudes entre dos opciones, elige la más **editorial** y la
  más **funcional** — no la más "modern" o "minimal".
- Si una decisión hace que el sitio se parezca más a una revista
  impresa premium, vas bien. Si lo hace parecer más SaaS / dashboard
  / Shopify default, vas mal.
- Los colores son **rules, no guidelines** — sólo los tokens de
  DESIGN.md.
- Sketcha la composición antes de escribir clases. La estructura
  manda sobre el detalle.
