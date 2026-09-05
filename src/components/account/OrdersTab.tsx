'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSupabase } from '@/app/supabase-provider/provider';
import { Database, Json } from '@/lib/database.types';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

// Type guard para verificar si shipping_address es un objeto válido
function isShippingAddress(address: Json): address is {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  phone: string;
} {
  return typeof address === 'object' && address !== null &&
         'name' in address && 'address' in address && 'city' in address;
}

type Order = Database['public']['Tables']['orders']['Row'] & {
  order_items: (Database['public']['Tables']['order_items']['Row'] & {
    product: Database['public']['Tables']['products']['Row']
  })[]
};

type OrdersTabProps = {
  userId: string;
};

const STATUS_STYLES: Record<string, string> = {
  delivered: 'bg-[#3C9A70]/12 text-[#3C9A70] border-[#3C9A70]/30',
  shipped: 'bg-[#3C9A70]/12 text-[#3C9A70] border-[#3C9A70]/30',
  paid: 'bg-[#3C9A70]/12 text-[#3C9A70] border-[#3C9A70]/30',
  processing: 'bg-[#E0A83A]/18 text-[#E0A83A] border-[#E0A83A]/45',
  pending: 'bg-[#E0A83A]/18 text-[#E0A83A] border-[#E0A83A]/45',
  cancelled: 'bg-[#D9563B]/12 text-[#D9563B] border-[#D9563B]/30',
  refunded: 'bg-[#D9563B]/12 text-[#D9563B] border-[#D9563B]/30',
};

function statusStyle(status: string | null | undefined) {
  if (!status) return STATUS_STYLES.processing;
  return STATUS_STYLES[status.toLowerCase()] || STATUS_STYLES.processing;
}

export default function OrdersTab({ userId }: OrdersTabProps) {
  const t = useTranslations('Account');
  const { supabase } = useSupabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items:order_items (
              *,
              product:products (*)
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [supabase, userId]);

  const formatPrice = (price: number) => `₡${price.toLocaleString()}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="text-[#F1E7D6]">
      <h2 className="font-display text-xl font-medium tracking-[-0.005em] mb-5">
        {t('orderHistory')}
      </h2>

      {loading ? (
        <div
          className="flex flex-col items-center justify-center py-12 gap-2 text-[#8C7F6E]"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-6 w-6 animate-spin text-[#F3C56B]" strokeWidth={2} aria-hidden />
          <span className="text-sm">{t('loading') || 'Cargando…'}</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-[#3A2E24] bg-[#161210] p-10 text-center">
          <p className="text-[#8C7F6E] mb-1">{t('noOrders')}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => {
            const isOpen = expandedOrderId === order.id;
            const statusKey = order.shipping_status || 'processing';
            return (
              <li
                key={order.id}
                className="overflow-hidden border border-[#3A2E24] bg-[#1E1813]"
              >
                <button
                  type="button"
                  onClick={() => toggleOrderExpansion(order.id)}
                  aria-expanded={isOpen}
                  aria-controls={`order-details-${order.id}`}
                  className="w-full flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#161210] hover:bg-[#1E1813] transition-colors text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-[#8C7F6E] mb-1">
                      <span>{t('orderNumber')}:</span>
                      <span className="font-medium text-[#F1E7D6] tabular-nums">#{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#8C7F6E]">
                      <span>{t('orderDate')}:</span>
                      <span className="font-medium text-[#F1E7D6]">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 md:mt-0">
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-[0.06em] text-[#8C7F6E]">
                        {t('total')}
                      </div>
                      <div className="font-display text-lg font-semibold text-[#F1E7D6] tabular-nums">
                        {formatPrice(order.total_amount)}
                      </div>
                    </div>

                    <span className="text-[#F3C56B]" aria-hidden>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5" strokeWidth={2} />
                      ) : (
                        <ChevronDown className="h-5 w-5" strokeWidth={2} />
                      )}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`order-details-${order.id}`}
                    className="p-4 border-t border-[#3A2E24]"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs uppercase tracking-[0.06em] text-[#8C7F6E]">
                        {t('status')}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.05em] rounded-sm border ${statusStyle(statusKey)}`}
                      >
                        {statusKey || t('processing')}
                      </span>
                    </div>

                    <div className="mb-4 overflow-hidden rounded-sm border border-[#3A2E24]">
                      <table className="min-w-full">
                        <thead className="bg-[#161210]">
                          <tr>
                            <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8C7F6E]">
                              {t('product')}
                            </th>
                            <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8C7F6E]">
                              {t('quantity')}
                            </th>
                            <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8C7F6E]">
                              {t('price')}
                            </th>
                            <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8C7F6E]">
                              {t('subtotal')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#3A2E24]/70 bg-[#1E1813]">
                          {order.order_items.map((item) => (
                            <tr key={item.id} className="text-sm">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="font-medium text-[#F1E7D6]">
                                  {item.product.name || t('product')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums text-[#C9BBA5]">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums text-[#C9BBA5]">
                                {formatPrice(item.price)}
                              </td>
                              <td className="px-4 py-3 text-right tabular-nums font-semibold text-[#F1E7D6]">
                                {formatPrice(item.price * item.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {order.shipping_address && isShippingAddress(order.shipping_address) && (
                      <div className="mb-4">
                        <h3 className="text-xs uppercase tracking-[0.06em] font-semibold text-[#8C7F6E] mb-2">
                          {t('shippingAddress')}
                        </h3>
                        <div className="rounded-sm border border-[#3A2E24]/70 bg-[#161210] p-3 text-sm text-[#C9BBA5]">
                          <p className="font-medium text-[#F1E7D6]">{order.shipping_address.name}</p>
                          <p>{order.shipping_address.address}</p>
                          <p>
                            {order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.country}
                            {order.shipping_address.postal_code && ` · ${order.shipping_address.postal_code}`}
                          </p>
                          <p>{order.shipping_address.phone}</p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs uppercase tracking-[0.06em] font-semibold text-[#8C7F6E] mb-2">
                          {t('paymentMethod')}
                        </h3>
                        <div className="rounded-sm border border-[#3A2E24]/70 bg-[#161210] p-3 text-sm text-[#C9BBA5]">
                          <p className="capitalize font-medium text-[#F1E7D6]">
                            {order.payment_method === 'paypal' ? 'PayPal' : 'SINPE Móvil'}
                          </p>
                          {order.payment_reference && (
                            <p className="text-[#8C7F6E] text-xs mt-0.5">
                              {t('reference')}: <span className="tabular-nums">{order.payment_reference}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {order.tracking_number && (
                        <div>
                          <h3 className="text-xs uppercase tracking-[0.06em] font-semibold text-[#8C7F6E] mb-2">
                            {t('trackingInfo')}
                          </h3>
                          <div className="rounded-sm border border-[#3A2E24]/70 bg-[#161210] p-3 text-sm text-[#C9BBA5]">
                            <p className="tabular-nums">{order.tracking_number}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
