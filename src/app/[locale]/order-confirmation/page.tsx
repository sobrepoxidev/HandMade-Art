'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Link } from '@/i18n/navigation';
import { ShoppingBag } from 'lucide-react'
import { useLocale } from 'next-intl';

interface OrderDetails {
  id: number
  total_amount: number
  created_at: string
  payment_method: string
  shipping_address: {
    name: string
    address: string
  }
}

export default function OrderConfirmationPage() {
  const locale = useLocale();
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', Number(orderId))
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        return
      }

      setOrderDetails(data as unknown as OrderDetails)
    }

    fetchOrderDetails()

    // Limpiar localStorage
    localStorage.removeItem('cartItems')
    localStorage.removeItem('checkoutData')
    localStorage.removeItem('discountInfo')
  }, [orderId])

  if (!orderDetails) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">{locale === 'es' ? 'Cargando detalles del pedido...' : 'Loading order details...'}</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">{locale === 'es' ? '¡Gracias por tu compra!' : 'Thank you for your purchase!'}</h1>
            <p className="mt-2 text-base text-gray-500">
              {locale === 'es' ? 'Tu pedido' : 'Your order'} #{orderDetails.id} {locale === 'es' ? 'ha sido confirmado' : 'has been confirmed'}
            </p>
          </div>

          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">{locale === 'es' ? 'Número de orden' : 'Order number'}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">#{orderDetails.id}</dd>
            </div>

            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">{locale === 'es' ? 'Total' : 'Total'}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                ₡{orderDetails.total_amount.toLocaleString()}
              </dd>
            </div>

            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">{locale === 'es' ? 'Método de pago' : 'Payment method'}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {orderDetails.payment_method === 'paypal' ? 'PayPal' : 'SINPE Móvil'}
              </dd>
            </div>

            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">{locale === 'es' ? 'Dirección de envío' : 'Shipping address'}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {orderDetails.shipping_address.name}<br />
                {orderDetails.shipping_address.address}
              </dd>
            </div>
          </dl>

          <div className="mt-8 text-center">
            <Link 
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {locale === 'es' ? 'Continuar comprando' : 'Continue shopping'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
