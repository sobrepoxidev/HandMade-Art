/**
 * Single source of truth for the workshop's NAP (name, address, phone).
 *
 * This exists because the address was previously duplicated as free text across
 * the layout JSON-LD, the footer, the navbar, llms.txt and every piece of
 * editorial copy — and all of them said "San Ramón, Alajuela", which is wrong.
 * Inconsistent or incorrect NAP is one of the most damaging things for local
 * search, so the address lives here once and everything else imports it.
 *
 * Coordinates verified against OpenStreetMap for San Isidro, Vázquez de
 * Coronado (postal code 11101, which matches the address on file).
 */
export const BUSINESS = {
  name: 'Handmade Art',
  streetAddress: 'Centro Comercial Velasuma, 2da planta, local No. 9, Calle 149, Avenida 91',
  /** Landmark locals use to find it. */
  landmark: 'Contiguo a Centro Comercial Velasuma',
  addressLocality: 'San Isidro',
  /** Canton. Kept separate because schema.org has no canton field. */
  canton: 'Vázquez de Coronado',
  addressRegion: 'San José',
  postalCode: '11101',
  addressCountry: 'CR',
  countryName: 'Costa Rica',
  latitude: 9.9768,
  longitude: -84.0086,
  telephone: '+506 8585 0000',
  email: 'info@handmadeart.store',
} as const;

/** "San Isidro de Coronado, San José" — how the location reads inside a sentence. */
export const SHORT_LOCATION = 'San Isidro de Coronado, San José';

/** Same, with the country, for contexts that need it spelled out. */
export const FULL_LOCATION = 'San Isidro de Coronado, San José, Costa Rica';

/** One-line postal address for footers and plain-text surfaces. */
export const POSTAL_LINE = `${BUSINESS.streetAddress}, ${BUSINESS.addressLocality}, ${BUSINESS.canton}, ${BUSINESS.addressRegion}, ${BUSINESS.postalCode}, ${BUSINESS.countryName}`;
