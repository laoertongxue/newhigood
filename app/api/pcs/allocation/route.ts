import { NextRequest, NextResponse } from 'next/server';
import type { InventoryAllocation, InventoryAllocationStatus, ListResponse } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

const VALID_STATUS: InventoryAllocationStatus[] = ['allocated', 'released', 'cancelled'];

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('pcs');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const status = searchParams.get('status');
    const warehouse = searchParams.get('warehouse');

    let query = auth.supabase.from('pcs_inventory_allocations').select('*', { count: 'exact' });
    if (status && status.trim()) query = query.eq('status', status);
    if (warehouse && warehouse.trim()) query = query.ilike('warehouse', `%${warehouse.trim()}%`);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) return jsonError(error.message || 'Failed to fetch allocations', 400);

    const response: ListResponse<InventoryAllocation> = {
      items: (data || []) as InventoryAllocation[],
      pagination: buildPagination(page, limit, count || 0),
    };

    return NextResponse.json(response);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth('pcs', 'manager');
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const requiredFields = ['goods_id', 'allocated_quantity', 'warehouse'];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length) return jsonError(`Missing required fields: ${missingFields.join(', ')}`, 400);

    if (typeof body.allocated_quantity !== 'number' || body.allocated_quantity <= 0) {
      return jsonError('allocated_quantity must be a positive number', 400);
    }

    if (body.status && !VALID_STATUS.includes(body.status as InventoryAllocationStatus)) {
      return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
    }

    const payload = {
      goods_id: body.goods_id,
      coordination_order_id: body.coordination_order_id || null,
      allocated_quantity: body.allocated_quantity,
      warehouse: String(body.warehouse).trim(),
      status: body.status || 'allocated',
    };

    const { data, error } = await auth.supabase.from('pcs_inventory_allocations').insert([payload]).select('*').single();
    if (error || !data) return jsonError(error?.message || 'Failed to create allocation', 400);

    return NextResponse.json({ success: true, data: data as InventoryAllocation }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
