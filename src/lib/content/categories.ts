// src/lib/content/categories.ts
//
// Static SEO/content layer for category landing pages (/[locale]/c/[slug]).
// Keyed to the live `categories` table (id is the source of truth for the
// product query); slugs, copy and FAQs live here so the page component stays
// a thin renderer. Keep this file the single place editors touch to change
// category landing copy.

export interface LocalizedText {
  es: string;
  en: string;
}

export interface CategoryFaq {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface CategoryContent {
  /** Matches `categories.id` in Supabase. */
  id: number;
  /** DB category names, used as fallback labels and for the products query join. */
  dbName: LocalizedText;
  slugs: LocalizedText;
  h1: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  /** Two paragraphs, ~120-180 words per locale. */
  intro: { es: [string, string]; en: [string, string] };
  faqs: CategoryFaq[];
  /** Category ids of related categories to cross-link. */
  relatedIds: number[];
}

export const CATEGORIES: CategoryContent[] = [
  {
    id: 1,
    dbName: { es: "Chorreadores de café", en: "Coffee drippers" },
    slugs: { es: "chorreadores-de-cafe", en: "coffee-drippers" },
    h1: {
      es: "Chorreadores de café de madera tallados a mano",
      en: "Hand-Carved Wooden Coffee Drippers",
    },
    metaTitle: {
      es: "Chorreadores de café de madera | Costa Rica",
      en: "Wooden Coffee Drippers | Costa Rica",
    },
    metaDescription: {
      es: "Chorreadores de café de madera tallados a mano en Costa Rica. Regalo artesanal auténtico. Envíos a todo el país e internacionales.",
      en: "Handmade wooden coffee drippers carved in Costa Rica. Authentic Costa Rican gift. Nationwide and international shipping.",
    },
    intro: {
      es: [
        "El chorreador de café de madera es uno de los objetos más representativos de la cultura cafetalera costarricense: una estructura tallada en cedro que sostiene una bolsa de tela por donde el agua caliente pasa lentamente sobre el café molido. Cada pieza de nuestra colección es tallada a mano por artesanos del programa de reinserción social en San Ramón, Alajuela, así que ningún chorreador sale idéntico a otro: las vetas de la madera, el tono del barniz y el detalle del tallado varían de pieza en pieza.",
        "Más que un utensilio de cocina, un chorreador de madera es un regalo artesanal de Costa Rica con historia detrás: cada compra apoya directamente el trabajo de personas en proceso de reinserción social. Es la opción favorita de quienes buscan un souvenir de Costa Rica auténtico —no un imán de refrigerador hecho en serie— para llevarse a casa o regalar a alguien que aprecia el café y el trabajo hecho a mano. Aceptamos pedidos personalizados con grabado si querés algo único para una boda, un aniversario o un regalo corporativo.",
      ],
      en: [
        "The wooden coffee dripper — chorreador — is one of the most recognizable objects in Costa Rican coffee culture: a carved cedar stand that holds a cloth sock through which hot water slowly filters over ground coffee. Every piece in this collection is hand-carved by artisans in the social reintegration program in San Ramón, Alajuela, so no two drippers are exactly alike — the wood grain, the varnish tone and the carving detail vary piece to piece.",
        "More than a kitchen tool, a wooden coffee dripper is a handmade Costa Rican gift with a real story behind it: every purchase directly supports people in a social reintegration process. It's the go-to pick for anyone looking for an authentic Costa Rican souvenir instead of a mass-produced fridge magnet — whether it's for your own kitchen or a gift for someone who appreciates coffee and handmade craft. We take custom engraving orders if you want something unique for a wedding, anniversary or corporate gift.",
      ],
    },
    faqs: [
      {
        question: { es: "¿Qué es un chorreador de café?", en: "What is a chorreador?" },
        answer: {
          es: "Es el método tradicional costarricense para colar café: una estructura de madera (\"palo de chorreador\") sostiene una bolsa de tela sobre la taza; se vierte agua caliente sobre el café molido dentro de la bolsa y el líquido gotea directamente a la taza, sin filtros de papel.",
          en: "It's the traditional Costa Rican method for brewing coffee: a wooden stand holds a cloth sock over the cup; hot water is poured over the ground coffee inside the sock and drips straight into the cup below — no paper filters needed.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí. Enviamos a todo Costa Rica y también hacemos envíos internacionales. El tiempo y costo de envío se calculan según tu ubicación al momento de la compra.",
          en: "Yes. We ship anywhere in Costa Rica and also internationally. Shipping time and cost are calculated based on your location at checkout.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "Aceptamos SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito. Todos los métodos son procesados de forma segura.",
          en: "We accept SINPE Móvil (Costa Rica), bank transfer, and credit or debit card. All methods are processed securely.",
        },
      },
      {
        question: { es: "¿Puedo pedir un chorreador personalizado?", en: "Can I order a custom dripper?" },
        answer: {
          es: "Sí, hacemos pedidos personalizados con grabado o medidas específicas. El tiempo de producción para piezas a medida es de aproximadamente 3 semanas.",
          en: "Yes, we take custom orders with engraving or specific dimensions. Production time for made-to-order pieces is about 3 weeks.",
        },
      },
    ],
    relatedIds: [10, 3, 2],
  },
  {
    id: 2,
    dbName: { es: "juegos de cocina", en: "Kitchen sets" },
    slugs: { es: "juegos-de-cocina", en: "kitchen-sets" },
    h1: {
      es: "Juegos de cocina artesanales de madera",
      en: "Handmade Wooden Kitchen Sets",
    },
    metaTitle: {
      es: "Juegos de cocina de madera hechos a mano | CR",
      en: "Handmade Wooden Kitchen Sets | Costa Rica",
    },
    metaDescription: {
      es: "Juegos de cocina de madera tallados a mano en Costa Rica: utensilios y sets únicos para la cocina. Regalo artesanal con impacto social.",
      en: "Handmade wooden kitchen sets carved in Costa Rica: one-of-a-kind utensils and sets for the kitchen. A handmade gift with social impact.",
    },
    intro: {
      es: [
        "Nuestros juegos de cocina de madera combinan función y artesanía: utensilios tallados a mano en cedro costarricense, pensados para usarse todos los días y no solo para exhibir. Cada set es trabajado por artesanos del programa de reinserción social en San Ramón, Alajuela, con un acabado en barniz natural que resiste el uso diario en la cocina. Incluyen desde cucharones y espátulas hasta tablas y soportes, siempre con el grano de la madera visible en cada pieza.",
        "Son un regalo artesanal de Costa Rica ideal para quien está armando su primera cocina, para una boda, o como souvenir de Costa Rica para alguien a quien le guste cocinar. Cada pieza incluye la marca del taller y, si necesitás una cantidad grande para un evento o un pedido personalizado, podemos coordinarlo con un tiempo de producción de aproximadamente 3 semanas. También combinan bien con un chorreador de café de madera como set de regalo.",
      ],
      en: [
        "Our wooden kitchen sets combine function and craft: utensils hand-carved from Costa Rican cedar, made to be used every day, not just displayed. Each set is made by artisans in the social reintegration program in San Ramón, Alajuela, finished with a natural varnish that holds up to daily kitchen use. They range from spoons and spatulas to boards and stands, each one showing the natural wood grain.",
        "They make a great Costa Rican handmade gift for someone setting up a first kitchen, a wedding registry, or as a souvenir for a home cook. Each piece carries the workshop's mark, and if you need a larger quantity for an event or a custom order, we can coordinate that with a production time of about 3 weeks. They also pair well with a wooden coffee dripper as a combined gift set.",
      ],
    },
    faqs: [
      {
        question: { es: "¿De qué madera están hechos los juegos de cocina?", en: "What wood are the kitchen sets made from?" },
        answer: {
          es: "Principalmente cedro costarricense, tratado y barnizado para uso en cocina. Cada pieza indica sus medidas exactas en la ficha del producto.",
          en: "Mainly Costa Rican cedar, treated and varnished for kitchen use. Each piece lists its exact dimensions on the product page.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, enviamos a todo Costa Rica y también al extranjero. El costo y tiempo de entrega dependen de tu ubicación.",
          en: "Yes, we ship anywhere in Costa Rica and internationally too. Cost and delivery time depend on your location.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito, todos procesados de forma segura.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card, all processed securely.",
        },
      },
      {
        question: { es: "¿Cómo cuido la madera para que dure?", en: "How do I care for the wood so it lasts?" },
        answer: {
          es: "Lavá a mano con agua tibia y jabón suave, secá de inmediato y evitá el lavavajillas y el remojo prolongado. Un aceite mineral ocasional mantiene el brillo del barniz.",
          en: "Hand-wash with warm water and mild soap, dry immediately, and avoid the dishwasher or long soaking. An occasional coat of mineral oil keeps the varnish looking fresh.",
        },
      },
    ],
    relatedIds: [1, 8, 7],
  },
  {
    id: 3,
    dbName: { es: "Espejos", en: "Mirrors" },
    slugs: { es: "espejos-tallados", en: "carved-mirrors" },
    h1: {
      es: "Espejos tallados en madera hechos a mano",
      en: "Hand-Carved Wooden Mirrors",
    },
    metaTitle: {
      es: "Espejos tallados en madera a mano | Costa Rica",
      en: "Hand-Carved Wooden Mirrors | Costa Rica",
    },
    metaDescription: {
      es: "Espejos tallados en madera a mano en Costa Rica, con marcos únicos de cedro. Ideales para decorar y como regalo artesanal con impacto social.",
      en: "Hand-carved wooden mirrors from Costa Rica with one-of-a-kind cedar frames. Perfect for décor and as a handmade gift with social impact.",
    },
    intro: {
      es: [
        "Un espejo tallado en madera es una de las piezas más pedidas de nuestro taller: el marco se talla a mano en cedro costarricense, con motivos que van de líneas geométricas simples a diseños inspirados en la fauna y flora del país. Cada espejo lo produce un artesano del programa de reinserción social en San Ramón, Alajuela, así que las variaciones naturales de la madera hacen que cada pieza sea única.",
        "Son un regalo artesanal de Costa Rica que funciona tanto para decorar una entrada, un pasillo o una sala, como para un souvenir de Costa Rica que se lleva bien en la maleta o se envía por correo. Si buscás un tamaño o acabado específico para un espacio particular, aceptamos pedidos personalizados con un tiempo de producción de aproximadamente 3 semanas.",
      ],
      en: [
        "A hand-carved wooden mirror is one of our workshop's most requested pieces: the frame is carved by hand from Costa Rican cedar, with motifs ranging from simple geometric lines to designs inspired by the country's wildlife and plants. Every mirror is made by an artisan in the social reintegration program in San Ramón, Alajuela, so the wood's natural variation makes each piece one of a kind.",
        "They make a Costa Rican handmade gift that works equally well decorating an entryway, hallway or living room, or as a Costa Rican souvenir that travels well in a suitcase or by mail. If you need a specific size or finish for a particular space, we take custom orders with a production time of about 3 weeks.",
      ],
    },
    faqs: [
      {
        question: { es: "¿Qué tamaños de espejo tienen disponibles?", en: "What mirror sizes are available?" },
        answer: {
          es: "Manejamos varios tamaños, desde espejos de pared pequeños hasta piezas grandes de sala. Las medidas exactas de cada modelo están en su ficha de producto.",
          en: "We carry several sizes, from small wall mirrors to larger living-room pieces. Exact dimensions for each model are listed on its product page.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, empacamos con cuidado para proteger el vidrio y enviamos a todo Costa Rica y al extranjero.",
          en: "Yes, we pack carefully to protect the glass and ship anywhere in Costa Rica and internationally.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card.",
        },
      },
      {
        question: { es: "¿Cómo cuido el marco de madera y el barniz?", en: "How do I care for the wood frame and varnish?" },
        answer: {
          es: "Limpiá el marco con un paño seco o ligeramente húmedo, lejos de la luz solar directa y de la humedad constante, y evitá químicos abrasivos sobre el barniz.",
          en: "Wipe the frame with a dry or slightly damp cloth, keep it away from direct sunlight and constant humidity, and avoid harsh chemicals on the varnish.",
        },
      },
    ],
    relatedIds: [9, 6, 4],
  },
  {
    id: 4,
    dbName: { es: "Decoración", en: "Decoration" },
    slugs: { es: "decoracion", en: "decor" },
    h1: {
      es: "Decoración artesanal hecha a mano",
      en: "Handmade Décor",
    },
    metaTitle: {
      es: "Decoración artesanal hecha a mano | Costa Rica",
      en: "Handmade Costa Rican Décor",
    },
    metaDescription: {
      es: "Piezas de decoración hechas a mano en Costa Rica: madera tallada y detalles únicos para el hogar. Regalo artesanal con impacto social real.",
      en: "Handmade décor pieces from Costa Rica: carved wood and one-of-a-kind details for the home. A handmade gift with real social impact.",
    },
    intro: {
      es: [
        "Esta colección reúne piezas de decoración hechas a mano que no encajan en una sola categoría: detalles en madera tallada, acabados en cedro costarricense y toques inspirados en la naturaleza tropical del país. Cada objeto sale del taller de artesanos en proceso de reinserción social en San Ramón, Alajuela, con el mismo cuidado en el tallado y el barniz que el resto de nuestra colección.",
        "Son ideales como regalo artesanal de Costa Rica para quien ya tiene lo básico y busca algo distinto para su casa, o como souvenir de Costa Rica que cuente una historia real al llegar a otro país. Si tenés un espacio específico en mente y querés una pieza a medida, coordinamos pedidos personalizados con un tiempo de producción de aproximadamente 3 semanas.",
      ],
      en: [
        "This collection brings together handmade décor pieces that don't fit neatly into one category: carved wood details, Costa Rican cedar finishes, and touches inspired by the country's tropical nature. Every object comes out of the workshop of artisans in a social reintegration process in San Ramón, Alajuela, with the same care in the carving and varnish as the rest of our collection.",
        "They make a great Costa Rican handmade gift for someone who already has the basics and wants something different for their home, or a Costa Rican souvenir with a real story behind it when it arrives in another country. If you have a specific space in mind and want a made-to-order piece, we coordinate custom orders with a production time of about 3 weeks.",
      ],
    },
    faqs: [
      {
        question: { es: "¿Qué tipo de piezas incluye esta categoría?", en: "What kind of pieces are in this category?" },
        answer: {
          es: "Objetos decorativos variados en madera tallada y otros materiales trabajados a mano, pensados para mesas, repisas y paredes.",
          en: "A mix of decorative objects in carved wood and other hand-worked materials, made for tables, shelves and walls.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, enviamos a todo Costa Rica y también hacemos envíos internacionales.",
          en: "Yes, we ship anywhere in Costa Rica and internationally as well.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card.",
        },
      },
      {
        question: { es: "¿Puedo pedir una pieza personalizada?", en: "Can I order a custom piece?" },
        answer: {
          es: "Sí, aceptamos pedidos personalizados en tamaño, grabado o acabado. El tiempo de producción es de aproximadamente 3 semanas.",
          en: "Yes, we take custom orders for size, engraving or finish. Production time is about 3 weeks.",
        },
      },
    ],
    relatedIds: [9, 3, 6],
  },
  {
    id: 5,
    dbName: { es: "Pinturas", en: "Paintings" },
    slugs: { es: "pinturas", en: "paintings" },
    h1: {
      es: "Pinturas artesanales costarricenses",
      en: "Costa Rican Handmade Paintings",
    },
    metaTitle: {
      es: "Pinturas artesanales hechas a mano | Costa Rica",
      en: "Handmade Costa Rican Paintings",
    },
    metaDescription: {
      es: "Pinturas hechas a mano en Costa Rica, con escenas y colores inspirados en el país. Arte original como regalo artesanal con impacto social.",
      en: "Handmade paintings from Costa Rica with scenes and colors inspired by the country. Original art as a handmade gift with social impact.",
    },
    intro: {
      es: [
        "Nuestras pinturas son piezas originales trabajadas a mano por artesanos del programa de reinserción social en San Ramón, Alajuela, con paletas de color y escenas inspiradas en los paisajes, pueblos y fauna de Costa Rica. No son reproducciones impresas: cada lienzo tiene pinceladas y detalles propios, por lo que ninguna pintura es exactamente igual a otra. Trabajamos formatos pequeños para espacios reducidos y piezas más grandes para una pared principal.",
        "Son un regalo artesanal de Costa Rica con presencia real en cualquier pared, y también un souvenir de Costa Rica distinto a lo que se encuentra en tiendas de suvenires típicas. Si buscás una pieza para un espacio con medidas específicas o un tema en particular, podemos coordinar un encargo personalizado con un tiempo de producción de aproximadamente 3 semanas. Cada pintura llega lista para colgar.",
      ],
      en: [
        "Our paintings are original pieces made by hand by artisans in the social reintegration program in San Ramón, Alajuela, with color palettes and scenes inspired by Costa Rica's landscapes, towns and wildlife. These aren't printed reproductions — each canvas has its own brushwork and detail, so no two paintings are exactly alike. We work in small formats for tight spaces and larger pieces for a statement wall.",
        "They make a Costa Rican handmade gift with real presence on any wall, and a Costa Rican souvenir that's different from what you'd find in a typical souvenir shop. If you're looking for a piece to fit a specific space or theme, we can coordinate a custom commission with a production time of about 3 weeks. Every painting arrives ready to hang.",
      ],
    },
    faqs: [
      {
        question: { es: "¿Las pinturas son piezas originales o impresiones?", en: "Are the paintings originals or prints?" },
        answer: {
          es: "Son piezas originales pintadas a mano, no impresiones. Cada una tiene variaciones únicas en pincelada y color.",
          en: "They're original hand-painted pieces, not prints. Each one has unique variations in brushwork and color.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, empacamos las pinturas con protección rígida y enviamos a todo Costa Rica y al extranjero.",
          en: "Yes, we pack paintings with rigid protection and ship anywhere in Costa Rica and internationally.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card.",
        },
      },
      {
        question: { es: "¿Puedo encargar un tema o tamaño específico?", en: "Can I commission a specific theme or size?" },
        answer: {
          es: "Sí, tomamos encargos personalizados de tema y tamaño. El tiempo de producción es de aproximadamente 3 semanas.",
          en: "Yes, we take custom commissions for theme and size. Production time is about 3 weeks.",
        },
      },
    ],
    relatedIds: [6, 9, 4],
  },
  {
    id: 6,
    dbName: { es: "Esculturas", en: "Sculptures" },
    slugs: { es: "esculturas-de-madera", en: "wood-sculptures" },
    h1: {
      es: "Esculturas de madera talladas a mano",
      en: "Hand-Carved Wood Sculptures",
    },
    metaTitle: {
      es: "Esculturas de madera talladas a mano | CR",
      en: "Hand-Carved Wood Sculptures | Costa Rica",
    },
    metaDescription: {
      es: "Esculturas de madera talladas a mano en Costa Rica, muchas inspiradas en la fauna tropical. Regalo artesanal único con impacto social.",
      en: "Hand-carved wood sculptures from Costa Rica, many inspired by tropical wildlife. A unique handmade gift with social impact.",
    },
    intro: {
      es: [
        "Cada escultura de madera de nuestra colección se talla a mano, bloque por bloque, por artesanos del programa de reinserción social en San Ramón, Alajuela. Muchas piezas están inspiradas en la fauna costarricense —tucanes, colibríes, ranas de ojos rojos, quetzales— y otras en formas abstractas o utilitarias, siempre trabajadas en cedro y otras maderas locales. El proceso puede tomar varios días por pieza según el nivel de detalle del tallado.",
        "Son de las piezas favoritas para quienes buscan un regalo artesanal de Costa Rica con carácter escultórico, o un souvenir de Costa Rica que se note tallado a mano y no producido en serie. Aceptamos encargos personalizados de tamaño o motivo, con un tiempo de producción de aproximadamente 3 semanas. Funcionan tanto en un escritorio como en una repisa o estante de sala.",
      ],
      en: [
        "Every wood sculpture in this collection is carved by hand, block by block, by artisans in the social reintegration program in San Ramón, Alajuela. Many pieces are inspired by Costa Rican wildlife — toucans, hummingbirds, red-eyed tree frogs, quetzals — while others are abstract or utilitarian shapes, always worked in cedar and other local woods. The carving process can take several days per piece depending on the level of detail.",
        "They're a favorite pick for anyone after a Costa Rican handmade gift with real sculptural presence, or a Costa Rican souvenir that's clearly hand-carved rather than mass-produced. We take custom orders for size or subject, with a production time of about 3 weeks. They look equally at home on a desk, a shelf, or a living-room console.",
      ],
    },
    faqs: [
      {
        question: { es: "¿Qué animales o formas puedo encontrar?", en: "What animals or shapes are available?" },
        answer: {
          es: "Tucanes, colibríes, ranas de ojos rojos, quetzales y otras formas abstractas talladas a mano. La disponibilidad exacta varía según la colección activa.",
          en: "Toucans, hummingbirds, red-eyed tree frogs, quetzals, and other hand-carved abstract shapes. Exact availability varies with the active collection.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, enviamos a todo Costa Rica y también al extranjero, con empaque protegido para piezas talladas.",
          en: "Yes, we ship anywhere in Costa Rica and internationally, with protective packaging for carved pieces.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card.",
        },
      },
      {
        question: { es: "¿Puedo encargar una escultura de un animal específico?", en: "Can I commission a sculpture of a specific animal?" },
        answer: {
          es: "Sí, tomamos encargos personalizados. El tiempo de producción para piezas a medida es de aproximadamente 3 semanas.",
          en: "Yes, we take custom commissions. Production time for made-to-order pieces is about 3 weeks.",
        },
      },
    ],
    relatedIds: [3, 9, 5],
  },
  {
    id: 7,
    dbName: { es: "Cofres", en: "Boxes" },
    slugs: { es: "cofres-de-madera", en: "wooden-boxes" },
    h1: {
      es: "Cofres de madera tallados a mano",
      en: "Hand-Carved Wooden Boxes",
    },
    metaTitle: {
      es: "Cofres de madera tallados a mano | Costa Rica",
      en: "Hand-Carved Wooden Boxes | Costa Rica",
    },
    metaDescription: {
      es: "Cofres de madera tallados a mano en Costa Rica para guardar joyas y objetos pequeños. Regalo artesanal con impacto social real.",
      en: "Hand-carved wooden boxes from Costa Rica for jewelry and small keepsakes. A handmade gift with real social impact.",
    },
    intro: {
      es: [
        "Los cofres de madera de nuestra colección son piezas pequeñas pero muy trabajadas: tallado a mano en la tapa y los laterales, bisagras funcionales y un interior liso listo para guardar joyas, cartas o cualquier objeto pequeño con valor sentimental. Los fabrican artesanos del programa de reinserción social en San Ramón, Alajuela, con el mismo cuidado en el barniz que el resto de la colección.",
        "Por su tamaño, son uno de los regalos artesanales de Costa Rica más fáciles de enviar o llevar en la maleta, y funcionan como souvenir de Costa Rica para bodas, cumpleaños o detalles corporativos. Si querés grabar una fecha o iniciales, coordinamos pedidos personalizados con un tiempo de producción de aproximadamente 3 semanas. Muchos clientes los usan también como caja de anillos para una propuesta.",
      ],
      en: [
        "The wooden boxes in this collection are small but carefully made: hand-carved lids and sides, functional hinges, and a smooth interior ready to hold jewelry, letters or any small keepsake. They're made by artisans in the social reintegration program in San Ramón, Alajuela, with the same care in the varnish as the rest of the collection.",
        "Thanks to their size, they're one of the easiest Costa Rican handmade gifts to ship or pack in a suitcase, and they work well as a Costa Rican souvenir for weddings, birthdays or corporate gifts. If you want to engrave a date or initials, we coordinate custom orders with a production time of about 3 weeks. Many customers also use them as a ring box for a proposal.",
      ],
    },
    faqs: [
      {
        question: { es: "¿Qué tamaño tienen los cofres?", en: "How big are the boxes?" },
        answer: {
          es: "Varían de pequeños joyeros de escritorio a cofres medianos. Las medidas exactas están en la ficha de cada producto.",
          en: "They range from small desktop jewelry boxes to medium-sized chests. Exact dimensions are listed on each product page.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, enviamos a todo Costa Rica y también hacemos envíos internacionales.",
          en: "Yes, we ship anywhere in Costa Rica and internationally as well.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card.",
        },
      },
      {
        question: { es: "¿Pueden grabar iniciales o una fecha en la tapa?", en: "Can you engrave initials or a date on the lid?" },
        answer: {
          es: "Sí, es uno de nuestros pedidos personalizados más comunes. El tiempo de producción es de aproximadamente 3 semanas.",
          en: "Yes, that's one of our most common custom orders. Production time is about 3 weeks.",
        },
      },
    ],
    relatedIds: [8, 3, 4],
  },
  {
    id: 8,
    dbName: { es: "Servilleteros", en: "Napkin holders" },
    slugs: { es: "servilleteros", en: "napkin-holders" },
    h1: {
      es: "Servilleteros de madera hechos a mano",
      en: "Handmade Wooden Napkin Holders",
    },
    metaTitle: {
      es: "Servilleteros de madera hechos a mano | CR",
      en: "Handmade Wooden Napkin Holders | CR",
    },
    metaDescription: {
      es: "Servilleteros de madera tallados a mano en Costa Rica, ideales para la mesa diaria o como regalo artesanal de impacto social.",
      en: "Hand-carved wooden napkin holders from Costa Rica, great for the everyday table or as a handmade gift with social impact.",
    },
    intro: {
      es: [
        "Nuestros servilleteros de madera son piezas pequeñas de uso diario, talladas a mano en cedro costarricense por artesanos del programa de reinserción social en San Ramón, Alajuela. Son un detalle sencillo que le da un toque artesanal a la mesa de todos los días sin perder funcionalidad, con el mismo acabado en barniz natural de nuestras piezas más grandes.",
        "Por su precio accesible y tamaño compacto, son un regalo artesanal de Costa Rica ideal para combinar con otras piezas —como un chorreador o un juego de cocina— o para llevar como souvenir de Costa Rica sin ocupar mucho espacio en la maleta. También los pedimos personalizados con grabado para bodas y eventos, con un tiempo de producción de aproximadamente 3 semanas. Son fáciles de regalar en pares o en set.",
      ],
      en: [
        "Our wooden napkin holders are small, everyday pieces, hand-carved from Costa Rican cedar by artisans in the social reintegration program in San Ramón, Alajuela. They're a simple detail that brings a handmade touch to the daily table without losing functionality, finished with the same natural varnish as our larger pieces.",
        "Thanks to their accessible price and compact size, they make a great Costa Rican handmade gift to pair with other pieces — like a coffee dripper or a kitchen set — or to pack as a Costa Rican souvenir without taking up much suitcase space. We also take custom engraved orders for weddings and events, with a production time of about 3 weeks. They're easy to gift in pairs or as a set.",
      ],
    },
    faqs: [
      {
        question: { es: "¿Los servilleteros vienen en juego o individuales?", en: "Do napkin holders come as a set or individually?" },
        answer: {
          es: "La presentación (individual o en set) se indica en cada ficha de producto.",
          en: "Whether it's sold individually or as a set is noted on each product page.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, enviamos a todo Costa Rica y también al extranjero.",
          en: "Yes, we ship anywhere in Costa Rica and internationally too.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card.",
        },
      },
      {
        question: { es: "¿Puedo pedir varios con grabado para un evento?", en: "Can I order several with engraving for an event?" },
        answer: {
          es: "Sí, es un pedido común para bodas y eventos corporativos. El tiempo de producción es de aproximadamente 3 semanas.",
          en: "Yes, it's a common request for weddings and corporate events. Production time is about 3 weeks.",
        },
      },
    ],
    relatedIds: [2, 7, 1],
  },
  {
    id: 9,
    dbName: { es: "Decoración de pared", en: "Wall decorations" },
    slugs: { es: "decoracion-de-pared", en: "wall-decor" },
    h1: {
      es: "Decoración de pared artesanal en madera",
      en: "Handmade Wood Wall Décor",
    },
    metaTitle: {
      es: "Decoración de pared en madera | Costa Rica",
      en: "Handmade Wood Wall Décor | Costa Rica",
    },
    metaDescription: {
      es: "Piezas de decoración de pared en madera tallada a mano en Costa Rica. Arte artesanal para el hogar con impacto social real.",
      en: "Hand-carved wood wall décor pieces from Costa Rica. Handmade art for the home with real social impact.",
    },
    intro: {
      es: [
        "Esta colección reúne relieves y piezas de decoración de pared talladas a mano en madera por artesanos del programa de reinserción social en San Ramón, Alajuela. A diferencia de un cuadro impreso, cada relieve tiene textura y profundidad reales, con diseños que van de patrones geométricos a escenas inspiradas en la naturaleza costarricense. El resultado es una pieza que cambia de aspecto según la luz del ambiente.",
        "Son un regalo artesanal de Costa Rica pensado para quien ya decoró con lo básico y busca una pieza con más carácter, y también funcionan como souvenir de Costa Rica de tamaño mediano que se nota apenas se cuelga. Si tenés una pared con medidas específicas, coordinamos un encargo personalizado con un tiempo de producción de aproximadamente 3 semanas. Cada relieve incluye el sistema de colgado listo para instalar.",
      ],
      en: [
        "This collection brings together hand-carved wood reliefs and wall décor pieces made by artisans in the social reintegration program in San Ramón, Alajuela. Unlike a printed canvas, each relief has real texture and depth, with designs ranging from geometric patterns to scenes inspired by Costa Rican nature. The result is a piece that changes character with the room's light.",
        "They make a Costa Rican handmade gift for someone who's already covered the basics and wants a piece with more character, and they also work as a medium-sized Costa Rican souvenir that stands out the moment it's hung. If you have a wall with specific dimensions, we coordinate a custom commission with a production time of about 3 weeks. Every relief ships with its hanging hardware ready to install.",
      ],
    },
    faqs: [
      {
        question: { es: "¿Cómo se cuelgan estas piezas?", en: "How are these pieces hung?" },
        answer: {
          es: "La mayoría incluye un sistema de colgado en la parte trasera; el detalle exacto se indica en cada ficha de producto.",
          en: "Most include a hanging mechanism on the back; the exact detail is noted on each product page.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, con empaque reforzado para piezas de mayor tamaño, a todo Costa Rica y al extranjero.",
          en: "Yes, with reinforced packaging for larger pieces, anywhere in Costa Rica and internationally.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card.",
        },
      },
      {
        question: { es: "¿Cómo cuido el relieve de madera y su barniz?", en: "How do I care for the wood relief and its varnish?" },
        answer: {
          es: "Limpiá con un paño seco, evitá la luz solar directa prolongada y la humedad constante para que el barniz no se opaque.",
          en: "Clean with a dry cloth, avoid prolonged direct sunlight and constant humidity so the varnish doesn't dull over time.",
        },
      },
    ],
    relatedIds: [6, 3, 4],
  },
  {
    id: 10,
    dbName: { es: "Jarras", en: "Coffee Cups" },
    slugs: { es: "jarras-y-tazas", en: "mugs" },
    h1: {
      es: "Tazas de peltre pintadas a mano",
      en: "Hand-Painted Enamel Mugs",
    },
    metaTitle: {
      es: "Tazas de peltre pintadas a mano | Costa Rica",
      en: "Hand-Painted Enamel Mugs | Costa Rica",
    },
    metaDescription: {
      es: "Tazas de peltre (enamel) pintadas a mano en Costa Rica, ideales para tomar café. Souvenir y regalo artesanal accesible con impacto social.",
      en: "Hand-painted enamel mugs from Costa Rica, perfect for your daily coffee. An accessible souvenir and handmade gift with social impact.",
    },
    intro: {
      es: [
        "Nuestras tazas son de peltre esmaltado (enamel), pintadas a mano una por una por artesanos del programa de reinserción social en San Ramón, Alajuela. Es el mismo tipo de taza resistente que se usa en fincas de café y campamentos, pero con diseños originales que no vas a encontrar en una tienda de recuerdos genérica.",
        "Son de los productos más accesibles de la colección, ideales como souvenir de Costa Rica para traer varios a la vez, o como regalo artesanal sencillo para acompañar un chorreador de café de madera. Aguantan bien el uso diario y, si necesitás una cantidad grande con un diseño específico para un evento, coordinamos un pedido personalizado con un tiempo de producción de aproximadamente 3 semanas.",
      ],
      en: [
        "Our mugs are hand-painted enamel, painted one by one by artisans in the social reintegration program in San Ramón, Alajuela. It's the same sturdy enamelware used on coffee farms and camping trips, but with original designs you won't find in a generic souvenir shop. The enamel coating resists chips better than plain ceramic, so it travels well too.",
        "They're among the most affordable products in the collection, perfect as a Costa Rican souvenir to bring back several at once, or as a simple handmade gift to pair with a wooden coffee dripper. They hold up well to daily use, and if you need a larger quantity with a specific design for an event, we coordinate a custom order with a production time of about 3 weeks. Many customers buy a set of four or more to share.",
      ],
    },
    faqs: [
      {
        question: { es: "¿De qué material son las tazas?", en: "What material are the mugs made of?" },
        answer: {
          es: "Peltre esmaltado (enamel), resistente y liviano, con el diseño pintado a mano sobre la superficie.",
          en: "Enameled steel (enamelware), sturdy and lightweight, with the design hand-painted onto the surface.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, enviamos a todo Costa Rica y también al extranjero.",
          en: "Yes, we ship anywhere in Costa Rica and internationally too.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card.",
        },
      },
      {
        question: { es: "¿Puedo pedir varias tazas con el mismo diseño para un evento?", en: "Can I order several mugs with the same design for an event?" },
        answer: {
          es: "Sí, tomamos pedidos por volumen con diseño personalizado. El tiempo de producción es de aproximadamente 3 semanas.",
          en: "Yes, we take bulk orders with a custom design. Production time is about 3 weeks.",
        },
      },
    ],
    relatedIds: [1, 8, 2],
  },
  {
    id: 11,
    dbName: { es: "Instrumentos Musicales", en: "Musical Instruments" },
    slugs: { es: "instrumentos-musicales", en: "musical-instruments" },
    h1: {
      es: "Instrumentos musicales artesanales",
      en: "Handmade Musical Instruments",
    },
    metaTitle: {
      es: "Instrumentos musicales artesanales | CR",
      en: "Handmade Musical Instruments | Costa Rica",
    },
    metaDescription: {
      es: "Instrumentos musicales hechos a mano en Costa Rica, tallados en madera por artesanos locales. Regalo artesanal con impacto social real.",
      en: "Handmade musical instruments from Costa Rica, carved in wood by local artisans. A handmade gift with real social impact.",
    },
    intro: {
      es: [
        "Los instrumentos musicales de nuestra colección se trabajan a mano en madera por artesanos del programa de reinserción social en San Ramón, Alajuela, combinando tradición costarricense con acabados cuidados para que suenen bien y también luzcan bien como pieza decorativa. Cada instrumento pasa por un proceso de selección de madera antes de empezar el tallado.",
        "Son un regalo artesanal de Costa Rica poco común —distinto a los espejos o chorreadores más conocidos— ideal para alguien interesado en música o en objetos con historia. También funcionan como souvenir de Costa Rica memorable. Si buscás un modelo específico o una cantidad para un grupo, escribinos para coordinar un pedido personalizado con un tiempo de producción de aproximadamente 3 semanas. Cada pieza se entrega lista para tocar.",
      ],
      en: [
        "The musical instruments in this collection are hand-worked in wood by artisans in the social reintegration program in San Ramón, Alajuela, combining Costa Rican tradition with careful finishing so they both sound good and look good as a decorative piece. Each instrument goes through a wood-selection step before the carving even begins.",
        "They make an uncommon Costa Rican handmade gift — different from our better-known mirrors or coffee drippers — perfect for someone interested in music or in objects with a story. They also work as a memorable Costa Rican souvenir. If you're looking for a specific model or a quantity for a group, reach out to coordinate a custom order with a production time of about 3 weeks. Every piece ships ready to play.",
      ],
    },
    faqs: [
      {
        question: { es: "¿Qué instrumentos musicales manejan?", en: "What musical instruments do you carry?" },
        answer: {
          es: "La selección varía; cada modelo disponible y sus materiales específicos se detallan en su ficha de producto.",
          en: "The selection varies; each available model and its specific materials are detailed on its product page.",
        },
      },
      {
        question: { es: "¿Hacen envíos a todo el país y al extranjero?", en: "Do you ship nationwide and internationally?" },
        answer: {
          es: "Sí, con empaque protegido para piezas de madera, a todo Costa Rica y al extranjero.",
          en: "Yes, with protective packaging for wooden pieces, anywhere in Costa Rica and internationally.",
        },
      },
      {
        question: { es: "¿Qué formas de pago aceptan?", en: "What payment methods do you accept?" },
        answer: {
          es: "SINPE Móvil, transferencia bancaria y tarjeta de crédito o débito.",
          en: "SINPE Móvil (Costa Rica), bank transfer, and credit or debit card.",
        },
      },
      {
        question: { es: "¿Puedo encargar un modelo específico?", en: "Can I order a specific model?" },
        answer: {
          es: "Sí, escribinos para coordinar disponibilidad. El tiempo de producción para pedidos personalizados es de aproximadamente 3 semanas.",
          en: "Yes, reach out to check availability. Production time for custom orders is about 3 weeks.",
        },
      },
    ],
    relatedIds: [6, 3, 4],
  },
];

export function getCategoryBySlug(locale: "es" | "en", slug: string): CategoryContent | undefined {
  return CATEGORIES.find((c) => c.slugs[locale] === slug);
}

export function getCategoryById(id: number): CategoryContent | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/** Path (without domain, without locale) for a category, e.g. "/c/chorreadores-de-cafe". */
export function getCategoryPath(slugKey: number, locale: "es" | "en"): string {
  const cat = getCategoryById(slugKey);
  if (!cat) return `/${locale}/c`;
  return `/${locale}/c/${cat.slugs[locale]}`;
}

/** Category ids to feature in primary navigation (per site brief). */
export const PRIMARY_NAV_CATEGORY_IDS = [1, 3, 6, 5];
