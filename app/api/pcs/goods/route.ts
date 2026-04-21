import { NextRequest, NextResponse } from 'next/server';
import type { Goods, GoodsCategory, ListResponse } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

const VALID_CATEGORY: GoodsCategory[] = ['fabric', 'accessory', 'component', 'other'];

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('pcs');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = auth.supabase.from('pcs_goods').select('*', { count: 'exact' });

    if (category && category.trim()) query = query.eq('category', category);
    if (search && search.trim()) {
      query = query.or(`goods_code.ilike.%${search.trim()}%,goods_name.ilike.%${search.trim()}%,supplier.ilike.%${search.trim()}%`);
    }

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    if (error) return jsonError(error.message || 'Failed to fetch goods', 400);

    const response: ListResponse<Goods> = {
      items: (data || []) as Goods[],
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
    const requiredFields = ['goods_code', 'goods_name', 'category', 'supplier', 'price', 'stock_quantity'];
    const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
    if (missingFields.length) return jsonError(`Missing required fields: ${missingFields.join(', ')}`, 400);

    if (!VALID_CATEGORY.includes(body.category as GoodsCategory)) {
      return jsonError(`Invalid category. Must be one of: ${VALID_CATEGORY.join(', ')}`, 400);
    }

    if (typeof body.price !== 'number' || body.price < 0) return jsonError('price must be a non-negative number', 400);
    if (typeof body.stock_quantity !== 'number' || body.stock_quantity < 0) {
      return jsonError('stock_quantity must be a non-negative number', 400);
    }

    const payload = {
      goods_code: String(body.goods_code).trim(),
      goods_name: String(body.goods_name).trim(),
      category: body.category,
      supplier: String(body.supplier).trim(),
      price: body.price,
      stock_quantity: body.stock_quantity,
    };

    const { data, error } = await auth.supabase.from('pcs_goods').insert([payload]).select('*').single();
    if (error || !data) return jsonError(error?.message || 'Failed to create goods', 400);

    return NextResponse.json({ success: true, data: data as Goods }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
