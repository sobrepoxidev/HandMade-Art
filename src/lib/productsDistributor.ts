// 👉 productsDistributor.ts
import { Product, Category } from "@/lib/hooks/useProducts";

export function distribuirProductos(
    products: Product[],
    categories: Category[],
    maxFeatured = 9
  ) {
    const usados = new Set<number>();              // <– memoria global
    const tomar = (lista: Product[], n: number, filtro?: (p:Product)=>boolean) => {
      const r: Product[] = [];
      for (const p of lista) {
        if (r.length === n) break;
        if (usados.has(p.id)) continue;
        if (filtro && !filtro(p)) continue;
        r.push(p);
        usados.add(p.id);
      }
      return r;
    };
  
    /* 1️⃣  GRID principal: 0-5 primeras categorías */
    const gridByCategory: Record<number, Product[]> = {};
    const principales = categories.slice(0, 6);
    principales.forEach(cat => {
      const propios   = products.filter(p => p.category_id === cat.id);
      gridByCategory[cat.id] = tomar(propios, 4, p => !!(Array.isArray(p.media) && p.media.length));
    });
  
    /* Rellenar huecos si alguna categoría tiene <4 */
    const reserva = products.filter(p => !usados.has(p.id) && Array.isArray(p.media) && p.media.length);
    principales.forEach(cat => {
      const faltan = 4 - gridByCategory[cat.id].length;
      if (faltan > 0) gridByCategory[cat.id].push(...tomar(reserva, faltan));
    });
  
    /* 2️⃣  GIFTS – máximo 12, evitando cocina y grid */
    const kitchenIds = categories
      .filter(c => c.name.toLowerCase().includes('kitchen'))
      .map(c => c.id);
  
    const gifts = tomar(
      products,
      12,
      p =>
        !!(Array.isArray(p.media) && p.media.length) &&
        !kitchenIds.includes(p.category_id ?? -1)
    );
  
    /* 3️⃣  FEATURED – destacados primero, luego caros, máx. 9 */
    const ordenPreferido = [
      ...products.filter(p => p.is_featured),
      ...products.sort((a, b) => (b.dolar_price ?? 0) - (a.dolar_price ?? 0)),
    ];
  
    const featured = tomar(ordenPreferido, maxFeatured);
  
    return { gridByCategory, gifts, featured };
  }
  