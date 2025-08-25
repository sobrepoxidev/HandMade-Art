import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = supabaseServer
      .from('interest_requests')
      .select(`
        *,
        interest_request_items (
          id,
          product_id,
          quantity,
          unit_price_crc,
          unit_price_usd,
          product_snapshot,
          products (
            id,
            name,
            name_es,
            name_en,
            media,
            colon_price,
            dolar_price
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Filtrar por estado si se proporciona
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Filtrar por búsqueda si se proporciona
    if (search) {
      query = query.or(`requester_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: quotes, error } = await query;

    if (error) {
      console.error('Error fetching quotes:', error);
      return NextResponse.json(
        { error: 'Error fetching quotes' },
        { status: 500 }
      );
    }

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('Error in quotes API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}