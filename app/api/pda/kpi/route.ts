import { NextRequest, NextResponse } from 'next/server';
import type { KpiMetric, ListResponse } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('pda');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const period = searchParams.get('period');

    let query = auth.supabase.from('pda_kpi_metrics').select('*', { count: 'exact' });
    if (period && period.trim()) query = query.eq('period', period);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) return jsonError(error.message || 'Failed to fetch KPI metrics', 400);

    const response: ListResponse<KpiMetric> = {
      items: (data || []) as KpiMetric[],
      pagination: buildPagination(page, limit, count || 0),
    };

    return NextResponse.json(response);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth('pda', 'manager');
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const requiredFields = ['metric_name', 'metric_value', 'period'];
    const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');

    if (missingFields.length) return jsonError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    if (typeof body.metric_value !== 'number') return jsonError('metric_value must be a number', 400);

    const payload = {
      metric_name: String(body.metric_name).trim(),
      metric_value: body.metric_value,
      period: String(body.period).trim(),
      subsystem_type: body.subsystem_type ? String(body.subsystem_type).trim() : 'pda',
    };

    const { data, error } = await auth.supabase.from('pda_kpi_metrics').insert([payload]).select('*').single();
    if (error || !data) return jsonError(error?.message || 'Failed to create KPI metric', 400);

    return NextResponse.json({ success: true, data: data as KpiMetric }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
