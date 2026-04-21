import { NextRequest, NextResponse } from 'next/server';
import type { CreateProductionDataDTO, DataType, ListResponse, ProductionData } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

const VALID_DATA_TYPES: DataType[] = ['temperature', 'humidity', 'pressure', 'quantity', 'weight', 'other'];

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('pda');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const dataType = searchParams.get('data_type');
    const orderId = searchParams.get('order_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    let query = auth.supabase.from('pda_production_data').select('*', { count: 'exact' });

    if (dataType && dataType.trim()) query = query.eq('data_type', dataType);
    if (orderId && orderId.trim()) query = query.eq('order_id', orderId);
    if (dateFrom && dateFrom.trim()) query = query.gte('recorded_at', dateFrom);
    if (dateTo && dateTo.trim()) query = query.lte('recorded_at', dateTo);

    const { data, error, count } = await query.order('recorded_at', { ascending: false }).range(offset, offset + limit - 1);

    if (error) return jsonError(error.message || 'Failed to fetch production data', 400);

    const response: ListResponse<ProductionData> = {
      items: (data || []) as ProductionData[],
      pagination: buildPagination(page, limit, count || 0),
    };

    return NextResponse.json(response);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth('pda');
    if (auth instanceof NextResponse) return auth;

    const body = (await request.json()) as CreateProductionDataDTO & { recorded_by?: string; recorded_at?: string };
    const requiredFields: Array<keyof CreateProductionDataDTO> = ['order_id', 'data_type', 'value', 'unit'];
    const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');

    if (missingFields.length) return jsonError(`Missing required fields: ${missingFields.join(', ')}`, 400);

    if (!VALID_DATA_TYPES.includes(body.data_type)) {
      return jsonError(`Invalid data_type. Must be one of: ${VALID_DATA_TYPES.join(', ')}`, 400);
    }

    if (typeof body.value !== 'number') {
      return jsonError('value must be a number', 400);
    }

    const payload = {
      order_id: body.order_id,
      data_type: body.data_type,
      value: body.value,
      unit: String(body.unit).trim(),
      recorded_by: body.recorded_by ? String(body.recorded_by).trim() : auth.profile.name,
      recorded_at: body.recorded_at || new Date().toISOString(),
    };

    const { data, error } = await auth.supabase.from('pda_production_data').insert([payload]).select('*').single();

    if (error || !data) return jsonError(error?.message || 'Failed to create production data', 400);
    return NextResponse.json({ success: true, data: data as ProductionData }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
