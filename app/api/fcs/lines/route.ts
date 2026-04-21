import { NextRequest, NextResponse } from 'next/server';
import type { ListResponse, ProductionLine } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

const VALID_STATUS = ['active', 'inactive'];

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('fcs');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = auth.supabase.from('production_lines').select('*', { count: 'exact' });

    if (status && status.trim()) query = query.eq('status', status);
    if (search && search.trim()) query = query.or(`line_name.ilike.%${search.trim()}%,line_code.ilike.%${search.trim()}%`);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    if (error) return jsonError(error.message || 'Failed to fetch lines', 400);

    const response: ListResponse<ProductionLine> = {
      items: (data || []) as ProductionLine[],
      pagination: buildPagination(page, limit, count || 0),
    };

    return NextResponse.json(response);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth('fcs', 'manager');
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const requiredFields = ['line_name', 'line_code', 'capacity'];
    const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');

    if (missingFields.length) return jsonError(`Missing required fields: ${missingFields.join(', ')}`, 400);

    if (typeof body.capacity !== 'number' || body.capacity < 0) {
      return jsonError('capacity must be a non-negative number', 400);
    }

    if (body.status && !VALID_STATUS.includes(body.status)) {
      return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
    }

    const payload = {
      line_name: String(body.line_name).trim(),
      line_code: String(body.line_code).trim(),
      capacity: body.capacity,
      status: body.status || 'active',
    };

    const { data, error } = await auth.supabase.from('production_lines').insert([payload]).select('*').single();

    if (error || !data) return jsonError(error?.message || 'Failed to create line', 400);

    return NextResponse.json({ success: true, data: data as ProductionLine }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
