'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from "@/lib/database.types";
import { computeSections, HomeSections } from '@/lib/home/computeSections';

export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];

// isMediaArray se maneja en computeSections; se elimina duplicado no utilizado

// Interfaz para los datos de productos por sección
export interface HomeProductsData {
  // Datos básicos
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  usingSnapshot: boolean;
  
  // Productos organizados por sección
  sections: {
    // Grid principal con categorías priorizadas
    grid: {
      products: Record<number, Product[]>;
      priorityOrder: number[]; // IDs de categorías en orden de prioridad
    };
    // Productos para la sección de regalos
    gifts: Product[];
    // Productos destacados
    featured: Product[];
  };
  
  // Funciones para carga paginada/infinita
  loadMoreProducts: (categoryId?: number) => Promise<void>;
  hasMoreProducts: boolean;
}

interface UseHomeProductsProps {
  initialCategories?: Category[];
  initialProducts?: Product[];
  initialSections?: HomeSections; // Snapshot SSR para hidratar sin mismatch
  priorityCategoryIds?: number[]; // IDs de categorías en orden de prioridad
  productsPerCategory?: number;
  maxGifts?: number;
  maxFeatured?: number;
}

/**
 * Hook personalizado para gestionar productos en la página de inicio
 * - Soporta carga inicial desde el servidor
 * - Implementa carga paginada/infinita
 * - Permite priorizar categorías específicas
 * - Distribuye productos en diferentes secciones sin duplicados
 */
export function useHomeProducts({
  initialCategories = [],
  initialProducts = [],
  initialSections,
  priorityCategoryIds = [], // Por defecto, sin prioridad específica
  productsPerCategory = 4,
  maxGifts = 12,
  maxFeatured = 9
}: UseHomeProductsProps = {}): HomeProductsData {
  // Cliente de Supabase
  const supabase = createClientComponentClient<Database>();
  
  // Estados para tracking de productos y paginación
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(initialCategories.length === 0 || initialProducts.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Usar snapshot SSR para la primera renderización y evitar mismatch de hidratación
  // Mantener el snapshot HASTA que cambien los datos en cliente
  // Mantener el snapshot SSR durante toda la sesión para evitar reordenamientos
  // del grid y parpadeos cuando se cargan más productos al hacer scroll.
  const [useSnapshot] = useState<boolean>(Boolean(initialSections));
  
  // Cargar datos iniciales
  useEffect(() => {
    if (initialCategories.length > 0 && initialProducts.length > 0) {
      // Ya tenemos datos iniciales, no necesitamos cargar más
      setLoading(false);
      return;
    }
    
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Cargar categorías si no las tenemos
        let categoriesData = initialCategories;
        if (categoriesData.length === 0) {
          const { data, error: categoriesError } = await supabase
            .from('categories')
            .select('*')
            .order('name');
            
          if (categoriesError) {
            throw new Error(`Error al cargar categorías: ${categoriesError.message}`);
          }
          
          categoriesData = data || [];
          setCategories(categoriesData);
        }
        
        // Cargar productos si no los tenemos
        let productsData = initialProducts;
        if (productsData.length === 0) {
          const { data, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (productsError) {
            throw new Error(`Error al cargar productos: ${productsError.message}`);
          }
          
          productsData = data || [];
          setProducts(productsData);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [initialCategories, initialProducts, supabase]);

  // Nota: ya no alternamos a datos en vivo para evitar que el grid cambie en CSR.
  // Si se necesitara actualizar el snapshot, hacerlo bajo un evento de usuario explícito.
  
  // Función para cargar más productos (paginación)
  const loadMoreProducts = useCallback(async (categoryId?: number) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      // Filtrar por categoría si se especifica
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      // Paginación
      const pageSize = 20;
      const from = page * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error: productsError } = await query
        .range(from, to);
      
      if (productsError) {
        throw new Error(`Error al cargar más productos: ${productsError.message}`);
      }
      
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setProducts(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
    }
  }, [page, supabase]);
  
  // Calcular secciones de productos de manera determinista
  const sections = useMemo(() => {
    if (useSnapshot && initialSections) {
      return initialSections;
    }
    return computeSections(
      products,
      categories,
      priorityCategoryIds,
      productsPerCategory,
      maxGifts,
      maxFeatured
    );
  }, [useSnapshot, initialSections, products, categories, priorityCategoryIds, productsPerCategory, maxGifts, maxFeatured]);
  
  return {
    products,
    categories,
    loading,
    error,
    sections,
    loadMoreProducts,
    hasMoreProducts: hasMore,
    usingSnapshot: useSnapshot
  };
}