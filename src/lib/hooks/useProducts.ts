'use client';

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import type { Database, Json } from "@/lib/database.types";
import { distribuirProductos } from "@/lib/productsDistributor";

export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];

// Type guard para verificar si media es un array válido
function isMediaArray(media: Json): media is Array<{ url: string }> {
  return Array.isArray(media) && media.length > 0 && 
         typeof media[0] === 'object' && media[0] !== null && 
         'url' in media[0] && typeof media[0].url === 'string';
}

// Interfaz para los datos que compartiremos
export interface ProductsData {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  productsByCategory: Record<number, Product[]>;
  sectionProducts: {
    gridByCategory: Record<number, Product[]>;
    gifts: Product[];
    featured: Product[];
  };
}

// Hook personalizado para obtener y compartir datos de productos
export function useProducts(
  initialCategories: Category[] = [],
  initialProducts: Product[] = []
) {
  // Procesamos los datos iniciales para evitar solicitudes innecesarias
  const initialProductsByCategory: Record<number, Product[]> = {};
  
  // Inicializar productsByCategory con categorías iniciales
  const typedInitialCategories: Category[] = initialCategories || [];
  typedInitialCategories.forEach(category => {
    initialProductsByCategory[category.id] = [];
  });

  // Agrupar productos iniciales por categoría
  initialProducts.forEach(product => {
    if (
      product.category_id &&
      initialProductsByCategory[product.category_id] &&
      product.media &&
      isMediaArray(product.media)
    ) {
      // Solo añadir hasta 4 productos por categoría
      if (initialProductsByCategory[product.category_id].length < 4) {
        initialProductsByCategory[product.category_id].push(product);
      }
    }
  });

  const [data, setData] = useState<ProductsData>({
    products: initialProducts,
    categories: initialCategories,
    loading: initialCategories.length > 0 && initialProducts.length > 0 ? false : true,
    error: null,
    productsByCategory: initialProductsByCategory,
    sectionProducts: {
      gridByCategory: {},
      gifts: [],
      featured: [],
    },
  });

  useEffect(() => {
    // Verificar si tenemos suficientes productos precargados para las categorías visibles
    const hasEnoughInitialData = () => {
      // Verificar si tenemos al menos 3 productos por cada una de las primeras 3 categorías
      // y al menos 2 productos para cada una de las siguientes categorías (6-12)
      const firstCategoryIds = initialCategories.slice(0, 3).map(cat => cat.id);
      const secondCategoryIds = initialCategories.slice(6, 12).map(cat => cat.id);
      
      // Contar cuántos productos tenemos por cada categoría
      const productCountByCategory: Record<number, number> = {};
      
      // Inicializar conteo
      [...firstCategoryIds, ...secondCategoryIds].forEach(id => {
        productCountByCategory[id] = 0;
      });
      
      // Contar productos por categoría
      initialProducts.forEach(product => {
        if (product.category_id && productCountByCategory[product.category_id] !== undefined) {
          productCountByCategory[product.category_id]++;
        }
      });
      
      // Verificar si tenemos suficientes productos para las primeras categorías
      const hasEnoughForFirstCategories = firstCategoryIds.every(id => 
        productCountByCategory[id] >= 3
      );
      
      // Verificar si tenemos suficientes productos para las segundas categorías
      const hasEnoughForSecondCategories = secondCategoryIds.length === 0 || 
        secondCategoryIds.some(id => productCountByCategory[id] >= 2);
      
      return hasEnoughForFirstCategories && hasEnoughForSecondCategories;
    };
    
    // Si ya tenemos suficientes datos precargados, no hacemos petición adicional
    if (initialCategories.length > 0 && initialProducts.length > 0 && hasEnoughInitialData()) {
      console.log('Usando datos precargados - no se requiere petición adicional');
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (categoriesError) {
          throw new Error(`Error fetching categories: ${categoriesError.message}`);
        }

        // Inicializar productsByCategory
        const productsByCategory: Record<number, Product[]> = {};
        categoriesData.forEach(category => {
          productsByCategory[category.id] = [];
        });

        // Fetch featured products for each category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .limit(49);

        if (productsError) {
          throw new Error(`Error fetching products: ${productsError.message}`);
        }

        const sectionProducts = distribuirProductos(productsData, categoriesData);

        // Filtrar productos por categoría y que tengan media
        productsData.forEach(product => {
          if (
            product.category_id &&
            productsByCategory[product.category_id] &&
            product.media &&
            isMediaArray(product.media)
          ) {
            // Solo añadir hasta 4 productos por categoría
            if (productsByCategory[product.category_id].length < 4) {
              productsByCategory[product.category_id].push(product);
            }
          }
        });

        if (isMounted) {
          setData({
            products: productsData,
            categories: categoriesData,
            loading: false,
            error: null,
            productsByCategory,
            sectionProducts,    
          });
        }
      } catch (err) {
        if (isMounted) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'Error desconocido',
          }));
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
}
