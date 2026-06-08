import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { assertAdminRequest } from '@/lib/checkout/security';
import {
  ensureUniqueProductName,
  fetchAdminProduct,
  parseProductPayload,
  productPayloadToUpdate,
  setProductInventory,
} from '@/lib/admin/products';

type Params = Promise<{ productId: string }>;

function adminErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unexpected admin API error.';
  const status = message.includes('Unauthorized') ? 403 : message.includes('already exists') ? 409 : 400;
  return NextResponse.json({ error: message }, { status });
}

function parseProductId(value: string) {
  const productId = Number(value);
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error('Invalid product id.');
  }
  return productId;
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    await assertAdminRequest();
    const { productId: rawProductId } = await params;
    const productId = parseProductId(rawProductId);
    const payload = parseProductPayload(await request.json());
    const updateRecord = productPayloadToUpdate(payload);

    if (updateRecord.name) {
      await ensureUniqueProductName(updateRecord.name, productId);
    }

    const { error } = await supabaseServer
      .from('products')
      .update(updateRecord)
      .eq('id', productId);

    if (error) {
      throw new Error(error.message);
    }

    await setProductInventory(productId, payload.inventory_quantity);
    const product = await fetchAdminProduct(productId);

    return NextResponse.json({ product });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    await assertAdminRequest();
    const { productId: rawProductId } = await params;
    const productId = parseProductId(rawProductId);
    const mode = new URL(request.url).searchParams.get('mode') || 'archive';

    if (mode !== 'hard') {
      const { error } = await supabaseServer
        .from('products')
        .update({ is_active: false, modified_at: new Date().toISOString() })
        .eq('id', productId);

      if (error) {
        throw new Error(error.message);
      }

      const product = await fetchAdminProduct(productId);
      return NextResponse.json({ product, deleted: false });
    }

    const { error: inventoryError } = await supabaseServer
      .from('inventory')
      .delete()
      .eq('product_id', productId);

    if (inventoryError) {
      throw new Error(inventoryError.message);
    }

    const { error: productError } = await supabaseServer
      .from('products')
      .delete()
      .eq('id', productId);

    if (productError) {
      const status = productError.code === '23503' ? 409 : 400;
      return NextResponse.json(
        {
          error:
            status === 409
              ? 'This product is referenced by historical records. Archive it instead.'
              : productError.message,
        },
        { status }
      );
    }

    return NextResponse.json({ deleted: true, productId });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
