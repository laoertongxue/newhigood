import { NextRequest, NextResponse } from 'next/server';
import type { DataType, ProductionData } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

const VALID_DATA_TYPES: DataType[] = ['temperature', 'humidity', 'pressure', 'quantity', 'weight', 'other'];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pda');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { data, error } = await auth.supabase.from('pda_production_data').select('*').eq('id', id).single();

  if (error || !data) return jsonError('Production data not found', 404);
  return NextResponse.json({ success: true, data: data as ProductionData });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pda');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await request.json();

  if (body.data_type && !VALID_DATA_TYPES.includes(body.data_type as DataType)) {
    return jsonError(`Invalid data_type. Must be one of: ${VALID_DATA_TYPES.join(', ')}`, 400);
  }

  if (body.value !== undefined && typeof body.value !== 'number') {
    return jsonError('value must be a number', 400);
  }

  const payload: Record<string, unknown> = {
    ...body,
    unit: typeof body.unit === 'string' ? body.unit.trim() : body.unit,
    recorded_by: typeof body.recorded_by === 'string' ? body.recorded_by.trim() : body.recorded_by,
  };

  const { data, error } = await auth.supabase.from('pda_production_data').update(payload).eq('id', id).select('*').single();

  if (error || !data) return jsonError(error?.message || 'Failed to update production data', 400);
  return NextResponse.json({ success: true, data: data as ProductionData });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pda', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { error } = await auth.supabase.from('pda_production_data').delete().eq('id', id);

  if (error) return jsonError(error.message || 'Failed to delete production data', 400);
  return NextResponse.json({ success: true });
}
