'use client';

import React, { createContext, useContext } from 'react';
import { useHomeProducts, HomeProductsData, Product, Category } from '@/lib/hooks/useHomeProducts';
import type { HomeSections } from '@/lib/home/computeSections';

// Crear el contexto
const HomeProductsContext = createContext<HomeProductsData | undefined>(undefined);

// Props para el proveedor
interface HomeProductsProviderProps {
  children: React.ReactNode;
  initialCategories?: Category[];
  initialProducts?: Product[];
  initialSections?: HomeSections;
  priorityCategoryIds?: number[]; // IDs de categorías en orden de prioridad
}

/**
 * Proveedor de contexto para productos de la página de inicio
 * - Encapsula la lógica de datos para compartirla entre componentes
 * - Acepta datos iniciales pre-cargados desde el servidor
 * - Permite configurar prioridades de categorías
 */
export function HomeProductsProvider({ 
  children, 
  initialCategories = [],
  initialProducts = [],
  initialSections,
  priorityCategoryIds = []
}: HomeProductsProviderProps) {
  const productsData = useHomeProducts({
    initialCategories,
    initialProducts,
    initialSections,
    priorityCategoryIds
  });

  return (
    <HomeProductsContext.Provider value={productsData}>
      {children}
    </HomeProductsContext.Provider>
  );
}

/**
 * Hook para consumir el contexto de productos de la página de inicio
 * @returns Datos y funciones para gestionar productos
 */
export function useHomeProductsContext(): HomeProductsData {
  const context = useContext(HomeProductsContext);
  if (context === undefined) {
    throw new Error('useHomeProductsContext debe ser usado dentro de un HomeProductsProvider');
  }
  return context;
}