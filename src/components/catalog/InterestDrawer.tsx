'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Minus, Trash2, Send, Loader2, Tag, AlertCircle, PackageOpen } from 'lucide-react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
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

const inputClass =
  'w-full px-3 py-2.5 border rounded-sm bg-white text-[#2D2D2D] placeholder:text-[#9C9589] ' +
  'focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25 transition-colors';

const labelClass = 'block text-xs uppercase tracking-[0.06em] font-medium text-[#6B6459] mb-1.5';

export function InterestDrawer({ open, onClose, interestList, appliedDiscountCode }: InterestDrawerProps) {
  const discountCode = useDiscountCode();
  const router = useRouter();
  const locale = useLocale();
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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.requester_name.trim()) {
      newErrors.requester_name = locale === 'es' ? 'El nombre es obligatorio' : 'Name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = locale === 'es' ? 'Email inválido' : 'Invalid email';
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
          const originalPrice = item.dolar_price || item.price || 0;
          const discountResult = appliedDiscountCode ?
            discountCode.calculateDiscount(
              originalPrice,
              appliedDiscountCode,
              item.category_id,
              true
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
              dolar_price: originalPrice,
              discounted_price: hasDiscount ? finalPrice : undefined,
              discount_amount: hasDiscount ? discountAmount : undefined,
              has_discount: hasDiscount
            }
          };
        })
      };

      const response = await fetch('/api/create-interest-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.ok) {
        interestList.clearList();
        setFormData({
          requester_name: '',
          organization: '',
          email: '',
          phone: '',
          notes: ''
        });
        try {
          if (appliedDiscountCode?.id) {
            await discountCode.incrementUsage(appliedDiscountCode.id);
          }
        } catch (e) {
          console.error('No se pudo incrementar el uso del código:', e);
        }
        onClose();
        router.push(`/catalog/gracias?solicitud=${result.request_id}`);
      } else {
        alert(result.error || (locale === 'es' ? 'Error al enviar la solicitud' : 'Error sending the request'));
      }
    } catch (error) {
      console.error('Error submitting interest request:', error);
      alert(locale === 'es' ? 'Error al enviar la solicitud. Por favor, inténtalo de nuevo.' : 'Error sending the request. Please try again.');
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
          <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-[2px] transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden text-[#2D2D2D]">
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-[#FAF6EF] shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-5 bg-[#FAF8F5] border-b border-[#E8E4E0]">
                      <Dialog.Title className="font-display text-lg font-medium text-[#2D2D2D] tracking-[-0.005em]">
                        {locale === 'es' ? 'Tu selección' : 'Your selection'} ({totalItems} {totalItems === 1 ? (locale === 'es' ? 'producto' : 'product') : (locale === 'es' ? 'productos' : 'products')})
                      </Dialog.Title>
                      <button
                        type="button"
                        className="grid place-items-center w-11 h-11 rounded-sm text-[#6B6459] hover:text-[#2D2D2D] hover:bg-[#E8E4E0]/60 transition-colors"
                        onClick={onClose}
                        aria-label={locale === 'es' ? 'Cerrar' : 'Close'}
                      >
                        <X className="h-5 w-5" strokeWidth={2} />
                      </button>
                    </div>

                    <div className="flex-1 px-5 py-6">
                      {/* Lista de productos */}
                      {interestList.items.length === 0 ? (
                        <div className="py-16 text-center">
                          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#C9A962]/18 text-[#A08848]">
                            <PackageOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                          </div>
                          <p className="mt-4 font-display text-xl font-medium text-[#2D2D2D]">
                            {locale === 'es' ? 'Tu lista está vacía' : 'Your list is empty'}
                          </p>
                          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#6B6459]">
                            {locale === 'es'
                              ? 'Agrega piezas del catálogo para solicitar una cotización revisada.'
                              : 'Add catalog pieces to request a reviewed quote.'}
                          </p>
                          <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-sm bg-[#2D2D2D] px-5 py-2.5 text-sm font-semibold text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
                          >
                            {locale === 'es' ? 'Seguir explorando' : 'Keep browsing'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 mb-8">
                          {interestList.items.map((item) => (
                            <div
                              key={item.product_id}
                              className="flex items-center gap-3 p-3 border border-[#E8E4E0] rounded-sm"
                            >
                              {/* Imagen */}
                              <div className="w-16 h-16 bg-[#FAF8F5] rounded-sm overflow-hidden flex-shrink-0 border border-[#E8E4E0]/70">
                                {item.main_image_url ? (
                                  <Image
                                    src={item.main_image_url}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    sizes="64px"
                                    className="w-full h-full object-contain p-1"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full grid place-items-center text-[#9C9589] text-xs">
                                    —
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-[#2D2D2D] truncate">{item.name}</h4>
                                {item.sku && (
                                  <p className="text-xs text-[#6B6459] tabular-nums">SKU: {item.sku}</p>
                                )}
                                {item.price && (() => {
                                  const originalPrice = item.dolar_price || item.price;
                                  const discountResult = appliedDiscountCode ?
                                    discountCode.calculateDiscount(
                                      originalPrice,
                                      appliedDiscountCode,
                                      item.category_id,
                                      true
                                    ) : null;

                                  const hasDiscount = discountResult?.isValid;
                                  const finalPrice = hasDiscount ? discountResult.finalPrice : item.price;
                                  const discountAmount = hasDiscount ? discountResult.discountAmount : 0;

                                  return (
                                    <div className="space-y-1 mt-0.5">
                                      {hasDiscount ? (
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-[#A08848] font-semibold text-sm tabular-nums">
                                          ${finalPrice.toFixed(2)} {locale === 'es' ? 'c/u' : 'each'}
                                            </span>
                                            <span className="inline-flex items-center gap-1 bg-[#C44536]/10 text-[#9F2D24] px-1.5 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-[0.04em]">
                                              <Tag className="h-3 w-3" strokeWidth={2} aria-hidden />
                                              {appliedDiscountCode?.discount_type === 'percentage'
                                                ? `${appliedDiscountCode.discount_value}% OFF`
                                                : `$${appliedDiscountCode?.discount_value.toFixed(2)} OFF`
                                              }
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-[#6B6459] line-through text-xs tabular-nums">
                                              ${originalPrice.toFixed(2)}
                                            </span>
                                            <span className="text-[#2F5F3E] text-xs font-medium tabular-nums">
                                              {locale === 'es' ? 'Ahorras' : 'You save'} ${discountAmount.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-sm font-medium text-[#A08848] tabular-nums">
                                          ${item.price.toFixed(2)} {locale === 'es' ? 'c/u' : 'each'}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* Controles */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => interestList.updateQuantity(item.product_id, item.qty - 1)}
                                  className="grid place-items-center w-9 h-9 rounded-sm text-[#4A4A4A] hover:bg-[#FAF8F5] hover:text-[#2D2D2D] transition-colors"
                                  aria-label={locale === 'es' ? 'Disminuir cantidad' : 'Decrease quantity'}
                                >
                                  <Minus className="h-4 w-4" strokeWidth={2} aria-hidden />
                                </button>
                                <span className="min-w-[28px] text-center font-medium text-[#2D2D2D] tabular-nums">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => interestList.updateQuantity(item.product_id, item.qty + 1)}
                                  className="grid place-items-center w-9 h-9 rounded-sm text-[#4A4A4A] hover:bg-[#FAF8F5] hover:text-[#2D2D2D] transition-colors"
                                  aria-label={locale === 'es' ? 'Aumentar cantidad' : 'Increase quantity'}
                                >
                                  <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
                                </button>
                                <button
                                  onClick={() => interestList.removeItem(item.product_id)}
                                  className="grid place-items-center w-9 h-9 rounded-sm text-[#9F2D24] hover:bg-[#C44536]/10 transition-colors ml-1"
                                  aria-label={`${locale === 'es' ? 'Quitar' : 'Remove'} ${item.name}`}
                                >
                                  <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Formulario */}
                      {interestList.items.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-display text-lg font-medium text-[#2D2D2D] tracking-[-0.005em] mb-2">
                            {locale === 'es' ? 'Solicitar cotización' : 'Request a quote'}
                          </h3>

                          <div>
                            <label htmlFor="interest-name" className={labelClass}>
                              {locale === 'es' ? 'Nombre completo' : 'Full name'} <span aria-hidden className="text-[#C44536]">*</span>
                              <span className="sr-only"> {locale === 'es' ? '(requerido)' : '(required)'}</span>
                            </label>
                            <input
                              id="interest-name"
                              type="text"
                              value={formData.requester_name}
                              onChange={(e) => handleInputChange('requester_name', e.target.value)}
                              aria-invalid={!!errors.requester_name}
                              aria-describedby={errors.requester_name ? 'interest-name-error' : undefined}
                              className={`${inputClass} ${errors.requester_name ? 'border-[#C44536]/50' : 'border-[#E8E4E0]'}`}
                              placeholder={locale === 'es' ? 'Tu nombre completo' : 'Your full name'}
                            />
                            {errors.requester_name && (
                              <p
                                id="interest-name-error"
                                role="alert"
                                className="flex items-center gap-1 text-sm text-[#9F2D24] mt-1"
                              >
                                <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                                {errors.requester_name}
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="interest-org" className={labelClass}>
                              {locale === 'es' ? 'Organización' : 'Organization'}
                            </label>
                            <input
                              id="interest-org"
                              type="text"
                              value={formData.organization}
                              onChange={(e) => handleInputChange('organization', e.target.value)}
                              className={`${inputClass} border-[#E8E4E0]`}
                              placeholder={locale === 'es' ? 'Empresa u organización' : 'Company or organization'}
                            />
                          </div>

                          <div>
                            <label htmlFor="interest-email" className={labelClass}>
                              Email
                            </label>
                            <input
                              id="interest-email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              aria-invalid={!!errors.email}
                              aria-describedby={errors.email ? 'interest-email-error' : undefined}
                              className={`${inputClass} ${errors.email ? 'border-[#C44536]/50' : 'border-[#E8E4E0]'}`}
                              placeholder="tu@email.com"
                            />
                            {errors.email && (
                              <p
                                id="interest-email-error"
                                role="alert"
                                className="flex items-center gap-1 text-sm text-[#9F2D24] mt-1"
                              >
                                <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                                {errors.email}
                              </p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="interest-phone" className={labelClass}>
                              {locale === 'es' ? 'Teléfono' : 'Phone'}
                            </label>
                            <input
                              id="interest-phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className={`${inputClass} border-[#E8E4E0]`}
                              placeholder={locale === 'es' ? 'Sin espacios ni guiones' : 'No spaces or dashes'}
                            />
                          </div>

                          <div>
                            <label htmlFor="interest-notes" className={labelClass}>
                              {locale === 'es' ? 'Notas adicionales' : 'Additional notes'}
                            </label>
                            <textarea
                              id="interest-notes"
                              value={formData.notes}
                              onChange={(e) => handleInputChange('notes', e.target.value)}
                              rows={3}
                              className={`${inputClass} border-[#E8E4E0] resize-y min-h-[80px]`}
                              placeholder={locale === 'es' ? 'Información adicional sobre tu solicitud...' : 'Additional information about your request...'}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || interestList.items.length === 0}
                            aria-busy={isSubmitting}
                            className="inline-flex items-center justify-center w-full min-h-[48px] px-5 py-3 bg-[#2D2D2D] text-[#F5F1EB] font-semibold text-sm tracking-wide rounded-sm hover:bg-[#1A1A1A] disabled:bg-[#E8E4E0] disabled:text-[#9C9589] disabled:cursor-not-allowed transition-colors gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
                                {locale === 'es' ? 'Enviando...' : 'Sending...'}
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
                                {locale === 'es' ? 'Enviar solicitud de cotización' : 'Send quote request'}
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
