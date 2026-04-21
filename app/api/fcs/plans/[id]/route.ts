import { NextRequest, NextResponse } from 'next/server';
import type { ProductionPlan } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

const VALID_STATUS = ['draft', 'scheduled', 'in_progress', 'completed'];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { data, error } = await auth.supabase.from('production_plans').select('*').eq('id', id).single();

  if (error || !data) return jsonError('Plan not found', 404);
  return NextResponse.json({ success: true, data: data as ProductionPlan });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await request.json();

  if (body.status && !VALID_STATUS.includes(body.status)) {
    return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
  }

  if (body.start_time && body.end_time && new Date(body.start_time) > new Date(body.end_time)) {
    return jsonError('start_time must be before end_time', 400);
  }

  const payload: Record<string, unknown> = {
    ...body,
    plan_no: typeof body.plan_no === 'string' ? body.plan_no.trim() : body.plan_no,
    assigned_worker: typeof body.assigned_worker === 'string' ? body.assigned_worker.trim() : body.assigned_worker,
  };

  const { data, error } = await auth.supabase.from('production_plans').update(payload).eq('id', id).select('*').single();

  if (error || !data) return jsonError(error?.message || 'Failed to update plan', 400);
  return NextResponse.json({ success: true, data: data as ProductionPlan });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { error } = await auth.supabase.from('production_plans').delete().eq('id', id);

  if (error) return jsonError(error.message || 'Failed to delete plan', 400);
  return NextResponse.json({ success: true });
}
