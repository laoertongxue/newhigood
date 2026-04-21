import { NextRequest, NextResponse } from 'next/server';
import type { CoordinationOrder, CoordinationOrderStatus, ListResponse } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

const VALID_STATUS: CoordinationOrderStatus[] = ['draft', 'submitted', 'approved', 'rejected', 'completed'];

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('pcs');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = auth.supabase.from('pcs_coordination_orders').select('*', { count: 'exact' });
    if (status && status.trim()) query = query.eq('status', status);
    if (search && search.trim()) query = query.ilike('coordination_no', `%${search.trim()}%`);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) return jsonError(error.message || 'Failed to fetch coordination orders', 400);

    const response: ListResponse<CoordinationOrder> = {
      items: (data || []) as CoordinationOrder[],
      pagination: buildPagination(page, limit, count || 0),
    };

    return NextResponse.json(response);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth('pcs');
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const requiredFields = ['coordination_no', 'goods_id', 'quantity'];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length) return jsonError(`Missing required fields: ${missingFields.join(', ')}`, 400);

    if (typeof body.quantity !== 'number' || body.quantity <= 0) {
      return jsonError('quantity must be a positive number', 400);
    }

    if (body.status && !VALID_STATUS.includes(body.status as CoordinationOrderStatus)) {
      return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
    }

    const payload = {
      coordination_no: String(body.coordination_no).trim(),
      goods_id: body.goods_id,
      quantity: body.quantity,
      status: body.status || 'draft',
    };

    const { data, error } = await auth.supabase.from('pcs_coordination_orders').insert([payload]).select('*').single();
    if (error || !data) return jsonError(error?.message || 'Failed to create coordination order', 400);

    return NextResponse.json({ success: true, data: data as CoordinationOrder }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
