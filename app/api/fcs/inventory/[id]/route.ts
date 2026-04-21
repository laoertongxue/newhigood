import { NextRequest, NextResponse } from 'next/server';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

interface FcsInventoryItem {
  id: string;
  item_code: string;
  item_name: string;
  unit: string;
  quantity: number;
  safety_stock: number;
  status: 'normal' | 'low' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

const VALID_STATUS = ['normal', 'low', 'out_of_stock'];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { data, error } = await auth.supabase.from('fcs_inventory').select('*').eq('id', id).single();

  if (error || !data) return jsonError('Inventory item not found', 404);
  return NextResponse.json({ success: true, data: data as FcsInventoryItem });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await request.json();

  if (body.quantity !== undefined && (typeof body.quantity !== 'number' || body.quantity < 0)) {
    return jsonError('quantity must be a non-negative number', 400);
  }

  if (body.safety_stock !== undefined && (typeof body.safety_stock !== 'number' || body.safety_stock < 0)) {
    return jsonError('safety_stock must be a non-negative number', 400);
  }

  if (body.status && !VALID_STATUS.includes(body.status)) {
    return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
  }

  const payload: Record<string, unknown> = {
    ...body,
    item_code: typeof body.item_code === 'string' ? body.item_code.trim() : body.item_code,
    item_name: typeof body.item_name === 'string' ? body.item_name.trim() : body.item_name,
    unit: typeof body.unit === 'string' ? body.unit.trim() : body.unit,
  };

  const { data, error } = await auth.supabase.from('fcs_inventory').update(payload).eq('id', id).select('*').single();

  if (error || !data) return jsonError(error?.message || 'Failed to update inventory item', 400);
  return NextResponse.json({ success: true, data: data as FcsInventoryItem });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { error } = await auth.supabase.from('fcs_inventory').delete().eq('id', id);

  if (error) return jsonError(error.message || 'Failed to delete inventory item', 400);
  return NextResponse.json({ success: true });
}
