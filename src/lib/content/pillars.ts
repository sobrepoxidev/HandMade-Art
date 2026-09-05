// src/lib/content/pillars.ts
//
// Static SEO/content layer for the three bilingual pillar pages built to
// capture high-impression / low-position Google Search Console queries
// ("costa rican handicrafts", "costa rica wood carvings", "costa rica
// souvenirs"). Mirrors the shape of src/lib/content/categories.ts and
// src/lib/content/guides.ts so PillarPageContent stays a thin renderer.
// Each pillar has an ES-canonical slug and an EN-canonical slug; the
// matching route folders live under src/app/[locale]/<slug>/ and
// cross-redirect the "wrong" locale, same pattern as
// reinsercion-sociolaboral / social-reintegration.

export interface LocalizedText {
  es: string;
  en: string;
}

export interface PillarFaq {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface PillarSection {
  h2: LocalizedText;
  paragraphs: { es: string[]; en: string[] };
}

export type PillarId = "handicrafts" | "wood-carvings" | "souvenirs";

export interface PillarContent {
  id: PillarId;
  slug: LocalizedText;
  h1: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  /** 5-6 sections, 900-1200 words per locale across all sections combined. */
  sections: PillarSection[];
  faqs: PillarFaq[];
}

export const PILLARS: PillarContent[] = [
  // ── 1. Brand + country pillar ──────────────────────────────────────
  {
    id: "handicrafts",
    slug: { es: "artesania-costarricense", en: "costa-rican-handicrafts" },
    h1: {
      es: "Artesanía costarricense hecha a mano en San Isidro de Coronado, San José",
      en: "Costa Rican Handicrafts, Hand-Carved in San Isidro de Coronado, San José",
    },
    metaTitle: {
      es: "Artesanía costarricense hecha a mano | Costa Rica",
      en: "Costa Rican Handicrafts, Made By Hand",
    },
    metaDescription: {
      es: "Artesanía costarricense auténtica: madera de cedro amargo y laurel, motivos de fauna tica y un taller en San Isidro de Coronado que reinserta a sus artesanos.",
      en: "Authentic Costa Rican handicrafts: cedro amargo and laurel wood, wildlife motifs, and a San Isidro de Coronado workshop that reintegrates its artisans.",
    },
    sections: [
      {
        h2: {
          es: "Qué es realmente la artesanía costarricense",
          en: "What Costa Rican handicraft actually is",
        },
        paragraphs: {
          es: [
            "\"Artesanía costarricense\" debería significar una sola cosa: un objeto hecho a mano, en Costa Rica, por una persona que domina un oficio específico —tallado, pintura, ensamblaje— y no una etiqueta pegada sobre un producto fabricado en otro país. En la práctica, buena parte de lo que se vende bajo ese nombre en zonas turísticas es producción en serie importada; la diferencia entre eso y una pieza real casi nunca está en el precio, sino en las variaciones que solo puede dejar una mano humana: una veta de madera distinta, un trazo de pincel que no se repite igual dos veces.",
            "Nuestro catálogo funciona con esa definición estricta: 119 productos activos, cada uno tallado o pintado por un artesano identificable dentro de un taller en San Isidro de Coronado, San José, no comprado a un intermediario ni ensamblado a partir de piezas genéricas. Eso significa que un chorreador de café, un espejo o una taza de esta colección se puede rastrear hasta la persona y el proceso que lo hicieron, algo que ningún imán de refrigerador importado puede ofrecer.",
            "Esa trazabilidad también cambia lo que significa el precio: no estás pagando solo por un objeto terminado, sino por las horas de tallado o pintura de una persona específica y por el proceso de reinserción que ese trabajo sostiene. Es una diferencia que vale la pena tener presente al comparar un chorreador de $30 hecho a mano contra uno importado de $10 en una tienda de souvenirs: no son el mismo producto, aunque se parezcan en la foto.",
          ],
          en: [
            "\"Costa Rican handicraft\" should mean one thing: an object made by hand, in Costa Rica, by someone who has a real trade — carving, painting, assembly — not a sticker slapped on something manufactured elsewhere. In practice, a large share of what gets sold under that label in tourist areas is imported mass production; the difference between that and a genuine piece is almost never the price tag, it's the variation only a human hand leaves behind — a different grain pattern, a brushstroke that never repeats exactly.",
            "Our catalog holds to that strict definition: 119 active products, each one carved or painted by an identifiable artisan inside a workshop in San Isidro de Coronado, San José — not bought from a middleman or assembled from generic parts. That means a coffee dripper, a mirror or a mug in this collection can be traced back to the person and the process that made it, something no imported fridge magnet can offer.",
            "That traceability also changes what the price actually represents: you're not just paying for a finished object, you're paying for a specific person's carving or painting hours and for the reintegration process that work supports. It's a distinction worth keeping in mind when comparing a $30 handmade dripper against a $10 imported one at a souvenir stand — they may look alike in a photo, but they aren't the same product.",
          ],
        },
      },
      {
        h2: {
          es: "Las maderas: cedro amargo y laurel",
          en: "The woods: cedro amargo and laurel",
        },
        paragraphs: {
          es: [
            "Las dos maderas base de nuestro taller son el cedro amargo y el laurel, ambas especies costarricenses elegidas por razones prácticas de tallado, no solo estéticas. El cedro amargo tiene un grano relativamente recto y una densidad media que lo hace trabajable con gubia sin astillarse en los detalles finos —ideal para el relieve de un motivo de fauna o el marco calado de un espejo—, además de un tono cálido que se profundiza con el barniz. El laurel es algo más denso y de veta más marcada, lo que lo hace especialmente resistente para piezas de uso diario como utensilios de cocina o chorreadores, donde la pieza recibe golpes y humedad de forma constante.",
            "Ninguna de las dos madera es tratada para parecer uniforme: la veta natural queda visible a propósito, y por eso dos piezas del mismo diseño nunca son idénticas entre sí. Si buscás una madera y un acabado específico para un espacio o un uso en particular, cada ficha de producto indica el material exacto de esa pieza.",
          ],
          en: [
            "The two base woods in our workshop are cedro amargo (bitter cedar) and laurel, both Costa Rican species chosen for practical carving reasons, not just looks. Cedro amargo has a fairly straight grain and medium density, which makes it workable with a gouge without splintering on fine detail — ideal for a carved wildlife motif or an openwork mirror frame — plus a warm tone that deepens once varnished. Laurel is somewhat denser with a more pronounced grain, which makes it especially durable for everyday pieces like kitchen utensils or coffee drippers, where the piece takes regular knocks and moisture.",
            "Neither wood is treated to look uniform: the natural grain is left visible on purpose, which is why two pieces of the same design are never identical. If you're after a specific wood or finish for a particular space or use, each product page lists the exact material for that piece.",
          ],
        },
      },
      {
        h2: {
          es: "Los motivos: la fauna costarricense tallada a mano",
          en: "The motifs: Costa Rican wildlife, carved by hand",
        },
        paragraphs: {
          es: [
            "Buena parte del catálogo repite un mismo set de motivos, y no por falta de variedad: son los animales más reconocibles de la biodiversidad costarricense y los que más piden nuestros clientes. El tucán y el colibrí aparecen sobre todo en esculturas pequeñas y marcos de espejo por su silueta reconocible al tallar; la rana de ojos rojos y la iguana se prestan bien al relieve plano en tazas pintadas y servilleteros; el quetzal y el perezoso son motivos más elaborados, frecuentes en piezas de mayor tamaño como espejos de sala o decoración de pared.",
            "Ningún motivo se imprime ni se calca: cada figura se talla o se pinta directamente sobre la pieza, así que el nivel de detalle varía según el artesano y el tamaño del objeto. Si un motivo específico te interesa y no lo ves disponible en un producto activo, escribinos para consultar si se puede coordinar como pedido personalizado.",
          ],
          en: [
            "A lot of the catalog repeats the same set of motifs, and not for lack of variety — they're the most recognizable animals in Costa Rica's biodiversity, and the ones customers ask for most. The toucan and hummingbird show up mostly in small sculptures and mirror frames, where their silhouette carves well; the red-eyed tree frog and the iguana lend themselves to flat relief on painted mugs and napkin holders; the quetzal and the sloth are more elaborate motifs, common on larger pieces like living-room mirrors or wall décor.",
            "No motif is printed or traced — every figure is carved or painted directly onto the piece, so the level of detail varies by artisan and by the size of the object. If a specific motif interests you and it's not on an active product right now, reach out to ask whether it can be coordinated as a custom order.",
          ],
        },
      },
      {
        h2: {
          es: "El taller en San Isidro de Coronado y el programa de reinserción",
          en: "The San Isidro de Coronado workshop and the reintegration program",
        },
        paragraphs: {
          es: [
            "Todas las piezas se producen en un taller en San Isidro de Coronado, donde trabajan artesanos que forman parte de un programa de reinserción social respaldado por el Ministerio de Justicia y Paz y el Instituto Nacional de Aprendizaje (INA). El INA aporta la capacitación técnica en talla y acabado; el programa de reinserción aporta la estructura, el acompañamiento y el espacio de trabajo. El resultado es un oficio real, con metas de producción y control de calidad, no una actividad ocasional.",
            "Esto tiene una consecuencia directa para quien compra: cada pieza vendida remunera el trabajo de la persona que la hizo y sostiene ese proceso de reinserción en marcha. No publicamos nombres, cifras de artesanos ni años de fundación porque preferimos no inventar datos que no podemos verificar en este momento —lo que sí podemos garantizar es la trazabilidad del taller y el programa detrás de cada producto.",
          ],
          en: [
            "Every piece is produced in a workshop in San Isidro de Coronado, San José, where the artisans are part of a social reintegration program backed by Costa Rica's Ministerio de Justicia y Paz (Ministry of Justice and Peace) and the Instituto Nacional de Aprendizaje (INA, the national vocational training institute). INA provides the technical training in carving and finishing; the reintegration program provides the structure, support and workspace. The result is a real trade, with production targets and quality control, not an occasional activity.",
            "That has a direct consequence for the buyer: every piece sold pays the person who made it and keeps that reintegration process running. We don't publish artisan names, headcounts or founding dates, because we'd rather not state numbers we can't verify right now — what we can guarantee is the traceability of the workshop and the program behind every product.",
          ],
        },
      },
      {
        h2: {
          es: "El catálogo de un vistazo",
          en: "The catalog at a glance",
        },
        paragraphs: {
          es: [
            "El catálogo activo suma 119 piezas repartidas en 11 categorías: 42 chorreadores de café, 27 espejos tallados, 20 tazas de peltre pintadas a mano, 9 piezas de decoración, 4 esculturas de madera, 4 pinturas originales, 4 servilleteros, 3 piezas de decoración de pared, 2 juegos de cocina, 2 cofres y 2 instrumentos musicales. Los precios van desde $7.50 en las tazas más accesibles hasta $1,347 en los espejos tallados de mayor formato, así que hay opciones tanto para un regalo pequeño como para una pieza central de sala.",
            "Si nunca compraste artesanía costarricense antes, el chorreador de café y los espejos tallados son el punto de entrada más representativo del taller; si preferís algo más accesible para empezar, las tazas de peltre y los servilleteros cubren ese rango de precio sin perder el carácter artesanal.",
          ],
          en: [
            "The active catalog totals 119 pieces across 11 categories: 42 coffee drippers, 27 carved mirrors, 20 hand-painted enamel mugs, 9 décor pieces, 4 wood sculptures, 4 original paintings, 4 napkin holders, 3 wall décor pieces, 2 kitchen sets, 2 boxes and 2 musical instruments. Prices range from $7.50 for the most accessible mugs up to $1,347 for the largest carved mirrors, so there's room for both a small gift and a living-room centerpiece.",
            "If you've never bought Costa Rican handicraft before, the coffee dripper and the carved mirrors are the most representative entry point into the workshop's work; if you'd rather start with something more affordable, the enamel mugs and napkin holders cover that price range without losing the handmade character.",
          ],
        },
      },
      {
        h2: {
          es: "Cómo comprar y enviar al extranjero",
          en: "How to buy and ship abroad",
        },
        paragraphs: {
          es: [
            "El proceso de compra es el mismo sin importar dónde vivas: elegís la pieza, confirmás el pedido y pagás por SINPE Móvil, transferencia bancaria o tarjeta de crédito o débito. Hacemos envíos a todo Costa Rica y también internacionales; el costo y el tiempo de entrega se calculan según tu ubicación al momento de la compra, así que no hace falta viajar al país para llevarte una pieza real del taller.",
            "Si querés un tamaño, grabado o acabado específico que no está en una ficha activa, podés coordinar un pedido personalizado; el tiempo de producción habitual para piezas a medida es de aproximadamente 3 semanas. Para explorar el catálogo completo por tipo de pieza, empezá por cualquiera de las categorías de abajo, o revisá nuestras guías si querés aprender a usar o cuidar una pieza antes de comprarla.",
            "Guardá siempre el correo de confirmación de tu pedido: es el respaldo que necesitás si tenés que declarar la pieza en aduana al volver a tu país, o simplemente si querés recordar en qué taller y con qué material se hizo. Ese tipo de trazabilidad —saber exactamente de dónde vino algo que compraste— es precisamente lo que distingue a la artesanía costarricense real de una imitación producida en otro país.",
          ],
          en: [
            "The buying process is the same no matter where you live: pick the piece, confirm the order, and pay by SINPE Móvil (Costa Rica), bank transfer, or credit or debit card. We ship anywhere in Costa Rica and internationally too; shipping cost and delivery time are calculated based on your location at checkout, so you don't need to visit the country to own a genuine piece from the workshop.",
            "If you want a specific size, engraving or finish that isn't on an active listing, you can coordinate a custom order; typical production time for made-to-order pieces is about 3 weeks. To browse the full catalog by piece type, start with any of the categories below, or check our guides if you want to learn how to use or care for a piece before buying it.",
            "Keep your order confirmation email on hand: it's the paper trail you'd need to declare the piece at customs when you get home, or simply to remember which workshop made it and what material it's carved from. That kind of traceability — knowing exactly where something you bought came from — is precisely what separates real Costa Rican handicraft from an imitation made somewhere else.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Cómo sé que una pieza es artesanía costarricense real y no importada?",
          en: "How do I know a piece is real Costa Rican handicraft and not imported?",
        },
        answer: {
          es: "Fijate en las variaciones naturales entre piezas del mismo diseño (veta de madera, pincelada) y en si el vendedor puede decirte de qué taller sale y en qué madera está hecha. Todas nuestras piezas se producen en un taller identificable en San Isidro de Coronado, San José.",
          en: "Look for natural variation between pieces of the same design (wood grain, brushwork) and whether the seller can tell you which workshop it comes from and what wood it's made of. All of our pieces are produced in an identifiable workshop in San Isidro de Coronado, San José.",
        },
      },
      {
        question: {
          es: "¿Qué maderas usan y por qué?",
          en: "What woods do you use, and why?",
        },
        answer: {
          es: "Principalmente cedro amargo y laurel, dos maderas costarricenses elegidas por su comportamiento al tallar con gubia y su resistencia al uso diario, no solo por su color.",
          en: "Mainly cedro amargo (bitter cedar) and laurel, two Costa Rican woods chosen for how they behave under gouge carving and their durability in daily use, not just their color.",
        },
      },
      {
        question: {
          es: "¿Qué relación tiene el taller con el programa de reinserción social?",
          en: "What's the workshop's relationship with the reintegration program?",
        },
        answer: {
          es: "El taller de San Isidro de Coronado emplea a artesanos dentro de un programa de reinserción social respaldado por el Ministerio de Justicia y Paz y el INA, que aporta la capacitación técnica en talla y acabado.",
          en: "The San Isidro de Coronado workshop employs artisans within a social reintegration program backed by the Ministerio de Justicia y Paz (Ministry of Justice and Peace) and the INA, which provides the technical training in carving and finishing.",
        },
      },
      {
        question: {
          es: "¿Hacen envíos internacionales?",
          en: "Do you ship internationally?",
        },
        answer: {
          es: "Sí. Enviamos a todo Costa Rica y también al extranjero; el costo y tiempo de entrega se calculan según tu ubicación al momento de la compra.",
          en: "Yes. We ship anywhere in Costa Rica and internationally as well; shipping cost and delivery time are calculated based on your location at checkout.",
        },
      },
      {
        question: {
          es: "¿Qué formas de pago aceptan?",
          en: "What payment methods do you accept?",
        },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito, todos procesados de forma segura.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card, all processed securely.",
        },
      },
    ],
  },

  // ── 2. Craft / technique pillar ────────────────────────────────────
  {
    id: "wood-carvings",
    slug: {
      es: "tallado-en-madera-costa-rica",
      en: "costa-rica-wood-carvings",
    },
    h1: {
      es: "Tallado en madera de Costa Rica: técnica, maderas y acabados",
      en: "Costa Rica Wood Carvings: Technique, Woods and Finishes",
    },
    metaTitle: {
      es: "Tallado en madera de Costa Rica | Técnica y maderas",
      en: "Costa Rica Wood Carvings | Technique & Woods",
    },
    metaDescription: {
      es: "Cómo se talla a mano una pieza de madera en Costa Rica: gubia, cedro amargo y laurel, barniz apto para alimentos y cómo distinguirla de lo importado.",
      en: "How a Costa Rican wood carving is made by hand: gouge work, cedro amargo and laurel, food-safe varnish, and how to spot the real thing.",
    },
    sections: [
      {
        h2: {
          es: "Cómo se talla una pieza, paso a paso",
          en: "How a piece is carved, step by step",
        },
        paragraphs: {
          es: [
            "Un tallado en madera de nuestro taller empieza con un bloque de madera seleccionado por su veta y ausencia de nudos problemáticos, no con una plantilla que se repite sin criterio. El artesano traza el diseño a mano sobre el bloque y luego trabaja con gubias de distintos anchos y curvaturas: las gubias más anchas desbastan el volumen general de la pieza, y las más finas entran en el detalle —las plumas de un tucán, la textura de la piel de una iguana, el calado de un marco de espejo.",
            "El proceso es progresivo: no se talla el detalle fino antes de tener bien definido el volumen general, porque un error en esa etapa temprana es mucho más difícil de corregir después. Dependiendo de la complejidad, una pieza puede tomar desde unas horas (una taza pintada, un servilletero) hasta varios días de trabajo (una escultura detallada o un espejo de marco calado grande).",
            "Las piezas pintadas —como las tazas de peltre— siguen una lógica distinta pero igual de manual: el diseño se pinta directamente sobre la superficie esmaltada, capa por capa, sin plantilla que se repita de forma idéntica en cada unidad. Esto explica por qué dos tazas del mismo diseño pueden tener un trazo levemente distinto en el pico de un ave o en el borde de una hoja: es la misma mano, no la misma máquina.",
          ],
          en: [
            "A wood carving from our workshop starts with a block of wood chosen for its grain and the absence of problem knots, not a template stamped out without judgment. The artisan sketches the design onto the block by hand, then works with gouges of different widths and curvatures: the wider gouges rough out the piece's overall volume, and the finer ones handle detail — a toucan's feathers, the texture of an iguana's skin, the openwork of a mirror frame.",
            "The process is progressive: fine detail isn't carved before the overall volume is well defined, because a mistake at that early stage is much harder to fix later. Depending on complexity, a piece can take anywhere from a few hours (a painted mug, a napkin holder) to several days of work (a detailed sculpture or a large openwork mirror frame).",
            "Painted pieces — like the enamel mugs — follow a different but equally manual logic: the design is painted directly onto the enameled surface, layer by layer, with no stencil that repeats identically from one unit to the next. That's why two mugs of the same design can show a slightly different line on a bird's beak or the edge of a leaf: it's the same hand, not the same machine.",
          ],
        },
      },
      {
        h2: {
          es: "Las maderas: por qué cedro amargo y laurel",
          en: "The woods: why cedro amargo and laurel",
        },
        paragraphs: {
          es: [
            "El cedro amargo se usa sobre todo en piezas que requieren detalle fino —marcos de espejo, esculturas, relieves de pared— porque su grano relativamente recto responde bien a la gubia sin astillarse en los bordes delgados. El laurel, más denso y de veta más marcada, se reserva para piezas de uso diario que reciben golpes y humedad constantes, como chorreadores de café y utensilios de cocina, donde la resistencia importa más que el nivel de detalle del tallado.",
            "Ninguna madera se lija hasta perder su veta natural: esa textura visible es parte del resultado esperado, y es justamente lo que hace que dos piezas del mismo diseño nunca sean visualmente idénticas entre sí.",
          ],
          en: [
            "Cedro amargo (bitter cedar) is used mainly for pieces that need fine detail — mirror frames, sculptures, wall reliefs — because its fairly straight grain responds well to the gouge without splintering along thin edges. Laurel, denser and more heavily grained, is reserved for everyday pieces that take regular knocks and moisture, like coffee drippers and kitchen utensils, where durability matters more than the fineness of the carving.",
            "Neither wood is sanded down to hide its natural grain — that visible texture is part of the intended result, and it's exactly what keeps two pieces of the same design from ever looking visually identical.",
          ],
        },
      },
      {
        h2: {
          es: "Acabados: barniz decorativo y barniz apto para alimentos",
          en: "Finishes: decorative varnish and food-safe varnish",
        },
        paragraphs: {
          es: [
            "El acabado varía según el uso de la pieza. Los espejos, esculturas y piezas de decoración llevan un barniz natural pensado para resaltar la veta y proteger la madera de la humedad ambiental, sin que la pieza entre en contacto directo con comida o bebida. Los chorreadores de café, juegos de cocina y otras piezas de uso alimentario llevan un barniz apto para alimentos, formulado para no traspasar sabor ni sustancias al líquido o al alimento que toca la madera.",
            "Esta distinción no es cosmética: usar el barniz equivocado en una pieza de cocina puede alterar el sabor del café o dejar residuo en la comida, así que cada ficha de producto especifica si la pieza es apta para uso alimentario o exclusivamente decorativa.",
          ],
          en: [
            "The finish depends on how the piece is used. Mirrors, sculptures and décor pieces get a natural varnish meant to bring out the grain and protect the wood from ambient humidity, without the piece ever touching food or drink directly. Coffee drippers, kitchen sets and other food-contact pieces get a food-safe varnish, formulated so it doesn't transfer flavor or substances into the liquid or food touching the wood.",
            "That distinction isn't cosmetic: using the wrong varnish on a kitchen piece can alter the taste of your coffee or leave residue in food, so every product page specifies whether a piece is food-safe or decorative only.",
          ],
        },
      },
      {
        h2: {
          es: "Cómo distinguir tallado a mano de producción en serie",
          en: "How to tell hand-carved from mass-produced",
        },
        paragraphs: {
          es: [
            "La señal más confiable no es el precio, es la variación. Dos piezas talladas a mano del mismo diseño nunca son perfectamente idénticas: la profundidad del relieve, el ángulo de una curva o el tono de la veta van a diferir levemente entre una y otra. Si dos piezas \"artesanales\" en un mismo estante son exactamente iguales hasta el último detalle, lo más probable es que salgan de un molde o un router CNC, no de una gubia.",
            "Otra señal es el peso y la solidez: una pieza tallada en madera maciza pesa más y se siente más densa al tacto que una réplica hueca o de material compuesto pensada para verse similar a bajo costo. Si tenés dudas sobre una pieza específica, preguntar directamente qué madera se usó y de qué taller sale filtra la mayoría de las imitaciones.",
          ],
          en: [
            "The most reliable sign isn't price, it's variation. Two hand-carved pieces of the same design are never perfectly identical — the depth of the relief, the angle of a curve, or the grain's tone will differ slightly between them. If two \"handmade\" pieces on the same shelf match exactly down to the last detail, they most likely came out of a mold or a CNC router, not a gouge.",
            "Weight and solidity are another tell: a piece carved from solid wood is heavier and feels denser to the touch than a hollow or composite replica made to look similar at a lower cost. Running a finger over the back or underside of a piece also helps — a hand-carved surface usually shows faint tool marks even where it's been sanded smooth, while an injection-molded replica tends to be uniformly slick everywhere, including spots a carver would never bother finishing perfectly. If you're unsure about a specific piece, simply asking what wood was used and which workshop it came from filters out most imitations.",
          ],
        },
      },
      {
        h2: {
          es: "Cuidado, tamaños y precios",
          en: "Care, sizes and pricing",
        },
        paragraphs: {
          es: [
            "El cuidado básico es el mismo para casi toda pieza tallada: paño seco o levemente húmedo para el polvo, nunca remojo ni lavavajillas en piezas de cocina, y una capa ocasional de aceite mineral apto para madera para mantener el brillo del barniz y sellar pequeñas grietas antes de que crezcan. Evitá la luz solar directa prolongada y los cambios bruscos de temperatura, que son la causa más común de que el barniz se opaque o la madera se agriete con el tiempo.",
            "En cuanto a tamaños y precios, el catálogo va de piezas pequeñas de escritorio —esculturas o cofres desde montos accesibles— hasta espejos de sala de gran formato que llegan a $1,347. El precio responde principalmente al tiempo de tallado y al tamaño del bloque de madera usado, así que una pieza pequeña con mucho detalle puede costar lo mismo que una pieza grande con un tallado más simple.",
            "Un error común es asumir que una pieza más grande siempre implica más horas de trabajo: un espejo grande con un tallado geométrico simple puede tomar menos tiempo que una escultura pequeña con un motivo de fauna muy detallado. Si el presupuesto es tu principal filtro, preguntá por el nivel de detalle en vez de guiarte solo por el tamaño de la pieza.",
          ],
          en: [
            "Basic care is the same for almost every carved piece: a dry or slightly damp cloth for dust, never soaking or dishwashing kitchen pieces, and an occasional coat of food-safe mineral oil to keep the varnish's shine and seal small cracks before they grow. Avoid prolonged direct sunlight and sudden temperature swings, which are the most common cause of varnish dulling or wood cracking over time.",
            "As for sizes and pricing, the catalog runs from small desktop pieces — sculptures or boxes starting at an accessible price — up to large-format living-room mirrors that reach $1,347. Price mostly reflects carving time and the size of the wood block used, so a small piece with heavy detail can cost about the same as a larger piece with simpler carving.",
            "A common mistake is assuming a bigger piece always means more work hours: a large mirror with a simple geometric carving can take less time than a small sculpture with a highly detailed wildlife motif. If budget is your main filter, ask about the level of detail rather than judging by the piece's size alone.",
          ],
        },
      },
      {
        h2: {
          es: "Qué esperar de la variación del grano",
          en: "What to expect from grain variation",
        },
        paragraphs: {
          es: [
            "Si comprás una pieza tallada en madera esperando que se vea exactamente igual a la foto del producto, vale la pena ajustar esa expectativa: la foto muestra fielmente el diseño y las proporciones, pero la veta específica de tu pieza —el patrón de líneas, algún nudo pequeño, el tono exacto tras el barnizado— va a ser único de esa pieza en particular. Eso no es un defecto, es la prueba de que la pieza es real.",
            "Si tenés preferencia por un tono más claro u oscuro, o por una veta más uniforme, podés mencionarlo al coordinar un pedido personalizado; el tiempo de producción habitual para piezas a medida es de aproximadamente 3 semanas, lo que da margen suficiente para que el artesano seleccione un bloque de madera acorde a lo que buscás.",
          ],
          en: [
            "If you buy a carved wood piece expecting it to look exactly like the product photo, it's worth adjusting that expectation: the photo accurately shows the design and proportions, but the specific grain of your piece — the pattern of lines, a small knot, the exact tone once varnished — will be unique to that individual piece. That's not a flaw, it's proof the piece is real.",
            "If you have a preference for a lighter or darker tone, or a more uniform grain, you can mention it when coordinating a custom order; typical production time for made-to-order pieces is about 3 weeks, which gives the artisan enough lead time to select a wood block that matches what you're looking for and to walk you through the trade-offs between the two woods before carving begins.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Con qué herramientas se talla la madera?",
          en: "What tools are used to carve the wood?",
        },
        answer: {
          es: "Principalmente gubias de distintos anchos y curvaturas: las más anchas desbastan el volumen general y las más finas trabajan el detalle, como las plumas de un ave o el calado de un marco.",
          en: "Mainly gouges of different widths and curvatures: the wider ones rough out the overall volume, and the finer ones handle detail work like a bird's feathers or a frame's openwork.",
        },
      },
      {
        question: {
          es: "¿El barniz es seguro para piezas que tocan comida o bebida?",
          en: "Is the varnish safe for pieces that touch food or drink?",
        },
        answer: {
          es: "Sí, en las piezas de uso alimentario —como chorreadores y juegos de cocina— usamos barniz apto para alimentos. Las piezas puramente decorativas llevan un barniz natural distinto, no pensado para contacto con comida.",
          en: "Yes, food-contact pieces — like coffee drippers and kitchen sets — use a food-safe varnish. Purely decorative pieces get a different natural varnish, not intended for food contact.",
        },
      },
      {
        question: {
          es: "¿Cómo sé si un tallado es realmente hecho a mano?",
          en: "How can I tell if a carving is really handmade?",
        },
        answer: {
          es: "Buscá variación entre piezas del mismo diseño: si dos son perfectamente idénticas, probablemente salieron de un molde o router CNC en vez de una gubia. El peso y la densidad al tacto también son buena señal de madera maciza.",
          en: "Look for variation between pieces of the same design: if two are perfectly identical, they probably came from a mold or a CNC router instead of a gouge. Weight and density to the touch are also good signs of solid wood.",
        },
      },
      {
        question: {
          es: "¿Cómo cuido una pieza tallada para que no se dañe el barniz?",
          en: "How do I care for a carved piece so the varnish doesn't get damaged?",
        },
        answer: {
          es: "Limpiá con paño seco o levemente húmedo, evitá remojo y lavavajillas en piezas de cocina, mantenela lejos de sol directo prolongado y aplicá aceite mineral apto para madera una o dos veces al año.",
          en: "Clean with a dry or slightly damp cloth, avoid soaking or dishwashing kitchen pieces, keep it away from prolonged direct sunlight, and apply food-safe mineral oil once or twice a year.",
        },
      },
      {
        question: {
          es: "¿Por qué mi pieza no se ve exactamente igual a la foto?",
          en: "Why doesn't my piece look exactly like the photo?",
        },
        answer: {
          es: "El diseño y las proporciones son fieles a la foto, pero la veta específica de la madera es única en cada pieza tallada a mano. Es la prueba de que la pieza es real y no una réplica producida en serie.",
          en: "The design and proportions match the photo, but the specific wood grain is unique to each hand-carved piece. It's proof the piece is genuine and not a mass-produced replica.",
        },
      },
    ],
  },

  // ── 3. Buyer-intent souvenir pillar ────────────────────────────────
  {
    id: "souvenirs",
    slug: { es: "souvenirs-de-costa-rica", en: "costa-rica-souvenirs" },
    h1: {
      es: "Souvenirs de Costa Rica hechos a mano, no de aeropuerto",
      en: "Costa Rica Souvenirs, Handmade — Not Airport Souvenirs",
    },
    metaTitle: {
      es: "Souvenirs de Costa Rica hechos a mano | No importados",
      en: "Costa Rica Souvenirs | Handmade, Not Imported",
    },
    metaDescription: {
      es: "Souvenirs de Costa Rica auténticos por presupuesto: desde tazas de $7.50 hasta espejos de más de $1,300. Qué llevar en la maleta y qué enviar.",
      en: "Authentic Costa Rica souvenirs by budget: from $7.50 mugs to mirrors over $1,300. What to pack in a suitcase and what to ship home instead.",
    },
    sections: [
      {
        h2: {
          es: "El problema del souvenir de aeropuerto",
          en: "The problem with airport souvenirs",
        },
        paragraphs: {
          es: [
            "El souvenir típico de aeropuerto o de zona turística —el imán de refrigerador, la pulsera de plástico con la bandera impresa, el llavero genérico— casi nunca se fabrica en Costa Rica: se importa en volumen y se le agrega una etiqueta al llegar. No es un problema de calidad exclusivamente, es un problema de honestidad: la persona que lo compra cree estar llevándose algo local cuando en realidad no lo es.",
            "La forma más simple de evitarlo es comprar directo de un catálogo que muestre el origen real de cada pieza. En este caso, cada producto se fabrica en un taller identificable en San Isidro de Coronado, San José, por artesanos de un programa de reinserción social —así que lo que ves en la ficha del producto es exactamente lo que vas a recibir, sin intermediarios que oculten de dónde viene.",
          ],
          en: [
            "The typical airport or tourist-zone souvenir — the fridge magnet, the plastic bracelet printed with the flag, the generic keychain — is almost never made in Costa Rica: it's imported in bulk and gets a sticker added on arrival. It's not just a quality problem, it's an honesty problem: the buyer thinks they're taking home something local when they're not.",
            "The simplest way to avoid that is to buy directly from a catalog that shows each piece's real origin. Here, every product is made in an identifiable workshop in San Isidro de Coronado, San José, by artisans in a social reintegration program — so what you see on the product page is exactly what you'll receive, with no middlemen hiding where it actually came from. If a shop can't tell you the workshop, the material, or roughly how long a piece took to make, that's usually enough reason to keep looking before you buy.",
          ],
        },
      },
      {
        h2: {
          es: "Qué llevarte según tu presupuesto",
          en: "What to bring home, by budget",
        },
        paragraphs: {
          es: [
            "Con $7.50 a $25 entrás directo a las tazas de peltre pintadas a mano y los servilleteros: livianos, resistentes y perfectos para llevarte varios de una vez sin gastar mucho. Entre $25 y $150 aparecen los cofres de madera, esculturas pequeñas y piezas de decoración con más presencia, ideales como regalo individual con más peso simbólico. De $150 en adelante entrás a espejos tallados medianos, esculturas más elaboradas y pinturas originales, y en el extremo superior del catálogo hay espejos de marco calado de gran formato que llegan hasta $1,347 —piezas pensadas como el punto focal de una sala, no como un souvenir de paso.",
            "No hace falta gastar en el extremo alto para llevarte algo genuinamente artesanal: incluso la pieza de $7.50 sale del mismo taller y del mismo proceso de tallado o pintura a mano que la más cara. La diferencia está en el tamaño y el tiempo de trabajo, no en la autenticidad.",
            "Si viajás con un grupo o una familia y querés repartir el presupuesto entre varias personas, suele rendir más comprar dos o tres piezas del rango medio —un cofre, una taza pintada y un servilletero, por ejemplo— que una sola pieza grande para todos. Así cada quien recibe algo propio, y el envío se puede consolidar en un mismo pedido para ahorrar en costo de entrega.",
          ],
          en: [
            "With $7.50 to $25 you're straight into hand-painted enamel mugs and napkin holders: light, sturdy, and easy to bring home several at once without spending much. Between $25 and $150 you get into wooden boxes, small sculptures and décor pieces with more presence, good as a single gift with more weight to it. From $150 up you're into mid-size carved mirrors, more elaborate sculptures and original paintings, and at the top end of the catalog there are large-format openwork mirror frames running up to $1,347 — pieces meant as a room's focal point, not a passing souvenir.",
            "You don't need to spend at the top end to bring home something genuinely handmade: even the $7.50 piece comes out of the same workshop and the same hand-carving or hand-painting process as the priciest one. The difference is size and time on the piece, not authenticity.",
            "If you're traveling with a group or a family and want to spread the budget across several people, it usually goes further to buy two or three mid-range pieces — a box, a painted mug and a napkin holder, say — than one large piece for everyone to share. That way everyone gets something of their own, and shipping can be consolidated into a single order to save on delivery cost.",
          ],
        },
      },
      {
        h2: {
          es: "Qué viaja bien en la maleta y qué no",
          en: "What travels well in a suitcase, and what doesn't",
        },
        paragraphs: {
          es: [
            "Las tazas de peltre, los servilleteros y los cofres pequeños son los que mejor viajan: pesan poco, resisten golpes razonables y ocupan poco espacio entre la ropa. Las esculturas pequeñas también funcionan bien envueltas en ropa como amortiguación, siempre que no tengan partes muy finas o sobresalientes que se puedan quebrar con la presión de la maleta.",
            "Los espejos de cualquier tamaño y las esculturas o piezas de decoración de pared más grandes son harina de otro costal: el vidrio y los marcos anchos no toleran bien el manejo de equipaje y casi siempre terminan pesando más de lo que conviene cargar. Para esas piezas, la opción más segura no es intentar meterlas en la maleta, sino pedir que se envíen directamente.",
          ],
          en: [
            "Enamel mugs, napkin holders and small boxes travel the best: they're light, hold up to reasonable knocks, and take up little space packed among clothes. Small sculptures also travel fine wrapped in clothing as padding, as long as they don't have thin or protruding parts that could snap under suitcase pressure.",
            "Mirrors of any size, and larger sculptures or wall décor pieces, are a different story: glass and wide frames don't handle baggage handling well and almost always end up heavier than makes sense to carry. For those pieces, the safer option isn't trying to fit them in a suitcase — it's having them shipped directly instead.",
          ],
        },
      },
      {
        h2: {
          es: "Enviar en vez de cargar en la maleta",
          en: "Shipping instead of carrying it home",
        },
        paragraphs: {
          es: [
            "Todas las piezas del catálogo se pueden enviar directamente desde el taller a tu domicilio, dentro de Costa Rica o al extranjero, sin necesidad de coordinar nada durante tu viaje. Podés hacer el pedido antes de volver, durante tu estadía, o incluso después de regresar a tu país si viste algo que te gustó y no lo compraste a tiempo.",
            "El pago se hace por SINPE Móvil, transferencia bancaria o tarjeta de crédito o débito, y el costo y tiempo de envío se calculan según tu ubicación al momento de la compra. Para piezas grandes o frágiles como espejos y esculturas, es casi siempre la opción más segura frente al riesgo de que se dañen en una maleta facturada.",
          ],
          en: [
            "Every piece in the catalog can ship directly from the workshop to your home, within Costa Rica or internationally, with nothing to coordinate during your trip. You can place the order before you leave, during your stay, or even after you're back home if you saw something you liked and didn't buy it in time.",
            "Payment is by SINPE Móvil (Costa Rica), bank transfer, or credit or debit card, and shipping cost and delivery time are calculated based on your location at checkout. For large or fragile pieces like mirrors and sculptures, shipping is almost always the safer option against the risk of damage in checked luggage.",
          ],
        },
      },
      {
        h2: {
          es: "Ideas de regalo según quién lo recibe",
          en: "Gift ideas by recipient",
        },
        paragraphs: {
          es: [
            "Para alguien que toma café todos los días, un chorreador de café de madera es casi imposible de fallar: se usa a diario y tiene una historia detrás que un regalo genérico no tiene. Para quien está decorando su casa, un espejo tallado o una pieza de decoración de pared funciona como punto focal en una habitación. Para un colega o un regalo grupal, las tazas de peltre y los servilleteros se prestan bien a pedidos por volumen sin disparar el presupuesto.",
            "Para quien ya tiene de todo, una escultura pequeña de un animal costarricense —un tucán, una rana de ojos rojos, un perezoso— suele sorprender precisamente porque no es lo primero que se le ocurre a la mayoría de la gente al pensar en un souvenir. Y si el regalo es para alguien que nunca visitó Costa Rica, contarle de dónde viene la pieza al entregarla —el taller, el programa de reinserción, el material— convierte un objeto bonito en un regalo con contexto real.",
          ],
          en: [
            "For a daily coffee drinker, a wooden coffee dripper is about as safe a pick as it gets: it's used every day and carries a story a generic gift doesn't. For someone decorating their home, a carved mirror or a wall décor piece works as a focal point in a room. For a coworker or a group gift, enamel mugs and napkin holders lend themselves well to bulk orders without blowing the budget.",
            "For someone who already has everything, a small sculpture of a Costa Rican animal — a toucan, a red-eyed tree frog, a sloth — tends to surprise people precisely because it's not the first thing most people think of as a souvenir. And if the gift is for someone who's never visited Costa Rica, sharing where the piece came from when you give it — the workshop, the reintegration program, the material — turns a nice object into a gift with real context behind it.",
          ],
        },
      },
      {
        h2: {
          es: "Por qué un souvenir con taller real detrás dura más que el recuerdo del viaje",
          en: "Why a souvenir with a real workshop behind it outlasts the trip itself",
        },
        paragraphs: {
          es: [
            "Un imán o una pulsera genérica se pierde o se descarta en algún momento sin que nadie lo note; una pieza tallada o pintada a mano se queda como objeto de uso o de decoración por años, precisamente porque tiene una función o un lugar en la casa más allá de recordar el viaje. Esa es la diferencia práctica entre comprar un símbolo y comprar una pieza que realmente vas a usar o exhibir.",
            "También es la diferencia entre un gasto que no deja rastro y una compra que sostiene un trabajo real: cada pieza de este catálogo paga directamente el trabajo de un artesano dentro de un programa de reinserción social respaldado por el Ministerio de Justicia y Paz y el INA. Si vas a llevarte un souvenir de Costa Rica, ese contexto —quién lo hizo, en qué taller, por qué importa la compra— vale tanto como la pieza en sí.",
          ],
          en: [
            "A generic magnet or bracelet eventually gets lost or thrown out without anyone noticing; a hand-carved or hand-painted piece sticks around as something you use or display for years, precisely because it has a function or a place in your home beyond just marking the trip. That's the practical difference between buying a symbol and buying a piece you'll actually use or display.",
            "It's also the difference between money spent that leaves no trace and a purchase that supports real work: every piece in this catalog directly pays an artisan working within a social reintegration program backed by the Ministerio de Justicia y Paz and the INA. If you're bringing home a Costa Rica souvenir, that context — who made it, in which workshop, why the purchase matters — is worth as much as the piece itself, and it's the part of the story most travelers end up telling long after the trip is over.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: {
          es: "¿Cómo distingo un souvenir hecho en Costa Rica de uno importado?",
          en: "How do I tell a souvenir made in Costa Rica from an imported one?",
        },
        answer: {
          es: "Fijate en variaciones naturales entre piezas del mismo diseño y en si el vendedor puede explicarte el material y el taller de origen. Un precio muy bajo para el nivel de detalle también es señal de que probablemente no es artesanal.",
          en: "Look for natural variation between pieces of the same design, and whether the seller can explain the material and workshop of origin. A price that's too low for the level of detail is also a sign it's probably not handmade.",
        },
      },
      {
        question: {
          es: "¿Cuál es el souvenir más económico y cuál el más caro del catálogo?",
          en: "What's the cheapest and most expensive souvenir in the catalog?",
        },
        answer: {
          es: "El precio de entrada del catálogo es $7.50, en tazas de peltre pintadas a mano; en el extremo superior hay espejos tallados de gran formato que llegan hasta $1,347.",
          en: "The catalog's entry price is $7.50, for hand-painted enamel mugs; at the top end there are large-format carved mirrors that reach up to $1,347.",
        },
      },
      {
        question: {
          es: "¿Qué souvenir conviene más para llevar en la maleta?",
          en: "What souvenir is best to pack in a suitcase?",
        },
        answer: {
          es: "Las tazas de peltre, los servilleteros y los cofres pequeños: livianos, resistentes y compactos. Los espejos y piezas grandes conviene enviarlos directamente en vez de cargarlos.",
          en: "Enamel mugs, napkin holders and small boxes — light, sturdy and compact. Mirrors and larger pieces are better shipped directly instead of carried.",
        },
      },
      {
        question: {
          es: "¿Puedo pedir un souvenir después de haber vuelto a mi país?",
          en: "Can I order a souvenir after I've already gone home?",
        },
        answer: {
          es: "Sí. Hacemos envíos internacionales, así que podés pedir la pieza en cualquier momento y la recibís sin necesidad de haber comprado en persona durante tu viaje.",
          en: "Yes. We ship internationally, so you can order the piece at any time and receive it without having had to buy it in person during your trip.",
        },
      },
      {
        question: {
          es: "¿Qué formas de pago aceptan para un pedido internacional?",
          en: "What payment methods do you accept for an international order?",
        },
        answer: {
          es: "Tarjeta de crédito o débito, además de SINPE Móvil y transferencia bancaria para quien paga desde Costa Rica.",
          en: "Credit or debit card, plus SINPE Móvil and bank transfer for anyone paying from within Costa Rica.",
        },
      },
    ],
  },
];

export function getPillarBySlug(
  locale: "es" | "en",
  slug: string
): PillarContent | undefined {
  return PILLARS.find((p) => p.slug[locale] === slug);
}

export function getPillarById(id: PillarId): PillarContent | undefined {
  return PILLARS.find((p) => p.id === id);
}

/** Path (without domain, without locale) for a pillar, e.g. "/costa-rican-handicrafts". */
export function getPillarPath(id: PillarId, locale: "es" | "en"): string {
  const pillar = getPillarById(id);
  if (!pillar) return `/${locale}`;
  return `/${pillar.slug[locale]}`;
}
