'use client';

import { useState } from 'react';
import { Database, ProductSnapshot } from '@/types-db';
import { X, Calculator, Percent, DollarSign, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

type InterestRequest = Database['interest_requests'] & {
  interest_request_items: (Database['interest_request_items'] & {
    product_snapshot: ProductSnapshot;
  })[];
};

type DiscountType = 'percentage' | 'fixed_amount' | 'product_percentage' | 'product_fixed' | 'total_override';

interface QuoteDiscountModalProps {
  quote: InterestRequest;
  locale: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface DiscountData {
  productDiscounts?: { [key: number]: number };
}

export default function QuoteDiscountModal({ quote, locale, onClose, onSuccess }: QuoteDiscountModalProps) {
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  
  // Calcular el total original basándose en los items si total_amount es null
  const calculateOriginalTotal = () => {
    if (quote.total_amount && quote.total_amount > 0) {
      return quote.total_amount;
    }
    
    // Calcular desde los items si total_amount no está disponible
    return quote.interest_request_items.reduce((total, item) => {
      const itemPrice = item.product_snapshot.dolar_price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };
  
  const [totalOverride, setTotalOverride] = useState<number>(calculateOriginalTotal());
  const [productDiscounts, setProductDiscounts] = useState<{ [key: number]: number }>({});
  const [managerNotes, setManagerNotes] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<number>(quote.shipping_cost || 0);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calcular el total final basado en el tipo de descuento
  const calculateFinalTotal = () => {
    const baseTotal = calculateOriginalTotal();
    let finalTotal = baseTotal;

    switch (discountType) {
      case 'percentage':
        finalTotal = baseTotal * (1 - discountValue / 100);
        break;
      case 'fixed_amount':
        finalTotal = baseTotal - discountValue;
        break;
      case 'product_percentage':
        finalTotal = quote.interest_request_items.reduce((total, item) => {
          const itemTotal = (item.product_snapshot.dolar_price || 0) * item.quantity;
          const discount = productDiscounts[item.id] || 0;
          return total + (itemTotal * (1 - discount / 100));
        }, 0);
        break;
      case 'product_fixed':
        finalTotal = quote.interest_request_items.reduce((total, item) => {
          const itemTotal = (item.product_snapshot.dolar_price || 0) * item.quantity;
          const discount = productDiscounts[item.id] || 0;
          return total + Math.max(0, itemTotal - discount);
        }, 0);
        break;
      case 'total_override':
        // Para total_override, sumar el shipping al total personalizado
        return Math.max(0, totalOverride + shippingCost);
      default:
        finalTotal = baseTotal;
    }

    // Para todos los otros tipos, agregar shipping al final
    return Math.max(0, finalTotal + shippingCost);
  };

  const handleProductDiscountChange = (itemId: number, value: number) => {
    setProductDiscounts(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleApplyDiscount = async () => {
    setLoading(true);
    try {
      const finalAmount = calculateFinalTotal();
      
      // Preparar valor de descuento según el tipo
      let discountValueToSend: number;
      const discountData: DiscountData = {};

      if (discountType === 'total_override') {
        // Para total_override, discount_value debe ser el monto final sin shipping
        discountValueToSend = totalOverride;
      } else {
        discountValueToSend = discountValue;
      }

      if (discountType.includes('product')) {
        discountData.productDiscounts = productDiscounts;
      }

      // Usar la API route para actualizar la cotización y enviar correos
      const response = await fetch('/api/update-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteId: quote.id,
          discountType: discountType,
          discountValue: discountValueToSend, // Solo el valor numérico
          productDiscounts: discountType.includes('product') ? productDiscounts : undefined,
          finalAmount: finalAmount,
          managerNotes: managerNotes,
          shippingCost: shippingCost
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al aplicar el descuento');
      }
      
      toast.success('Descuento aplicado y correo enviado correctamente');
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al aplicar el descuento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-1.5">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pt-6 px-3 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {locale === 'es' ? 'Aplicar Descuento a Cotización' : 'Apply Discount to Quote'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-7 h-7 text-black font-bold" />
          </button>
        </div>

        <div className="p-3">
          {/* Información de la cotización */}
          <div className="mb-2 p-2 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">
              {locale === 'es' ? 'Información del Cliente' : 'Customer Information'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-sm">
              <div>
                <span className="font-medium">{locale === 'es' ? 'Nombre:' : 'Name:'}</span> {quote.requester_name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {quote.email}
              </div>
              <div>
                <span className="font-medium">{locale === 'es' ? 'Teléfono:' : 'Phone:'}</span> {quote.phone}
              </div>
            </div>
          </div>

          {/* Productos en la cotización */}
          <div className="mb-2">
            <h3 className="font-medium text-gray-900 mb-2">
              {locale === 'es' ? 'Productos Solicitados' : 'Requested Products'}
            </h3>
            <div className="space-y-1.5">
              {quote.interest_request_items.map((item) => {
                const itemTotal = (item.product_snapshot.dolar_price || 0) * item.quantity;
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {item.product_snapshot?.image_url ? (
                        <div className="w-16 h-16 relative rounded-md overflow-hidden">
                          <Image
                            src={item.product_snapshot.image_url}
                            alt={item.product_snapshot.name || 'Product'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div>
                        <p className=" text-gray-900 max-sm:text-sm">{item.product_snapshot?.name}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.product_snapshot?.dolar_price || 0)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(itemTotal)}</p>
                      {(discountType === 'product_percentage' || discountType === 'product_fixed') && (
                        <div className="mt-2">
                          <input
                            type="number"
                            min="0"
                            max={discountType === 'product_percentage' ? "100" : undefined}
                            step={discountType === 'product_percentage' ? "1" : "0.01"}
                            placeholder={discountType === 'product_percentage' ? "% desc." : "$ desc."}
                            value={productDiscounts[item.id] ? productDiscounts[item.id].toString() : ''}
                            onChange={(e) => handleProductDiscountChange(item.id, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-sm border rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tipo de descuento */}
          <div className="mb-2">
            <h3 className="font-medium text-gray-900 mb-2">
              {locale === 'es' ? 'Tipo de Descuento' : 'Discount Type'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={() => setDiscountType('percentage')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  discountType === 'percentage'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center mb-1">
                  <Percent className="w-4 h-4 mr-2" />
                  <span className="font-medium">{locale === 'es' ? 'Descuento Total' : 'Total Discount'}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {locale === 'es' ? 'Porcentaje sobre el total' : 'Percentage on total'}
                </p>
              </button>

              <button
                onClick={() => setDiscountType('fixed_amount')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  discountType === 'fixed_amount'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center mb-1">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-medium">{locale === 'es' ? 'Monto Fijo Total' : 'Fixed Amount Total'}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {locale === 'es' ? 'Monto fijo del total' : 'Fixed amount from total'}
                </p>
              </button>

              <button
                onClick={() => setDiscountType('product_percentage')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  discountType === 'product_percentage'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center mb-1">
                  <Percent className="w-4 h-4 mr-2" />
                  <span className="font-medium">
                    {locale === 'es' ? 'Descuento por Producto' : 'Discount per Product'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {locale === 'es' ? 'Porcentaje por producto' : 'Percentage per product'}
                </p>
              </button>

              <button
                onClick={() => setDiscountType('product_fixed')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  discountType === 'product_fixed'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center mb-1">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="font-medium">
                    {locale === 'es' ? 'Monto Fijo por Producto' : 'Fixed Amount per Product'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {locale === 'es' ? 'Monto fijo por producto' : 'Fixed amount per product'}
                </p>
              </button>

              <button
                onClick={() => setDiscountType('total_override')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  discountType === 'total_override'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center mb-1">
                  <Edit className="w-4 h-4 mr-2" />
                  <span className="font-medium">{locale === 'es' ? 'Anulación del Total' : 'Total Override'}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {locale === 'es' ? 'Establecer un monto final personalizado' : 'Set a custom final amount'}
                </p>
              </button>
            </div>
          </div>

          {/* Valor del descuento */}
          {discountType !== 'product_percentage' && discountType !== 'product_fixed' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {discountType === 'total_override'
                  ? (locale === 'es' ? 'Total Final' : 'Final Total')
                  : (locale === 'es' ? 'Valor del Descuento' : 'Discount Value')
                }
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  max={discountType === 'percentage' ? "100" : undefined}
                  value={discountType === 'total_override' ? (totalOverride || '') : (discountValue || '')}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    if (discountType === 'total_override') {
                      setTotalOverride(value);
                    } else {
                      setDiscountValue(value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={discountType === 'percentage' ? "10" : "25.00"}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {discountType === 'percentage' ? (
                    <Percent className="w-4 h-4 text-gray-400" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Control de envío */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'es' ? 'Costo de Envío (USD)' : 'Shipping Cost (USD)'}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={shippingCost || ''}
                onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <DollarSign className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'es' 
                ? 'Ingrese 0 para deshabilitar el cobro de envío' 
                : 'Enter 0 to disable shipping charges'
              }
            </p>
          </div>

          {/* Notas del gestor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {locale === 'es' ? 'Notas del Gestor (Opcional)' : 'Manager Notes (Optional)'}
            </label>
            <textarea
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={locale === 'es' ? 'Agregar notas sobre el descuento aplicado...' : 'Add notes about the applied discount...'}
            />
          </div>

          {/* Resumen de cálculo */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              {locale === 'es' ? 'Resumen de Cálculo' : 'Calculation Summary'}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{locale === 'es' ? 'Total Original:' : 'Original Total:'}</span>
                <span className="font-medium">{formatCurrency(calculateOriginalTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span>{locale === 'es' ? 'Descuento Aplicado:' : 'Applied Discount:'}</span>
                <span className="font-medium text-red-600">
                  {discountType === 'total_override' 
                    ? `-${formatCurrency(calculateOriginalTotal() - totalOverride)}`
                    : `-${formatCurrency(calculateOriginalTotal() - (calculateFinalTotal() - shippingCost))}`
                  }
                </span>
              </div>
              {shippingCost > 0 && (
                <div className="flex justify-between">
                  <span>{locale === 'es' ? 'Costo de Envío:' : 'Shipping Cost:'}</span>
                  <span className="font-medium">{formatCurrency(shippingCost)}</span>
                </div>
              )}
              <hr className="border-gray-300" />
              <div className="flex justify-between text-lg font-semibold">
                <span>{locale === 'es' ? 'Total Final:' : 'Final Total:'}</span>
                <span className="text-green-600">{formatCurrency(calculateFinalTotal())}</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {locale === 'es' ? 'Cancelar' : 'Cancel'}
            </button>
            <button
              onClick={handleApplyDiscount}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? (locale === 'es' ? 'Aplicando...' : 'Applying...')
                : (locale === 'es' ? 'Aplicar Descuento' : 'Apply Discount')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}