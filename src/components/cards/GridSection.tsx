"use client";

import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Link } from '@/i18n/navigation';
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Database, Json } from "@/lib/database.types";
import CarrucelSectionA from "./CarrucelSectionA";
import { useLocale } from "next-intl";
import { formatUSD } from "@/lib/formatCurrency";

// Type definitions with fixes for TypeScript errors
type Category = Database['public']['Tables']['categories']['Row'] & { image_url?: string }; // Add image_url property
type Product = Database['public']['Tables']['products']['Row'];

// Type guard for media
function isMediaArray(media: Json): media is { url: string; type: string }[] {
  return Array.isArray(media) && media.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'url' in item && 
    typeof item.url === 'string'
  );
}

const GridSection = ({ indexStart, indexEnd, mobileActive = true }: { indexStart: number, indexEnd: number, mobileActive?: boolean }) => {
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*');

        if (categoriesError) {
          throw new Error(`Error fetching categories: ${categoriesError.message}`);
        }

        // Obtener productos para cada categoría
        const productsByCategory: Record<number, Product[]> = {};

        // Inicializar el objeto de productos por categoría
        categoriesData.forEach(category => {
          productsByCategory[category.id] = [];
        });

        // Obtener productos para cada categoría
        const productsPromises = categoriesData.map(category =>
          supabase
            .from('products')
            .select('*, category_id')
            .eq('category_id', category.id)
            .order('created_at', { ascending: false })
            .limit(4)
        );

        const productsResults = await Promise.all(productsPromises);

        // Organizar productos por categoría
        productsResults.forEach((result, index) => {
          const categoryId = categoriesData[index].id;
          if (result.error) {
            console.error(`Error fetching products for category ${categoriesData[index].name}:`, result.error);
          } else if (result.data) {
            productsByCategory[categoryId] = result.data.filter(product =>
              product.media &&
              isMediaArray(product.media) &&
              product.media.length > 0 &&
              product.media[0].url
            ).slice(0, 4);
          }
        });

        // Crear array plano de todos los productos
        const allProducts = Object.values(productsByCategory).flat();



        // Set state
        setCategories(categoriesData);
        setTopProducts(allProducts);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Agrupar productos por categoría
  const productsByCategory: Record<number, Product[]> = {};
  categories.forEach((category) => {
    productsByCategory[category.id] = [];
  });

  // Agregar productos a sus respectivas categorías
  topProducts.forEach((product: Product) => {
    if (product.category_id && productsByCategory[product.category_id]) {
      // Solo agregar productos que tengan media y si la categoría no tiene 4 productos aún
      if (product.media &&
        isMediaArray(product.media) &&
        product.media.length > 0 &&
        product.media[0].url &&
        productsByCategory[product.category_id].length < 4) {
        productsByCategory[product.category_id].push(product);
      }
    }
  });

  // Para pantallas grandes (desktop/tablet) - Mostrar múltiples productos por categoría como Amazon
  const desktopCards = categories.slice(indexStart, indexEnd).map(category => {
    const categoryProducts = productsByCategory[category.id] || [];
    const displayProducts = categoryProducts.slice(0, 4); // Mostrar hasta 4 productos por categoría

    return {
      title: (locale === 'es' ? category.name_es : category.name_en) || category.name || 'Categoría',
      link: `/products?category=${category.id}`,
      content: (
        <div className="p-3">
          {displayProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {displayProducts.map((product: Product, idx: number) => (
                  <Link key={idx} href={`/product/${product.id}`} className="block group">
                    <div className="flex flex-col items-center bg-gray-50 rounded p-2 hover:shadow-sm transition-shadow">
                      <div className="h-44 flex items-center justify-center mb-1">
                        <Image
                          src={product.media && isMediaArray(product.media) && product.media.length > 0 ?
                            product.media[0].url :
                            '/placeholder.jpg'}
                          alt={(locale === 'es' ? product.name_es : product.name_en) || product.name || "Producto"}
                          width={100}
                          height={100}
                          className="object-contain max-h-full group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] text-center line-clamp-1 font-medium text-gray-800">
                        {locale === 'es' ? product.name_es : product.name_en}
                      </span>
                      {product.dolar_price && (
                        <span className="text-[10px] font-bold text-teal-700 mt-0.5">
                          {formatUSD(product.dolar_price)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-3 text-xs text-teal-600 hover:underline text-center">
                <Link href={`/products?category=${category.id}`} className="inline-flex items-center">
                  <span>{locale === 'es' ? 'Ver todo en ' + category.name_es : 'See all in ' + category.name_en}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center h-48">
                <Image
                  src={typeof category.image_url === 'string' ? category.image_url : '/placeholder.jpg'}
                  alt={category.name || 'Categoría'}
                  width={180}
                  height={180}
                  className="max-h-full object-contain transition-transform hover:scale-105"
                />
              </div>
              <div className="mt-3 text-xs text-teal-600 hover:underline text-center">
                <Link href={`/products?category=${category.id}`} className="inline-flex items-center">
                  <span>{locale === 'es' ? 'Ver todo en ' + category.name_es : 'See all in ' + category.name_en}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      ),
    };
  });


  if (loading) {
    return (
      <>

        {/* Skeleton para desktop */}
        <div className="max-lg:hidden grid grid-cols-3 gap-5 mt-4 mb-4 mx-4 pb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>

        {/* Skeleton para móvil */}
        <div className="lg:hidden grid grid-rows-3 gap-4 mt-4 mb-4 mx-4 pb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>{locale === 'es' ? 'Error al cargar categorías' : 'Error loading categories'}</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full ">


      {/* Versión de escritorio - Muestra categorías en grid */}
      <div className="grid grid-cols-2 md:grid-cols-3  px-4 gap-4 mb-4 mt-4 max-lg:hidden">
        {desktopCards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>

      {/* Versión móvil - Usa CarrucelSectionA para mostrar tarjetas en carrusel horizontal */}
      {mobileActive && <div className="lg:hidden">
        <CarrucelSectionA
          items={
            // Ordenamos las categorías dando prioridad a Paintings y Napkin Holders
            [...categories.slice(indexStart, indexEnd-2)]
              .sort((a, b) => {
                // Obtener nombres de categorías para comparación (case insensitive)
                const aName = (a.name || '').toLowerCase();
                const bName = (b.name || '').toLowerCase();

                // Priorizar Paintings y Napkin Holders
                const isPrioritizedA = aName.includes('painting') || aName.includes('napkin holder');
                const isPrioritizedB = bName.includes('painting') || bName.includes('napkin holder');

                // Si a es prioritario y b no, a va primero
                if (isPrioritizedA && !isPrioritizedB) return -1;
                // Si b es prioritario y a no, b va primero
                if (!isPrioritizedA && isPrioritizedB) return 1;

                // Si ambos son prioritarios o ninguno lo es, priorizamos por cantidad de productos
                const aProducts = (productsByCategory[a.id] || []).length;
                const bProducts = (productsByCategory[b.id] || []).length;

                // Priorizar categorías con 4 o más productos
                if (aProducts >= 4 && bProducts < 4) return -1;
                if (aProducts < 4 && bProducts >= 4) return 1;

                // Si ambas tienen 4+ o ambas tienen menos de 4, ordenar por cantidad
                return bProducts - aProducts; // Ordenar de mayor a menor
              })
              .map((category, index) => {
                // Convertir la categoría a formato esperado por CarrucelSectionA
                const categoryProducts = productsByCategory[category.id] || [];

                // Colores brillantes para las tarjetas
                const cardColors = [
        
                  
                  'bg-blue-500',   // Azul
                  'bg-green-500', // Morado oscuro
                  'bg-pink-500', // Rosa
                    
                  'bg-red-500'     // Rojo
                ];

        

                // Priorizar ciertos colores para categorías específicas
                const cardColor = cardColors[index];
                
                return {
                  title: `${locale === 'es' ? category.name_es : category.name_en || category.name} `,
                  content: (
                    <div className="grid grid-cols-2 gap-2 w-full h-full px-1 pt-4">
                      {categoryProducts.slice(0, 4).map((product, idx) => (
                        <Link key={idx} href={`/product/${product.id}`} className="block text-center">
                          <div className="h-44 flex items-center justify-center bg-white rounded-lg shadow-sm">
                            <Image
                              src={product.media && isMediaArray(product.media) && product.media.length > 0 ? product.media[0].url : '/placeholder-image.png'}
                              alt={product.name || ''}
                              width={100}
                              height={100}
                              className="object-contain max-h-full p-0.5"
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ),
                  link: `/category/${category.id}`,
                  className: `${cardColor} rounded-xl px-3 pt-2 pb-3 shadow-sm` // Color llamativo y bordes redondeados
                };
              })
          }
        />
      </div>
      }
    </div>
  );
};

export default GridSection;
