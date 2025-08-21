'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Plus, Minus, Trash2, Search } from 'lucide-react';
import { useInterestList, InterestItem } from '@/lib/hooks/useInterestList';

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

interface ProductCardProps {
  product: Product;
  interestList: ReturnType<typeof useInterestList>;
}

export function ProductCard({ product, interestList }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.495);
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  
  const isInList = interestList.isInList(product.id);
  const currentItem = interestList.getItem(product.id);
  const currentQty = currentItem?.qty || 0;

  // Calcular precios
  const originalPrice = product.dolar_price || 0;
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
  const finalPrice = hasDiscount 
    ? originalPrice * (1 - product.discount_percentage! / 100)
    : originalPrice;

  // Formatear descripción corta
  const shortDescription = product.description 
    ? product.description.length > 160 
      ? product.description.substring(0, 160) + '...'
      : product.description
    : '';

  // Formatear dimensiones
  const getDimensions = () => {
    const { length_cm, width_cm, height_cm } = product;
    if (length_cm && width_cm && height_cm) {
      return `${length_cm} × ${width_cm} × ${height_cm} cm`;
    }
    return null;
  };

  const handleAddToList = () => {
    const itemData: Omit<InterestItem, 'qty'> = {
      product_id: product.id,
      name: product.name,
      sku: product.sku || undefined,
      main_image_url: product.main_image_url || undefined,
      price: finalPrice,
      discount_percentage: product.discount_percentage || undefined
    };
    
    interestList.addItem(itemData);
  };

  const handleUpdateQuantity = (newQty: number) => {
    interestList.updateQuantity(product.id, newQty);
  };

  const handleRemoveFromList = () => {
    interestList.removeItem(product.id);
  };

  const productUrl = `https://handmadeart.store/en/product/${product.id}`;

  // Funciones de zoom y arrastre
  const handleImageClick = (e: React.MouseEvent) => {
    // Prevenir el click si estamos arrastrando
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    if (isZoomed) {
      setIsZoomed(false);
      setZoomScale(1.495);
    } else {
      setIsZoomed(true);
      setZoomScale(2);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    // Delay para asegurar que no se active el click
    setTimeout(() => setIsDragging(false), 200);
  };

  // Función helper para calcular distancia entre dos toques
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Manejar inicio de toque
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches as unknown as TouchList);
      setLastTouchDistance(distance);
    }
  };

  // Manejar movimiento de toque (pinch-to-zoom)
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance > 0) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches as unknown as TouchList);
      const scaleChange = currentDistance / lastTouchDistance;
      const newScale = Math.max(1.0, Math.min(4, zoomScale * scaleChange));
      
      setZoomScale(newScale);
      setIsZoomed(newScale > 1.495);
      setLastTouchDistance(currentDistance);
    }
  };

  // Manejar fin de toque
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setLastTouchDistance(0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Imagen con zoom */}
      <div className="aspect-square relative h-[190px] w-full bg-gray-100 overflow-hidden">
        {product.main_image_url && !imageError ? (
          <motion.div 
            className="relative w-full h-full cursor-pointer"
            onClick={handleImageClick}
            drag={isZoomed}
            dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={{ 
              scale: zoomScale,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
            style={{ 
              touchAction: isZoomed ? 'none' : 'auto',
              transformOrigin: 'center center'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={product.main_image_url}
              alt={product.name}
              fill
              className="object-contain select-none pointer-events-none"
              loading="lazy"
              onError={() => setImageError(true)}
              draggable={false}
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-sm">Sin imagen</p>
            </div>
          </div>
        )}
        
        {/* Indicadores de zoom */}
        {product.main_image_url && !imageError && (
          <>
            {!isZoomed && (
              <motion.div 
                className="absolute bottom-1 right-1 bg-black bg-opacity-40 text-white text-xs px-1 py-0.5 rounded pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                Zoom
              </motion.div>
            )}
            
            {isZoomed && (
              <>
                <motion.div 
                  className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 pointer-events-none z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Search className="h-3 w-3 text-gray-700" />
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded pointer-events-none z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {Math.round(zoomScale * 100)}%
                </motion.div>
              </>
            )}
          </>
        )}
      </div>

      {/* Contenido */}
      <div className="px-2 pb-1.5">
        {/* Nombre */}
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        {/* Precio */}
        <div className="mb-1.5">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-teal-600">
                ${finalPrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                -{product.discount_percentage}%
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-green-900">
              ${finalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Especificaciones */}
        <div className="space-y-1 mb-3 text-sm text-gray-600">
          {getDimensions() && (
            <p><span className="font-medium">Dimensiones:</span> {getDimensions()}</p>
          )}
          {product.weight_kg && (
            <p><span className="font-medium">Peso:</span> {product.weight_kg} kg</p>
          )}
          {product.sku && (
            <p><span className="font-medium">SKU:</span> {product.sku}</p>
          )}
        </div>

        {/* Descripción */}
        {shortDescription && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {shortDescription}
          </p>
        )}

        {/* Acciones */}
        <div className="space-y-3">
          {/* Botón agregar/stepper */}
          {!isInList ? (
            <button
              onClick={handleAddToList}
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar a la lista
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateQuantity(currentQty - 1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-5 w-5 text-gray-700" />
                </button>
                <span className="w-8 text-center font-semibold text-black">{currentQty}</span>
                <button
                  onClick={() => handleUpdateQuantity(currentQty + 1)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              <button
                onClick={handleRemoveFromList}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Quitar de la lista"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Link a ficha */}
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Ver ficha completa
          </a>
        </div>
      </div>
    </div>
  );
}