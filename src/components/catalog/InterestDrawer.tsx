'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Minus, Trash2, Send, Loader2, Tag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useInterestList } from '@/lib/hooks/useInterestList';
import { useDiscountCode, DiscountCode } from '@/lib/hooks/useDiscountCode';

interface InterestDrawerProps {
  open: boolean;
  onClose: () => void;
  interestList: ReturnType<typeof useInterestList>;
  appliedDiscountCode?: DiscountCode | null;
}

interface FormData {
  requester_name: string;
  organization: string;
  email: string;
  phone: string;
  notes: string;
}

export function InterestDrawer({ open, onClose, interestList, appliedDiscountCode }: InterestDrawerProps) {
  const discountCode = useDiscountCode();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    requester_name: '',
    organization: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.requester_name.trim()) {
      newErrors.requester_name = 'El nombre es obligatorio';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (interestList.items.length === 0) return;

    setIsSubmitting(true);

    try {
      const payload = {
        requester_name: formData.requester_name.trim(),
        organization: formData.organization.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        discount_code_applied: appliedDiscountCode ? {
          code: appliedDiscountCode.code,
          discount_type: appliedDiscountCode.discount_type,
          discount_value: appliedDiscountCode.discount_value,
          description: appliedDiscountCode.description
        } : undefined,
        items: interestList.items.map(item => {
          // Usar el precio original (dolar_price) para calcular descuento, no el precio ya descontado
          const originalPrice = item.dolar_price || item.price || 0;
          const discountResult = appliedDiscountCode ? 
            discountCode.calculateDiscount(
              originalPrice,
              appliedDiscountCode,
              item.category_id,
              true // Omitir validación de monto mínimo
            ) : null;
          
          const hasDiscount = discountResult?.isValid;
          const finalPrice = hasDiscount ? discountResult.finalPrice : originalPrice;
          const discountAmount = hasDiscount ? discountResult.discountAmount : 0;
          
          return {
            product_id: item.product_id,
            quantity: item.qty,
            product_snapshot: {
              name: item.name,
              sku: item.sku,
              image_url: item.main_image_url,
              dolar_price: originalPrice, // Guardar el precio original
              discounted_price: hasDiscount ? finalPrice : undefined,
              discount_amount: hasDiscount ? discountAmount : undefined,
              has_discount: hasDiscount
            }
          };
        })
      };

      const response = await fetch('/api/create-interest-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.ok) {
        // Limpiar lista y formulario
        interestList.clearList();
        setFormData({
          requester_name: '',
          organization: '',
          email: '',
          phone: '',
          notes: ''
        });
        
        // Cerrar drawer y redirigir
        onClose();
        router.push(`/catalog/gracias?solicitud=${result.request_id}`);
      } else {
        alert(result.error || 'Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('Error submitting interest request:', error);
      alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = interestList.getTotalItems();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden text-black">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-6 bg-gray-50 border-b">
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Tu selección ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                      >
                        <X className="h-6 w-6 transition-transform text-black font-semibold duration-200 transform hover:scale-110" />
                      </button>
                    </div>

                    <div className="flex-1 px-4 py-6">
                      {/* Lista de productos */}
                      {interestList.items.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No hay productos en tu lista</p>
                        </div>
                      ) : (
                        <div className="space-y-4 mb-8">
                          {interestList.items.map((item) => (
                            <div key={item.product_id} className="flex items-center gap-3 p-3 border rounded-lg">
                              {/* Imagen */}
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {item.main_image_url ? (
                                  <Image
                                    src={item.main_image_url}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    📦
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                                {item.sku && (
                                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                                )}
                                {item.price && (() => {
                                  // Usar el precio original (dolar_price) para calcular descuento, no el precio ya descontado
                                  const originalPrice = item.dolar_price || item.price;
                                  const discountResult = appliedDiscountCode ? 
                                    discountCode.calculateDiscount(
                                      originalPrice,
                                      appliedDiscountCode,
                                      item.category_id,
                                      true // Omitir validación de monto mínimo
                                    ) : null;
                                  
                                  const hasDiscount = discountResult?.isValid;
                                  const finalPrice = hasDiscount ? discountResult.finalPrice : item.price;
                                  const discountAmount = hasDiscount ? discountResult.discountAmount : 0;
                                  
                                  return (
                                    <div className="space-y-1">
                                      {hasDiscount ? (
                                        <div className="space-y-1">
                                          {/* Precio con descuento */}
                                          <div className="flex items-center gap-1">
                                            <span className="text-green-600 font-bold text-sm">
                                              ${finalPrice.toFixed(2)} c/u
                                            </span>
                                            <div className="flex items-center gap-0.5 bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-[0.6rem] font-medium">
                                              <Tag className="h-3 w-3" />
                                              {appliedDiscountCode?.discount_type === 'percentage'
                                                ? `${appliedDiscountCode.discount_value}% OFF`
                                                : `$${appliedDiscountCode?.discount_value.toFixed(2)} OFF`
                                              }
                                            </div>
                                          </div>
                                          {/* Precio original tachado */}
                                          <div className="flex items-center gap-2">
                                            <span className="text-gray-500 line-through text-xs">
                                              ${originalPrice.toFixed(2)}
                                            </span>
                                            <span className="text-green-600 text-xs font-medium">
                                              Ahorras ${discountAmount.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-sm font-medium text-teal-600">
                                          ${item.price.toFixed(2)} c/u
                                        </p>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* Controles */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => interestList.updateQuantity(item.product_id, item.qty - 1)}
                                  className="p-1 rounded-full hover:bg-gray-100"
                                >
                                  <Minus className="h-4 w-4 text-gray-600" />
                                </button>
                                <span className="w-8 text-center font-medium">{item.qty}</span>
                                <button
                                  onClick={() => interestList.updateQuantity(item.product_id, item.qty + 1)}
                                  className="p-1 rounded-full hover:bg-gray-100"
                                >
                                  <Plus className="h-4 w-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => interestList.removeItem(item.product_id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded-full ml-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Formulario */}
                      {interestList.items.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Solicitar cotización
                          </h3>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre completo *
                            </label>
                            <input
                              type="text"
                              value={formData.requester_name}
                              onChange={(e) => handleInputChange('requester_name', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                                errors.requester_name ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="Tu nombre completo"
                            />
                            {errors.requester_name && (
                              <p className="text-sm text-red-600 mt-1">{errors.requester_name}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Organización
                            </label>
                            <input
                              type="text"
                              value={formData.organization}
                              onChange={(e) => handleInputChange('organization', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              placeholder="Empresa u organización"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                                errors.email ? 'border-red-300' : 'border-gray-300'
                              }`}
                              placeholder="tu@email.com"
                            />
                            {errors.email && (
                              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              placeholder="Sin espacios ni guiones"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notas adicionales
                            </label>
                            <textarea
                              value={formData.notes}
                              onChange={(e) => handleInputChange('notes', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                              placeholder="Información adicional sobre tu solicitud..."
                            />
                          </div>

                          <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || interestList.items.length === 0}
                            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Enviar solicitud de cotización
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}