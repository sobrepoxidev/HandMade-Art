"use client";

import { MediaCarousel } from "./ClientComponents";
import { ShoppingCartIcon, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Database } from "@/lib/database.types";
import { useCart } from "@/context/CartContext";
import { useLocale } from 'next-intl';

type Product = Database['public']['Tables']['products']['Row'] & { category?: string | null };

export function ProductCardModal({
    product,
    activeExpandButton,
    fullscreenMode = false
}: {
    product: Product,
    activeExpandButton: boolean,
    fullscreenMode?: boolean
}) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const locale = useLocale();

    const handleIncrement = () => {
        if (quantity < 10) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        console.log("Adding to cart:", product, quantity);
        addToCart(product, quantity);
    };

    const { name, category, description, dolar_price: price } = product;

    // Use different layouts for fullscreen mode vs card mode
    if (fullscreenMode) {
        return (
            <div className="w-full h-screen sm:h-full flex flex-col md:flex-row ">
                {/* Media section - larger in fullscreen mode */}
                <div className="w-full md:w-3/5 lg:w-2/3 h-screen sm:h-full bg-gray-50 items-center justify-center">
                    <MediaCarousel product={product} activeExpandButton={activeExpandButton} />
                </div>

                {/* Product details section */}
                <div className="w-full md:w-2/5 lg:w-1/3 h-1/2 md:h-full flex flex-col p-6 bg-white overflow-y-auto">
                    <div className="mb-4">
                        {category && <p className="text-sm text-teal-600 font-medium">{category}</p>}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{name || 'Product Name'}</h1>
                        <div className="flex items-center gap-3">
                            <p className="text-xl font-bold text-gray-900">
                                ${price ? price.toFixed(0) : 'Price not available'}
                            </p>
                        </div>
                    </div>

                    {/* Description - shown in fullscreen mode */}
                    {description && (
                        <div className="mb-6 flex-grow overflow-y-auto">
                            <p className="text-gray-700">{description}</p>
                        </div>
                    )}

                    {/* Action section */}
                    <div className="mt-auto pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center border rounded-lg overflow-hidden shadow-sm bg-gray-50">
                                <button
                                    className="px-3 py-2 hover:bg-gray-200 text-gray-700 transition-colors h-10"
                                    aria-label="Disminuir cantidad"
                                    onClick={handleDecrement}
                                >
                                    −
                                </button>
                                <div className="flex items-center justify-center w-12 h-10 text-base font-semibold text-gray-700">
                                    {quantity}
                                </div>
                                <button
                                    className="px-3 py-2 hover:bg-gray-200 text-gray-700 transition-colors h-10"
                                    aria-label="Aumentar cantidad"
                                    onClick={handleIncrement}
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex gap-2">
                                {/* <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button> */}
                                <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <button
                            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-white font-medium shadow-md transition-all hover:bg-teal-700 active:scale-95 active:shadow-sm"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCartIcon className="w-5 h-5" />
                            {locale === 'es' ? 'Añadir al carrito' : 'Add to cart'} • ${price ? (price * quantity).toFixed(0) : 'N/A'}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-700">
                                {locale === 'es' ? 'Envío gratuito para ordenes superiores a $50,000' : 'Free shipping for orders over $50,000'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Original compact layout with improvements
    return (
        <div className="w-full h-full flex flex-col justify-between">
          {/* Carrusel de imágenes */}
          <div className="relative">
            <MediaCarousel product={product} activeExpandButton={activeExpandButton} />
      
            {description && (
              <>
                <button
                  className="absolute bottom-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10 transition-colors"
                  aria-label="Toggle description"
                  title="Toggle description"
                >
                  {/* <Info className="w-5 h-5 text-gray-700" /> */}
                </button>
              </>
            )}
      
            {/* {showDescription && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm p-4 overflow-auto z-20 transition-opacity">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDescription(false)}
                >
                  ×
                </button>
                <h3 className="mb-2 text-xl font-bold text-gray-800">Description</h3>
                <p className="text-sm text-gray-700">{description}</p>
              </div>
            )} */}
          </div>
      
          {/* Línea divisoria */}
          <div className="flex flex-row justify-center font-thin border-t border-gray-300 mb-1 mt-2 mx-4" />
      
          {/* Contenido principal del producto */}
          <div className="flex flex-col flex-grow items-center justify-start text-center px-0">
            {/* Info: nombre y categoría */}
            <div className="flex-grow px-4">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 break-words">
                {name}
              </h2>
              <p className="text-sm text-gray-600">{category}</p>
            </div>
      

      
            {/* Selector y botón */}
            <div className="mt-1 w-full flex flex-col gap-3 px-4">
              {/* Selector de cantidad */}
              <div className="flex justify-center">
                <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                  <button
                    className="px-3 hover:bg-gray-200 text-gray-700 transition-colors duration-200 h-10"
                    onClick={handleDecrement}
                    title="Disminuir cantidad"
                  >
                    −
                  </button>
                  <div className="flex items-center justify-center w-12 h-8 text-base font-semibold text-gray-700">
                    {quantity}
                  </div>
                  <button
                    className="px-3 py-2 hover:bg-gray-200 text-gray-700 transition-colors duration-200 h-10"
                    onClick={handleIncrement}
                    title="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
      
          {/* Botón de precio/carrito fijo abajo */}
          <div className="w-full mt-2">
            <button
              className="w-full inline-flex items-center justify-center gap-2 rounded-b-lg bg-teal-600 py-3 text-white font-medium shadow-lg transition-all hover:bg-teal-700 active:scale-95 active:shadow-none"
              onClick={handleAddToCart}
              aria-label="Agregar al carrito"
            >
              <ShoppingCartIcon className="w-5 h-5" /> ₡{price ? price.toFixed(0) : 'Price not available'}
            </button>
          </div>
        </div>
      );
      
}