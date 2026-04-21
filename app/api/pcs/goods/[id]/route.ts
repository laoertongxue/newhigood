import { NextRequest, NextResponse } from 'next/server';
import type { Goods, GoodsCategory } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

const VALID_CATEGORY: GoodsCategory[] = ['fabric', 'accessory', 'component', 'other'];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { data, error } = await auth.supabase.from('pcs_goods').select('*').eq('id', id).single();

  if (error || !data) return jsonError('Goods not found', 404);
  return NextResponse.json({ success: true, data: data as Goods });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await request.json();

  if (body.category && !VALID_CATEGORY.includes(body.category as GoodsCategory)) {
    return jsonError(`Invalid category. Must be one of: ${VALID_CATEGORY.join(', ')}`, 400);
  }

  if (body.price !== undefined && (typeof body.price !== 'number' || body.price < 0)) {
    return jsonError('price must be a non-negative number', 400);
  }

  if (body.stock_quantity !== undefined && (typeof body.stock_quantity !== 'number' || body.stock_quantity < 0)) {
    return jsonError('stock_quantity must be a non-negative number', 400);
  }

  const payload: Record<string, unknown> = {
    ...body,
    goods_code: typeof body.goods_code === 'string' ? body.goods_code.trim() : body.goods_code,
    goods_name: typeof body.goods_name === 'string' ? body.goods_name.trim() : body.goods_name,
    supplier: typeof body.supplier === 'string' ? body.supplier.trim() : body.supplier,
  };

  const { data, error } = await auth.supabase.from('pcs_goods').update(payload).eq('id', id).select('*').single();
  if (error || !data) return jsonError(error?.message || 'Failed to update goods', 400);

  return NextResponse.json({ success: true, data: data as Goods });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { error } = await auth.supabase.from('pcs_goods').delete().eq('id', id);

  if (error) return jsonError(error.message || 'Failed to delete goods', 400);
  return NextResponse.json({ success: true });
}
