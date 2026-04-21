import { NextRequest, NextResponse } from 'next/server';
import type { CoordinationOrder, CoordinationOrderStatus } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

const VALID_STATUS: CoordinationOrderStatus[] = ['draft', 'submitted', 'approved', 'rejected', 'completed'];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { data, error } = await auth.supabase.from('pcs_coordination_orders').select('*').eq('id', id).single();

  if (error || !data) return jsonError('Coordination order not found', 404);
  return NextResponse.json({ success: true, data: data as CoordinationOrder });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await request.json();

  if (body.status && !VALID_STATUS.includes(body.status as CoordinationOrderStatus)) {
    return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
  }

  if (body.quantity !== undefined && (typeof body.quantity !== 'number' || body.quantity <= 0)) {
    return jsonError('quantity must be a positive number', 400);
  }

  const payload: Record<string, unknown> = {
    ...body,
    coordination_no: typeof body.coordination_no === 'string' ? body.coordination_no.trim() : body.coordination_no,
  };

  const { data, error } = await auth.supabase.from('pcs_coordination_orders').update(payload).eq('id', id).select('*').single();
  if (error || !data) return jsonError(error?.message || 'Failed to update coordination order', 400);

  return NextResponse.json({ success: true, data: data as CoordinationOrder });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { error } = await auth.supabase.from('pcs_coordination_orders').delete().eq('id', id);

  if (error) return jsonError(error.message || 'Failed to delete coordination order', 400);
  return NextResponse.json({ success: true });
}
