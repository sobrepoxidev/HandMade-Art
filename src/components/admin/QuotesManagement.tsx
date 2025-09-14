'use client';

import { useState, useEffect, useCallback } from 'react';
import { Database, ProductSnapshot } from '@/lib/database.types';
import { Search, Filter, RefreshCw, Eye, Edit, DollarSign, Send, Copy, Share2, Tag } from 'lucide-react';
import { FaPhone, FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import QuoteDiscountModal from './QuoteDiscountModal';
import DiscountCodesModal from './DiscountCodesModal';

type InterestRequest = Database['public']['Tables']['interest_requests']['Row'] & {
  interest_request_items: (Database['public']['Tables']['interest_request_items']['Row'] & {
    product_snapshot: ProductSnapshot;
  })[];
};

type QuoteStatus = 'received' | 'priced' | 'sent_to_client' | 'closed_won' | 'closed_lost';

interface QuotesManagementProps {
  locale: string;
}

export default function QuotesManagement({ locale }: QuotesManagementProps) {
  const [quotes, setQuotes] = useState<InterestRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
  const [selectedQuote, setSelectedQuote] = useState<InterestRequest | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showDiscountCodesModal, setShowDiscountCodesModal] = useState(false);

  // Cargar cotizaciones
  const loadQuotes = useCallback(async () => {
    console.log("Loading quotes...")
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/quotes?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }

      const { quotes: data } = await response.json();
      console.log("Data: ", data)
      setQuotes(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las cotizaciones');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, setLoading, setQuotes]);

  useEffect(() => {
    loadQuotes();
  }, [statusFilter, searchTerm, loadQuotes]);

  // Filtrar cotizaciones por término de búsqueda
  const filteredQuotes = quotes.filter(quote => 
    (quote.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.requester_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.phone || '').includes(searchTerm)
  );

  // Actualizar estado de cotización
  const updateQuoteStatus = async (quoteId: number, newStatus: QuoteStatus) => {
    try {
      const response = await fetch('/api/update-quote-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quoteId,
          status: newStatus,
          responded_at: newStatus === 'sent_to_client' ? new Date().toISOString() : undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update quote status');
      }

      toast.success('Estado actualizado correctamente');
      loadQuotes();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  // Copiar link de cotización
  const copyQuoteLink = (slug: string) => {
    const link = `${window.location.origin}/quote/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success(locale === 'es' ? 'Link copiado al portapapeles' : 'Link copied to clipboard');
  };

  // Compartir cotización (API nativa de compartir)
  const shareQuote = async (slug: string) => {
    const link = `${window.location.origin}/quote/${slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: locale === 'es' ? 'Cotización - Handmade Art' : 'Quote - Handmade Art',
          text: locale === 'es' ? 'Revisa tu cotización personalizada' : 'Check your personalized quote',
          url: link
        });
        toast.success(locale === 'es' ? 'Compartido exitosamente' : 'Shared successfully');
      } catch (error) {
        // Usuario canceló o error
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          // Fallback a copiar
          copyQuoteLink(slug);
        }
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      copyQuoteLink(slug);
    }
  };

  // Ver cotización (para cotizaciones vendidas)
  const viewQuote = (slug: string) => {
    const link = `/${locale}/quote/${slug}`;
    window.open(link, '_blank');
  };

  // Enviar cotización por correo
  const sendQuoteEmail = async (quote: InterestRequest) => {
    if (!quote.quote_slug) {
      toast.error(locale === 'es' ? 'Esta cotización no tiene un enlace generado' : 'This quote does not have a generated link');
      return;
    }

    try {
      const response = await fetch('/api/send-quote-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.id })
      });

      if (!response.ok) {
        throw new Error('Error al enviar correo');
      }

      toast.success(locale === 'es' ? 'Correo enviado exitosamente al cliente' : 'Email sent successfully to customer');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(locale === 'es' ? 'Error al enviar el correo' : 'Error sending email');
    }
  };

  const getStatusBadge = (status: QuoteStatus) => {
    const styles = {
      received: 'bg-blue-100 text-blue-800',
      priced: 'bg-yellow-100 text-yellow-800',
      sent_to_client: 'bg-green-100 text-green-800',
      closed_won: 'bg-purple-100 text-purple-800',
      closed_lost: 'bg-red-100 text-red-800'
    };

    const labels = {
      received: locale === 'es' ? 'Recibido' : 'Received',
      priced: locale === 'es' ? 'Cotizado' : 'Priced',
      sent_to_client: locale === 'es' ? 'Enviado' : 'Sent to Client',
      closed_won: locale === 'es' ? 'Vendido' : 'Sold',
      closed_lost: locale === 'es' ? 'Perdido' : 'Lost'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-3 py-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-8 h-8 mr-2 text-green-600" />
            {locale === 'es' ? 'Gestión de Cotizaciones' : 'Quote Management'}
          </h1>
          <p className="text-gray-500 mt-1">
            {locale === 'es' ? 'Administra las solicitudes de cotización de los clientes' : 'Manage customer quote requests'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDiscountCodesModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            <Tag className="w-4 h-4 mr-2" />
            {locale === 'es' ? 'Códigos de Descuento' : 'Discount Codes'}
          </button>
          <button
            onClick={loadQuotes}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {locale === 'es' ? 'Actualizar' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-3 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative text-gray-800">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={locale === 'es' ? 'Buscar por email, nombre o teléfono...' : 'Search by email, name or phone...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | 'all')}
            className="px-3 py-2 border border-gray-300 text-gray-800 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">{locale === 'es' ? 'Todos los estados' : 'All statuses'}</option>
            <option value="nuevo">{locale === 'es' ? 'Nuevo' : 'New'}</option>
            <option value="finalizado">{locale === 'es' ? 'Finalizado' : 'Finalized'}</option>
            <option value="vendido">{locale === 'es' ? 'Vendido' : 'Sold'}</option>
          </select>
        </div>
      </div>

      {/* Lista de cotizaciones */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {filteredQuotes.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {locale === 'es' ? 'No se encontraron cotizaciones' : 'No quotes found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'es' ? 'Cliente' : 'Customer'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'es' ? 'Productos' : 'Products'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'es' ? 'Total' : 'Total'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'es' ? 'Estado' : 'Status'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'es' ? 'Fecha' : 'Date'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {locale === 'es' ? 'Acciones' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-gray-900">
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {quote.requester_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {quote.email}
                          </div>
                          {quote.phone && (
                             <div className="flex items-center gap-2 mt-1">
                               <a
                                 href={`tel:${quote.phone.replace(/[^0-9]/g, '').length === 8 ? '+506' + quote.phone.replace(/[^0-9]/g, '') : quote.phone}`}
                                 className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                 title="Llamar"
                               >
                                 <FaPhone className="w-3 h-3" />
                                 <span className="hidden sm:inline">Llamar</span>
                               </a>
                               <a
                                 href={`https://wa.me/${quote.phone.replace(/[^0-9]/g, '').length === 8 ? '506' + quote.phone.replace(/[^0-9]/g, '') : quote.phone.replace(/[^0-9]/g, '')}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                                 title="WhatsApp"
                               >
                                 <FaWhatsapp className="w-3 h-3" />
                                 <span className="hidden sm:inline">WhatsApp</span>
                               </a>
                               <span className="text-xs text-gray-500 ml-1">
                                 {quote.phone.replace(/[^0-9]/g, '').length === 8 ? '+506 ' + quote.phone : quote.phone}
                               </span>
                             </div>
                           )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {quote.interest_request_items.slice(0, 3).map((item, index) => (
                            <div key={index} className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                              {item.product_snapshot?.image_url ? (
                                <Image
                                  src={item.product_snapshot.image_url}
                                  alt={item.product_snapshot.name || 'Product'}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">
                                    {item.product_snapshot?.name?.charAt(0) || 'P'}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                          {quote.interest_request_items.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-500">
                                +{quote.interest_request_items.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {quote.interest_request_items.length} {locale === 'es' ? 'productos' : 'products'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(quote.final_amount || quote.total_amount || 0)}
                        </div>
                        {quote.final_amount && quote.total_amount && quote.final_amount !== quote.total_amount && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatCurrency(quote.total_amount)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(quote.status as QuoteStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(quote.created_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {quote.status === 'received' && (
                            <button
                              onClick={() => {
                                setSelectedQuote(quote);
                                setShowDiscountModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title={locale === 'es' ? 'Aplicar descuento' : 'Apply discount'}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {quote.status === 'sent_to_client' && quote.quote_slug && (
                            <>
                              <button
                                onClick={() => copyQuoteLink(quote.quote_slug!)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title={locale === 'es' ? 'Copiar link' : 'Copy link'}
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => sendQuoteEmail(quote)}
                                className="text-purple-600 hover:text-purple-900 p-1 rounded"
                                title={locale === 'es' ? 'Enviar por correo' : 'Send by email'}
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => shareQuote(quote.quote_slug!)}
                                className="text-orange-600 hover:text-orange-900 p-1 rounded"
                                title={locale === 'es' ? 'Compartir (móvil)' : 'Share (mobile)'}
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {quote.status === 'sent_to_client' && (
                            <button
                              onClick={() => updateQuoteStatus(quote.id, 'closed_won')}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title={locale === 'es' ? 'Marcar como vendido' : 'Mark as sold'}
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                          )}
                          {(quote.status === 'closed_won' || quote.status === 'closed_lost') && quote.quote_slug && (
                            <button
                              onClick={() => viewQuote(quote.quote_slug!)}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded"
                              title={locale === 'es' ? 'Visualizar cotización' : 'View quote'}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de descuentos */}
      {showDiscountModal && selectedQuote && (
        <QuoteDiscountModal
          quote={selectedQuote}
          locale={locale}
          onClose={() => {
            setShowDiscountModal(false);
            setSelectedQuote(null);
          }}
          onSuccess={() => {
            setShowDiscountModal(false);
            setSelectedQuote(null);
            loadQuotes();
          }}
        />
      )}

      {/* Modal de códigos de descuento */}
      {showDiscountCodesModal && (
        <DiscountCodesModal
          locale={locale}
          onClose={() => setShowDiscountCodesModal(false)}
        />
      )}
    </div>
  );
}