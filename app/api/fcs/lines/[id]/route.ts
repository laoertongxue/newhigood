import { NextRequest, NextResponse } from 'next/server';
import type { ProductionLine } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

const VALID_STATUS = ['active', 'inactive'];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { data, error } = await auth.supabase.from('production_lines').select('*').eq('id', id).single();

  if (error || !data) return jsonError('Line not found', 404);
  return NextResponse.json({ success: true, data: data as ProductionLine });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await request.json();

  if (body.capacity !== undefined && (typeof body.capacity !== 'number' || body.capacity < 0)) {
    return jsonError('capacity must be a non-negative number', 400);
  }

  if (body.status && !VALID_STATUS.includes(body.status)) {
    return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
  }

  const payload: Record<string, unknown> = {
    ...body,
    line_name: typeof body.line_name === 'string' ? body.line_name.trim() : body.line_name,
    line_code: typeof body.line_code === 'string' ? body.line_code.trim() : body.line_code,
  };

  const { data, error } = await auth.supabase.from('production_lines').update(payload).eq('id', id).select('*').single();

  if (error || !data) return jsonError(error?.message || 'Failed to update line', 400);
  return NextResponse.json({ success: true, data: data as ProductionLine });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('fcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { error } = await auth.supabase.from('production_lines').delete().eq('id', id);

  if (error) return jsonError(error.message || 'Failed to delete line', 400);
  return NextResponse.json({ success: true });
}
