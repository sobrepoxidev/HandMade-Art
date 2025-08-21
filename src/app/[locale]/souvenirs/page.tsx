'use client';

import { useState, useEffect } from 'react';
import { useInterestList } from '@/lib/hooks/useInterestList';
import { ProductCard } from '@/components/souvenirs/ProductCard';
import { CategoryChips } from '@/components/souvenirs/CategoryChips';
import { InterestDrawer } from '@/components/souvenirs/InterestDrawer';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: number;
  name: string;
  description: string | null;
  category_id: number | null;
  sku: string | null;
  brand: string | null;
  dolar_price: number | null;
  discount_percentage: number | null;
  weight_kg: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  main_image_url: string | null;
}

interface Category {
  id: number;
  name: string;
}

export default function SouvenirsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const interestList = useInterestList();

  // Cargar categorías
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name_es, name')
        .order('name_es');

      if (error) {
        console.error('Error loading categories:', error);
        return;
      }

      const formattedCategories = data.map(cat => ({
        id: cat.id,
        name: cat.name_es || cat.name || ''
      }));

      setCategories(formattedCategories);
    }

    loadCategories();
  }, []);

  // Cargar productos
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      
      let query = supabase
        .from('product_card_view')
        .select('*')
        .order('name');

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading products:', error);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    }

    loadProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const totalItems = interestList.getTotalItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Catálogo de productos
          </h1>
          <p className=" text-gray-600 text-sm">
            Selecciona productos para tu lista de interés y solicita una cotización personalizada
          </p>
        </div>
      </div>

      {/* Categorías */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-1.5">
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      {/* Grid de productos */}
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-2">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <span className="ml-2 text-gray-600">Cargando productos...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedCategory 
                ? 'No se encontraron productos en esta categoría'
                : 'No hay productos disponibles'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                interestList={interestList}
              />
            ))}
          </div>
        )}
      </div>

      {/* Barra inferior sticky */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
            >
              Ver selección ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
            </button>
          </div>
        </div>
      )}

      {/* Drawer de selección */}
      <InterestDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        interestList={interestList}
      />

      {/* Espaciado para la barra inferior */}
      {totalItems > 0 && <div className="h-20" />}
    </div>
  );
}