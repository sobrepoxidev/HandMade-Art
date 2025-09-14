'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSupabase } from '@/app/supabase-provider/provider';
import { Database, Json } from '@/lib/database.types';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

export default function OrdersTab({ userId }: OrdersTabProps) {
  const t = useTranslations('Account');
  const { supabase } = useSupabase();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Cargar pedidos cuando se monta el componente
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Obtener los pedidos del usuario ordenados por fecha (el más reciente primero)
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

  // Función para formatear precio
  const formatPrice = (price: number) => `₡${price.toLocaleString()}`;
  
  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  // Alternar la expansión de un pedido
  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  return (
    <div className="text-gray-800">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {t('orderHistory')}
      </h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-50 rounded-md p-8 text-center border border-gray-200">
          <p className="text-gray-500">{t('noOrders')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="border border-gray-200 rounded-md overflow-hidden"
            >
              {/* Cabecera del pedido (siempre visible) */}
              <div 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 cursor-pointer"
                onClick={() => toggleOrderExpansion(order.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <span>{t('orderNumber')}:</span>
                    <span className="font-medium text-gray-800">#{order.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{t('orderDate')}:</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{t('total')}:</div>
                    <div className="font-bold text-gray-800">
                      {formatPrice(order.total_amount)}
                    </div>
                  </div>
                  
                  <div className="text-teal-600">
                    {expandedOrderId === order.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Detalles del pedido (expandible) */}
              {expandedOrderId === order.id && (
                <div className="p-4 border-t border-gray-200">
                  {/* Estado del pedido */}
                  <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">{t('status')}:</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                      {order.shipping_status || t('processing')}
                    </span>
                  </div>
                  
                  {/* Productos del pedido */}
                  <div className="border rounded-md overflow-hidden mb-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('product')}
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('quantity')}
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('price')}
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('subtotal')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.order_items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-medium">{item.product.name || 'Producto'}</span>
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              {formatPrice(item.price)}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Dirección de envío */}
                  {order.shipping_address && isShippingAddress(order.shipping_address) && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {t('shippingAddress')}
                      </h3>
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        <p className="font-medium">{order.shipping_address.name}</p>
                        <p>{order.shipping_address.address}</p>
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.country}
                          {order.shipping_address.postal_code && ` - ${order.shipping_address.postal_code}`}
                        </p>
                        <p>{order.shipping_address.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Método de pago */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {t('paymentMethod')}
                      </h3>
                      <div className="bg-gray-50 p-3 rounded-md text-sm">
                        <p className="capitalize">
                          {order.payment_method === 'paypal' ? 'PayPal' : 'SINPE Móvil'}
                        </p>
                        {order.payment_reference && (
                          <p className="text-gray-500">
                            {t('reference')}: {order.payment_reference}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Número de seguimiento, si existe */}
                    {order.tracking_number && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          {t('trackingInfo')}
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          <p>{order.tracking_number}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
