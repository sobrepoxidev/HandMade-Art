'use client';

import { useState } from 'react';
import { Database } from '@/types-db';
import { X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

type Product = Database['products'];
type Category = Database['categories'];

interface ProductEditorProps {
  locale: string;
  product: Product;
  categories: Category[];
  onSave: (updates: Partial<Product>) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

export default function ProductEditor({ locale, product, categories, onSave, onCancel }: ProductEditorProps) {
  // Campos que ya se pueden editar directamente en las tarjetas
  // - price: se puede editar en la tarjeta con guardado inmediato
  // - is_active: se puede activar/desactivar en la tarjeta con guardado inmediato
  // - discount_percentage: se puede editar en la tarjeta con guardado inmediato

  // En el editor modal, nos enfocamos en campos que no se pueden editar fácilmente en las tarjetas
  // y opciones más avanzadas
  const [price, setPrice] = useState<number | null>(product.colon_price);
  const [usdPrice, setUsdPrice] = useState<number | null>(product.dolar_price);
  const [nameEs, setNameEs] = useState<string | null>(product.name_es || product.name);
  const [nameEn, setNameEn] = useState<string | null>(product.name || product.name_es);
  const [weight_kg, setWeightKg] = useState<number | null>(product.weight_kg);
  const [length_cm, setLengthCm] = useState<number | null>(product.length_cm);
  const [width_cm, setWidthCm] = useState<number | null>(product.width_cm);
  const [height_cm, setHeightCm] = useState<number | null>(product.height_cm);
  const [isActive, setIsActive] = useState<boolean | null>(product.is_active);
  const [discountPercentage, setDiscountPercentage] = useState<number | null>(product.discount_percentage);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(product.category_id || 0);

  // Manejar el guardado de cambios
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const updates: Partial<Product> = {};

      // Solo incluir campos que han cambiado
      if (price !== product.colon_price) updates.colon_price = price;
      if (usdPrice !== product.dolar_price) updates.dolar_price = usdPrice;
      if (nameEs !== (product.name_es || product.name)) {
        updates.name = nameEs;
        updates.name_es = nameEs;
      }
      if (nameEn !== (product.name || product.name_es)) {
        updates.name = nameEn;
        updates.name_en = nameEn;
      }
      if (isActive !== product.is_active) updates.is_active = isActive;
      if (discountPercentage !== product.discount_percentage) updates.discount_percentage = discountPercentage;

      if (weight_kg !== product.weight_kg) updates.weight_kg = weight_kg;
      if (length_cm !== product.length_cm) updates.length_cm = length_cm;
      if (width_cm !== product.width_cm) updates.width_cm = width_cm;
      if (height_cm !== product.height_cm) updates.height_cm = height_cm;
      if (categoryId !== product.category_id) updates.category_id = categoryId;

      // Si no hay cambios, mostrar mensaje y salir
      if (Object.keys(updates).length === 0) {
        toast(locale === 'es' ? 'No se han realizado cambios' : 'No changes made', {
          icon: '🔔',
          style: {
            background: '#3498db',
            color: '#fff'
          }
        });
        return;
      }

      // Validar datos antes de guardar
      if (updates.colon_price !== undefined && updates.colon_price !== null) {
        const priceNum = Number(updates.colon_price);
        if (isNaN(priceNum) || priceNum < 0) {
          throw new Error(locale === 'es' ? 'El precio debe ser un número válido mayor o igual a 0' : 'The price must be a valid number greater than or equal to 0');
        }
        updates.colon_price = priceNum;
      }

      if (categoryId !== 0) {
        updates.category_id = categoryId;
      }

      if (updates.dolar_price !== undefined && updates.dolar_price !== null) {
        const usdNum = Number(updates.dolar_price);
        if (isNaN(usdNum) || usdNum < 0) {
          throw new Error(locale === 'es' ? 'El precio en USD debe ser un número válido mayor o igual a 0' : 'USD price must be a valid number greater than or equal to 0');
        }
        updates.dolar_price = usdNum;
      }

      if (updates.weight_kg !== undefined && updates.weight_kg !== null) {
        const weightNum = Number(updates.weight_kg);
        if (isNaN(weightNum) || weightNum < 0) {
          throw new Error(locale === 'es' ? 'El peso debe ser un número válido mayor o igual a 0' : 'The weight must be a valid number greater than or equal to 0');
        }
        updates.weight_kg = weightNum;
      }

      if (updates.length_cm !== undefined && updates.length_cm !== null) {
        const lengthNum = Number(updates.length_cm);
        if (isNaN(lengthNum) || lengthNum < 0) {
          throw new Error(locale === 'es' ? 'La longitud debe ser un número válido mayor o igual a 0' : 'The length must be a valid number greater than or equal to 0');
        }
        updates.length_cm = lengthNum;
      }

      if (updates.width_cm !== undefined && updates.width_cm !== null) {
        const widthNum = Number(updates.width_cm);
        if (isNaN(widthNum) || widthNum < 0) {
          throw new Error(locale === 'es' ? 'El ancho debe ser un número válido mayor o igual a 0' : 'The width must be a valid number greater than or equal to 0');
        }
        updates.width_cm = widthNum;
      }

      if (updates.height_cm !== undefined && updates.height_cm !== null) {
        const heightNum = Number(updates.height_cm);
        if (isNaN(heightNum) || heightNum < 0) {
          throw new Error(locale === 'es' ? 'La altura debe ser un número válido mayor o igual a 0' : 'The height must be a valid number greater than or equal to 0');
        }
        updates.height_cm = heightNum;
      }

      if (updates.discount_percentage !== undefined && updates.discount_percentage !== null) {
        const discountNum = Number(updates.discount_percentage);
        if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
          throw new Error(locale === 'es' ? 'El descuento debe ser un número entre 0 y 100' : 'The discount must be a number between 0 and 100');
        }
        updates.discount_percentage = discountNum;
      }

      const result = await onSave(updates);

      if (result.success) {
        // El toast se mostrará desde el componente AdminDashboard
        // Cerrar el modal después de un breve retraso
        setTimeout(() => {
          onCancel();
        }, 500);
      } else {
        toast.error(result.error || (locale === 'es' ? 'Error al guardar los cambios' : 'Error saving changes'));
        setError(result.error || (locale === 'es' ? 'Error al guardar los cambios' : 'Error saving changes'));
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : (locale === 'es' ? 'Error al guardar los cambios' : 'Error saving changes');
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-1">
      <div className="flex justify-between items-center mb-0.5">
        <h2 className="text-xl font-bold">{locale === 'es' ? 'Editar Producto' : 'Edit Product'}</h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Cerrar"
        >
          <X className="h-7 w-7 text-black bg-gray-400 rounded-lg" />
        </button>
      </div>

      {/* Mensajes de error o éxito */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-1">
        {/* Imagen del producto */}
        <div className="flex justify-center mb-0">
          <div className="w-full max-w-xs h-36 py-1 bg-gray-200 rounded-lg overflow-hidden">
            {product.media && product.media.length > 0 && product.media[0].url ? (
              <Image
                src={product.media[0].url}
                alt={product.name || 'Producto'}
                className="w-full h-full object-contain"
                width={300}
                height={300}
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                <span>{locale === 'es' ? 'Sin imagen' : 'No image'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Información principal del producto */}
        <div className="bg-gray-50 p-1 rounded-lg">
          <div className="mb-1 text-[0.7rem] text-gray-500">
            ID: {product.id} {product.sku && `• SKU: ${product.sku}`}
          </div>

          {/* Nombre del producto - No editable en tarjetas */}
          <div className="mb-1">
            <label htmlFor="nameEs" className="block text-sm font-semibold text-gray-700">
              {locale === 'es' ? 'Nombre ESPAÑOL' : 'SPANISH name'}
            </label>
            <input
              type="text"
              id="nameEs"
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={nameEs || ''}
              onChange={(e) => setNameEs(e.target.value || null)}
              placeholder="Nombre en ESPAÑOL"
            />

          </div>
          <div className="mb-1">
            <label htmlFor="nameEn" className="block text-sm font-semibold text-gray-700">
              {locale === 'es' ? 'Nombre INGLÉS' : 'ENGLISH name'}
            </label>
            <input
              type="text"
              id="nameEn"
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={nameEn || ''}
              onChange={(e) => setNameEn(e.target.value || null)}
              placeholder="Nombre en ENGLISH"
            />

          </div>

          {/* Sección de campos que también se pueden editar en las tarjetas */}
          {/* Precio CRC */}
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'es' ? 'Precio (₡)' : 'Price (₡)'}
              </label>
              <input
                type="number"
                id="price"
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={price === null ? '' : price}
                onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : null)}
                min="0"
                step="100"
                placeholder="0"
              />
            </div>

            {/* Precio USD */}
            <div className="mb-2">
              <label htmlFor="usdPrice" className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'es' ? 'Precio (US$)' : 'Price (US$)'}
              </label>
              <input
                type="number"
                id="usdPrice"
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={usdPrice === null ? '' : usdPrice}
                onChange={(e) => setUsdPrice(e.target.value ? parseFloat(e.target.value) : null)}
                min="0"
                step="0.01"
                placeholder="0"
              />
            </div>
          </div>



          {/* Descuento */}
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-2">
              <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'es' ? 'Descuento (%)' : 'Discount (%)'}
              </label>
              <input
                type="number"
                id="discountPercentage"
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={discountPercentage === null ? '' : discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value ? parseFloat(e.target.value) : null)}
                min="0"
                max="100"
                step="0.1"
                placeholder="Sin descuento"
              />
            </div>
            {/* Estado activo */}
            <div className="mb-2">
              <div className="flex items-center justify-center pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  className="h-4 w-4 py-1 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  checked={isActive === true}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-800 font-semibold">
                  {locale === 'es' ? 'Producto activo' : 'Product active'}
                </label>
              </div>
            </div>
          </div>
          {/* Peso */}
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-1">
              <label htmlFor="weight_kg" className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'es' ? 'Peso (kg)' : 'Weight (kg)'}
              </label>
              <input
                type="number"
                id="weight_kg"
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={weight_kg === null ? '' : weight_kg}
                onChange={(e) => setWeightKg(e.target.value ? parseFloat(e.target.value) : null)}
                min="0"
                step="0.1"
                placeholder="0"
              />
            </div>
            <div className="mb-1">
              <label htmlFor="length_cm" className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'es' ? 'Longitud (cm)' : 'Length (cm)'}
              </label>
              <input
                type="number"
                id="length_cm"
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={length_cm === null ? '' : length_cm}
                onChange={(e) => setLengthCm(e.target.value ? parseFloat(e.target.value) : null)}
                min="0"
                step="0.1"
                placeholder="0"
              />
            </div>
            <div className="mb-1">
              <label htmlFor="width_cm" className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'es' ? 'Ancho (cm)' : 'Width (cm)'}
              </label>
              <input
                type="number"
                id="width_cm"
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={width_cm === null ? '' : width_cm}
                onChange={(e) => setWidthCm(e.target.value ? parseFloat(e.target.value) : null)}
                min="0"
                step="0.1"
                placeholder="0"
              />
            </div>
            <div className="mb-1">
              <label htmlFor="height_cm" className="block text-sm font-medium text-gray-700 mb-1">
                {locale === 'es' ? 'Altura (cm)' : 'Height (cm)'}
              </label>
              <input
                type="number"
                id="height_cm"
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={height_cm === null ? '' : height_cm}
                onChange={(e) => setHeightCm(e.target.value ? parseFloat(e.target.value) : null)}
                min="0"
                step="0.1"
                placeholder="0"
              />
            </div>


          </div>

        </div>

        {/* Opciones avanzadas (colapsables) */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full flex justify-between items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 focus:outline-none"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span className="font-medium">{locale === 'es' ? 'Opciones avanzadas' : 'Advanced options'}</span>
            {showAdvanced ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {showAdvanced && (
            <div className="p-4 bg-white">


              {/* Aquí se pueden agregar más campos como categoría, especificaciones, etc. */}
              <div className="mb-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'es' ? 'Categoría' : 'Category'}
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : 0)}

                >
                  <option value="">{locale === 'es' ? 'Sin categoría' : 'No category'}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_es}
                    </option>
                  ))}
                </select>

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
            {locale === 'es' ? 'Cancelar' : 'Cancel'}
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
                {locale === 'es' ? 'Guardando...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {locale === 'es' ? 'Guardar cambios' : 'Save changes'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
