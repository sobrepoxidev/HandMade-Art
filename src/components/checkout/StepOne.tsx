import { Database, Json } from "@/lib/database.types";

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
import { useState, useEffect } from "react";
import { useSupabase } from '@/app/supabase-provider/provider';
import { Session } from '@supabase/supabase-js';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { formatUSD } from "@/lib/formatCurrency";

// Tipo para la información de descuento basado en la tabla discount_codes
type DiscountInfo = {
  valid: boolean;
  discountAmount: number;
  finalTotal: number;
  code: string;
  description?: string;
  discount_type: Database['public']['Tables']['discount_codes']['Row']['discount_type'];
  discount_value: number;
};

type ProductType = Database['public']['Tables']['products']['Row'];

type CartItem = {
  product: ProductType;
  quantity: number;
  id?: number;
};

// Using the ShippingAddress from types-db.ts but making all fields required for checkout
type ShippingAddress = {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
};

export default function StepOne({
  cart,
  onContinue,
  initialData,
  locale,
}: {
  cart: CartItem[];
  onContinue: (address: ShippingAddress) => void;
  initialData?: ShippingAddress | null;
  locale: string;
}) {
  const t = useTranslations('Account');
  const { supabase } = useSupabase();

  // Estados para la sesión y el perfil de usuario
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Database['public']['Tables']['user_profiles']['Row'] | null>(null);

  // Estado para mostrar diálogo de selección de dirección
  const [showAddressOptions, setShowAddressOptions] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  // Estado para la información de descuento
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);

  // Cargar información de descuento desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const discountInfoStr = localStorage.getItem('discountInfo');
      if (discountInfoStr) {
        try {
          const discountData = JSON.parse(discountInfoStr);
          setDiscountInfo(discountData);
        } catch (e) {
          console.error('Error parsing discount info:', e);
        }
      }

      // Verificar si el usuario acaba de iniciar sesión
      const justLoggedInFlag = sessionStorage.getItem('justLoggedIn');
      if (justLoggedInFlag === 'true') {
        setJustLoggedIn(true);
        // Limpiar la bandera después de usarla
        sessionStorage.removeItem('justLoggedIn');
      }
    }
  }, []);

  // Cargar la sesión inicial y escuchar cambios
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: string, newSession: Session | null) => {
      setSession(newSession);

      // Si el usuario acaba de iniciar sesión
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setJustLoggedIn(true);
        // Marcar en sessionStorage que el usuario acaba de iniciar sesión
        sessionStorage.setItem('justLoggedIn', 'true');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  // Cargar el perfil del usuario cuando cambia la sesión
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (data) {
            setUserProfile(data);

            // Si el usuario acaba de iniciar sesión y tiene una dirección guardada
            if (justLoggedIn && data.shipping_address) {
              setShowAddressOptions(true);
            }
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchUserProfile();
  }, [session, supabase, justLoggedIn]);

  const [formData, setFormData] = useState({
    nombre: initialData?.name?.split(' ')[0] || '',
    apellidos: initialData?.name?.split(' ').slice(1).join(' ') || '',
    email: '',
    telefono: initialData?.phone || '',
    direccion1: initialData?.address || '',
    direccion2: '',
    provincia: initialData?.state || '',
    canton: initialData?.city || '',
    distrito: '',
    codigoPostal: initialData?.postal_code || '',
  });

  // Inicializar datos del formulario según la fuente (initialData o perfil de usuario)
  useEffect(() => {
    // Si hay datos iniciales, usarlos
    if (initialData) {
      const nameParts = initialData.name.split(' ');
      setFormData({
        nombre: nameParts[0] || '',
        apellidos: nameParts.slice(1).join(' ') || '',
        email: '',
        telefono: initialData.phone || '',
        direccion1: initialData.address || '',
        direccion2: '',
        provincia: initialData.state || '',
        canton: initialData.city || '',
        distrito: '',
        codigoPostal: initialData.postal_code || '',
      });
    }
    // Si no hay datos iniciales pero sí hay perfil con dirección guardada
    else if (userProfile?.shipping_address && !initialData && !showAddressOptions) {
      const address = userProfile.shipping_address;
      if (address && isShippingAddress(address)) {
        const nameParts = address.name?.split(' ') || [''];
        setFormData({
          nombre: nameParts[0] || '',
          apellidos: nameParts.slice(1).join(' ') || '',
          email: '',
          telefono: address.phone || '',
          direccion1: address.address || '',
          direccion2: '',
          provincia: address.state || '',
          canton: address.city || '',
          distrito: '',
          codigoPostal: address.postal_code || '',
        });
      }
    }
  }, [initialData, userProfile, showAddressOptions]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.nombre.trim()) newErrors.nombre = locale == "es" ? "El nombre es requerido" : "The name is required";
    if (!formData.apellidos.trim()) newErrors.apellidos = locale == "es" ? "Los apellidos son requeridos" : "The last name is required";
    if (!formData.email.trim()) newErrors.email = locale == "es" ? "El correo electrónico es requerido" : "The email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = locale == "es" ? "Correo electrónico inválido" : "Invalid email";
    if (!formData.telefono.trim()) newErrors.telefono = locale == "es" ? "El teléfono es requerido" : "The phone is required";
    if (!formData.direccion1.trim()) newErrors.direccion1 = locale == "es" ? "La dirección es requerida" : "The address is required";
    if (!formData.provincia.trim()) newErrors.provincia = locale == "es" ? "La provincia es requerida" : "The province is required";
    if (!formData.canton.trim()) newErrors.canton = locale == "es" ? "El cantón es requerido" : "The canton is required";
    if (!formData.distrito.trim()) newErrors.distrito = locale == "es" ? "El distrito es requerido" : "The district is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para guardar la dirección en el perfil del usuario
  const saveAddressToProfile = async (address: ShippingAddress) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ shipping_address: address })
        .eq('id', session.user.id);

      if (error) throw error;

      toast.success(t('addressUpdated'));
    } catch (error) {
      console.error('Error saving address to profile:', error);
      toast.error(t('updateError'));
    }
  };

  // Manejar selección de dirección (usar la del perfil o la que se estaba completando)
  const handleAddressSelection = (useProfileAddress: boolean, updateProfile = false) => {
    if (useProfileAddress && userProfile?.shipping_address) {
      // Usar la dirección del perfil
      const address = userProfile.shipping_address;
      if (address && isShippingAddress(address)) {
        const nameParts = address.name?.split(' ') || [''];
        setFormData({
          nombre: nameParts[0] || '',
          apellidos: nameParts.slice(1).join(' ') || '',
          email: '',
          telefono: address.phone || '',
          direccion1: address.address || '',
          direccion2: '',
          provincia: address.state || '',
          canton: address.city || '',
          distrito: '',
          codigoPostal: address.postal_code || '',
        });
      }
    } else if (updateProfile) {
      // Crear dirección a partir de los datos del formulario
      const shippingAddress: ShippingAddress = {
        name: `${formData.nombre} ${formData.apellidos}`.trim(),
        address: formData.direccion1,
        city: formData.canton,
        state: formData.provincia,
        country: 'Costa Rica',
        postal_code: formData.codigoPostal,
        phone: formData.telefono,
      };

      // Guardar en el perfil
      saveAddressToProfile(shippingAddress);
    }

    // Cerrar el diálogo
    setShowAddressOptions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Construir objeto de dirección para el pedido
    const shippingAddress: ShippingAddress = {
      name: `${formData.nombre} ${formData.apellidos}`.trim(),
      address: formData.direccion1 + (formData.direccion2 ? `, ${formData.direccion2}` : ''),
      city: formData.canton,
      state: formData.provincia,
      country: 'Costa Rica',
      postal_code: formData.codigoPostal,
      phone: formData.telefono,
    };

    // Si el usuario está autenticado pero no tiene dirección guardada, preguntar si desea guardarla
    if (session && !userProfile?.shipping_address && !showAddressOptions) {
      const confirmed = window.confirm('¿Deseas guardar esta dirección en tu perfil para futuros pedidos?');
      if (confirmed) {
        saveAddressToProfile(shippingAddress);
      }
    }

    onContinue(shippingAddress);
  };

  // Costa Rica provinces
  const provincias = [
    'San José',
    'Alajuela',
    'Cartago',
    'Heredia',
    'Guanacaste',
    'Puntarenas',
    'Limón'
  ];

  return (
    <section className="w-full text-gray-950">
      {/* Modal de selección de dirección cuando el usuario acaba de iniciar sesión */}
      {showAddressOptions && userProfile?.shipping_address && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {locale == "es" ? "Selección de dirección de envío" : "Shipping Address Selection"}
            </h3>
            <p className="mb-4 text-gray-600">
              {locale == "es" ? "Detectamos que ya tienes una dirección de envío guardada en tu perfil. ¿Cómo deseas proceder?" : "We detected that you already have a saved shipping address in your profile. How do you want to proceed?"}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleAddressSelection(true)}
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition"
              >
                {locale == "es" ? "Usar mi dirección guardada" : "Use my saved address"}
              </button>

              <button
                onClick={() => handleAddressSelection(false)}
                className="w-full bg-white text-gray-800 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition"
              >
                {locale == "es" ? "Continuar con la dirección actual" : "Continue with the current address"}
              </button>

              <button
                onClick={() => handleAddressSelection(false, true)}
                className="w-full bg-white text-teal-600 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition"
              >
                {locale == "es" ? "Usar la dirección actual y actualizarla en mi perfil" : "Use the current address and update it in my profile"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Form */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-md p-4">

            {/* Account section */}
            <div className="p-2">
              <p>{locale == "es" ? "¿Tiene una cuenta con nosotros? Inicie sesión para acelerar su compra." : "Do you have an account with us? Login to speed up your purchase."}
                <a href="#" className="text-[#4A9DAB] font-medium ml-1 hover:underline">{locale == "es" ? "Entrar" : "Login"}</a>
              </p>
            </div>

            {/* Shipping Address header */}
            <div className="bg-teal-600 p-4 text-white font-medium rounded-md">
              {locale == "es" ? "Información de envío" : "Shipping Information"}
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-1">
                  {locale == "es" ? "Nombre" : "Name"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={errors.nombre ? "true" : "false"}
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              {/* Apellidos */}
              <div>
                <label htmlFor="apellidos" className="block text-sm font-medium mb-1">
                  {locale == "es" ? "Apellidos" : "Last name"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.apellidos ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={errors.apellidos ? "true" : "false"}
                />
                {errors.apellidos && <p className="text-red-500 text-xs mt-1">{errors.apellidos}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  {locale == "es" ? "Email" : "Email"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium mb-1">
                  {locale == "es" ? "Teléfono" : "Phone"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="8888-8888"
                  className={`w-full p-2 border rounded-md ${errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={errors.telefono ? "true" : "false"}
                />
                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
              </div>

              {/* Dirección 1 */}
              <div className="md:col-span-2">
                <label htmlFor="direccion1" className="block text-sm font-medium mb-1">
                  {locale == "es" ? "Dirección" : "Address"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="direccion1"
                  name="direccion1"
                  value={formData.direccion1}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.direccion1 ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={errors.direccion1 ? "true" : "false"}
                />
                {errors.direccion1 && <p className="text-red-500 text-xs mt-1">{errors.direccion1}</p>}
              </div>

              {/* Provincia */}
              <div>
                <label htmlFor="provincia" className="block text-sm font-medium mb-1">
                  {locale == "es" ? "Provincia" : "Province"} <span className="text-red-500">*</span>
                </label>
                <select
                  id="provincia"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.provincia ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={errors.provincia ? "true" : "false"}
                >
                  <option value="">{locale == "es" ? "Seleccionar provincia" : "Select province"}</option>
                  {provincias.map((provincia) => (
                    <option key={provincia} value={provincia}>
                      {provincia}
                    </option>
                  ))}
                </select>
                {errors.provincia && <p className="text-red-500 text-xs mt-1">{errors.provincia}</p>}
              </div>

              {/* Cantón */}
              <div>
                <label htmlFor="canton" className="block text-sm font-medium mb-1">
                  {locale == "es" ? "Cantón" : "Canton"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="canton"
                  name="canton"
                  value={formData.canton}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.canton ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={errors.canton ? "true" : "false"}
                />
                {errors.canton && <p className="text-red-500 text-xs mt-1">{errors.canton}</p>}
              </div>

              {/* Distrito */}
              <div>
                <label htmlFor="distrito" className="block text-sm font-medium mb-1">
                  {locale == "es" ? "Distrito" : "District"} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="distrito"
                  name="distrito"
                  value={formData.distrito}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.distrito ? 'border-red-500' : 'border-gray-300'}`}
                  data-error={errors.distrito ? "true" : "false"}
                />
                {errors.distrito && <p className="text-red-500 text-xs mt-1">{errors.distrito}</p>}
              </div>

              {/* Código Postal */}
              <div>
                <label htmlFor="codigoPostal" className="block text-sm font-medium mb-1">
                  {locale == "es" ? "Código Postal" : "Postal code"}
                </label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition"
              >
                {locale == "es" ? "CONTINUAR" : "CONTINUE"}
              </button>
            </div>
          </form>
        </div>

        {/* Right column - Order summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-md p-4 sticky top-4">
            <h2 className="text-lg font-medium mb-4">{locale == "es" ? "Resumen del pedido" : "Order summary"}</h2>

            {/* Cart items */}
            <div className="space-y-4 mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex items-start border-b pb-3">
                  <div className="flex-grow">
                    <p className="font-medium">{item.product.name || 'Producto'}</p>
                    <p className="text-sm text-gray-600">{locale == "es" ? "Cantidad" : "Quantity"}: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {item.product?.dolar_price != null
                        ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          currencyDisplay: 'narrowSymbol', // “$”, no “US$”
                          minimumFractionDigits: 2,        // siempre dos decimales
                        }).format(item.product.dolar_price * item.quantity)
                        : 'N/A'}
                    </p>

                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>{locale == "es" ? "Total parcial" : "Partial total"}</span>
                <span className="text-xs font-bold text-teal-700">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    currencyDisplay: 'narrowSymbol', // “$”, no “US$”
                    minimumFractionDigits: 2,
                  }).format(
                    cart.reduce(
                      (sum, item) => sum + (item.product.dolar_price ?? 0) * item.quantity,
                      0
                    )
                  )}
                </span>

              </div>
              <div className="flex justify-between">
                <span>{locale == "es" ? "Envío" : "Shipping"}</span>
                <span>$6.99</span>
              </div>
              {discountInfo && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>{locale == "es" ? "Descuento" : "Discount"} ({discountInfo.code})</span>
                  <span>-  {formatUSD(discountInfo.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>{locale == "es" ? "Total del pedido:" : "Total of the order:"}</span>
                <span className="text-xs font-bold text-teal-700">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    currencyDisplay: 'narrowSymbol',   // “$” en lugar de “US$”
                    minimumFractionDigits: 2,          // siempre 2 decimales
                  }).format(
                    discountInfo
                      ? discountInfo.finalTotal
                      : cart.reduce(
                        (sum, item) =>
                          sum + (item.product.dolar_price ?? 0) * item.quantity,
                        0,
                      ) + 7 // sobrecargo fijo de envío
                  )}
                </span>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-600 mt-4">
        <span className="text-red-500">*</span> {locale == "es" ? "Campos requeridos" : "Required fields"}
      </div>
    </section>
  );
}