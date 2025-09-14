'use client';

import { useTranslations } from 'next-intl';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useSupabase } from '@/app/supabase-provider/provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Json } from '@/lib/database.types';
// Tipo para dirección de envío basado en la interfaz de types-db.ts
interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
}
import { toast } from 'react-hot-toast';
import ProfileTab from './ProfileTab';
import AddressTab from './AddressTab';
import OrdersTab from './OrdersTab';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

// Tipo compatible para ProfileTab
type ProfileTabUserProfile = {
  id: string;
  full_name?: string | null;
  shipping_address?: unknown | null;
  preferences?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
};

// Tipo compatible para AddressTab
type AddressTabUserProfile = {
  id: string;
  full_name?: string | null;
  shipping_address?: ShippingAddress | null;
  preferences?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
};

type AccountClientProps = {
  user: User;
  initialProfile: UserProfile | null;
};

export default function AccountClient({ user, initialProfile }: AccountClientProps) {
  const t = useTranslations('Account');
  const { supabase } = useSupabase();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [loading, setLoading] = useState(false);

  // Función para convertir el perfil para ProfileTab
  const convertToProfileTabProfile = (dbProfile: UserProfile | null): ProfileTabUserProfile | null => {
    if (!dbProfile) return null;
    
    return {
      id: dbProfile.id,
      full_name: dbProfile.full_name,
      shipping_address: dbProfile.shipping_address,
      preferences: dbProfile.preferences as Record<string, unknown> | null,
      created_at: dbProfile.created_at || undefined,
      updated_at: dbProfile.updated_at || undefined
    };
  };

  // Función para convertir el perfil para AddressTab
  const convertToAddressTabProfile = (dbProfile: UserProfile | null): AddressTabUserProfile | null => {
    if (!dbProfile) return null;
    
    return {
      id: dbProfile.id,
      full_name: dbProfile.full_name,
      shipping_address: dbProfile.shipping_address ? JSON.parse(JSON.stringify(dbProfile.shipping_address)) as ShippingAddress : null,
      preferences: dbProfile.preferences as Record<string, unknown> | null,
      created_at: dbProfile.created_at || undefined,
      updated_at: dbProfile.updated_at || undefined
    };
  };

  // Efecto para crear un perfil si no existe
  useEffect(() => {
    let isMounted = true;
    
    const createProfileIfNotExists = async () => {
      if (!profile && user) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || null,
              shipping_address: null,
            })
            .select()
            .single();

          if (error) throw error;
          if (isMounted) {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error creating profile:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };
    
    createProfileIfNotExists();
    
    return () => {
      isMounted = false;
    };
  }, [supabase, profile, user]);

  // Función para actualizar el nombre completo
  const updateFullName = async (fullName: string) => {
    try {
      setLoading(true);
      
      // Actualizar en la tabla user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Actualizar también en auth.users
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (authError) throw authError;

      // Actualizar el estado
      setProfile(prev => prev ? { ...prev, full_name: fullName } : null);
      
      toast.success(t('profileUpdated'));
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error(t('updateError'));
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar la dirección de envío
  const updateShippingAddress = async (address: ShippingAddress) => {
    try {
      setLoading(true);
      
      // Convertir ShippingAddress a Json
      const addressAsJson = address as unknown as Json;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ shipping_address: addressAsJson })
        .eq('id', user.id);

      if (error) throw error;

      // Actualizar el estado
      setProfile(prev => prev ? { ...prev, shipping_address: addressAsJson } : null);
      
      toast.success(t('addressUpdated'));
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error(t('updateError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        {t('myAccount')}
      </h1>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger 
            value="profile" 
            className="text-[0.7rem] sm:text-sm md:text-base py-2 px-1 sm:px-2 md:px-4 truncate"
          >
            {t('personalInfo')}
          </TabsTrigger>
          <TabsTrigger 
            value="address" 
            className="text-[0.7rem] sm:text-sm md:text-base py-2 px-1 sm:px-2 md:px-4 truncate"
          >
            {t('shippingAddress')}
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="text-[0.7rem] sm:text-sm md:text-base py-2 px-1 sm:px-2 md:px-4 truncate"
          >
            {t('orderHistory')}
          </TabsTrigger>
        </TabsList>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
          <TabsContent value="profile">
            <ProfileTab 
              user={user} 
              profile={convertToProfileTabProfile(profile)} 
              updateFullName={updateFullName} 
              loading={loading} 
            />
          </TabsContent>

          <TabsContent value="address">
            <AddressTab 
              profile={convertToAddressTabProfile(profile)} 
              updateShippingAddress={updateShippingAddress} 
              loading={loading} 
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab userId={user.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}