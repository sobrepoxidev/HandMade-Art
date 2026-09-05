// src/lib/content/guides.ts
//
// Static editorial content for the guides section (/[locale]/guias,
// /[locale]/guides). ES canonical guides live under /guias, EN canonical
// guides live under /guides — each guide has its own slug per locale.
// Word counts target 600-900 words per locale across `sections`.

export interface LocalizedText {
  es: string;
  en: string;
}

export interface GuideFaq {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface GuideSection {
  h2: LocalizedText;
  paragraphs: { es: string[]; en: string[] };
}

export interface GuideContent {
  slug: LocalizedText;
  title: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  excerpt: LocalizedText;
  sections: GuideSection[];
  faqs: GuideFaq[];
  /** Category id (see src/lib/content/categories.ts) this guide links to. */
  relatedCategoryId: number;
  publishedAt: string;
  updatedAt: string;
}

export const GUIDES: GuideContent[] = [
  // 1 ────────────────────────────────────────────────────────────────
  {
    slug: {
      es: "como-usar-un-chorreador-de-cafe-paso-a-paso",
      en: "how-to-brew-coffee-costa-rican-chorreador",
    },
    title: {
      es: "Cómo usar un chorreador de café de madera, paso a paso",
      en: "How to Brew Coffee with a Costa Rican Chorreador",
    },
    metaTitle: {
      es: "Cómo usar un chorreador de café paso a paso",
      en: "How to Brew Coffee with a Chorreador",
    },
    metaDescription: {
      es: "Aprendé a usar un chorreador de café de madera paso a paso: bolsa, molienda, temperatura del agua y errores comunes al colar café tico.",
      en: "Learn to brew coffee with a wooden chorreador step by step: sock, grind size, water temperature, and common mistakes to avoid.",
    },
    excerpt: {
      es: "El método tradicional costarricense para colar café, explicado paso a paso para que te salga bien desde la primera taza.",
      en: "Costa Rica's traditional coffee-brewing method, explained step by step so you get it right from the very first cup.",
    },
    sections: [
      {
        h2: { es: "Qué necesitás antes de empezar", en: "What you need before you start" },
        paragraphs: {
          es: [
            "Para usar un chorreador de madera necesitás cuatro cosas: el chorreador (la estructura tallada que sostiene la bolsa), la bolsa de tela (llamada \"la bolsa\" o \"el calcetín\"), café recién molido y agua caliente, no hirviendo. La bolsa suele venir incluida con el chorreador, pero es una pieza de tela que se lava y se reutiliza cientos de veces, así que tratala con cuidado desde el primer uso.",
            "El punto de molienda ideal es medio-grueso, similar al de una prensa francesa. Si el café queda muy fino, la bolsa se tapa y el agua no baja; si queda muy grueso, el café sale aguado. La proporción clásica es de una cucharada de café por cada taza de agua, ajustable según qué tan cargado te guste.",
          ],
          en: [
            "To use a wooden chorreador you need four things: the dripper stand itself (the carved wooden frame that holds the sock), the cloth sock (called \"la bolsa\" in Spanish), freshly ground coffee, and hot — not boiling — water. The sock usually comes included with the dripper, but it's a piece of fabric meant to be washed and reused hundreds of times, so treat it carefully from the first use.",
            "The ideal grind is medium-coarse, similar to a French press grind. Too fine and the sock clogs, so the water won't drain; too coarse and the coffee comes out watery. The classic ratio is one tablespoon of coffee per cup of water, adjustable to how strong you like it.",
          ],
        },
      },
      {
        h2: { es: "El proceso, paso a paso", en: "The process, step by step" },
        paragraphs: {
          es: [
            "Primero, colocá el chorreador sobre la taza o jarra donde va a caer el café. Enganchá la bolsa en los dos ganchos o muescas del chorreador, de modo que quede como un embudo de tela suspendido. Agregá el café molido dentro de la bolsa: para una taza, una cucharada sopera es un buen punto de partida.",
            "Calentá el agua hasta que rompa el hervor y dejala reposar unos 30 segundos antes de verterla; a esa temperatura (entre 90 y 96°C) el café extrae bien sin quemarse. Vertí el agua caliente lentamente y en movimientos circulares sobre el café, en dos o tres tandas, dejando que el agua baje entre cada una. El café gotea directamente a la taza, sin necesidad de filtro de papel.",
            "Cuando termine de gotear, retirá el chorreador con la bolsa y serví. Para lavar la bolsa después de cada uso, enjuagala con agua caliente sin jabón —el jabón deja residuo que altera el sabor del café— y dejala secar al aire antes de guardarla.",
          ],
          en: [
            "First, place the dripper stand over the cup or pitcher where the coffee will fall. Hook the cloth sock onto the two notches on the frame so it hangs like a suspended fabric funnel. Add the ground coffee inside the sock: for one cup, a heaping tablespoon is a good starting point.",
            "Heat the water until it comes to a full boil, then let it rest for about 30 seconds before pouring — at that temperature (around 195-205°F) the coffee extracts well without scorching. Pour the hot water slowly in a circular motion over the grounds, in two or three passes, letting the water drain between each one. The coffee drips straight into the cup below, no paper filter needed.",
            "Once it's done dripping, lift off the dripper with the sock and serve. To clean the sock after each use, rinse it in hot water without soap — soap leaves a residue that changes the coffee's flavor — and let it air dry before storing it.",
          ],
        },
      },
      {
        h2: { es: "Errores comunes y cómo evitarlos", en: "Common mistakes and how to avoid them" },
        paragraphs: {
          es: [
            "El error más común es usar agua hirviendo directo de la olla: quema el café y saca sabores amargos. Otro es lavar la bolsa con jabón o dejarla mojada guardada, lo que genera moho y mal olor con el tiempo. También es común verter toda el agua de golpe, lo que hace que el café no tenga tiempo de extraerse bien y el resultado salga flojo.",
            "Si tu chorreador es nuevo, lavá la bolsa antes del primer uso con agua caliente para quitar el almidón de fábrica, que puede darle un sabor raro a la primera taza. Con el uso, la bolsa se va \"curando\" y el café sale cada vez más parejo.",
          ],
          en: [
            "The most common mistake is using water straight from a rolling boil — it scorches the coffee and pulls out bitter flavors. Another is washing the sock with soap or storing it wet, which leads to mold and off smells over time. It's also common to pour all the water in one go, which doesn't give the coffee time to extract properly and results in a weak cup.",
            "If your dripper is brand new, rinse the sock in hot water before the first use to remove factory starch, which can give the first cup an odd taste. With use, the sock \"seasons\" itself and the coffee comes out more consistent every time.",
          ],
        },
      },
      {
        h2: { es: "Variantes y trucos de barista casero", en: "Variations and home-barista tips" },
        paragraphs: {
          es: [
            "Si viajás seguido, un chorreador pequeño es fácil de empacar junto con una bolsa de repuesto, así que no necesitás depender de una cafetera eléctrica en un Airbnb o una cabina. Para un café más frío en días calurosos, coleá directamente sobre un vaso con hielo en vez de una taza; el hielo se derrite un poco con el calor del agua, pero el resultado es un café tipo \"flash brew\" con buen cuerpo.",
            "El chorreador también se presta para experimentar con la proporción de café: si preferís algo más suave para la tarde, bajá la cantidad de café a media cucharada por taza; si te gusta un café cargado por la mañana, subila a una cucharada y media. Usar granos de una sola finca (single origin) de Costa Rica, en vez de mezclas, deja notar mejor las diferencias que el chorreador resalta frente a otros métodos.",
            "Un hábito más que vale la pena adoptar: enjuagar y colgar la bolsa a secar justo después de usarla, en vez de dejarla mojada en el fregadero. Una bolsa que se seca por completo entre usos dura notablemente más y nunca desarrolla ese olor agrio que obliga a reemplazarla antes de tiempo; es un hábito de 30 segundos que te ahorra comprar una bolsa nueva cada pocas semanas.",
            "Con estos pasos y un poco de práctica, colar café en un chorreador se vuelve una rutina de apenas cinco minutos que rinde una taza consistente cada vez, y es también uno de los pequeños rituales que más se extrañan cuando alguien deja Costa Rica después de visitarla, lo que explica por qué tantos turistas terminan comprando uno para llevarse a casa.",
          ],
          en: [
            "If you travel often, a small chorreador is easy to pack along with a spare sock, so you don't have to rely on an electric coffee maker in an Airbnb or a cabin. For a cold coffee on a hot day, brew directly over a glass of ice instead of a cup; the ice melts a little from the hot water, but the result is a flash-brew style coffee with real body.",
            "The chorreador also lends itself to experimenting with ratio: for something milder in the afternoon, drop to half a tablespoon per cup; for a stronger morning coffee, bump it up to a tablespoon and a half. Using single-origin Costa Rican beans instead of a blend lets you notice more clearly the differences the chorreador brings out compared to other methods.",
            "One more habit worth building: rinse and hang the sock to dry right after use instead of leaving it wet in the sink. A sock that dries fully between uses lasts noticeably longer and never picks up that sour smell that forces an early replacement — it's a 30-second habit that saves you from buying a new sock every few weeks.",
            "With these steps and a bit of practice, brewing coffee in a chorreador becomes a five-minute routine that delivers a consistent cup every time — and it's also one of the small rituals people miss most after leaving Costa Rica, which is why so many visitors end up buying one to take home.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: { es: "¿Qué tipo de café se usa en un chorreador?", en: "What kind of coffee should I use in a chorreador?" },
        answer: {
          es: "Cualquier café de grano entero recién molido funciona, pero el café costarricense de altura con molienda medio-gruesa da mejores resultados por su balance de acidez y cuerpo.",
          en: "Any freshly ground whole-bean coffee works, but Costa Rican high-altitude coffee with a medium-coarse grind gives the best results thanks to its balance of acidity and body.",
        },
      },
      {
        question: { es: "¿Cada cuánto hay que cambiar la bolsa de tela?", en: "How often should I replace the cloth sock?" },
        answer: {
          es: "Con buen cuidado (enjuague sin jabón y secado al aire), una bolsa dura varios meses de uso diario. Cuando empieza a oler agrio incluso después de lavarla, es momento de reemplazarla.",
          en: "With proper care (rinsing without soap and air-drying), a sock lasts several months of daily use. When it starts smelling sour even after rinsing, it's time to replace it.",
        },
      },
      {
        question: { es: "¿El chorreador sirve para varias tazas a la vez?", en: "Can a chorreador brew several cups at once?" },
        answer: {
          es: "Sí, sobre una jarra en vez de una taza individual, ajustando la cantidad de café y agua proporcionalmente y vertiendo en más tandas para una extracción pareja.",
          en: "Yes, by placing it over a pitcher instead of a single cup, scaling the coffee and water proportionally, and pouring in more passes for an even extraction.",
        },
      },
    ],
    relatedCategoryId: 1,
    publishedAt: "2026-09-05",
    updatedAt: "2026-09-05",
  },

  // 2 ────────────────────────────────────────────────────────────────
  {
    slug: {
      es: "regalos-artesanales-de-costa-rica-guia-para-elegir",
      en: "costa-rican-handmade-gifts-how-to-choose",
    },
    title: {
      es: "Regalos artesanales de Costa Rica: guía para elegir bien",
      en: "Costa Rican Handmade Gifts: How to Choose the Right One",
    },
    metaTitle: {
      es: "Regalos artesanales de Costa Rica: cómo elegir",
      en: "Costa Rican Handmade Gifts: How to Choose",
    },
    metaDescription: {
      es: "Guía práctica para elegir un regalo artesanal de Costa Rica según la persona, el presupuesto y la ocasión, con ejemplos reales de piezas.",
      en: "A practical guide to choosing a Costa Rican handmade gift based on the person, budget and occasion, with real product examples.",
    },
    excerpt: {
      es: "Cómo elegir entre chorreadores, espejos, esculturas y más para acertar en cualquier ocasión, sin caer en el souvenir genérico.",
      en: "How to choose between coffee drippers, mirrors, sculptures and more to get it right for any occasion, without settling for a generic souvenir.",
    },
    sections: [
      {
        h2: { es: "Empezá por la persona, no por el objeto", en: "Start with the person, not the object" },
        paragraphs: {
          es: [
            "El error más común al elegir un regalo artesanal de Costa Rica es empezar por lo que hay disponible en vez de por a quién va dirigido. Si la persona toma café todos los días, un chorreador de café de madera es casi siempre un acierto: es funcional, tiene historia y se usa a diario, lo que lo hace memorable cada vez que se prepara una taza.",
            "Si en cambio buscás algo para decorar, pensá en el espacio donde va a vivir el regalo: un espejo tallado en madera funciona bien para una entrada o un pasillo, mientras que una escultura pequeña o una pieza de decoración de pared se adapta mejor a un escritorio o una repisa. Para alguien que ya tiene la casa llena de objetos, una pieza más pequeña —como un servilletero o una taza pintada a mano— suele ser más bienvenida que algo grande.",
          ],
          en: [
            "The most common mistake when choosing a Costa Rican handmade gift is starting from what's available instead of who it's for. If the person drinks coffee every day, a wooden coffee dripper is almost always a safe bet: it's functional, has a story, and gets used daily, which makes it memorable every time a cup is brewed.",
            "If you're looking for something decorative instead, think about the space the gift will live in: a hand-carved wooden mirror works well for an entryway or hallway, while a small sculpture or wall décor piece fits better on a desk or shelf. For someone whose home is already full of objects, a smaller piece — like a napkin holder or a hand-painted mug — is often more welcome than something large.",
          ],
        },
      },
      {
        h2: { es: "Elegí según el presupuesto y la ocasión", en: "Choose based on budget and occasion" },
        paragraphs: {
          es: [
            "Para presupuestos ajustados o regalos grupales, las tazas de peltre pintadas a mano y los servilleteros son opciones accesibles que no se sienten baratas: siguen siendo piezas artesanales únicas. Para un regalo de cumpleaños o un detalle de agradecimiento, un cofre de madera pequeño o una pieza de decoración mediana suele ser el punto justo entre precio y presencia.",
            "Para ocasiones más grandes —bodas, aniversarios, regalos corporativos— los espejos tallados, las esculturas de madera y las pinturas originales tienen más presencia y admiten personalización, como un grabado con fecha o iniciales. En estos casos vale la pena pedir con tiempo: las piezas personalizadas tardan aproximadamente 3 semanas en producirse.",
          ],
          en: [
            "For tighter budgets or group gifts, hand-painted enamel mugs and napkin holders are affordable options that don't feel cheap — they're still one-of-a-kind handmade pieces. For a birthday or a thank-you gift, a small wooden box or a mid-sized décor piece is usually the sweet spot between price and presence.",
            "For bigger occasions — weddings, anniversaries, corporate gifts — carved mirrors, wood sculptures and original paintings carry more presence and can be personalized, like an engraved date or initials. In these cases it's worth ordering ahead: custom pieces take about 3 weeks to produce.",
          ],
        },
      },
      {
        h2: { es: "Por qué un regalo artesanal de Costa Rica es diferente", en: "Why a Costa Rican handmade gift is different" },
        paragraphs: {
          es: [
            "A diferencia de un souvenir producido en serie, cada pieza de esta colección la talla o pinta a mano un artesano del programa de reinserción social en San Ramón, Alajuela. Eso significa dos cosas prácticas: primero, que ninguna pieza es exactamente igual a otra, así que el regalo se siente único de verdad; segundo, que la compra tiene un impacto directo y verificable en la vida de esa persona.",
            "Si no estás seguro de qué elegir, empezá por la categoría más cercana a los hábitos de la persona —café, decoración, cocina— y de ahí filtrá por presupuesto y ocasión. Todas las piezas se pueden enviar a todo Costa Rica o al extranjero, así que la distancia no es un obstáculo para regalar algo hecho a mano de verdad.",
          ],
          en: [
            "Unlike a mass-produced souvenir, every piece in this collection is hand-carved or hand-painted by an artisan in the social reintegration program in San Ramón, Alajuela. That means two practical things: first, no two pieces are exactly alike, so the gift feels genuinely unique; second, the purchase has a direct, traceable impact on that person's life.",
            "If you're not sure what to pick, start with the category closest to the person's habits — coffee, décor, cooking — then filter by budget and occasion from there. Every piece can ship anywhere in Costa Rica or internationally, so distance is never a reason to skip giving something genuinely handmade.",
          ],
        },
      },
      {
        h2: { es: "Ideas rápidas según la persona", en: "Quick ideas by recipient" },
        paragraphs: {
          es: [
            "Para alguien que ama el café: un chorreador de madera, idealmente acompañado de una taza de peltre pintada a mano para completar el set. Para alguien que está decorando una casa nueva: un espejo tallado o una pieza de decoración de pared que funcione como punto focal en una sala vacía. Para alguien que cocina seguido: un juego de cocina de madera o un servilletero, piezas que se usan literalmente todos los días.",
            "Para un regalo corporativo o de agradecimiento a un equipo completo: los servilleteros y las tazas de peltre se pueden pedir en volumen con un diseño consistente, manteniendo el presupuesto bajo control sin perder el toque artesanal. Y para quien ya tiene de todo: una escultura de madera pequeña con un animal representativo de Costa Rica suele sorprender, precisamente porque no es lo primero que se le ocurre a la mayoría de la gente.",
            "Si el regalo es para alguien que no conoce Costa Rica, contale brevemente de dónde viene la pieza al entregarla: quién la hizo, en qué taller y por qué cada compra apoya un programa de reinserción social. Ese contexto convierte un objeto bonito en un regalo con significado, y suele ser lo que la persona recuerda incluso más que la pieza en sí.",
            "En resumen: pensá primero en la persona y su rutina diaria, después en el espacio o la ocasión, y por último en el presupuesto. Ese orden evita el error más común de elegir un regalo artesanal de Costa Rica basado únicamente en lo que está disponible en ese momento, en vez de en lo que realmente va a usar o disfrutar quien lo recibe.",
          ],
          en: [
            "For a coffee lover: a wooden coffee dripper, ideally paired with a hand-painted enamel mug to round out the set. For someone decorating a new home: a carved mirror or a wall décor piece that works as a focal point in an empty room. For someone who cooks often: a wooden kitchen set or a napkin holder — pieces that get used literally every day.",
            "For a corporate gift or a thank-you to a whole team: napkin holders and enamel mugs can be ordered in bulk with a consistent design, keeping the budget in check without losing the handmade touch. And for someone who already has everything: a small wood sculpture of an animal representative of Costa Rica tends to surprise people, precisely because it's not the first thing most people think of.",
            "If the gift is for someone unfamiliar with Costa Rica, share a bit of context when you give it: who made the piece, in which workshop, and why every purchase supports a social reintegration program. That context turns a nice object into a gift with meaning, and it's often what the person remembers even more than the piece itself.",
            "In short: think about the person and their daily routine first, then the space or the occasion, and budget last. That order avoids the most common mistake — choosing a Costa Rican handmade gift based only on what happens to be in stock, instead of what the recipient will actually use or enjoy.",
            "Whichever piece you land on, ordering a little ahead of the date you need it gives you room to add engraving or ask a question about sizing, without the pressure of a last-minute deadline.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: { es: "¿Cuál es el regalo artesanal más popular?", en: "What's the most popular handmade gift?" },
        answer: {
          es: "El chorreador de café de madera, porque combina uso diario, historia cultural y un precio accesible.",
          en: "The wooden coffee dripper, because it combines daily use, cultural history and an accessible price.",
        },
      },
      {
        question: { es: "¿Puedo pedir el regalo envuelto o con nota?", en: "Can I get the gift wrapped or with a note?" },
        answer: {
          es: "Escribinos al coordinar tu pedido y te confirmamos las opciones de empaque disponibles según la pieza.",
          en: "Reach out when placing your order and we'll confirm the packaging options available for that piece.",
        },
      },
      {
        question: { es: "¿Cuánto tiempo antes debo pedir un regalo personalizado?", en: "How far in advance should I order a custom gift?" },
        answer: {
          es: "Al menos 3 semanas antes de la fecha que necesitás, ya que ese es el tiempo estimado de producción para piezas personalizadas.",
          en: "At least 3 weeks before the date you need it, since that's the estimated production time for custom pieces.",
        },
      },
    ],
    relatedCategoryId: 4,
    publishedAt: "2026-09-05",
    updatedAt: "2026-09-05",
  },

  // 3 ────────────────────────────────────────────────────────────────
  {
    slug: {
      es: "como-cuidar-madera-tallada-y-barnizada",
      en: "how-to-care-for-carved-varnished-wood",
    },
    title: {
      es: "Cómo cuidar madera tallada y barnizada para que dure años",
      en: "How to Care for Carved and Varnished Wood So It Lasts Years",
    },
    metaTitle: {
      es: "Cómo cuidar madera tallada y barnizada",
      en: "How to Care for Carved, Varnished Wood",
    },
    metaDescription: {
      es: "Guía de cuidado para piezas de madera tallada y barnizada: limpieza, humedad, luz solar y qué hacer si el barniz se opaca con el tiempo.",
      en: "A care guide for carved, varnished wood pieces: cleaning, humidity, sunlight, and what to do if the varnish dulls over time.",
    },
    excerpt: {
      es: "Lo que hay que saber para que un espejo, una escultura o un chorreador de madera se vean bien por años, no solo por meses.",
      en: "What you need to know so a mirror, sculpture or coffee dripper still looks good years from now, not just months.",
    },
    sections: [
      {
        h2: { es: "Los tres enemigos de la madera barnizada", en: "The three enemies of varnished wood" },
        paragraphs: {
          es: [
            "La madera tallada y barnizada dura décadas si se evitan tres cosas: la humedad constante, la luz solar directa y prolongada, y los cambios bruscos de temperatura. La humedad hace que la madera se hinche y el barniz se despegue en capas; el sol decolora el barniz y reseca la fibra de la madera con el tiempo; los cambios de temperatura (por ejemplo, cerca de una ventana que da mucho sol de día y se enfría de noche) generan grietas finas en piezas talladas con detalle.",
            "Ninguno de estos tres factores daña la pieza de un día para otro: el deterioro es gradual, lo que significa que también se puede prevenir con hábitos simples de ubicación y limpieza, sin necesidad de productos especiales.",
          ],
          en: [
            "Carved, varnished wood can last decades if you avoid three things: constant humidity, prolonged direct sunlight, and sudden temperature swings. Humidity makes the wood swell and the varnish peel in layers; sun bleaches the varnish and dries out the wood fiber over time; temperature swings (say, near a window that gets full sun by day and cools sharply at night) create fine cracks in finely carved pieces.",
            "None of these three factors damages a piece overnight — the wear is gradual, which means it can also be prevented with simple habits around placement and cleaning, without needing any special products.",
          ],
        },
      },
      {
        h2: { es: "Limpieza correcta, pieza por pieza", en: "The right way to clean each piece" },
        paragraphs: {
          es: [
            "Para piezas decorativas como espejos, esculturas y relieves de pared, un paño seco o ligeramente húmedo (nunca empapado) es suficiente para quitar el polvo. Pasalo siguiendo la dirección del tallado, no en contra, para no acumular polvo en los surcos más finos. Evitá productos de limpieza con alcohol o amoníaco directamente sobre el barniz: pueden opacarlo o dejarlo pegajoso.",
            "Para piezas de uso diario como chorreadores, juegos de cocina y servilleteros, lavá a mano con agua tibia y jabón suave, secá de inmediato con un paño y nunca las dejes en remojo ni las metás al lavavajillas: el calor y la humedad prolongada son justo lo que más daña el barniz. Un aceite mineral para madera aplicado una o dos veces al año ayuda a mantener el brillo y a sellar pequeñas grietas antes de que crezcan.",
          ],
          en: [
            "For decorative pieces like mirrors, sculptures and wall reliefs, a dry or slightly damp cloth (never soaking wet) is enough to remove dust. Wipe in the direction of the carving, not against it, so dust doesn't build up in the finer grooves. Avoid cleaning products with alcohol or ammonia directly on the varnish — they can dull it or leave it tacky.",
            "For everyday pieces like coffee drippers, kitchen sets and napkin holders, hand-wash with warm water and mild soap, dry immediately with a cloth, and never soak them or put them in the dishwasher — heat and prolonged moisture are exactly what damages varnish the most. A food-safe mineral oil applied once or twice a year helps keep the shine and seals small cracks before they grow.",
          ],
        },
      },
      {
        h2: { es: "Dónde ubicar cada pieza en la casa", en: "Where to place each piece in your home" },
        paragraphs: {
          es: [
            "La ubicación importa tanto como la limpieza. Evitá colgar espejos o relieves de pared justo frente a una ventana con sol directo la mayor parte del día; un pasillo interior o una pared lateral suele ser mejor opción. En la cocina, mantené los utensilios de madera lejos de la estufa y de fuentes directas de vapor constante, y guardalos en un lugar seco entre usos.",
            "Si notás que el barniz se ve opaco o reseco después de meses de uso, no es necesario reemplazar la pieza: una limpieza suave seguida de una capa fina de aceite mineral suele devolverle el brillo. Si aparece una grieta visible en el tallado, es mejor consultarnos antes de aplicar cualquier producto, para no empeorar el daño.",
          ],
          en: [
            "Placement matters as much as cleaning. Avoid hanging mirrors or wall reliefs directly facing a window that gets full sun most of the day; an interior hallway or a side wall is usually a better spot. In the kitchen, keep wooden utensils away from the stove and constant direct steam, and store them somewhere dry between uses.",
            "If the varnish looks dull or dry after months of use, you don't need to replace the piece — a gentle cleaning followed by a thin coat of mineral oil usually brings the shine back. If a visible crack appears in the carving, it's best to check with us before applying anything, so you don't make the damage worse.",
          ],
        },
      },
      {
        h2: { es: "Cuidados según la temporada en Costa Rica", en: "Seasonal care for Costa Rica's climate" },
        paragraphs: {
          es: [
            "En época lluviosa, la humedad ambiental sube considerablemente en gran parte del país. Es un buen momento para revisar que las piezas de madera no estén en contacto directo con paredes húmedas y, si notás que el ambiente se siente pegajoso, ventilar la habitación un rato ayuda a que la madera no absorba exceso de humedad. Un secado ocasional con paño evita que se forme una fina capa de humedad sobre el barniz.",
            "En época seca, sobre todo en zonas de Guanacaste o en habitaciones con aire acondicionado constante, la madera puede resecarse más rápido de lo normal. En esos casos, aplicar aceite mineral cada dos o tres meses en vez de una vez al año ayuda a compensar la sequedad del ambiente y evita que aparezcan grietas finas en el tallado.",
            "Si vas a guardar una pieza por un tiempo largo —por ejemplo, durante una mudanza o un viaje extendido— envolvela en tela de algodón, nunca en plástico, y guardala en un lugar seco y con algo de ventilación. El plástico atrapa la humedad residual de la madera y puede generar manchas o moho en el barniz durante un almacenamiento prolongado.",
            "En general, la regla más simple para recordar es: limpieza seca o casi seca, ubicación lejos de sol y humedad extremos, y una capa de aceite mineral una o dos veces al año. Con eso, cualquier pieza tallada de esta colección debería verse bien por muchos años, mucho después de lo que dura un souvenir producido en serie.",
          ],
          en: [
            "During the rainy season, ambient humidity rises considerably across much of the country. It's a good time to check that wooden pieces aren't touching damp walls directly, and if a room feels sticky, airing it out for a while helps keep the wood from absorbing excess moisture. Wiping pieces dry occasionally prevents a thin film of dampness from forming over the varnish.",
            "During the dry season, especially in areas like Guanacaste or in rooms with constant air conditioning, wood can dry out faster than usual. In those cases, applying mineral oil every two or three months instead of once a year helps offset the dry air and keeps fine cracks from forming in the carving.",
            "If you're storing a piece for a while — during a move or an extended trip, say — wrap it in cotton cloth, never plastic, and keep it somewhere dry with some airflow. Plastic traps residual moisture from the wood and can lead to staining or mold on the varnish during long storage.",
            "As a simple rule to remember: dry or near-dry cleaning, placement away from extreme sun and humidity, and a coat of mineral oil once or twice a year. With that, any carved piece in this collection should look good for many years — well past what a mass-produced souvenir ever lasts.",
            "None of this requires special tools or expensive products — just a bit of attention every few months, which is a small trade-off for a piece that's meant to last a lifetime. Treat it like a piece of furniture rather than a disposable decoration, and it will comfortably outlast most other things around it.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: { es: "¿Puedo usar aceite de cocina para tratar la madera?", en: "Can I use cooking oil to treat the wood?" },
        answer: {
          es: "No se recomienda: los aceites vegetales de cocina se ponen rancios con el tiempo. Usá aceite mineral apto para madera, disponible en la mayoría de ferreterías.",
          en: "It's not recommended: cooking oils go rancid over time. Use a food-safe mineral oil made for wood, available at most hardware stores.",
        },
      },
      {
        question: { es: "¿El barniz original se puede volver a aplicar en casa?", en: "Can the original varnish be reapplied at home?" },
        answer: {
          es: "Para mantenimiento ligero, el aceite mineral es suficiente. Si el barniz está muy dañado, contactanos para orientarte según la pieza específica.",
          en: "For light maintenance, mineral oil is enough. If the varnish is badly damaged, contact us and we'll advise based on the specific piece.",
        },
      },
      {
        question: { es: "¿La madera tallada aguanta clima húmedo como el de la costa?", en: "Does carved wood hold up in humid coastal climates?" },
        answer: {
          es: "Sí, pero con más atención: ventilá el espacio donde está la pieza y evitá que quede pegada a paredes exteriores húmedas.",
          en: "Yes, but it needs more attention: ventilate the room where the piece sits and avoid placing it flush against damp exterior walls.",
        },
      },
    ],
    relatedCategoryId: 3,
    publishedAt: "2026-09-05",
    updatedAt: "2026-09-05",
  },

  // 4 ────────────────────────────────────────────────────────────────
  {
    slug: {
      es: "espejos-tallados-en-madera-estilos-tamanos-donde-colgarlos",
      en: "hand-carved-wooden-mirrors-styles-sizes-where-to-hang",
    },
    title: {
      es: "Espejos tallados en madera: estilos, tamaños y dónde colgarlos",
      en: "Hand-Carved Wooden Mirrors: Styles, Sizes and Where to Hang Them",
    },
    metaTitle: {
      es: "Espejos tallados en madera: guía de estilos",
      en: "Hand-Carved Wooden Mirrors: Style Guide",
    },
    metaDescription: {
      es: "Guía para elegir un espejo tallado en madera: estilos de tallado, tamaños según el espacio y consejos para colgarlo correctamente.",
      en: "A guide to choosing a hand-carved wooden mirror: carving styles, sizing for your space, and tips for hanging it correctly.",
    },
    excerpt: {
      es: "Cómo elegir el estilo y tamaño correcto de espejo tallado en madera según el espacio donde vaya a colgarse.",
      en: "How to pick the right style and size of hand-carved wooden mirror for the space it's going to live in.",
    },
    sections: [
      {
        h2: { es: "Estilos de tallado más comunes", en: "The most common carving styles" },
        paragraphs: {
          es: [
            "Los espejos tallados en madera de nuestro taller se agrupan en tres estilos generales. El primero es geométrico: líneas rectas, ángulos repetidos y patrones simétricos que funcionan bien en espacios modernos o minimalistas. El segundo está inspirado en la naturaleza tropical costarricense: hojas, enredaderas y formas orgánicas que le dan un aire más cálido y artesanal al espacio. El tercero es más figurativo, con motivos de fauna local tallados directamente en el marco.",
            "Ningún estilo es \"mejor\" que otro; depende del resto de la decoración. Un espacio con muebles de líneas simples se beneficia de un marco más orgánico para romper la rigidez, mientras que un ambiente ya cargado de texturas naturales (madera, fibra, plantas) puede pedir un marco geométrico que aporte orden visual.",
          ],
          en: [
            "The hand-carved wooden mirrors from our workshop fall into three general styles. The first is geometric: straight lines, repeated angles and symmetrical patterns that work well in modern or minimalist spaces. The second draws from Costa Rica's tropical nature: leaves, vines and organic shapes that bring a warmer, more handmade feel to a room. The third is more figurative, with local wildlife motifs carved directly into the frame.",
            "No style is objectively \"better\" — it depends on the rest of the décor. A space with simple, clean furniture benefits from a more organic frame to break up the rigidity, while a room already full of natural textures (wood, fiber, plants) might call for a geometric frame that brings visual order.",
          ],
        },
      },
      {
        h2: { es: "Cómo elegir el tamaño correcto", en: "How to choose the right size" },
        paragraphs: {
          es: [
            "Antes de comprar, medí el espacio de pared disponible y restale al menos 10 cm a cada lado para que el espejo no se vea apretado. Como regla general, un espejo de entrada o pasillo funciona bien entre 40 y 60 cm de ancho; uno para sala o dormitorio, pensado como pieza central, puede ir de 60 cm en adelante.",
            "Si el espejo va sobre un mueble —una consola, un tocador o una cómoda— el ancho del espejo no debería superar el ancho del mueble; lo ideal es que quede entre un 60% y un 90% de esa medida para mantener proporción visual. Todas nuestras piezas indican sus medidas exactas (alto, ancho y a veces profundidad del marco) en la ficha de producto.",
          ],
          en: [
            "Before buying, measure the available wall space and subtract at least 4 inches on each side so the mirror doesn't look cramped. As a general rule, an entryway or hallway mirror works well between 16 and 24 inches wide; one meant as a centerpiece for a living room or bedroom can go from 24 inches up.",
            "If the mirror will hang above a piece of furniture — a console, a dresser, a vanity — its width shouldn't exceed the furniture's width; ideally it should sit between 60% and 90% of that measurement to keep visual proportion. Every one of our pieces lists exact dimensions (height, width and sometimes frame depth) on its product page.",
          ],
        },
      },
      {
        h2: { es: "Dónde colgarlo y cómo instalarlo bien", en: "Where to hang it and how to install it properly" },
        paragraphs: {
          es: [
            "La altura estándar para colgar un espejo es que su centro quede a la altura de los ojos de una persona promedio, entre 150 y 160 cm del piso. En una entrada, un espejo mediano frente a la puerta principal amplía visualmente el espacio y es el lugar más pedido por nuestros clientes. En un pasillo estrecho, un espejo alargado y angosto ayuda a que el corredor se sienta menos cerrado.",
            "Para instalarlo, usá anclajes aptos para el peso real de la pieza (la madera tallada pesa más que un espejo de marco plástico) y, si la pared es de drywall, buscá un montante o usá anclajes de expansión certificados para ese peso. Evitá colgarlo con un solo punto de apoyo si el marco es ancho: dos puntos de anclaje distribuyen mejor el peso y evitan que el espejo quede inclinado con el tiempo.",
          ],
          en: [
            "The standard height for hanging a mirror is with its center at average eye level, roughly 57 to 63 inches from the floor. In an entryway, a medium mirror facing the front door visually expands the space and is the most requested placement among our customers. In a narrow hallway, a tall, narrow mirror helps the corridor feel less closed in.",
            "To install it, use anchors rated for the piece's real weight (carved wood is heavier than a plastic-framed mirror), and if the wall is drywall, find a stud or use expansion anchors certified for that weight. Avoid hanging it from a single point if the frame is wide — two anchor points distribute the weight better and keep the mirror from tilting over time.",
          ],
        },
      },
      {
        h2: { es: "Cómo combinarlo con el resto de la decoración", en: "Pairing it with the rest of your décor" },
        paragraphs: {
          es: [
            "Un marco de madera tallada combina bien con metales cálidos —bronce, cobre, dorado envejecido— en lámparas o marcos de cuadros cercanos, y tiende a chocar visualmente con acabados muy fríos como el cromo pulido o el acero inoxidable brillante. Si tu espacio ya tiene mucho metal frío, un espejo con marco de madera puede ser justamente el contraste cálido que le falta.",
            "La iluminación también importa: colocar una luz cálida cerca del espejo (una lámpara de pared o un aplique) resalta el relieve del tallado con sombras suaves, mientras que una luz fría y directa desde arriba puede aplanar visualmente los detalles. Si el espejo va en una entrada oscura, una luz tenue a los lados suele funcionar mejor que una sola fuente cenital.",
            "Si querés armar una pared de espejos en vez de uno solo, combinar dos o tres tamaños distintos con el mismo estilo de tallado (por ejemplo, todos geométricos) da un resultado más intencional que mezclar tamaños iguales con estilos muy distintos entre sí. Dejar espacio parejo entre cada pieza —unos 8 a 10 cm— ayuda a que el conjunto se vea ordenado en vez de saturado.",
            "Sea cual sea el estilo o el tamaño que elijas, medí dos veces antes de taladrar: es el paso que más se salta la gente y el que más determina si el espejo termina viéndose bien proporcionado en la pared o no.",
          ],
          en: [
            "A carved wood frame pairs well with warm metals — bronze, copper, aged gold — in nearby lamps or picture frames, and tends to clash visually with very cold finishes like polished chrome or bright stainless steel. If your space already has a lot of cool metal, a wood-framed mirror can be exactly the warm contrast it's missing.",
            "Lighting matters too: placing a warm light source near the mirror (a wall sconce or a small lamp) brings out the carving's relief with soft shadows, while a cold, direct overhead light can visually flatten the detail. If the mirror hangs in a dim entryway, soft side lighting usually works better than a single overhead source.",
            "If you want to build a mirror wall instead of hanging just one, combining two or three different sizes in the same carving style (all geometric, say) reads as more intentional than mixing equal sizes with very different styles. Leaving even spacing between each piece — roughly 3 to 4 inches — keeps the grouping looking curated instead of cluttered.",
            "Whatever style or size you choose, measure twice before drilling — it's the step people skip most often, and the one that most determines whether the mirror ends up looking well-proportioned on the wall or not. A quick paper cutout taped to the wall beforehand can save you an unnecessary hole, and it only takes a couple of minutes to try before committing to a spot.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: { es: "¿Los espejos incluyen sistema para colgar?", en: "Do the mirrors include a hanging system?" },
        answer: {
          es: "Sí, la mayoría incluye un sistema de colgado en la parte trasera; el detalle exacto se indica en cada ficha de producto.",
          en: "Yes, most include a hanging mechanism on the back; the exact detail is listed on each product page.",
        },
      },
      {
        question: { es: "¿Puedo pedir un espejo con medidas personalizadas?", en: "Can I order a mirror in a custom size?" },
        answer: {
          es: "Sí, tomamos pedidos personalizados de tamaño y estilo, con un tiempo de producción de aproximadamente 3 semanas.",
          en: "Yes, we take custom orders for size and style, with a production time of about 3 weeks.",
        },
      },
      {
        question: { es: "¿Qué estilo conviene para una casa con decoración minimalista?", en: "What style works for a minimalist home?" },
        answer: {
          es: "El estilo geométrico suele encajar mejor: sus líneas limpias no compiten con una decoración ya despejada.",
          en: "The geometric style usually fits best — its clean lines don't compete with an already-uncluttered décor.",
        },
      },
    ],
    relatedCategoryId: 3,
    publishedAt: "2026-09-05",
    updatedAt: "2026-09-05",
  },

  // 5 ────────────────────────────────────────────────────────────────
  {
    slug: {
      es: "souvenirs-de-costa-rica-hechos-a-mano",
      en: "authentic-handmade-costa-rican-souvenirs",
    },
    title: {
      es: "Souvenirs de Costa Rica hechos a mano (no importados)",
      en: "Authentic Handmade Costa Rican Souvenirs (Not Imported)",
    },
    metaTitle: {
      es: "Souvenirs de Costa Rica hechos a mano, no importados",
      en: "Authentic Handmade Costa Rican Souvenirs",
    },
    metaDescription: {
      es: "Cómo distinguir un souvenir de Costa Rica hecho a mano de uno importado, y qué piezas artesanales llevarte como recuerdo auténtico.",
      en: "How to tell a genuine handmade Costa Rican souvenir from an imported one, and which artisan pieces make an authentic keepsake.",
    },
    excerpt: {
      es: "La diferencia entre un souvenir hecho a mano en Costa Rica y uno importado no siempre es obvia. Esta guía te ayuda a distinguirlos.",
      en: "The difference between a souvenir handmade in Costa Rica and an imported one isn't always obvious. This guide helps you tell them apart.",
    },
    sections: [
      {
        h2: { es: "El problema del souvenir importado", en: "The problem with imported souvenirs" },
        paragraphs: {
          es: [
            "Una parte importante de lo que se vende como \"souvenir de Costa Rica\" en zonas turísticas en realidad se produce en serie fuera del país y solo se le agrega una etiqueta o un imán con la bandera. Es difícil notarlo a simple vista: el empaque y el precio bajo son las principales pistas. Un imán de refrigerador genérico o una pulsera de plástico con \"Costa Rica\" impreso casi nunca se fabrica localmente.",
            "La forma más confiable de saber que una pieza es realmente artesanal es que tenga variaciones visibles entre unidades: vetas de madera distintas, ligeras diferencias en el tallado o en la pincelada. Si dos piezas \"artesanales\" en un estante son absolutamente idénticas, probablemente salieron de un molde industrial, no de la mano de un artesano.",
          ],
          en: [
            "A significant share of what's sold as a \"Costa Rican souvenir\" in tourist areas is actually mass-produced outside the country, with only a sticker or a flag magnet added on top. It's hard to spot at a glance — the packaging and the low price are the main clues. A generic fridge magnet or a plastic bracelet printed with \"Costa Rica\" is almost never made locally.",
            "The most reliable way to know a piece is genuinely handmade is that it shows visible variation between units: different wood grain, slight differences in the carving or the brushwork. If two \"artisan\" pieces on a shelf are perfectly identical, they probably came from an industrial mold, not an artisan's hands.",
          ],
        },
      },
      {
        h2: { es: "Qué preguntar antes de comprar un souvenir", en: "What to ask before buying a souvenir" },
        paragraphs: {
          es: [
            "Tres preguntas simples filtran la mayoría de las piezas importadas: ¿de qué material está hecho?, ¿dónde se fabricó?, y ¿quién lo hizo? Un vendedor que puede responder con detalle —el tipo de madera, el pueblo o taller de origen, incluso el nombre del artesano— casi siempre está vendiendo una pieza real. Si la respuesta es vaga o el vendedor no sabe, es una señal de alerta.",
            "También ayuda fijarse en el precio en relación al tiempo de trabajo evidente en la pieza: una talla detallada en madera maciza no puede costar lo mismo que producirla en serie con máquina, así que un precio demasiado bajo para el nivel de detalle suele indicar que no es artesanal.",
          ],
          en: [
            "Three simple questions filter out most imported pieces: what material is it made of, where was it made, and who made it? A seller who can answer in detail — the type of wood, the town or workshop of origin, even the artisan's name — is almost always selling something real. A vague answer, or a seller who doesn't know, is a red flag.",
            "It also helps to weigh the price against the visible amount of work in the piece: a detailed carving in solid wood can't cost the same as a machine-made equivalent, so a price that's too low for the level of detail usually signals it isn't handmade.",
          ],
        },
      },
      {
        h2: { es: "Souvenirs que sí son 100% hechos en Costa Rica", en: "Souvenirs that really are 100% made in Costa Rica" },
        paragraphs: {
          es: [
            "En nuestro catálogo, cada pieza —desde un chorreador de café hasta una taza de peltre pintada a mano— se produce en el taller de San Ramón, Alajuela, por artesanos del programa de reinserción social. Eso significa trazabilidad real: sabemos quién hizo cada pieza y cómo se hizo, algo que ningún souvenir importado puede ofrecer.",
            "Para alguien que visita el país o para quien quiere enviar un recuerdo genuino a otra persona, los chorreadores de madera y las tazas pintadas a mano son las opciones más fáciles de transportar y las más representativas de la cultura cafetalera costarricense. Todas se pueden enviar directamente a cualquier parte del mundo, sin necesidad de cargarlas en la maleta.",
          ],
          en: [
            "In our catalog, every piece — from a coffee dripper to a hand-painted enamel mug — is produced in the workshop in San Ramón, Alajuela, by artisans in the social reintegration program. That means real traceability: we know who made each piece and how, something no imported souvenir can offer.",
            "For someone visiting the country, or for sending a genuine keepsake to someone else, wooden coffee drippers and hand-painted mugs are the easiest to transport and the most representative of Costa Rican coffee culture. All of them can ship directly anywhere in the world, no suitcase required.",
          ],
        },
      },
      {
        h2: { es: "Qué evitar al comprar en zonas turísticas", en: "What to avoid when buying in tourist areas" },
        paragraphs: {
          es: [
            "Algunos puestos en zonas muy turísticas mezclan piezas locales genuinas con productos importados en el mismo estante, sin distinguirlos, lo que hace fácil llevarse algo que no es lo que parece. Desconfiá especialmente de tiendas donde todo el inventario tiene el mismo nivel de \"perfección\" industrial, sin ninguna variación entre piezas del mismo diseño.",
            "Comprar directo del taller o de un sitio que muestre claramente el origen de cada pieza —como este catálogo, donde cada producto se fabrica en San Ramón, Alajuela— elimina esa incertidumbre. Podés pedir con anticipación y recibir la pieza en tu casa o en tu hotel antes de viajar de regreso, sin depender de encontrarla en el aeropuerto a última hora.",
            "Guardá el comprobante de compra o el correo de confirmación del pedido: si alguna vez necesitás explicar de dónde viene la pieza —a aduanas, a un asegurador de envíos, o simplemente a la persona a quien se la regalás— tener ese respaldo evita dudas y confirma que se trata de una pieza artesanal genuina con origen verificable.",
            "Al final, la mejor garantía de autenticidad no es un sello ni una etiqueta, sino la posibilidad de rastrear la pieza hasta un taller y un artesano reales. Eso es exactamente lo que buscamos ofrecer con cada producto de este catálogo, para que un souvenir de Costa Rica siga siendo un objeto con historia años después de la compra.",
            "La próxima vez que busques un recuerdo de un viaje, hacete esas tres preguntas antes de pagar: material, origen y quién lo hizo. Es un filtro rápido que funciona en cualquier país, no solo en Costa Rica.",
          ],
          en: [
            "Some stalls in heavily touristed areas mix genuine local pieces with imported products on the same shelf without distinguishing them, making it easy to walk away with something that isn't what it seems. Be especially wary of shops where the entire inventory shows the same level of industrial \"perfection,\" with no variation between pieces of the same design.",
            "Buying directly from the workshop, or from a site that clearly shows each piece's origin — like this catalog, where every product is made in San Ramón, Alajuela — removes that uncertainty. You can order ahead of time and have the piece delivered to your home or hotel before you fly back, instead of hoping to find it at the airport at the last minute.",
            "Keep the receipt or order confirmation email: if you ever need to explain where the piece came from — to customs, to a shipping insurer, or simply to the person you're gifting it to — having that on hand removes any doubt and confirms it's a genuine handmade piece with a verifiable origin.",
            "In the end, the best guarantee of authenticity isn't a stamp or a tag — it's the ability to trace the piece back to a real workshop and a real artisan. That's exactly what we aim to offer with every product in this catalog, so a Costa Rican souvenir keeps being an object with a story years after the purchase.",
            "Next time you're shopping for a travel keepsake anywhere, ask those same three questions before you pay: material, origin, and who made it. It's a quick filter that works in any country, not just Costa Rica, and it takes less time than deciding which shelf to display the souvenir on once you get home.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: { es: "¿Cómo sé si una pieza es realmente hecha en Costa Rica?", en: "How do I know a piece is really made in Costa Rica?" },
        answer: {
          es: "Buscá variaciones naturales entre piezas, un vendedor que pueda explicar el origen y el material, y desconfiá de precios demasiado bajos para el nivel de detalle.",
          en: "Look for natural variation between pieces, a seller who can explain the origin and material, and be wary of prices too low for the level of detail.",
        },
      },
      {
        question: { es: "¿Cuál es el souvenir más fácil de llevar en la maleta?", en: "What's the easiest souvenir to pack in a suitcase?" },
        answer: {
          es: "Las tazas de peltre pintadas a mano y los servilleteros: son livianos, resistentes y compactos.",
          en: "Hand-painted enamel mugs and napkin holders — they're light, sturdy and compact.",
        },
      },
      {
        question: { es: "¿Puedo enviar un souvenir directamente sin llevarlo en la maleta?", en: "Can I ship a souvenir directly instead of packing it?" },
        answer: {
          es: "Sí, hacemos envíos nacionales e internacionales directos desde el taller a la dirección que nos indiques.",
          en: "Yes, we ship both domestically and internationally directly from the workshop to the address you provide.",
        },
      },
    ],
    relatedCategoryId: 4,
    publishedAt: "2026-09-05",
    updatedAt: "2026-09-05",
  },

  // 6 ────────────────────────────────────────────────────────────────
  {
    slug: {
      es: "que-es-un-programa-de-reinsercion-social-y-por-que-tu-compra-importa",
      en: "what-is-a-social-reintegration-program-why-your-purchase-matters",
    },
    title: {
      es: "Qué es un programa de reinserción social y por qué tu compra importa",
      en: "What a Social Reintegration Program Is and Why Your Purchase Matters",
    },
    metaTitle: {
      es: "Reinserción social: por qué tu compra importa",
      en: "Social Reintegration: Why Your Purchase Matters",
    },
    metaDescription: {
      es: "Qué es un programa de reinserción social en Costa Rica y cómo comprar arte hecho a mano apoya directamente ese proceso.",
      en: "What a social reintegration program in Costa Rica is, and how buying handmade art directly supports that process.",
    },
    excerpt: {
      es: "Detrás de cada pieza de este catálogo hay un proceso real de reinserción social. Esto es lo que eso significa en la práctica.",
      en: "Behind every piece in this catalog is a real social reintegration process. Here's what that actually means in practice.",
    },
    sections: [
      {
        h2: { es: "Qué es la reinserción social en la práctica", en: "What social reintegration looks like in practice" },
        paragraphs: {
          es: [
            "Un programa de reinserción social busca que una persona que estuvo privada de libertad o en una situación de vulnerabilidad social pueda reconstruir una vida estable a través del trabajo. En la práctica, eso significa aprender un oficio —en este caso, la talla en madera y la pintura artesanal— dentro de un taller estructurado, con horarios, metas de producción y acompañamiento constante.",
            "El oficio no es incidental: el trabajo manual especializado, como tallar un espejo o pintar una taza a mano, da a la persona una habilidad concreta y transferible, algo que puede seguir usando para generar ingreso mucho después de terminar el programa. Es distinto de un trabajo temporal sin capacitación: es un oficio real con demanda en el mercado.",
          ],
          en: [
            "A social reintegration program helps someone who has been incarcerated or in a situation of social vulnerability rebuild a stable life through work. In practice, that means learning a trade — in this case, wood carving and hand-painting — inside a structured workshop, with schedules, production goals and ongoing support.",
            "The trade itself isn't incidental: specialized manual work, like carving a mirror or hand-painting a mug, gives the person a concrete, transferable skill — something they can keep using to earn income long after the program ends. It's different from an untrained temporary job: it's a real trade with market demand.",
          ],
        },
      },
      {
        h2: { es: "El taller en San Ramón, Alajuela", en: "The workshop in San Ramón, Alajuela" },
        paragraphs: {
          es: [
            "El taller que produce cada pieza de este catálogo está en San Ramón, Alajuela, una zona con tradición cafetalera y de trabajo en madera. Ahí, los artesanos reciben la madera —principalmente cedro— y la transforman a mano en chorreadores, espejos, esculturas y el resto de las categorías del catálogo, siguiendo procesos que van del tallado inicial al barnizado final.",
            "No es un taller simbólico ni una donación disfrazada de comercio: cada pieza se vende a precio de mercado por su calidad y diseño. La diferencia es que, en lugar de que la ganancia vaya a un intermediario o a una fábrica, sostiene directamente el trabajo del artesano y la continuidad del programa.",
          ],
          en: [
            "The workshop that produces every piece in this catalog is in San Ramón, Alajuela, an area with a long tradition of coffee farming and woodworking. There, artisans receive the wood — mainly cedar — and hand-transform it into coffee drippers, mirrors, sculptures and every other category in the catalog, following a process that runs from initial carving to final varnishing.",
            "This isn't a symbolic workshop or charity disguised as commerce — each piece sells at market price because of its quality and design. The difference is that instead of the profit going to a middleman or a factory, it directly sustains the artisan's work and the program's continuity.",
          ],
        },
      },
      {
        h2: { es: "Qué significa esto para vos como comprador", en: "What this means for you as a buyer" },
        paragraphs: {
          es: [
            "Comprar una pieza de este catálogo no es una donación: es una compra normal de un producto de calidad que, además, tiene un efecto directo y medible. Cada venta se traduce en trabajo remunerado para un artesano en proceso de reinserción, lo que reduce la probabilidad de reincidencia y fortalece su estabilidad económica y familiar.",
            "Si querés profundizar más en el programa —cómo funciona, quiénes participan y qué pasa después de que una persona termina su proceso—, tenemos una página dedicada con más detalle sobre el impacto social del proyecto. Cada compra que hacés a través de este sitio contribuye directamente a esa misión.",
          ],
          en: [
            "Buying a piece from this catalog isn't a donation — it's a regular purchase of a quality product that also happens to have a direct, measurable effect. Every sale translates into paid work for an artisan in a reintegration process, which lowers the likelihood of reoffending and strengthens their economic and family stability.",
            "If you want to go deeper into the program — how it works, who takes part, and what happens after someone completes their process — we have a dedicated page with more detail on the project's social impact. Every purchase you make through this site contributes directly to that mission.",
          ],
        },
      },
      {
        h2: { es: "Qué resultados buscamos y cómo se ven", en: "What outcomes we're aiming for" },
        paragraphs: {
          es: [
            "El objetivo de fondo de un programa de reinserción social no es solo dar empleo temporal: es reducir la reincidencia y construir estabilidad de largo plazo. Un artesano que aprende un oficio remunerado, mantiene un horario y ve el resultado tangible de su trabajo —una pieza vendida, un cliente satisfecho— tiene una base mucho más sólida para no volver a un ciclo de vulnerabilidad social que alguien sin esa estructura.",
            "Esto también beneficia a las familias del artesano: un ingreso estable y una habilidad transferible significan más independencia económica hoy y más opciones a futuro, incluso después de terminar el programa formal. Por eso cada compra recurrente importa tanto como la primera: sostiene el trabajo en el tiempo, no solo en un momento puntual.",
            "Contar esta historia también tiene un efecto multiplicador: cuando alguien recibe un chorreador o un espejo tallado como regalo y sabe de dónde viene, es más probable que vuelva a comprar o que recomiende el catálogo a otra persona. Ese boca a boca, sostenido con productos de calidad real, es una de las formas más efectivas de mantener el programa funcionando a largo plazo.",
            "Si esta guía te ayudó a entender mejor el proyecto, la forma más directa de apoyarlo sigue siendo la más simple: comprar una pieza cuando la necesites, en vez de optar por una alternativa producida en masa. No hace falta un gesto grande; una compra normal, hecha con esa información de fondo, ya es suficiente.",
            "Y si conocés a alguien que colecciona souvenirs o le gusta el café, compartir esta historia junto con el regalo suele significar más que cualquier explicación que podamos poner nosotros en una página de producto.",
          ],
          en: [
            "The underlying goal of a social reintegration program isn't just temporary employment — it's reducing reoffending and building long-term stability. An artisan who learns a paid trade, keeps a schedule, and sees the tangible result of their work — a piece sold, a satisfied customer — has a much stronger foundation for staying out of a cycle of social vulnerability than someone without that structure.",
            "This also benefits the artisan's family: a steady income and a transferable skill mean more economic independence today and more options down the road, even after the formal program ends. That's why every repeat purchase matters as much as the first one — it sustains the work over time, not just in a single moment.",
            "Telling this story also has a multiplying effect: when someone receives a coffee dripper or a carved mirror as a gift and knows where it came from, they're more likely to buy again or recommend the catalog to someone else. That word of mouth, backed by genuinely good products, is one of the most effective ways to keep the program running over the long term.",
            "If this guide helped you understand the project better, the most direct way to support it is still the simplest one: buy a piece when you need one, instead of defaulting to a mass-produced alternative. It doesn't take a grand gesture — a regular purchase, made with that context in mind, is already enough.",
            "And if you know someone who collects souvenirs or loves coffee, sharing this story along with the gift usually means more than anything we could put on a product page ourselves. It's a small effort that turns a purchase into something the recipient actually remembers long after the object itself gets used.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: { es: "¿El dinero de mi compra va directo al artesano?", en: "Does the money from my purchase go directly to the artisan?" },
        answer: {
          es: "El programa remunera el trabajo de los artesanos como parte de su proceso de reinserción; las ventas sostienen esa operación de forma continua.",
          en: "The program pays artisans for their work as part of their reintegration process; sales sustain that operation on an ongoing basis.",
        },
      },
      {
        question: { es: "¿Puedo visitar el taller en San Ramón?", en: "Can I visit the workshop in San Ramón?" },
        answer: {
          es: "Escribinos por los canales de contacto del sitio para consultar disponibilidad de visitas.",
          en: "Reach out through the site's contact channels to ask about visit availability.",
        },
      },
      {
        question: { es: "¿Dónde puedo leer más sobre el impacto social del proyecto?", en: "Where can I read more about the project's social impact?" },
        answer: {
          es: "Tenemos una página dedicada al impacto social con más detalle sobre el programa y su funcionamiento.",
          en: "We have a dedicated social-impact page with more detail on the program and how it runs.",
        },
      },
    ],
    relatedCategoryId: 1,
    publishedAt: "2026-09-05",
    updatedAt: "2026-09-05",
  },

  // 7 ────────────────────────────────────────────────────────────────
  {
    slug: {
      es: "chorreador-vs-prensa-francesa-vs-v60",
      en: "chorreador-vs-french-press-vs-v60",
    },
    title: {
      es: "Chorreador vs. prensa francesa vs. V60: ¿cuál elegir?",
      en: "Chorreador vs. French Press vs. V60: Which Should You Choose?",
    },
    metaTitle: {
      es: "Chorreador vs prensa francesa vs V60",
      en: "Chorreador vs French Press vs V60",
    },
    metaDescription: {
      es: "Comparamos el chorreador de madera, la prensa francesa y el V60 en sabor, costo, mantenimiento y facilidad de uso para ayudarte a elegir.",
      en: "We compare the wooden chorreador, the French press and the V60 on flavor, cost, upkeep and ease of use to help you decide.",
    },
    excerpt: {
      es: "Tres métodos, tres resultados distintos en la taza. Esta comparación te ayuda a decidir cuál conviene según tu rutina.",
      en: "Three methods, three different results in the cup. This comparison helps you decide which fits your routine.",
    },
    sections: [
      {
        h2: { es: "Cómo funciona cada método", en: "How each method works" },
        paragraphs: {
          es: [
            "El chorreador usa una bolsa de tela que actúa como filtro reutilizable: el agua caliente pasa por el café molido y gotea directamente a la taza, sin filtro de papel. La prensa francesa sumerge el café molido en agua caliente durante unos minutos y luego separa los sólidos con un émbolo metálico que empuja una malla hacia el fondo. El V60 usa un filtro de papel cónico y un vertido controlado en espiral, diseñado para una extracción más limpia y precisa.",
            "Los tres parten de la misma idea —agua caliente en contacto con café molido— pero cambian el material del filtro (tela, metal o papel) y el tiempo de contacto, y eso es lo que más define el resultado final en la taza.",
          ],
          en: [
            "The chorreador uses a cloth sock that acts as a reusable filter: hot water passes through the ground coffee and drips straight into the cup, no paper filter involved. The French press submerges the grounds in hot water for a few minutes, then separates the solids with a metal plunger that pushes a mesh screen to the bottom. The V60 uses a conical paper filter and a controlled spiral pour, designed for a cleaner, more precise extraction.",
            "All three start from the same idea — hot water meeting ground coffee — but they differ in filter material (cloth, metal or paper) and contact time, and that's what most defines the final result in the cup.",
          ],
        },
      },
      {
        h2: { es: "Sabor, cuerpo y mantenimiento", en: "Flavor, body and upkeep" },
        paragraphs: {
          es: [
            "El chorreador da un café con cuerpo medio y una textura ligeramente más redonda que el V60, porque la tela deja pasar algunos aceites del café que un filtro de papel retiene. La prensa francesa produce el café con más cuerpo de los tres, con más aceites y algo de sedimento, ideal para quien prefiere un café intenso. El V60 da la taza más limpia y con más notas de acidez definidas, porque el papel filtra casi todos los aceites y partículas finas.",
            "En mantenimiento, la prensa francesa y el V60 son más simples de limpiar (vidrio o cerámica, y filtro de papel desechable), mientras que el chorreador requiere lavar y secar la bolsa de tela después de cada uso para evitar mal olor. A cambio, la bolsa no genera residuo desechable como el filtro de papel del V60.",
          ],
          en: [
            "The chorreador produces a medium-bodied coffee with a slightly rounder texture than the V60, because the cloth lets through some of the coffee's natural oils that a paper filter would trap. The French press produces the most full-bodied cup of the three, with more oils and some sediment, ideal for anyone who likes an intense coffee. The V60 gives the cleanest cup with the most defined acidity notes, since the paper filters out nearly all oils and fine particles.",
            "In terms of upkeep, the French press and the V60 are simpler to clean (glass or ceramic, plus a disposable paper filter), while the chorreador requires washing and drying the cloth sock after every use to avoid odor. In exchange, the sock doesn't create disposable waste the way the V60's paper filter does.",
          ],
        },
      },
      {
        h2: { es: "¿Cuál conviene según tu rutina?", en: "Which one fits your routine?" },
        paragraphs: {
          es: [
            "Si valorás la tradición, un café con cuerpo medio y una pieza que también funciona como objeto decorativo en la cocina, el chorreador de madera es la opción más completa: no necesita electricidad, no genera desechos de filtro y tiene una historia cultural real detrás. Si preferís un café más intenso y no te molesta un poco de sedimento, la prensa francesa es la mejor opción. Si buscás precisión y una taza más limpia, y estás dispuesto a comprar filtros de papel de forma regular, el V60 es el método más técnico de los tres.",
            "Para alguien que recién empieza a explorar métodos de café manual, el chorreador tiene la curva de aprendizaje más suave: no requiere una técnica de vertido tan precisa como el V60 ni un tiempo de inmersión exacto como la prensa francesa.",
          ],
          en: [
            "If you value tradition, a medium-bodied cup, and a piece that also works as a decorative object in the kitchen, the wooden chorreador is the most complete option: it needs no electricity, produces no filter waste, and carries a real cultural history behind it. If you prefer a bolder coffee and don't mind a bit of sediment, the French press is the better fit. If you want precision and a cleaner cup, and don't mind buying paper filters regularly, the V60 is the most technical of the three.",
            "For someone just starting to explore manual coffee brewing, the chorreador has the gentlest learning curve: it doesn't demand the precise pour technique the V60 does, nor the exact steep time a French press requires.",
          ],
        },
      },
      {
        h2: { es: "Costo total y huella ambiental", en: "Total cost and environmental footprint" },
        paragraphs: {
          es: [
            "A largo plazo, el chorreador y la prensa francesa salen más económicos porque no dependen de un consumible que hay que comprar una y otra vez. El V60 requiere filtros de papel de forma constante, un gasto pequeño por unidad pero que se acumula con el uso diario a lo largo de los años, además de generar desecho después de cada taza.",
            "En términos ambientales, la bolsa de tela del chorreador y la malla metálica de la prensa francesa se reutilizan cientos de veces antes de reemplazarse, mientras que cada filtro de papel del V60 se usa una sola vez. Para alguien que toma decisiones de compra pensando en el desecho que genera, el chorreador es la opción con menor huella por taza a lo largo del tiempo.",
            "Otro punto a favor del chorreador: la pieza de madera en sí no se desgasta con el uso normal, así que el único consumible real es la bolsa de tela, que se reemplaza cada varios meses. Con el equipo de cristal de una prensa francesa el riesgo es la rotura accidental, mientras que el chorreador de madera tolera mucho mejor un golpe o una caída sin quebrarse.",
            "Ninguno de los tres métodos es objetivamente \"el mejor\": cada uno resuelve una necesidad distinta, y muchos amantes del café terminan teniendo los tres en la cocina para usarlos según el momento del día o el estado de ánimo.",
          ],
          en: [
            "In the long run, the chorreador and the French press end up cheaper because neither depends on a consumable you have to keep buying. The V60 requires paper filters on an ongoing basis — a small cost per unit, but one that adds up with daily use over the years, on top of generating waste after every single cup.",
            "Environmentally, the chorreador's cloth sock and the French press's metal mesh get reused hundreds of times before needing replacement, while each V60 paper filter is used only once. For anyone factoring waste into their buying decisions, the chorreador is the option with the smallest footprint per cup over time.",
            "One more point in the chorreador's favor: the wooden stand itself doesn't wear out with normal use, so the only real consumable is the cloth sock, replaced every few months. With a French press's glass carafe the risk is accidental breakage, while a wooden chorreador tolerates a bump or a drop far better without cracking.",
            "None of the three methods is objectively \"the best\" — each solves a different need, and plenty of coffee lovers end up keeping all three in the kitchen, reaching for whichever fits the time of day or the mood. If you only have room for one, the chorreador is the most versatile starting point, since it also works fine for a quick single cup or a small pitcher for guests.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: { es: "¿Cuál de los tres es más económico a largo plazo?", en: "Which of the three is cheapest in the long run?" },
        answer: {
          es: "El chorreador y la prensa francesa, porque no dependen de filtros desechables como el V60.",
          en: "The chorreador and the French press, since neither depends on disposable filters the way the V60 does.",
        },
      },
      {
        question: { es: "¿Puedo usar café pre-molido en un chorreador?", en: "Can I use pre-ground coffee in a chorreador?" },
        answer: {
          es: "Sí, siempre que la molienda sea medio-gruesa; una molienda muy fina puede tapar la bolsa de tela.",
          en: "Yes, as long as the grind is medium-coarse; a very fine grind can clog the cloth sock.",
        },
      },
      {
        question: { es: "¿Cuál método da más cafeína por taza?", en: "Which method extracts the most caffeine per cup?" },
        answer: {
          es: "La diferencia entre los tres es mínima y depende más de la cantidad de café usada que del método en sí.",
          en: "The difference between the three is minimal and depends more on the amount of coffee used than on the method itself.",
        },
      },
    ],
    relatedCategoryId: 1,
    publishedAt: "2026-09-05",
    updatedAt: "2026-09-05",
  },

  // 8 ────────────────────────────────────────────────────────────────
  {
    slug: {
      es: "fauna-de-costa-rica-en-la-artesania-tucan-rana-colibri-quetzal",
      en: "costa-rican-wildlife-in-folk-art",
    },
    title: {
      es: "Fauna de Costa Rica en la artesanía: tucán, rana, colibrí y quetzal",
      en: "Costa Rican Wildlife in Folk Art: Toucans, Frogs, Hummingbirds and Quetzals",
    },
    metaTitle: {
      es: "Fauna de Costa Rica en la artesanía hecha a mano",
      en: "Costa Rican Wildlife in Handmade Folk Art",
    },
    metaDescription: {
      es: "Por qué el tucán, la rana de ojos rojos, el colibrí y el quetzal son tan comunes en la artesanía costarricense, y cómo se tallan a mano.",
      en: "Why toucans, red-eyed tree frogs, hummingbirds and quetzals are so common in Costa Rican folk art, and how they're hand-carved.",
    },
    excerpt: {
      es: "Cuatro animales aparecen una y otra vez en la artesanía costarricense. Esta guía explica por qué, y qué representa cada uno.",
      en: "Four animals show up again and again in Costa Rican folk art. This guide explains why, and what each one represents.",
    },
    sections: [
      {
        h2: { es: "Por qué estos cuatro animales", en: "Why these four animals" },
        paragraphs: {
          es: [
            "Costa Rica tiene una biodiversidad desproporcionada para su tamaño: alberga cerca del 5% de las especies del planeta en apenas el 0.03% de la superficie terrestre. De esa enorme variedad, cuatro animales se volvieron símbolos visuales del país en el arte popular: el tucán, la rana de ojos rojos, el colibrí y el quetzal. No es casualidad: los cuatro son fáciles de reconocer a la distancia por su silueta o su color, lo que los hace ideales para tallar o pintar de forma que cualquiera los identifique de inmediato.",
            "Además, cada uno tiene una presencia cultural específica: el quetzal es un símbolo histórico de libertad en varias culturas mesoamericanas y hoy es una de las aves más buscadas por observadores en las montañas de Costa Rica; el tucán es probablemente el animal más asociado internacionalmente con la selva tropical; la rana de ojos rojos es casi un ícono no oficial del turismo costarricense; y el colibrí representa la enorme diversidad de polinizadores del país, con más de 50 especies registradas.",
          ],
          en: [
            "Costa Rica holds a disproportionate amount of biodiversity for its size: it's home to roughly 5% of the planet's species on just 0.03% of its land area. Out of that huge variety, four animals became visual symbols of the country in folk art: the toucan, the red-eyed tree frog, the hummingbird and the resplendent quetzal. That's not a coincidence — all four are easy to recognize at a distance by their silhouette or color, which makes them ideal to carve or paint in a way anyone can identify instantly.",
            "Each one also carries a specific cultural weight: the quetzal is a historic symbol of freedom across several Mesoamerican cultures and today is one of the most sought-after birds for watchers in Costa Rica's mountains; the toucan is probably the animal most internationally associated with tropical rainforest; the red-eyed tree frog is almost an unofficial icon of Costa Rican tourism; and the hummingbird represents the country's huge diversity of pollinators, with more than 50 recorded species.",
          ],
        },
      },
      {
        h2: { es: "Cómo se talla o se pinta cada figura", en: "How each figure is carved or painted" },
        paragraphs: {
          es: [
            "En madera, el tucán y el quetzal suelen tallarse en relieve o como figura de bulto (tridimensional), porque su plumaje permite jugar con capas y texturas que se notan bien en la madera. La rana de ojos rojos, en cambio, se presta más para piezas pequeñas y pintadas, donde el color —verde brillante con ojos rojos y patas naranjas— es lo que más comunica, más que la textura tallada. El colibrí, por su tamaño real pequeño, aparece frecuentemente en piezas delicadas como detalles de espejos o esculturas de escritorio.",
            "El proceso siempre empieza igual: el artesano elige el bloque de madera según la veta y el tamaño de la figura, dibuja una guía a lápiz, y talla de lo general a lo específico —primero la silueta completa, después los detalles como plumas o el patrón de la piel—. El barniz final protege la pieza y, en las tallas pintadas, fija el color para que no se opaque con el tiempo.",
          ],
          en: [
            "In wood, the toucan and the quetzal are usually carved in relief or as a full three-dimensional figure, because their plumage allows for layers and textures that read well in wood. The red-eyed tree frog, on the other hand, lends itself more to small, painted pieces, where color — bright green with red eyes and orange feet — communicates more than the carved texture does. The hummingbird, given its actual small size, often shows up in delicate pieces like mirror details or desk sculptures.",
            "The process always starts the same way: the artisan chooses the wood block based on grain and figure size, sketches a pencil guide, and carves from general to specific — first the full silhouette, then details like feathers or skin pattern. The final varnish protects the piece and, on painted carvings, locks in the color so it doesn't dull over time.",
          ],
        },
      },
      {
        h2: { es: "Dónde encontrar estas piezas en nuestro catálogo", en: "Where to find these pieces in our catalog" },
        paragraphs: {
          es: [
            "Las esculturas de madera son la categoría donde más aparecen estos cuatro animales, ya sea como pieza única de escritorio o repisa, o como parte de una colección temática. También aparecen como motivo tallado en el marco de algunos espejos y en piezas de decoración de pared, para quien prefiere un formato más grande y visible.",
            "La disponibilidad exacta de cada animal varía según la colección activa del taller, así que si buscás una figura específica —por ejemplo, un quetzal para regalo— te recomendamos revisar directamente la categoría de esculturas o escribirnos para consultar disponibilidad y tiempos de producción para un encargo personalizado.",
          ],
          en: [
            "Wood sculptures are the category where these four animals show up most, either as a single desk or shelf piece, or as part of a themed collection. They also appear as a carved motif on some mirror frames and in wall décor pieces, for anyone who prefers a larger, more visible format.",
            "Exact availability of each animal varies with the workshop's active collection, so if you're looking for a specific figure — say, a quetzal as a gift — we recommend checking the sculptures category directly or reaching out to ask about availability and production time for a custom commission.",
          ],
        },
      },
      {
        h2: { es: "Cómo saber si una talla de animal es auténtica", en: "How to tell if an animal carving is authentic" },
        paragraphs: {
          es: [
            "Una talla hecha a mano casi siempre muestra pequeñas irregularidades: un ala ligeramente distinta a la otra, marcas finas de gubia visibles de cerca, un peso real de madera maciza en la mano. Una figura moldeada en resina o producida en masa suele ser demasiado simétrica y perfecta, y pesa menos de lo que aparenta porque no es madera sólida.",
            "Si te interesa una figura en particular, revisá el material indicado en la ficha de producto y, si tenés dudas, escribinos directamente: podemos confirmarte el origen exacto de la pieza y, si querés, el nombre del artesano que la talló como parte del programa en San Ramón, Alajuela.",
            "Otra señal útil: una talla auténtica suele conservar parte del olor natural de la madera recién trabajada durante las primeras semanas, algo que una pieza de resina o plástico pintado nunca tiene. Si tenés la oportunidad de olerla de cerca antes de comprar, es una forma sencilla y rápida de confirmar que estás frente a madera real.",
            "Sea cual sea el animal que elijas, una talla auténtica siempre va a tener algo que una réplica producida en masa nunca podrá igualar: el tiempo real de una persona dedicado a esa pieza específica.",
          ],
          en: [
            "A hand-carved figure almost always shows small irregularities: one wing slightly different from the other, fine gouge marks visible up close, the real heft of solid wood in your hand. A figure molded from resin or mass-produced tends to be too symmetrical and perfect, and weighs less than it looks like it should because it isn't solid wood.",
            "If you're interested in a particular figure, check the material listed on the product page, and if you have doubts, reach out directly — we can confirm the piece's exact origin and, if you'd like, the name of the artisan who carved it as part of the program in San Ramón, Alajuela.",
            "Another useful sign: an authentic carving usually keeps some of the natural scent of freshly worked wood for the first few weeks, something a resin or painted-plastic piece never has. If you get the chance to smell it up close before buying, it's a quick, simple way to confirm you're looking at real wood.",
            "Whichever animal you choose, an authentic carving will always have something a mass-produced replica never can: the real, human time one person spent on that specific piece.",
          ],
        },
      },
    ],
    faqs: [
      {
        question: { es: "¿Qué animal es el más pedido para regalo?", en: "Which animal is the most requested as a gift?" },
        answer: {
          es: "El tucán y el quetzal son los más pedidos, seguidos de cerca por la rana de ojos rojos en piezas pequeñas.",
          en: "The toucan and the quetzal are the most requested, closely followed by the red-eyed tree frog in smaller pieces.",
        },
      },
      {
        question: { es: "¿Las figuras son fieles al color real del animal?", en: "Are the figures true to the animal's real coloring?" },
        answer: {
          es: "Sí, los artesanos siguen los colores reales del animal como referencia, con ligeras variaciones artísticas entre piezas.",
          en: "Yes, artisans use the animal's real coloring as a reference, with slight artistic variation from piece to piece.",
        },
      },
      {
        question: { es: "¿Puedo encargar una figura de un animal que no está en el catálogo?", en: "Can I commission a figure of an animal that's not in the catalog?" },
        answer: {
          es: "Escribinos para consultar; según el diseño y la complejidad, podemos coordinar un encargo personalizado con un tiempo de producción de aproximadamente 3 semanas.",
          en: "Reach out to ask — depending on the design and complexity, we can coordinate a custom commission with a production time of about 3 weeks.",
        },
      },
    ],
    relatedCategoryId: 6,
    publishedAt: "2026-09-05",
    updatedAt: "2026-09-05",
  },
];

export function getGuideBySlug(locale: "es" | "en", slug: string): GuideContent | undefined {
  return GUIDES.find((g) => g.slug[locale] === slug);
}

/** Path (without domain) for a guide, e.g. "/es/guias/<slug>" or "/en/guides/<slug>". */
export function getGuidePath(slug: string, locale: "es" | "en"): string {
  const guide =
    GUIDES.find((g) => g.slug.es === slug || g.slug.en === slug) ?? undefined;
  const localizedSlug = guide ? guide.slug[locale] : slug;
  const base = locale === "es" ? "guias" : "guides";
  return `/${locale}/${base}/${localizedSlug}`;
}

/** All (locale, slug) pairs for sitemap generation — canonical URLs only. */
export function getAllGuideSlugs(): { locale: "es" | "en"; slug: string; updatedAt: string }[] {
  return GUIDES.flatMap((g) => [
    { locale: "es" as const, slug: g.slug.es, updatedAt: g.updatedAt },
    { locale: "en" as const, slug: g.slug.en, updatedAt: g.updatedAt },
  ]);
}
