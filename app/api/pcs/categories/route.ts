import { NextRequest, NextResponse } from 'next/server';
import type { GoodsCategoryItem, ListResponse } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('pcs');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const search = searchParams.get('search');

    let query = auth.supabase.from('pcs_categories').select('*', { count: 'exact' });
    if (search && search.trim()) {
      query = query.or(`category_code.ilike.%${search.trim()}%,category_name.ilike.%${search.trim()}%`);
    }

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) return jsonError(error.message || 'Failed to fetch categories', 400);

    const response: ListResponse<GoodsCategoryItem> = {
      items: (data || []) as GoodsCategoryItem[],
      pagination: buildPagination(page, limit, count || 0),
    };

    return NextResponse.json(response);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth('pcs', 'manager');
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    if (!body.category_code || !body.category_name) {
      return jsonError('Missing required fields: category_code, category_name', 400);
    }

    const payload = {
      category_code: String(body.category_code).trim(),
      category_name: String(body.category_name).trim(),
    };

    const { data, error } = await auth.supabase.from('pcs_categories').insert([payload]).select('*').single();
    if (error || !data) return jsonError(error?.message || 'Failed to create category', 400);

    return NextResponse.json({ success: true, data: data as GoodsCategoryItem }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
