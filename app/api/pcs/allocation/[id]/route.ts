import { NextRequest, NextResponse } from 'next/server';
import type { InventoryAllocation, InventoryAllocationStatus } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

const VALID_STATUS: InventoryAllocationStatus[] = ['allocated', 'released', 'cancelled'];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { data, error } = await auth.supabase.from('pcs_inventory_allocations').select('*').eq('id', id).single();

  if (error || !data) return jsonError('Allocation not found', 404);
  return NextResponse.json({ success: true, data: data as InventoryAllocation });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await request.json();

  if (body.allocated_quantity !== undefined && (typeof body.allocated_quantity !== 'number' || body.allocated_quantity <= 0)) {
    return jsonError('allocated_quantity must be a positive number', 400);
  }

  if (body.status && !VALID_STATUS.includes(body.status as InventoryAllocationStatus)) {
    return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
  }

  const payload: Record<string, unknown> = {
    ...body,
    warehouse: typeof body.warehouse === 'string' ? body.warehouse.trim() : body.warehouse,
  };

  const { data, error } = await auth.supabase.from('pcs_inventory_allocations').update(payload).eq('id', id).select('*').single();
  if (error || !data) return jsonError(error?.message || 'Failed to update allocation', 400);

  return NextResponse.json({ success: true, data: data as InventoryAllocation });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { error } = await auth.supabase.from('pcs_inventory_allocations').delete().eq('id', id);

  if (error) return jsonError(error.message || 'Failed to delete allocation', 400);
  return NextResponse.json({ success: true });
}
