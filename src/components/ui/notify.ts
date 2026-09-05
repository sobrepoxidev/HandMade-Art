import toast, { type ToastOptions } from 'react-hot-toast';

/**
 * Centralized toast wrapper unified to the Handmade Art palette.
 * Use it instead of importing `toast` directly so every notification
 * across the site looks the same (charcoal bg, cream text, gold accent).
 *
 * Usage:
 *   import { notify } from '@/components/ui/notify';
 *   notify.success('Producto añadido al carrito');
 *   notify.error('No pudimos guardar la dirección', { duration: 4000 });
 */

const baseStyle = {
  background: '#1E1813',
  color: '#F1E7D6',
  border: '1px solid rgba(224,168,58,0.35)',
  borderRadius: '4px',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 500,
} as const;

const baseOptions: ToastOptions = {
  duration: 2800,
  style: baseStyle,
  position: 'top-center',
};

export const notify = {
  success(message: string, opts?: ToastOptions) {
    return toast.success(message, {
      ...baseOptions,
      iconTheme: { primary: '#E0A83A', secondary: '#161210' },
      ...opts,
    });
  },

  error(message: string, opts?: ToastOptions) {
    return toast.error(message, {
      ...baseOptions,
      duration: 4000,
      iconTheme: { primary: '#D9563B', secondary: '#1E1813' },
      ...opts,
    });
  },

  info(message: string, opts?: ToastOptions) {
    return toast(message, {
      ...baseOptions,
      icon: 'ℹ️',
      ...opts,
    });
  },

  /**
   * Promise variant — shows a loading toast while the promise is pending,
   * then swaps to success/error.
   *
   *   await notify.promise(savePromise, {
   *     loading: 'Guardando…',
   *     success: 'Guardado',
   *     error: 'No se pudo guardar',
   *   });
   */
  promise<T>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string },
    opts?: ToastOptions
  ) {
    return toast.promise(promise, msgs, {
      ...baseOptions,
      ...opts,
    });
  },

  /**
   * Dismiss any active toast — useful when navigating away from a flow
   * (e.g. closing a modal that was showing a transient message).
   */
  dismiss(id?: string) {
    toast.dismiss(id);
  },
};

export default notify;
