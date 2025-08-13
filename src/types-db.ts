interface MediaItem {
    url: string;
    type: "image" | "video";
    caption?: string;
}

interface ShippingAddress {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    phone?: string;
}

export type Database = {
    discount_codes: {
        id: number;
        code: string;
        description: string | null;
        discount_type: 'percentage' | 'fixed' | 'total_override';
        discount_value: number;
        min_purchase_amount: number;
        max_uses: number | null;
        current_uses: number;
        is_active: boolean;
        valid_from: string;
        valid_until: string | null;
        created_at: string;
        updated_at: string;
    },
    leads: {
        id: string;
        name: string;
        email: string;
        phone: string;
        entries: number;
        facebook_followed: boolean;
        instagram_followed: boolean;
        tiktok_followed: boolean;
        youtube_followed: boolean;
        kenia_basilis_followed: boolean;
        created_at: string;
      },
    cart_items: {
        id: number;
        user_id: string; // UUID
        product_id: number;
        quantity: number;
        created_at: string;
        updated_at: string;
    },
    categories: {
        id: number;
        name: string;
        name_es: string;
        name_en: string;
        parent_id: number | null;
        created_at: string;
    },
    favorites: {
        id: number;
        user_id: string; // UUID
        product_id: number;
        created_at: string;
    },
    inventory: {
        id: number;
        product_id: number;
        quantity: number;
        reserved: number; // Missing field found in DB
        updated_at: string;
    },
    newsletter_subscribers: {
        id: number;
        email: string;
        user_id: string | null; // Optional user association
        status: 'active' | 'unsubscribed';
        created_at: string;
        updated_at: string;
    },
    order_items: {
        id: number;
        order_id: number;
        product_id: number;
        quantity: number;
        price: number;
        created_at: string;
    },
    orders: {
        id: number;
        user_id: string; // UUID
        payment_method: string;
        payment_status: string;
        payment_reference: string | null;
        total_amount: number;
        created_at: string;
        updated_at: string;
        shipping_address: ShippingAddress | null;
        shipping_status: string | null;
        tracking_number: string | null;
        notes: string | null;
        // Additional shipping fields found in DB
        shipping_carrier: string | null;
        shipping_service: string | null;
        shipping_cost: number | null;
        shipping_currency: string | null;
        shipping_est_delivery: string | null;
        shipping_label_url: string | null;
        shipping_quote_id: string | null;
        shipping_last_updated: string | null;
    },
    products: {
        id: number;
        created_at: string;
        modified_at: string;
        name: string | null;
        name_es: string | null;
        name_en: string | null;
        description: string | null;
        description_en: string | null;
        media: MediaItem[] | null;
        colon_price: number | null;
        dolar_price: number | null;
        category_id: number | null;
        sku: string | null;
        brand: string | null;
        is_featured: boolean | null;
        is_active: boolean | null;
        specifications: Record<string, string | number | boolean | null> | null;
        discount_percentage: number | null;
        tags: string[] | null;
        // Additional dimension fields found in DB
        weight_kg: number | null;
        length_cm: number | null;
        width_cm: number | null;
        height_cm: number | null;
    },
    reviews: {
        id: number;
        product_id: number;
        user_id: string; // UUID
        rating: number;
        comment: string | null;
        created_at: string;
        updated_at: string;
    },
    view_history: {
        id: number;
        user_id: string; // UUID
        product_id: number;
        viewed_at: string;
    },
    user_profiles: {
        id: string; // UUID references auth.users(id)
        full_name: string | null;
        shipping_address: ShippingAddress | null;
        preferences: Record<string, unknown>;
        created_at: string;
        updated_at: string;
    },
    vcards: {
        id: string; // UUID
        user_id: string | null;
        full_name: string | null;
        email: string | null;
        phone: string | null;
        company: string | null;
        job_title: string | null;
        website: string | null;
        notes: string | null;
        created_at: string;
    }
}