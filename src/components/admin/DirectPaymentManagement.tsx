'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Search, ShoppingCart, Plus, Minus, Trash2, User, Mail, Phone, X, Filter, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DirectPaymentDiscountModal from './DirectPaymentDiscountModal';
import { Database } from '@/types-db';

type Product = Database['products'];

interface CartItem extends Product {
  quantity: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}

interface DirectPaymentManagementProps {
  locale: string;
}

export default function DirectPaymentManagement({ locale }: DirectPaymentManagementProps) {
  const supabase = createClientComponentClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;

        setProducts(data || []);
        setFilteredProducts(data || []);

       
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error(locale === 'es' ? 'Error al cargar productos' : 'Error loading products');
      } finally {
        setLoading(false);
      }
    }
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

    fetchProducts();
  }, [supabase, locale]);

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = products;

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((product) => {
        return product.category_id?.toString() === categoryFilter;
      });
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name_es?.toLowerCase().includes(term) ||
          product.name_en?.toLowerCase().includes(term) ||
          product.name?.toLowerCase().includes(term) ||
          (product.description && product.description.toLowerCase().includes(term)) ||
          (product.description_en && product.description_en.toLowerCase().includes(term)) ||
          (product.sku && product.sku.toLowerCase().includes(term))
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter]);

  // Add to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    toast.success(
      locale === 'es' ? 'Producto agregado al carrito' : 'Product added to cart'
    );
  };

  // Remove from cart
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate totals
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const discountPrice = item.discount_percentage ? 
        (item.dolar_price || 0) * (1 - (item.discount_percentage / 100)) : 
        null;
      const price = discountPrice || item.dolar_price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  // Handle checkout
  const handleCheckout = () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email) {
      toast.error(
        locale === 'es'
          ? 'Por favor ingresa el nombre y correo del cliente'
          : 'Please enter customer name and email'
      );
      return;
    }

    // Validate cart
    if (cart.length === 0) {
      toast.error(
        locale === 'es'
          ? 'El carrito está vacío'
          : 'Cart is empty'
      );
      return;
    }

    // Show discount modal
    setShowDiscountModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-1.5 text-black">
      <h1 className="text-2xl font-bold mb-2">
        {locale === 'es' ? 'Generación de Pagos Directos' : 'Direct Payment Generation'}
      </h1>

      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          {locale === 'es' ? 'Información del Cliente' : 'Customer Information'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'es' ? 'Nombre' : 'Name'} *
            </label>
            <input
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={locale === 'es' ? 'Nombre del cliente' : 'Customer name'}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'es' ? 'Correo Electrónico' : 'Email'} *
            </label>
            <input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={locale === 'es' ? 'Correo del cliente' : 'Customer email'}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {locale === 'es' ? 'Teléfono' : 'Phone'}
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={locale === 'es' ? 'Teléfono del cliente' : 'Customer phone'}
            />
          </div>
        </div>
      </div>

      {/* Mobile-first layout */}
      <div className="block lg:hidden mb-3">
        {/* Mobile Cart - Always visible at top */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            {locale === 'es' ? 'Carrito de Compras' : 'Shopping Cart'}
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {cart.length}
            </span>
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              {locale === 'es' ? 'El carrito está vacío' : 'Cart is empty'}
            </div>
          ) : (
            <div>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center border-b pb-2 last:border-b-0">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-2">
                      {item.media && item.media.length > 0 ? (
                        <Image
                          src={item.media[0].url}
                          alt={locale == 'es' ? (item.name_es || item.name || "Nombre no disponible") : (item.name_en || item.name || "No name available")}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{locale === 'es' ? (item.name_es || item.name) : (item.name_en || item.name)}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-indigo-600 p-1"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-indigo-600 p-1"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-sm mr-2">
                            ${(() => {
                              const discountPrice = item.discount_percentage ? 
                                (item.dolar_price || 0) * (1 - (item.discount_percentage / 100)) : 
                                null;
                              const price = discountPrice || item.dolar_price || 0;
                              return (price * item.quantity).toFixed(2);
                            })()}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-base mb-3">
                  <span>{locale === 'es' ? 'Total:' : 'Total:'}</span>
                  <span>${cartTotal ? cartTotal.toFixed(2) : '0.00'}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                >
                  {locale === 'es' ? 'Proceder al Checkout' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Catalog */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">
              {locale === 'es' ? 'Catálogo de Productos' : 'Product Catalog'}
            </h2>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={locale === 'es' ? 'Buscar productos...' : 'Search products...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="w-full md:w-64">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">{locale === 'es' ? 'Todas las categorías' : 'All categories'}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {locale === 'es' ? 'No se encontraron productos' : 'No products found'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-40 bg-gray-100">
                      {product.media && product.media.length > 0 ? (
                        <Image
                          src={product.media[0].url || '/product-placeholder.png'}
                          alt={locale == 'es' ? (product.name_es || product.name || "Nombre no disponible") : (product.name_en || product.name || "No name available")}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 truncate">{locale === 'es' ? (product.name_es || product.name) : (product.name_en || product.name)}</h3>
                      {product.sku && (
                        <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                      )}
                      <div className="mt-2 flex justify-between items-center">
                        <div>
                          {product.discount_percentage ? (
                            <div className="flex flex-col">
                              <span className="text-sm line-through text-gray-500">
                                ${product.dolar_price ? product.dolar_price.toFixed(2) : '0.00'}
                              </span>
                              <span className="font-bold text-red-600">
                                ${product.dolar_price && product.discount_percentage ? (product.dolar_price * (1 - product.discount_percentage / 100)).toFixed(2) : '0.00'}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold">${product.dolar_price ? product.dolar_price.toFixed(2) : '0.00'}</span>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full"
                          aria-label="Add to cart"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Shopping Cart - Desktop only */}
        <div className="lg:col-span-1 hidden lg:block">
          <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              {locale === 'es' ? 'Carrito de Compras' : 'Shopping Cart'}
              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {locale === 'es' ? 'El carrito está vacío' : 'Cart is empty'}
              </div>
            ) : (
              <div>
                <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center border-b pb-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-3">
                        {item.media && item.media.length > 0 ? (
                          <Image
                            src={item.media[0].url}
                            alt={locale == 'es' ? (item.name_es || item.name || "Nombre no disponible") : (item.name_en || item.name || "No name available")}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium truncate">{locale === 'es' ? (item.name_es || item.name) : (item.name_en || item.name)}</h3>
                        <div className="flex justify-between mt-1">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-500 hover:text-indigo-600"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-500 hover:text-indigo-600"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">
                              ${(() => {
                                const discountPrice = item.discount_percentage ? 
                                  (item.dolar_price || 0) * (1 - (item.discount_percentage / 100)) : 
                                  null;
                                const price = discountPrice || item.dolar_price || 0;
                                return (price * item.quantity).toFixed(2);
                              })()}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>{locale === 'es' ? 'Total:' : 'Total:'}</span>
                    <span>${cartTotal ? cartTotal.toFixed(2) : '0.00'}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    {locale === 'es' ? 'Proceder al Checkout' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discount Modal */}
      {showDiscountModal && (
        <DirectPaymentDiscountModal
          locale={locale}
          onClose={() => setShowDiscountModal(false)}
          cart={cart}
          customerInfo={customerInfo}
        />
      )}
    </div>
  );
}