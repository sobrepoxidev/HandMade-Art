'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSupabase } from '@/app/supabase-provider/provider';
import { Database, Json } from '@/lib/database.types';
import ProductEditor from './ProductEditor';
import { Search, Filter, RefreshCw, Menu, Check, X, Edit } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

type Product = Database['public']['Tables']['products']['Row'];

// Type guard para verificar si media es un array válido con objetos que tienen url
const isMediaArray = (media: Json): media is Array<{ url: string; type?: string; alt?: string }> => {
  return Array.isArray(media) && media.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'url' in item && 
    typeof item.url === 'string'
  );
};

// Función para formatear la fecha de modificación en formato costarricense
const formatModifiedDate = (dateString: string): string => {
  // Ajustar la zona horaria a Costa Rica (UTC-6)
  const now = new Date();
  const modifiedDate = new Date(dateString);

  // Ajustar a la zona horaria de Costa Rica (UTC-6)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Costa_Rica',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const timeFormatter = new Intl.DateTimeFormat('es-CR', options);
  const timeString = timeFormatter.format(modifiedDate).toLowerCase();

  // Calcular diferencia en días
  const diffInMs = now.getTime() - modifiedDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);

  // Para fechas de hoy
  if (diffInDays === 0) {
    return `Hoy a las ${timeString}`;
  }
  // Para ayer
  else if (diffInDays === 1) {
    return `Ayer a las ${timeString}`;
  }
  // Últimos 7 días (mostrar día de la semana)
  else if (diffInDays < 7) {
    const dayFormatter = new Intl.DateTimeFormat('es-CR', {
      weekday: 'long',
      timeZone: 'America/Costa_Rica'
    });
    const dayName = dayFormatter.format(modifiedDate);
    return `El ${dayName.charAt(0).toUpperCase() + dayName.slice(1)} a las ${timeString}`;
  }
  // Hace 1 semana
  else if (diffInWeeks === 1) {
    return 'La semana pasada';
  }
  // Hace 2-3 semanas
  else if (diffInWeeks < 4) {
    return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? 's' : ''}`;
  }
  // Hace 1 mes o más
  else {
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths === 1) {
      return 'Hace 1 mes';
    } else if (diffInMonths < 12) {
      return `Hace ${diffInMonths} meses`;
    } else {
      // Para más de un año
      const diffInYears = Math.floor(diffInMonths / 12);
      return `Hace ${diffInYears} año${diffInYears > 1 ? 's' : ''}`;
    }
  }
};

export default function AdminDashboard({ locale }: { locale: string }) {
  const { supabase } = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [categories, setCategories] = useState<Database['public']['Tables']['categories']['Row'][]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showProductMenu, setShowProductMenu] = useState<number | null>(null); // Para controlar el menú de opciones



  // Función para cargar productos
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading, setProducts, setError]);

  // Función para cargar categorías
  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_es', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err: unknown) {
      console.error('Error al cargar categorías:', err);
    }
  }, [supabase, setCategories]);

  // Cargar productos y categorías
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Verificar si el clic fue fuera del menú
      const menuButton = document.querySelector(`button[aria-controls="product-menu-${showProductMenu}"]`);
      const menuElement = document.getElementById(`product-menu-${showProductMenu}`);

      if (showProductMenu !== null &&
        menuButton &&
        menuElement &&
        !menuButton.contains(event.target as Node) &&
        !menuElement.contains(event.target as Node)) {
        setShowProductMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showProductMenu]);

  // Filtrar productos según búsqueda y categoría
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        !searchTerm ||
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.name_es && product.name_es.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = !categoryFilter || product.category_id === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Actualizar un producto
  const updateProduct = useCallback(async (productId: number, updates: Partial<Product>) => {
    try {
      setLoading(true);

      // Validar los datos antes de actualizar
      if (updates.colon_price !== undefined) {
        const price = Number(updates.colon_price);
        if (isNaN(price) || price < 0) {
          throw new Error(locale === 'es' ? 'El precio debe ser un número válido mayor o igual a 0' : 'The price must be a valid number greater than or equal to 0');
        }
        updates.colon_price = price;
      }

      if (updates.dolar_price !== undefined) {
        const usd = Number(updates.dolar_price);
        if (isNaN(usd) || usd < 0) {
          throw new Error(locale === 'es' ? 'El precio USD debe ser un número válido mayor o igual a 0' : 'USD price must be a valid number greater than or equal to 0');
        }
        updates.dolar_price = usd;
      }

      if (updates.discount_percentage !== undefined) {
        const discount = Number(updates.discount_percentage);
        if (isNaN(discount) || discount < 0 || discount > 100) {
          throw new Error(locale === 'es' ? 'El descuento debe ser un número entre 0 y 100' : 'The discount must be a number between 0 and 100');
        }
        updates.discount_percentage = discount;
      }

      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId);

      if (error) throw error;

      // Actualizar el producto en el estado local
      setProducts(products.map(p =>
        p.id === productId ? { ...p, ...updates } : p
      ));

      // Si estamos editando este producto, actualizar también el producto seleccionado
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct({ ...selectedProduct, ...updates });
      }

      // Mostrar notificación de éxito según el tipo de actualización
      if (updates.colon_price !== undefined) {
        toast.success(
          <div className="flex flex-col">
            <span className="font-medium">{locale === 'es' ? 'Precio actualizado' : 'Price updated'}</span>
            <span className="text-sm">{locale === 'es' ? 'Nuevo precio: ₡' : 'New price: ₡'}{updates.colon_price}</span>
          </div>,
          { duration: 3000 }
        );
      } else if (updates.dolar_price !== undefined) {
        toast.success(
          <div className="flex flex-col">
            <span className="font-medium">{locale === 'es' ? 'Precio USD actualizado' : 'USD price updated'}</span>
            <span className="text-sm">{locale === 'es' ? 'Nuevo precio: $' : 'New price: $'}{updates.dolar_price}</span>
          </div>,
          { duration: 3000 }
        );
      } else if (updates.is_active !== undefined) {
        toast.success(
          <div className="flex flex-col">
            <span className="font-medium">{locale === 'es' ? 'Estado actualizado' : 'Status updated'}</span>
            <span className="text-sm">{locale === 'es' ? (updates.is_active ? 'Producto activado' : 'Producto desactivado') : (updates.is_active ? 'Product activated' : 'Product deactivated')}</span>
          </div>,
          { duration: 3000 }
        );
      } else if (updates.discount_percentage !== undefined) {
        toast.success(
          <div className="flex flex-col">
            <span className="font-medium">{locale === 'es' ? 'Descuento actualizado' : 'Discount updated'}</span>
            <span className="text-sm">
              {updates.discount_percentage > 0
                ? locale === 'es' ? `Descuento: ${updates.discount_percentage}%` : `Discount: ${updates.discount_percentage}%`
                : locale === 'es' ? 'Descuento removido' : 'Discount removed'}
            </span>
          </div>,
          { duration: 3000 }
        );
      } else {
        toast.success(locale === 'es' ? 'Producto actualizado correctamente' : 'Product updated successfully');
      }

      return { success: true };
    } catch (err: unknown) {
      console.error('Error al actualizar producto:', err);
      const errorMessage = err instanceof Error ? err.message : 'No se pudo actualizar el producto';
      toast.error(`Error: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [supabase, products, selectedProduct, setLoading, setProducts, setSelectedProduct, locale]);

  return (
    <div className="container mx-auto px-2 py-0.5 text-gray-800">
      <h1 className="text-2xl font-bold mb-0.5">{locale === 'es' ? 'Admin de Productos' : 'Products admin'}</h1>


      {/* Barra de herramientas */}
      <div className="bg-white rounded-lg shadow-md p-1 mb-1">
        {/* Búsqueda y filtro en la misma fila */}
        <div className="flex flex-row gap-2 md:gap-4 mb-2">
          {/* Búsqueda */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={locale === 'es' ? 'Buscar por nombre...' : 'Search by name...'}
              className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar productos"
            />
          </div>

          {/* Filtro de categoría */}
          <div className="relative w-12 md:w-64">
            <div className="absolute inset-y-0 left-3 p-1 flex items-center justify-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none md:appearance-auto"
              value={categoryFilter || ''}
              onChange={(e) => setCategoryFilter(e.target.value ? parseInt(e.target.value) : null)}
              aria-label="Filtrar por categoría"
            >
              <option value=""></option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {locale === 'es' ? category.name_es : category.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón de actualizar y selector de vista en fila separada */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          {/* Botón de actualizar */}
          <button
            onClick={() => fetchProducts()}
            className="flex items-center justify-center px-3 py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 mr-1 ${loading ? 'animate-spin' : ''}`} />
            {locale === 'es' ? 'Actualizar' : 'Update'}
          </button>

          {/* Selector de vista */}
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}
              aria-label="Ver en cuadrícula"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}
              aria-label="Ver en lista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Estado de carga o error */}
      {loading && !selectedProduct && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mb-2"></div>
          <p className="text-gray-600">{locale === 'es' ? 'Cargando productos...' : 'Loading products...'}</p>
        </div>
      )}

      {error && !selectedProduct && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">{locale === 'es' ? 'Error' : 'Error'}</p>
          <p>{error}</p>
        </div>
      )}

      {/* Vista del editor de producto */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl w-full max-w-full max-h-full h-full overflow-y-auto">
            <ProductEditor
              locale={locale}
              product={selectedProduct}
              categories={categories}
              onSave={async (updates) => {
                const result = await updateProduct(selectedProduct.id, updates);
                if (result.success) {
                  setSelectedProduct(null);
                }
                return result;
              }}
              onCancel={() => setSelectedProduct(null)}
            />
          </div>
        </div>
      )}

      {/* Lista de productos */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">{locale === 'es' ? 'No se encontraron productos' : 'No products found'}</p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "flex flex-col space-y-3"
        }>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg ${viewMode === 'grid' ? 'transform hover:-translate-y-1' : 'flex flex-col md:flex-row'
                }`}
            >
              {viewMode === 'grid' ? (
                // Vista de cuadrícula
                <div className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <div className="h-36 sm:h-56 relative">
                    <div className="h-full w-full flex items-center justify-center bg-teal-50 p-4"

                    >
                      {product.media && isMediaArray(product.media) && product.media.length > 0 && product.media[0].url ? (
                        <Image
                          src={product.media[0].url}
                          alt={product.name || 'Producto'}
                          className="w-full h-full object-contain"
                          width={300}
                          height={300}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                          <span>{locale === 'es' ? 'Sin imagen' : 'No image'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-none">
                        {locale === 'es' ? `${product.name_es || product.name}` : `${product.name_en || product.name}`}

                      </h3>
                      {product.is_active ? (
                        <span className="inline-block px-2 py-1 text-[0.65rem] font-semibold rounded-full bg-green-100 text-green-800">
                          {locale === 'es' ? 'Activo' : 'Active'}
                        </span>
                      ) : (
                        <span className="inline-block px-1 py-1 text-[0.65rem] font-semibold rounded-full bg-red-100 text-red-800">

                          {locale === 'es' ? 'Inactivo' : 'Inactive'}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex flex-col">
                      <div className="flex items-center">
                        <div className="flex-grow flex items-center">
                          <div className="flex flex-col space-y-2">
                            {/* Primera fila: Precio y estado */}
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex items-center">
                                <div className="flex items-center border border-gray-300 rounded-l overflow-hidden">
                                  <span className="px-2 py-1.5 bg-gray-50 text-teal-700 font-bold border-r border-gray-300">$</span>
                                  <input
                                    type="number"
                                    className="w-24 px-2 py-1.5 text-md font-bold text-teal-700 border-none transition-colors focus:outline-none focus:ring-0"
                                    value={product.dolar_price || ''}
                                    onChange={(e) => {
                                      const newPrice = e.target.value ? parseFloat(e.target.value) : null;
                                      setProducts(products.map(p =>
                                        p.id === product.id ? { ...p, dolar_price: newPrice } : p
                                      ));
                                    }}
                                    min="0"
                                    step="100"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <button
                                  className="px-3 py-2 ml-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-r transition-colors duration-200 flex items-center justify-center"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (product.dolar_price !== null) {
                                      const loadingToast = toast.loading(`${locale === 'es' ? 'Actualizando precio...' : 'Updating price...'}`);
                                      await updateProduct(product.id, { dolar_price: product.dolar_price });
                                      toast.dismiss(loadingToast);
                                    }
                                  }}
                                  title={locale === 'es' ? 'Actualizar precio' : 'Update price'}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  <span>{locale === 'es' ? 'Aplicar precio' : 'Apply price'}</span>
                                </button>
                              </div>

                              {/* Menú de opciones */}
                              <div className="relative">
                                <button
                                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowProductMenu(showProductMenu === product.id ? null : product.id);
                                  }}
                                  title={locale === 'es' ? 'Más opciones' : 'More options'}
                                >
                                  <Menu className="h-7 w-7 text-black" />
                                </button>

                                {showProductMenu === product.id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                    {/* Botón para activar/desactivar producto */}
                                    <button
                                      className={`w-full text-left px-4 py-2 text-sm flex items-center ${product.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        const loadingToast = toast.loading(`${product.is_active ? (locale === 'es' ? 'Desactivando' : 'Deactivating') : (locale === 'es' ? 'Activando' : 'Activating')} producto...`);
                                        await updateProduct(product.id, { is_active: !product.is_active });
                                        toast.dismiss(loadingToast);
                                        setShowProductMenu(null);
                                      }}
                                    >
                                      {product.is_active ? (
                                        <>
                                          <X className="h-4 w-4 mr-2" />
                                          {locale === 'es' ? 'Desactivar producto' : 'Deactivate product'}
                                        </>
                                      ) : (
                                        <>
                                          <Check className="h-4 w-4 mr-2" />
                                          {locale === 'es' ? 'Activar producto' : 'Activate product'}
                                        </>
                                      )}
                                    </button>

                                    {/* Botón para editar producto completo */}
                                    <button
                                      className="w-full text-left px-4 py-2 text-sm flex items-center text-blue-600 hover:bg-blue-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProduct(product);
                                        setShowProductMenu(null);
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      {locale === 'es' ? 'Editar producto' : 'Edit product'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Segunda fila: Control de descuento */}
                            <div className="flex items-center">
                              <div className="flex items-center border border-gray-300 rounded-l overflow-hidden">
                                <input
                                  type="number"
                                  className="w-16 px-2 py-1.5 text-sm font-medium text-gray-700 border-none focus:outline-none focus:ring-0"

                                  value={product.discount_percentage || ''}
                                  onChange={(e) => {
                                    const newDiscount = e.target.value ? parseFloat(e.target.value) : null;
                                    setProducts(products.map(p =>
                                      p.id === product.id ? { ...p, discount_percentage: newDiscount } : p
                                    ));
                                  }}
                                  min="0"
                                  max="100"
                                  step="1"
                                  placeholder="0"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="px-2 py-1.5 bg-gray-50 text-gray-700 font-medium border-l border-gray-300">%</span>
                              </div>
                              <button
                                className="px-3 py-2 ml-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-r transition-colors duration-200 flex items-center justify-center"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const loadingToast = toast.loading('Actualizando descuento...');
                                  await updateProduct(product.id, { discount_percentage: product.discount_percentage });
                                  toast.dismiss(loadingToast);
                                }}
                                title="Actualizar descuento"
                              >
                                <span>{locale === 'es' ? 'Aplicar descuento' : 'Apply discount'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {product.sku && (
                      <div className="mt-0.5 pl-0.5 text-[0.6rem] text-gray-500">
                        SKU: {product.sku}
                      </div>
                    )}

                    {product.category_id && (
                      <div className="mt-0.5">
                        <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-700 text-xs rounded-full border border-teal-100">
                          {locale === 'es' ? categories.find(cat => cat.id === product.category_id)?.name_es || 'Categoría' : categories.find(cat => cat.id === product.category_id)?.name_en || 'Category'}

                        </span>
                      </div>
                    )}

                    <div className="mt-2 text-center text-xs text-gray-500">
                      {locale === 'es' ? 'Última modificación' : 'Last modification'}: {product.modified_at ? formatModifiedDate(product.modified_at) : 'No disponible'}
                    </div>
                    <div className="mt-1 text-center text-[0.6rem] text-gray-400 italic">

                      {locale === 'es' ? 'Click para más opciones de edición' : 'Click for more editing options'}
                    </div>
                  </div>
                </div>
              ) : (
                // Vista de lista mejorada
                <div className="flex items-start p-3 gap-3 w-full cursor-pointer hover:bg-gray-50" onClick={() => setSelectedProduct(product)}>
                  {/* Imagen del producto */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    {product.media && isMediaArray(product.media) && product.media.length > 0 && product.media[0].url ? (
                      <Image
                        src={product.media[0].url}
                        alt={product.name || 'Producto'}
                        className="w-full h-full object-contain bg-gray-50 rounded"
                        width={64}
                        height={64}
                        priority={false}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400 rounded">
                        <span className="text-xs">{locale === 'es' ? 'Sin imagen' : 'No image'}</span>
                      </div>
                    )}
                  </div>

                  {/* Nombre del producto */}
                  <div className="flex-grow min-w-0 py-1">
                    <h3 className="text-base font-medium text-gray-900 leading-relaxed break-words">
                      {product.name_es || product.name || `Producto #${product.id}`}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
