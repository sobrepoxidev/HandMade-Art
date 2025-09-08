'use client';

import { useState, useEffect } from 'react';
import { useInterestList } from '@/lib/hooks/useInterestList';
import { useDiscountCode } from '@/lib/hooks/useDiscountCode';
import { ProductCard } from '@/components/catalog/ProductCard';
import { CategoryChips } from '@/components/catalog/CategoryChips';
import { InterestDrawer } from '@/components/catalog/InterestDrawer';
import { Loader2, Tag, X, Check } from 'lucide-react';
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

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [showDiscountSuccess, setShowDiscountSuccess] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const interestList = useInterestList();
  const discountCode = useDiscountCode();

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

  const handleApplyDiscountCode = async () => {
    if (!discountCodeInput.trim()) return;
    
    setDiscountError('');
    const result = await discountCode.applyCode(discountCodeInput.trim());
    
    if (result.isValid) {
      setShowDiscountSuccess(true);
      setDiscountCodeInput('');
      setTimeout(() => setShowDiscountSuccess(false), 6500);
    } else {
      setDiscountError(result.errorMessage || 'Código inválido');
    }
  };

  const handleRemoveDiscountCode = () => {
    discountCode.removeCode();
    setDiscountError('');
    setShowDiscountSuccess(false);
  };

  // Función wrapper para adaptar calculateDiscount a la interfaz esperada por ProductCard
  const handleCalculateDiscount = (productPrice: number, categoryId: number | null) => {
    if (!discountCode.appliedCode) return null;
    
    const result = discountCode.calculateDiscount(
      productPrice,
      discountCode.appliedCode,
      categoryId || undefined,
      true // Omitir validación de monto mínimo en el catálogo
    );
    
    if (!result.isValid) return null;
    
    return {
      discountedPrice: result.finalPrice,
      discountAmount: result.discountAmount
    };
  };

  const totalItems = interestList.getTotalItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Catálogo de productos
          </h1>
          <p className=" text-gray-600 text-sm">
            Selecciona productos para tu lista de interés y solicita una cotización personalizada
          </p>
        </div>
      </div>

      {/* Código de descuento */}
      <div className=" border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
          {!discountCode.appliedCode ? (
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600 border-b border-teal-500 hover:border-b-2 hover:border-teal-700">
                <Tag className="h-4 w-4" />
                <span className="cursor-default">¿Tienes un código de descuento?</span>
              </div>
              <div className="flex gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  value={discountCodeInput}
                  onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                  placeholder="Ingresa tu código"
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscountCode()}
                />
                <button
                  onClick={handleApplyDiscountCode}
                  disabled={!discountCodeInput.trim() || discountCode.loading}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {discountCode.loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Aplicar'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Código aplicado: {discountCode.appliedCode.code}
                  </p>
                  <p className="text-xs text-green-600">
                    {discountCode.appliedCode.discount_type === 'percentage'
                      ? `${discountCode.appliedCode.discount_value}% de descuento`
                      : `$${discountCode.appliedCode.discount_value.toFixed(2)} USD de descuento`
                    }
                    {!discountCode.appliedCode.apply_to_all_categories && ' (categorías específicas)'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveDiscountCode}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          
          {/* Mensajes de error y éxito */}
          {discountError && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {discountError}
            </div>
          )}
          
          {showDiscountSuccess && (
            <div className="mt-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-2">
              ¡Código aplicado correctamente! Los descuentos se mostrarán en los productos aplicables.
            </div>
          )}
        </div>
      </div>

      {/* Categorías */}
      <div className="">
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-1.5">
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            discountCategories={discountCode.appliedCode?.categories || []}
            hasDiscountForAll={discountCode.appliedCode?.apply_to_all_categories || false}
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
                appliedDiscountCode={discountCode.appliedCode}
                onCalculateDiscount={handleCalculateDiscount}
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
        appliedDiscountCode={discountCode.appliedCode}
      />

      {/* Espaciado para la barra inferior */}
      {totalItems > 0 && <div className="h-20" />}
    </div>
  );
}