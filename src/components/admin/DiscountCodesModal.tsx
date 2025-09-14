'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Tag, Percent, DollarSign, Save, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

interface DiscountCode {
  id?: number;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  apply_to_all_categories: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: number;
  name: string;
}

interface DiscountCodesModalProps {
  locale: string;
  onClose: () => void;
}

export default function DiscountCodesModal({ locale, onClose }: DiscountCodesModalProps) {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  
  const [formData, setFormData] = useState<Partial<DiscountCode>>({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: 0,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    apply_to_all_categories: true,
    is_active: true,
    usage_limit: undefined
  });

  // Cargar códigos de descuento y categorías
  useEffect(() => {
    loadDiscountCodes();
    loadCategories();
  }, []);

  const loadDiscountCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const typedData = (data || []).map(item => ({
        ...item,
        apply_to_all_categories: item.apply_to_all_categories ?? true,
        is_active: item.is_active ?? true
      })) as DiscountCode[];
      setDiscountCodes(typedData);
    } catch (error) {
      console.error('Error loading discount codes:', error);
      toast.error('Error al cargar códigos de descuento');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.discount_value || !formData.valid_from || !formData.valid_until) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (formData.discount_type === 'percentage' && (formData.discount_value <= 0 || formData.discount_value > 100)) {
      toast.error('El porcentaje debe estar entre 1 y 100');
      return;
    }

    if (formData.discount_type === 'fixed_amount' && formData.discount_value <= 0) {
      toast.error('El monto fijo debe ser mayor a 0');
      return;
    }

    try {
      const codeData = {
        ...formData,
        code: formData.code?.toUpperCase() || '',
        discount_type: formData.discount_type || 'percentage',
        discount_value: formData.discount_value || 0,
        used_count: editingCode ? editingCode.used_count : 0
      };

      let result;
      if (editingCode?.id) {
        const { data, error } = await supabase
          .from('quotes_codes')
          .update(codeData)
          .eq('id', editingCode.id)
          .select()
          .single();
        result = { data, error };
      } else {
        const { data, error } = await supabase
          .from('quotes_codes')
          .insert([codeData])
          .select()
          .single();
        result = { data, error };
      }

      if (result.error) throw result.error;

      // Manejar categorías específicas
      if (!formData.apply_to_all_categories && selectedCategories.length > 0) {
        // Eliminar categorías existentes si estamos editando
        if (editingCode?.id) {
          await supabase
            .from('quotes_codes_categories')
            .delete()
            .eq('quote_code_id', editingCode.id);
        }

        // Insertar nuevas categorías
        if (!result.data?.id) {
          throw new Error('No se pudo obtener el ID del código creado');
        }
        
        const categoryInserts = selectedCategories.map(categoryId => ({
          quote_code_id: result.data!.id,
          category_id: categoryId
        }));

        const { error: categoryError } = await supabase
          .from('quotes_codes_categories')
          .insert(categoryInserts);

        if (categoryError) throw categoryError;
      }

      toast.success(editingCode ? 'Código actualizado correctamente' : 'Código creado correctamente');
      resetForm();
      loadDiscountCodes();
    } catch (error: unknown) {
      console.error('Error saving discount code:', error);
      console.error('Error details:', {        
        message: error && typeof error === 'object' && 'message' in error ? error.message : undefined, 
        code: error && typeof error === 'object' && 'code' in error ? error.code : undefined, 
        details: error && typeof error === 'object' && 'details' in error ? error.details : undefined, 
        hint: error && typeof error === 'object' && 'hint' in error ? error.hint : undefined
      });
      
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        toast.error('Ya existe un código con ese nombre');
      } else if (error && typeof error === 'object' && 'message' in error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('Error al guardar el código');
      }
    }
  };

  const handleEdit = async (code: DiscountCode) => {
    setEditingCode(code);
    
    // Convertir fechas al formato correcto para los inputs de tipo date
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    };
    
    setFormData({
      ...code,
      valid_from: formatDateForInput(code.valid_from),
      valid_until: formatDateForInput(code.valid_until)
    });
    
    // Cargar categorías específicas si no aplica a todas
    if (!code.apply_to_all_categories) {
      try {
        const { data, error } = await supabase
          .from('quotes_codes_categories')
          .select('category_id')
          .eq('quote_code_id', code.id!);

        if (error) throw error;
        setSelectedCategories(data?.map(item => item.category_id).filter((id): id is number => id !== null) || []);
      } catch (error) {
        console.error('Error loading code categories:', error);
      }
    } else {
      setSelectedCategories([]);
    }
    
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este código?')) return;

    try {
      // Eliminar categorías relacionadas primero
      await supabase
        .from('quotes_codes_categories')
        .delete()
        .eq('quote_code_id', id);

      // Eliminar el código
      const { error } = await supabase
        .from('quotes_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Código eliminado correctamente');
      loadDiscountCodes();
    } catch (error) {
      console.error('Error deleting discount code:', error);
      toast.error('Error al eliminar el código');
    }
  };

  const toggleActive = async (code: DiscountCode) => {
    try {
      const { error } = await supabase
        .from('quotes_codes')
        .update({ is_active: !code.is_active })
        .eq('id', code.id!);

      if (error) throw error;

      toast.success(`Código ${!code.is_active ? 'activado' : 'desactivado'} correctamente`);
      loadDiscountCodes();
    } catch (error) {
      console.error('Error toggling code status:', error);
      toast.error('Error al cambiar el estado del código');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      apply_to_all_categories: true,
      is_active: true,
      usage_limit: undefined
    });
    setSelectedCategories([]);
    setEditingCode(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      date.setHours(0, 0, 0, 0);
      // Si es solo fecha (YYYY-MM-DD), agregar hora local para evitar problemas de zona horaria
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return new Date(date).toLocaleDateString('es-ES');
    } catch (error) {
      console.error('Error formatting date:', error, 'dateString:', dateString);
      return 'Fecha inválida';
    }
  };

  return (
    <div className="fixed inset-0 bg-black  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-950  rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {showForm && (
              <button
                onClick={resetForm}
                className="text-gray-800 hover:text-gray-950 transition-colors mr-2"
                title={locale === 'es' ? 'Volver a la lista' : 'Back to list'}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <Tag className="h-6 w-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {showForm 
                ? (editingCode 
                    ? (locale === 'es' ? 'Editar Código de Descuento' : 'Edit Discount Code')
                    : (locale === 'es' ? 'Nuevo Código de Descuento' : 'New Discount Code')
                  )
                : (locale === 'es' ? 'Administrar Códigos de Descuento' : 'Manage Discount Codes')
              }
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-gray-950 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Action buttons - Solo mostrar cuando no está en modo formulario */}
          {!showForm && (
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {locale === 'es' ? 'Gestiona los códigos de descuento para el catálogo' : 'Manage discount codes for the catalog'}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                {locale === 'es' ? 'Nuevo Código' : 'New Code'}
              </button>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCode ? 'Editar Código' : 'Nuevo Código'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Código */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código *
                    </label>
                    <input
                      type="text"
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="ej. MORPHO2025"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Tipo de descuento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de descuento *
                    </label>
                    <select
                      value={formData.discount_type || 'percentage'}
                      onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed_amount' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed_amount">Monto fijo (USD)</option>
                    </select>
                  </div>

                  {/* Valor del descuento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor del descuento *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {formData.discount_type === 'percentage' ? (
                          <Percent className="h-4 w-4 text-gray-400" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="number"
                        value={formData.discount_value || ''}
                        onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                        placeholder={formData.discount_type === 'percentage' ? '10' : '30.00'}
                        min="0"
                        max={formData.discount_type === 'percentage' ? '100' : undefined}
                        step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Monto mínimo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto mínimo de orden (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.min_order_amount || ''}
                      onChange={(e) => setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Fecha de inicio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Válido desde *
                    </label>
                    <input
                      type="date"
                      value={formData.valid_from || ''}
                      onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Fecha de fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Válido hasta *
                    </label>
                    <input
                      type="date"
                      value={formData.valid_until || ''}
                      onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Máximo de usos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Máximo de usos (opcional)
                    </label>
                    <input
                      type="number"
                      value={formData.usage_limit || ''}
                      onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : undefined })}
                      placeholder="Ilimitado"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Aplicar a todas las categorías */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="apply_to_all"
                    checked={formData.apply_to_all_categories || false}
                    onChange={(e) => {
                      setFormData({ ...formData, apply_to_all_categories: e.target.checked });
                      if (e.target.checked) {
                        setSelectedCategories([]);
                      }
                    }}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="apply_to_all" className="text-sm font-medium text-gray-700">
                    Aplicar a todas las categorías
                  </label>
                </div>

                {/* Selección de categorías específicas */}
                {!formData.apply_to_all_categories && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categorías específicas
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {categories.map((category) => (
                        <label key={category.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, category.id]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                              }
                            }}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </label>
                      ))}
                    </div>
                    {!formData.apply_to_all_categories && selectedCategories.length === 0 && (
                      <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Selecciona al menos una categoría o marca &quot;Aplicar a todas las categorías&quot;
                      </p>
                    )}
                  </div>
                )}

                {/* Estado activo */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active || false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Código activo
                  </label>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={!formData.apply_to_all_categories && selectedCategories.length === 0}
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingCode ? (locale === 'es' ? 'Actualizar' : 'Update') : (locale === 'es' ? 'Crear' : 'Create')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {locale === 'es' ? 'Volver a la lista' : 'Back to list'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de códigos - Solo mostrar cuando no está en modo formulario */}
          {!showForm && (
            loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Cargando códigos...</p>
              </div>
            ) : discountCodes.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay códigos de descuento creados</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descuento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Validez
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {discountCodes.map((code) => (
                    <tr key={code.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{code.code}</div>
                          <div className="text-sm text-gray-500">
                            {code.apply_to_all_categories ? 'Todas las categorías' : 'Categorías específicas'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {code.discount_type === 'percentage'
                            ? `${code.discount_value}%`
                            : `$${code.discount_value.toFixed(2)} USD`
                          }
                        </div>
                        {code.min_order_amount && code.min_order_amount > 0 && (
                          <div className="text-sm text-gray-500">
                            Mín: ${code.min_order_amount.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatDate(code.valid_from)}</div>
                        <div>hasta {formatDate(code.valid_until)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {code.used_count} {code.usage_limit ? `/ ${code.usage_limit}` : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(code)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            code.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {code.is_active ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(code)}
                            className="text-teal-600 hover:text-teal-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => code.id && handleDelete(code.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}