import { NextRequest, NextResponse } from 'next/server';
import type { ProductionOrder, UpdateProductionOrderDTO } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

const VALID_STATUS = ['pending', 'in_progress', 'completed', 'cancelled'];
const VALID_PRIORITY = ['low', 'normal', 'high', 'urgent'];

function validateUpdateBody(body: UpdateProductionOrderDTO) {
  if (body.quantity !== undefined && (typeof body.quantity !== 'number' || body.quantity < 0)) {
    return 'Quantity must be a non-negative number';
  }

  if (body.status && !VALID_STATUS.includes(body.status)) {
    return `Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`;
  }

  if (body.priority && !VALID_PRIORITY.includes(body.priority)) {
    return `Invalid priority. Must be one of: ${VALID_PRIORITY.join(', ')}`;
  }

  if (body.start_date && Number.isNaN(new Date(body.start_date).getTime())) {
    return 'Invalid start_date format';
  }

  if (body.end_date && Number.isNaN(new Date(body.end_date).getTime())) {
    return 'Invalid end_date format';
  }

  if (body.start_date && body.end_date && new Date(body.start_date) > new Date(body.end_date)) {
    return 'start_date must be before end_date';
  }

  return null;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;

  const { data, error } = await auth.supabase
    .from('production_orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return jsonError('Order not found', 404);
  }

  return NextResponse.json({ success: true, data: data as ProductionOrder });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = (await request.json()) as UpdateProductionOrderDTO;

  const validationError = validateUpdateBody(body);
  if (validationError) {
    return jsonError(validationError, 400);
  }

  const payload: Record<string, unknown> = { ...body };

  if (typeof payload.order_no === 'string') payload.order_no = payload.order_no.trim();
  if (typeof payload.customer_name === 'string') payload.customer_name = payload.customer_name.trim();
  if (typeof payload.product_name === 'string') payload.product_name = payload.product_name.trim();

  const { data, error } = await auth.supabase
    .from('production_orders')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    return jsonError(error?.message || 'Failed to update order', 400);
  }

  return NextResponse.json({ success: true, data: data as ProductionOrder });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;

  const { error } = await auth.supabase.from('production_orders').delete().eq('id', id);

  if (error) {
    return jsonError(error.message || 'Failed to delete order', 400);
  }

  return NextResponse.json({ success: true });
}
