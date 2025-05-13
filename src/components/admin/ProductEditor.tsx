'use client';

import { useState } from 'react';
import { Database } from '@/types-db';
import { X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

type Product = Database['products'];
type Category = Database['categories'];

interface ProductEditorProps {
  product: Product;
  categories: Category[];
  onSave: (updates: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

export default function ProductEditor({ product, categories, onSave, onCancel }: ProductEditorProps) {
  const [price, setPrice] = useState<number | null>(product.price);
  const [name, setName] = useState<string | null>(product.name_es || product.name);
  const [isActive, setIsActive] = useState<boolean | null>(product.is_active);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(product.discount_percentage);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manejar el guardado de cambios
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const updates: Partial<Product> = {};
      
      // Solo incluir campos que han cambiado
      if (price !== product.price) updates.price = price;
      if (name !== (product.name_es || product.name)) {
        updates.name = name;
        updates.name_es = name;
      }
      if (isActive !== product.is_active) updates.is_active = isActive;
      if (discountPercentage !== product.discount_percentage) updates.discount_percentage = discountPercentage;
      
      // Si no hay cambios, mostrar mensaje y salir
      if (Object.keys(updates).length === 0) {
        toast('No se han realizado cambios', {
          icon: '🔔',
          style: {
            background: '#3498db',
            color: '#fff'
          }
        });
        return;
      }
      
      const result = await onSave(updates);
      
      if (result.success) {
        // El toast se mostrará desde el componente AdminDashboard
        // Cerrar el modal después de un breve retraso
        setTimeout(() => {
          onCancel();
        }, 500);
      } else {
        toast.error(result.error || 'Error al guardar los cambios');
        setError(result.error || 'Error al guardar los cambios');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al guardar los cambios';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Editar Producto</h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Cerrar"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
      </div>
      
      {/* Mensajes de error o éxito */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Imagen del producto */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-xs h-64 bg-gray-200 rounded-lg overflow-hidden">
            {product.media && product.media.length > 0 && product.media[0].url ? (
              <img 
                src={product.media[0].url} 
                alt={product.name || 'Producto'} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                <span>Sin imagen</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Información principal del producto */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-2 text-sm text-gray-500">
            ID: {product.id} {product.sku && `• SKU: ${product.sku}`}
          </div>
          
          {/* Nombre del producto */}
          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del producto
            </label>
            <input
              type="text"
              id="productName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={name || ''}
              onChange={(e) => setName(e.target.value || null)}
            />
          </div>
          
          {/* Precio - Sección destacada */}
          <div className="mb-6 bg-white p-4 rounded-lg border-2 border-teal-500 shadow-sm">
            <label htmlFor="productPrice" className="block text-lg font-bold text-teal-700 mb-2">
              Precio (₡)
            </label>
            <input
              type="number"
              id="productPrice"
              className="w-full px-4 py-3 text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={price === null ? '' : price}
              onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : null)}
              step="0.01"
              min="0"
              placeholder="Ingrese el precio en colones"
            />
          </div>
          
          {/* Estado del producto */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado del producto
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-teal-600"
                  name="status"
                  checked={isActive === true}
                  onChange={() => setIsActive(true)}
                />
                <span className="ml-2">Activo</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-red-600"
                  name="status"
                  checked={isActive === false}
                  onChange={() => setIsActive(false)}
                />
                <span className="ml-2">Inactivo</span>
              </label>
            </div>
          </div>
          
          {/* Descuento */}
          <div className="mb-4">
            <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-1">
              Porcentaje de descuento (%)
            </label>
            <input
              type="number"
              id="discountPercentage"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={discountPercentage === null ? '' : discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value ? parseFloat(e.target.value) : null)}
              min="0"
              max="100"
              step="0.1"
              placeholder="Sin descuento"
            />
          </div>
        </div>
        
        {/* Opciones avanzadas (colapsables) */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span className="font-medium">Opciones avanzadas</span>
            {showAdvanced ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {showAdvanced && (
            <div className="p-4 bg-white">
              <p className="text-gray-500 text-sm mb-4">
                Estas opciones están disponibles pero no son necesarias para la edición rápida de precios.
              </p>
              
              {/* Aquí se pueden agregar más campos como categoría, especificaciones, etc. */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={product.category_id || ''}
                  disabled
                >
                  <option value="">Sin categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_es}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  La categoría no se puede cambiar desde esta pantalla.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
          >
            {saving ? (
              <>
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
