'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, Loader2 } from 'lucide-react';

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
}

type UserProfile = {
  id: string;
  full_name?: string | null;
  shipping_address?: ShippingAddress | null;
  preferences?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
};

type AddressTabProps = {
  profile: UserProfile | null;
  updateShippingAddress: (address: ShippingAddress) => Promise<void>;
  loading: boolean;
};

const labelClass = 'block text-xs uppercase tracking-[0.06em] font-medium text-[#6B6459] mb-1.5';

function inputClass(hasError: boolean) {
  return `w-full p-3 border rounded-sm bg-[#FFFDF9] text-[#2D2D2D] placeholder:text-[#9C9589]
          focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25
          transition-colors disabled:opacity-60 ${
    hasError ? 'border-[#C44536]/50' : 'border-[#E8E4E0]'
  }`;
}

export default function AddressTab({
  profile,
  updateShippingAddress,
  loading,
}: AddressTabProps) {
  const t = useTranslations('Account');

  const [formData, setFormData] = useState<ShippingAddress>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: 'Costa Rica',
    postal_code: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile?.shipping_address) {
      setFormData(profile.shipping_address);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = t('requiredField');
    if (!formData.address.trim()) newErrors.address = t('requiredField');
    if (!formData.city.trim()) newErrors.city = t('requiredField');
    if (!formData.state.trim()) newErrors.state = t('requiredField');
    if (!formData.phone.trim()) newErrors.phone = t('requiredField');
    else if (!/^\d{8,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = t('invalidPhone');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await updateShippingAddress(formData);
  };

  const fieldError = (field: keyof ShippingAddress) =>
    errors[field] ? (
      <p
        id={`${field}-error`}
        role="alert"
        className="flex items-center gap-1 text-sm text-[#9F2D24] mt-1"
      >
        <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        {errors[field]}
      </p>
    ) : null;

  return (
    <div className="text-[#2D2D2D]">
      <h2 className="font-display text-xl font-medium tracking-[-0.005em] mb-5">
        {t('shippingAddress')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className={labelClass}>
            {t('fullName')} <span aria-hidden className="text-[#C44536]">*</span>
            <span className="sr-only"> (requerido)</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={inputClass(!!errors.name)}
            disabled={loading}
          />
          {fieldError('name')}
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            {t('address')} <span aria-hidden className="text-[#C44536]">*</span>
            <span className="sr-only"> (requerido)</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
            className={inputClass(!!errors.address)}
            disabled={loading}
          />
          {fieldError('address')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className={labelClass}>
              {t('city')} <span aria-hidden className="text-[#C44536]">*</span>
              <span className="sr-only"> (requerido)</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              aria-invalid={!!errors.city}
              aria-describedby={errors.city ? 'city-error' : undefined}
              className={inputClass(!!errors.city)}
              disabled={loading}
            />
            {fieldError('city')}
          </div>
          <div>
            <label htmlFor="state" className={labelClass}>
              {t('province')} <span aria-hidden className="text-[#C44536]">*</span>
              <span className="sr-only"> (requerido)</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              aria-invalid={!!errors.state}
              aria-describedby={errors.state ? 'state-error' : undefined}
              className={inputClass(!!errors.state)}
              disabled={loading}
            />
            {fieldError('state')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className={labelClass}>
              {t('country')}
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClass(false)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="postal_code" className={labelClass}>
              {t('postalCode')}
            </label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className={inputClass(false)}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            {t('phone')} <span aria-hidden className="text-[#C44536]">*</span>
            <span className="sr-only"> (requerido)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={inputClass(!!errors.phone)}
            placeholder="8888-8888"
            disabled={loading}
          />
          {fieldError('phone')}
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 bg-[#C9A962] text-[#1A1A1A] font-semibold text-sm tracking-wide rounded-sm hover:bg-[#A08848] hover:text-[#F5F1EB] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" strokeWidth={2} aria-hidden />
            )}
            {loading ? t('saving') : t('saveAddress')}
          </button>
        </div>

        <div className="text-xs text-[#6B6459] mt-2">
          <span aria-hidden className="text-[#C44536]">*</span> {t('requiredFields')}
        </div>
      </form>
    </div>
  );
}
