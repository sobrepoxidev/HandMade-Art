import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { assertAdminRequest } from '@/lib/checkout/security';
import {
  ensureUniqueProductName,
  fetchAdminProduct,
  listAdminProducts,
  parseProductPayload,
  productPayloadToRecord,
  setProductInventory,
} from '@/lib/admin/products';

function adminErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unexpected admin API error.';
  const status = message.includes('Unauthorized') ? 403 : message.includes('already exists') ? 409 : 400;
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  try {
    await assertAdminRequest();

    const [products, categoriesResult] = await Promise.all([
      listAdminProducts(),
      supabaseServer
        .from('categories')
        .select('*')
        .order('name_es', { ascending: true }),
    ]);

    if (categoriesResult.error) {
      throw new Error(categoriesResult.error.message);
    }

    return NextResponse.json({
      products,
      categories: categoriesResult.data || [],
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await assertAdminRequest();

    const payload = parseProductPayload(await request.json());
    const productRecord = productPayloadToRecord(payload);
    await ensureUniqueProductName(productRecord.name || '');

    const { data, error } = await supabaseServer
      .from('products')
      .insert(productRecord)
      .select('id')
      .single();

    if (error || !data) {
      throw new Error(error?.message || 'Product could not be created.');
    }

    await setProductInventory(data.id, payload.inventory_quantity ?? 0);
    const product = await fetchAdminProduct(data.id);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
