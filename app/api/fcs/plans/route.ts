import { NextRequest, NextResponse } from 'next/server';
import type { ListResponse, ProductionPlan } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

const VALID_STATUS = ['draft', 'scheduled', 'in_progress', 'completed'];

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('fcs');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = auth.supabase.from('production_plans').select('*', { count: 'exact' });

    if (status && status.trim()) query = query.eq('status', status);
    if (search && search.trim()) query = query.or(`plan_no.ilike.%${search.trim()}%,assigned_worker.ilike.%${search.trim()}%`);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    if (error) return jsonError(error.message || 'Failed to fetch plans', 400);

    const response: ListResponse<ProductionPlan> = {
      items: (data || []) as ProductionPlan[],
      pagination: buildPagination(page, limit, count || 0),
    };

    return NextResponse.json(response);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth('fcs');
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const requiredFields = ['order_id', 'plan_no', 'start_time', 'end_time', 'assigned_worker'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length) {
      return jsonError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    if (body.status && !VALID_STATUS.includes(body.status)) {
      return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
    }

    if (new Date(body.start_time) > new Date(body.end_time)) {
      return jsonError('start_time must be before end_time', 400);
    }

    const payload = {
      order_id: body.order_id,
      plan_no: String(body.plan_no).trim(),
      start_time: body.start_time,
      end_time: body.end_time,
      assigned_worker: String(body.assigned_worker).trim(),
      line_id: body.line_id || null,
      status: body.status || 'draft',
    };

    const { data, error } = await auth.supabase.from('production_plans').insert([payload]).select('*').single();

    if (error || !data) return jsonError(error?.message || 'Failed to create plan', 400);

    return NextResponse.json({ success: true, data: data as ProductionPlan }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
