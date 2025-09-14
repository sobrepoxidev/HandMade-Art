export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string | null
          country_code: string
          created_at: string
          email: string
          id: number
          is_pickup_point: boolean
          line1: string
          line2: string | null
          name: string
          phone: string
          pickup_point_id: string | null
          pickup_point_label: string | null
          postal_code: string | null
          reference: string | null
          state: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          country_code: string
          created_at?: string
          email: string
          id?: number
          is_pickup_point?: boolean
          line1: string
          line2?: string | null
          name: string
          phone: string
          pickup_point_id?: string | null
          pickup_point_label?: string | null
          postal_code?: string | null
          reference?: string | null
          state?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string
          created_at?: string
          email?: string
          id?: number
          is_pickup_point?: boolean
          line1?: string
          line2?: string | null
          name?: string
          phone?: string
          pickup_point_id?: string | null
          pickup_point_label?: string | null
          postal_code?: string | null
          reference?: string | null
          state?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      carrier_accounts: {
        Row: {
          carrier: string
          created_at: string
          credentials: Json
          default_markup_percent: number
          enabled: boolean
          id: number
          name: string
        }
        Insert: {
          carrier: string
          created_at?: string
          credentials: Json
          default_markup_percent?: number
          enabled?: boolean
          id?: number
          name: string
        }
        Update: {
          carrier?: string
          created_at?: string
          credentials?: Json
          default_markup_percent?: number
          enabled?: boolean
          id?: number
          name?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: number
          product_id: number
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          product_id: number
          quantity: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          name: string
          name_en: string | null
          name_es: string | null
          parent_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          name_en?: string | null
          name_es?: string | null
          parent_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          name_en?: string | null
          name_es?: string | null
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          id: number
          is_active: boolean | null
          max_uses: number | null
          min_purchase_amount: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: number
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: number
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: number
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_request_items: {
        Row: {
          boss_note: string | null
          discount_percentage: number | null
          id: number
          product_id: number
          product_snapshot: Json
          quantity: number
          request_id: number
          unit_price_crc: number | null
          unit_price_usd: number | null
        }
        Insert: {
          boss_note?: string | null
          discount_percentage?: number | null
          id?: number
          product_id: number
          product_snapshot?: Json
          quantity?: number
          request_id: number
          unit_price_crc?: number | null
          unit_price_usd?: number | null
        }
        Update: {
          boss_note?: string | null
          discount_percentage?: number | null
          id?: number
          product_id?: number
          product_snapshot?: Json
          quantity?: number
          request_id?: number
          unit_price_crc?: number | null
          unit_price_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "interest_request_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interest_request_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interest_request_items_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "interest_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      interest_requests: {
        Row: {
          admin_notes: string | null
          channel: string
          created_at: string
          discount_code_applied: Json | null
          discount_type: string | null
          discount_value: number | null
          email: string | null
          final_amount: number | null
          id: number
          locale: string
          manager_notes: string | null
          notes: string | null
          organization: string | null
          phone: string | null
          quote_slug: string | null
          requester_name: string
          responded_at: string | null
          shipping_cost: number | null
          source: string
          status: string
          total_amount: number | null
        }
        Insert: {
          admin_notes?: string | null
          channel?: string
          created_at?: string
          discount_code_applied?: Json | null
          discount_type?: string | null
          discount_value?: number | null
          email?: string | null
          final_amount?: number | null
          id?: number
          locale?: string
          manager_notes?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          quote_slug?: string | null
          requester_name: string
          responded_at?: string | null
          shipping_cost?: number | null
          source?: string
          status?: string
          total_amount?: number | null
        }
        Update: {
          admin_notes?: string | null
          channel?: string
          created_at?: string
          discount_code_applied?: Json | null
          discount_type?: string | null
          discount_value?: number | null
          email?: string | null
          final_amount?: number | null
          id?: number
          locale?: string
          manager_notes?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          quote_slug?: string | null
          requester_name?: string
          responded_at?: string | null
          shipping_cost?: number | null
          source?: string
          status?: string
          total_amount?: number | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          id: number
          product_id: number
          quantity: number
          reserved: number
          updated_at: string
        }
        Insert: {
          id?: number
          product_id: number
          quantity?: number
          reserved?: number
          updated_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          quantity?: number
          reserved?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          entries: number
          facebook_followed: boolean
          id: string
          instagram_followed: boolean
          kenia_basilis_followed: boolean | null
          name: string
          phone: string
          tiktok_followed: boolean
          youtube_followed: boolean
        }
        Insert: {
          created_at?: string
          email: string
          entries?: number
          facebook_followed?: boolean
          id?: string
          instagram_followed?: boolean
          kenia_basilis_followed?: boolean | null
          name: string
          phone: string
          tiktok_followed?: boolean
          youtube_followed?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          entries?: number
          facebook_followed?: boolean
          id?: string
          instagram_followed?: boolean
          kenia_basilis_followed?: boolean | null
          name?: string
          phone?: string
          tiktok_followed?: boolean
          youtube_followed?: boolean
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: number
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          dims_snapshot: Json | null
          id: number
          order_id: number
          price: number
          product_id: number
          product_name_snapshot: string | null
          quantity: number
          sku_snapshot: string | null
          unit_weight_kg_snapshot: number | null
        }
        Insert: {
          created_at?: string
          dims_snapshot?: Json | null
          id?: number
          order_id: number
          price: number
          product_id: number
          product_name_snapshot?: string | null
          quantity: number
          sku_snapshot?: string | null
          unit_weight_kg_snapshot?: number | null
        }
        Update: {
          created_at?: string
          dims_snapshot?: Json | null
          id?: number
          order_id?: number
          price?: number
          product_id?: number
          product_name_snapshot?: string | null
          quantity?: number
          sku_snapshot?: string | null
          unit_weight_kg_snapshot?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_id: number | null
          created_at: string
          currency: string
          discount_amount: number
          id: number
          notes: string | null
          payment_method: string
          payment_reference: string | null
          payment_status: string
          shipping_address: Json | null
          shipping_address_id: number | null
          shipping_amount: number
          shipping_carrier: string | null
          shipping_cost: number
          shipping_currency: string
          shipping_est_delivery: string | null
          shipping_label_url: string | null
          shipping_last_updated: string | null
          shipping_quote_id: string | null
          shipping_service: string | null
          shipping_status: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address_id?: number | null
          created_at?: string
          currency?: string
          discount_amount?: number
          id?: number
          notes?: string | null
          payment_method: string
          payment_reference?: string | null
          payment_status?: string
          shipping_address?: Json | null
          shipping_address_id?: number | null
          shipping_amount?: number
          shipping_carrier?: string | null
          shipping_cost?: number
          shipping_currency?: string
          shipping_est_delivery?: string | null
          shipping_label_url?: string | null
          shipping_last_updated?: string | null
          shipping_quote_id?: string | null
          shipping_service?: string | null
          shipping_status?: string | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address_id?: number | null
          created_at?: string
          currency?: string
          discount_amount?: number
          id?: number
          notes?: string | null
          payment_method?: string
          payment_reference?: string | null
          payment_status?: string
          shipping_address?: Json | null
          shipping_address_id?: number | null
          shipping_amount?: number
          shipping_carrier?: string | null
          shipping_cost?: number
          shipping_currency?: string
          shipping_est_delivery?: string | null
          shipping_label_url?: string | null
          shipping_last_updated?: string | null
          shipping_quote_id?: string | null
          shipping_service?: string | null
          shipping_status?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          height_cm: number
          id: number
          insured_value: number | null
          length_cm: number
          reference: string | null
          shipment_id: number
          weight_kg: number
          width_cm: number
        }
        Insert: {
          height_cm: number
          id?: number
          insured_value?: number | null
          length_cm: number
          reference?: string | null
          shipment_id: number
          weight_kg: number
          width_cm: number
        }
        Update: {
          height_cm?: number
          id?: number
          insured_value?: number | null
          length_cm?: number
          reference?: string | null
          shipment_id?: number
          weight_kg?: number
          width_cm?: number
        }
        Relationships: [
          {
            foreignKeyName: "packages_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: number | null
          colon_price: number | null
          country_of_origin: string | null
          created_at: string
          customs_description_en: string | null
          dangerous_goods: boolean
          description: string | null
          description_en: string | null
          discount_percentage: number | null
          dolar_price: number | null
          height_cm: number
          hs_code: string | null
          id: number
          is_active: boolean | null
          is_featured: boolean | null
          length_cm: number
          media: Json | null
          modified_at: string | null
          name: string | null
          name_en: string | null
          name_es: string | null
          sku: string | null
          specifications: Json | null
          tags: string[] | null
          weight_kg: number
          width_cm: number
        }
        Insert: {
          brand?: string | null
          category_id?: number | null
          colon_price?: number | null
          country_of_origin?: string | null
          created_at?: string
          customs_description_en?: string | null
          dangerous_goods?: boolean
          description?: string | null
          description_en?: string | null
          discount_percentage?: number | null
          dolar_price?: number | null
          height_cm?: number
          hs_code?: string | null
          id?: number
          is_active?: boolean | null
          is_featured?: boolean | null
          length_cm?: number
          media?: Json | null
          modified_at?: string | null
          name?: string | null
          name_en?: string | null
          name_es?: string | null
          sku?: string | null
          specifications?: Json | null
          tags?: string[] | null
          weight_kg?: number
          width_cm?: number
        }
        Update: {
          brand?: string | null
          category_id?: number | null
          colon_price?: number | null
          country_of_origin?: string | null
          created_at?: string
          customs_description_en?: string | null
          dangerous_goods?: boolean
          description?: string | null
          description_en?: string | null
          discount_percentage?: number | null
          dolar_price?: number | null
          height_cm?: number
          hs_code?: string | null
          id?: number
          is_active?: boolean | null
          is_featured?: boolean | null
          length_cm?: number
          media?: Json | null
          modified_at?: string | null
          name?: string | null
          name_en?: string | null
          name_es?: string | null
          sku?: string | null
          specifications?: Json | null
          tags?: string[] | null
          weight_kg?: number
          width_cm?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes_codes: {
        Row: {
          apply_to_all_categories: boolean | null
          code: string
          created_at: string | null
          description: string | null
          discount_type: string
          discount_value: number
          id: number
          is_active: boolean | null
          max_discount_amount: number | null
          min_order_amount: number | null
          updated_at: string | null
          usage_limit: number | null
          used_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          apply_to_all_categories?: boolean | null
          code: string
          created_at?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: number
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          apply_to_all_categories?: boolean | null
          code?: string
          created_at?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: number
          is_active?: boolean | null
          max_discount_amount?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          usage_limit?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      quotes_codes_categories: {
        Row: {
          category_id: number | null
          created_at: string | null
          id: number
          quote_code_id: number | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          quote_code_id?: number | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          quote_code_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_codes_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_codes_categories_quote_code_id_fkey"
            columns: ["quote_code_id"]
            isOneToOne: false
            referencedRelation: "quotes_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: number
          product_id: number
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: number
          product_id: number
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: number
          product_id?: number
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          carrier: string
          cost: number
          created_at: string
          currency: string
          id: number
          label_format: string | null
          label_url: string | null
          meta: Json
          negotiated_rate: Json | null
          order_id: number
          service_code: string
          status: string
          tracking_number: string | null
        }
        Insert: {
          carrier: string
          cost: number
          created_at?: string
          currency: string
          id?: number
          label_format?: string | null
          label_url?: string | null
          meta?: Json
          negotiated_rate?: Json | null
          order_id: number
          service_code: string
          status?: string
          tracking_number?: string | null
        }
        Update: {
          carrier?: string
          cost?: number
          created_at?: string
          currency?: string
          id?: number
          label_format?: string | null
          label_url?: string | null
          meta?: Json
          negotiated_rate?: Json | null
          order_id?: number
          service_code?: string
          status?: string
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_quotes: {
        Row: {
          amount: number
          breakdown: Json
          carrier: string
          cart_hash: string
          created_at: string
          currency: string
          eta_days: number | null
          id: number
          service_code: string
          service_name: string
          user_id: string | null
          valid_until: string
        }
        Insert: {
          amount: number
          breakdown?: Json
          carrier: string
          cart_hash: string
          created_at?: string
          currency: string
          eta_days?: number | null
          id?: number
          service_code: string
          service_name: string
          user_id?: string | null
          valid_until: string
        }
        Update: {
          amount?: number
          breakdown?: Json
          carrier?: string
          cart_hash?: string
          created_at?: string
          currency?: string
          eta_days?: number | null
          id?: number
          service_code?: string
          service_name?: string
          user_id?: string | null
          valid_until?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          preferences: Json | null
          shipping_address: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          preferences?: Json | null
          shipping_address?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          preferences?: Json | null
          shipping_address?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vcards: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          job_title: string | null
          notes: string | null
          phone: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          job_title?: string | null
          notes?: string | null
          phone?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          job_title?: string | null
          notes?: string | null
          phone?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      view_history: {
        Row: {
          id: number
          product_id: number
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: number
          product_id: number
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "view_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_card_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "view_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      product_card_view: {
        Row: {
          brand: string | null
          category_id: number | null
          description: string | null
          discount_percentage: number | null
          dolar_price: number | null
          height_cm: number | null
          id: number | null
          length_cm: number | null
          main_image_url: string | null
          name: string | null
          sku: string | null
          weight_kg: number | null
          width_cm: number | null
        }
        Insert: {
          brand?: string | null
          category_id?: number | null
          description?: string | null
          discount_percentage?: number | null
          dolar_price?: number | null
          height_cm?: number | null
          id?: number | null
          length_cm?: number | null
          main_image_url?: never
          name?: never
          sku?: string | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Update: {
          brand?: string | null
          category_id?: number | null
          description?: string | null
          discount_percentage?: number | null
          dolar_price?: number | null
          height_cm?: number | null
          id?: number | null
          length_cm?: number | null
          main_image_url?: never
          name?: never
          sku?: string | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

// ProductSnapshot type for storing product information in snapshots
export interface ProductSnapshot {
  id: number;
  name: string;
  image_url?: string;
  price?: number;
  dolar_price?: number;
  sku?: string;
  description?: string;
}

export const Constants = {
  public: {
    Enums: {},
  },
} as const
