'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface DiscountCode {
  id: number;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  apply_to_all_categories: boolean;
  categories?: number[]; // IDs de categorías aplicables
}

export interface DiscountApplication {
  isValid: boolean;
  discountCode?: DiscountCode;
  discountAmount: number;
  finalPrice: number;
  errorMessage?: string;
}

export function useDiscountCode() {
  const [loading, setLoading] = useState(false);
  const [appliedCode, setAppliedCode] = useState<DiscountCode | null>(null);

  const validateCode = useCallback(async (code: string): Promise<DiscountCode | null> => {
    if (!code.trim()) return null;

    try {
      setLoading(true);
      
      // Buscar el código en la base de datos
      const { data: codeData, error } = await supabase
        .from('quotes_codes')
        .select(`
          *,
          quotes_codes_categories(
            category_id
          )
        `)
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !codeData) {
        return null;
      }

      // Verificar fechas de validez
      const now = new Date();
      const validFrom = new Date(codeData.valid_from || new Date());
      const validUntil = codeData.valid_until ? new Date(codeData.valid_until) : null;

      if (now < validFrom || (validUntil && now > validUntil)) {
        return null;
      }

      // Verificar límite de uso
      if (codeData.usage_limit && (codeData.used_count ?? 0) >= codeData.usage_limit) {
        return null;
      }

      // Extraer categorías aplicables
      const categories = codeData.quotes_codes_categories?.map((rel: { category_id: number | null }) => rel.category_id).filter((id): id is number => id !== null) || [];

      const result: DiscountCode = {
        id: codeData.id,
        code: codeData.code,
        description: codeData.description,
        discount_type: codeData.discount_type as 'percentage' | 'fixed_amount',
        discount_value: codeData.discount_value,
        min_order_amount: codeData.min_order_amount ?? 0,
        max_discount_amount: codeData.max_discount_amount,
        usage_limit: codeData.usage_limit,
        used_count: codeData.used_count ?? 0,
        valid_from: codeData.valid_from || new Date().toISOString(),
        valid_until: codeData.valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: codeData.is_active ?? true,
        apply_to_all_categories: codeData.apply_to_all_categories ?? true,
        categories
      };
      
      return result;
    } catch (error) {
      console.error('Error validating discount code:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateDiscount = useCallback((
    originalPrice: number,
    discountCode: DiscountCode,
    categoryId?: number,
    skipMinOrderValidation: boolean = false
  ): DiscountApplication => {
    // Verificar si el código aplica a la categoría del producto
    if (!discountCode.apply_to_all_categories && categoryId) {
      if (!discountCode.categories?.includes(categoryId)) {
        return {
          isValid: false,
          discountAmount: 0,
          finalPrice: originalPrice,
          errorMessage: 'Este código no aplica a esta categoría de producto'
        };
      }
    }

    // Verificar monto mínimo de orden (solo si no se omite la validación)
    if (!skipMinOrderValidation && originalPrice < discountCode.min_order_amount) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: originalPrice,
        errorMessage: `Monto mínimo requerido: $${discountCode.min_order_amount.toFixed(2)}`
      };
    }

    let discountAmount = 0;

    if (discountCode.discount_type === 'percentage') {
      discountAmount = (originalPrice * discountCode.discount_value) / 100;
      
      // Aplicar límite máximo de descuento si existe
      if (discountCode.max_discount_amount && discountAmount > discountCode.max_discount_amount) {
        discountAmount = discountCode.max_discount_amount;
      }
    } else if (discountCode.discount_type === 'fixed_amount') {
      discountAmount = Math.min(discountCode.discount_value, originalPrice);
    }

    const finalPrice = Math.max(0, originalPrice - discountAmount);

    return {
      isValid: true,
      discountCode,
      discountAmount,
      finalPrice
    };
  }, []);

  const applyCode = useCallback(async (code: string): Promise<DiscountApplication> => {
    const discountCode = await validateCode(code);
    
    if (!discountCode) {
      return {
        isValid: false,
        discountAmount: 0,
        finalPrice: 0,
        errorMessage: 'Código inválido, expirado o no encontrado'
      };
    }

    setAppliedCode(discountCode);
    
    return {
      isValid: true,
      discountCode,
      discountAmount: 0,
      finalPrice: 0
    };
  }, [validateCode]);

  const removeCode = useCallback(() => {
    setAppliedCode(null);
  }, []);

  const incrementUsage = useCallback(async (codeId: number) => {
    try {
      // Primero obtenemos el valor actual
      const { data: currentData } = await supabase
        .from('quotes_codes')
        .select('used_count')
        .eq('id', codeId)
        .single();
      
      if (currentData) {
        await supabase
          .from('quotes_codes')
          .update({ used_count: (currentData.used_count ?? 0) + 1 })
          .eq('id', codeId);
      }
    } catch (error) {
      console.error('Error incrementing code usage:', error);
    }
  }, []);

  return {
    loading,
    appliedCode,
    validateCode,
    calculateDiscount,
    applyCode,
    removeCode,
    incrementUsage
  };
}