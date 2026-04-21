import { NextRequest, NextResponse } from 'next/server';
import type { DataAnalysisReport, DataType, ListResponse } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

const DATA_TYPES: DataType[] = ['temperature', 'humidity', 'pressure', 'quantity', 'weight', 'other'];

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('pda');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const search = searchParams.get('search');

    let query = auth.supabase.from('pda_data_analysis_reports').select('*', { count: 'exact' });
    if (search && search.trim()) query = query.ilike('report_no', `%${search.trim()}%`);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) return jsonError(error.message || 'Failed to fetch analysis reports', 400);

    const response: ListResponse<DataAnalysisReport> = {
      items: (data || []) as DataAnalysisReport[],
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

    if (!body.start || !body.end) {
      return jsonError('Missing required fields: start, end', 400);
    }

    const { data: rows, error: queryError } = await auth.supabase
      .from('pda_production_data')
      .select('data_type, value')
      .gte('recorded_at', body.start)
      .lte('recorded_at', body.end);

    if (queryError) return jsonError(queryError.message || 'Failed to load production data', 400);

    const dataTypes = DATA_TYPES.reduce<Record<DataType, number>>((acc, item) => {
      acc[item] = 0;
      return acc;
    }, {} as Record<DataType, number>);

    const valueTotals = DATA_TYPES.reduce<Record<DataType, number>>((acc, item) => {
      acc[item] = 0;
      return acc;
    }, {} as Record<DataType, number>);

    for (const row of rows || []) {
      const key = row.data_type as DataType;
      if (!DATA_TYPES.includes(key)) continue;
      dataTypes[key] += 1;
      valueTotals[key] += Number(row.value || 0);
    }

    const averageValues = DATA_TYPES.reduce<Record<DataType, number>>((acc, item) => {
      acc[item] = dataTypes[item] > 0 ? Number((valueTotals[item] / dataTypes[item]).toFixed(4)) : 0;
      return acc;
    }, {} as Record<DataType, number>);

    const reportNo = `RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const payload = {
      report_no: reportNo,
      analysis_period: { start: body.start, end: body.end },
      summary: {
        total_records: (rows || []).length,
        data_types: dataTypes,
        average_values: averageValues,
      },
    };

    const { data, error } = await auth.supabase.from('pda_data_analysis_reports').insert([payload]).select('*').single();
    if (error || !data) return jsonError(error?.message || 'Failed to create analysis report', 400);

    return NextResponse.json({ success: true, data: data as DataAnalysisReport }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
