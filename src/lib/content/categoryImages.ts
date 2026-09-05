/**
 * Workshop photograph for each category, used as the landing-page hero band.
 *
 * Every photo stages a REAL catalog piece (it was generated from that product's
 * own image as a visual reference), so nothing on screen is something a customer
 * could ask for and not be able to buy.
 */
const CATEGORY_IMAGE_BY_ID: Record<number, string> = {
  1: "/taller/cat-chorreadores.webp", // Chorreadores de café
  2: "/taller/cat-cocina.webp", // Juegos de cocina
  3: "/taller/cat-espejos.webp", // Espejos
  4: "/taller/cat-decoracion.webp", // Decoración
  5: "/taller/cat-pinturas.webp", // Pinturas
  6: "/taller/cat-esculturas.webp", // Esculturas
  7: "/taller/cat-cofres.webp", // Cofres
  8: "/taller/cat-servilleteros.webp", // Servilleteros
  9: "/taller/cat-pared.webp", // Decoración de pared
  10: "/taller/cat-jarras.webp", // Jarras y tazas
  11: "/taller/cat-instrumentos.webp", // Instrumentos musicales
};

/** Wide workshop shot: the fallback for any category created later in the admin. */
export const CATEGORY_FALLBACK_IMAGE = "/taller/taller-amplio.webp";

export function getCategoryImage(categoryId: number): string {
  return CATEGORY_IMAGE_BY_ID[categoryId] ?? CATEGORY_FALLBACK_IMAGE;
}
