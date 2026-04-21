import { NextRequest, NextResponse } from 'next/server';
import type { ListResponse } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

interface FcsInventoryItem {
  id: string;
  item_code: string;
  item_name: string;
  unit: string;
  quantity: number;
  safety_stock: number;
  status: 'normal' | 'low' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

const VALID_STATUS = ['normal', 'low', 'out_of_stock'];

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('fcs');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = auth.supabase.from('fcs_inventory').select('*', { count: 'exact' });

    if (status && status.trim()) query = query.eq('status', status);
    if (search && search.trim()) query = query.or(`item_code.ilike.%${search.trim()}%,item_name.ilike.%${search.trim()}%`);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    if (error) return jsonError(error.message || 'Failed to fetch inventory', 400);

    const response: ListResponse<FcsInventoryItem> = {
      items: (data || []) as FcsInventoryItem[],
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
    const requiredFields = ['item_code', 'item_name', 'unit'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length) return jsonError(`Missing required fields: ${missingFields.join(', ')}`, 400);

    if (body.quantity !== undefined && (typeof body.quantity !== 'number' || body.quantity < 0)) {
      return jsonError('quantity must be a non-negative number', 400);
    }

    if (body.safety_stock !== undefined && (typeof body.safety_stock !== 'number' || body.safety_stock < 0)) {
      return jsonError('safety_stock must be a non-negative number', 400);
    }

    if (body.status && !VALID_STATUS.includes(body.status)) {
      return jsonError(`Invalid status. Must be one of: ${VALID_STATUS.join(', ')}`, 400);
    }

    const payload = {
      item_code: String(body.item_code).trim(),
      item_name: String(body.item_name).trim(),
      unit: String(body.unit).trim(),
      quantity: body.quantity ?? 0,
      safety_stock: body.safety_stock ?? 0,
      status: body.status || 'normal',
    };

    const { data, error } = await auth.supabase.from('fcs_inventory').insert([payload]).select('*').single();

    if (error || !data) return jsonError(error?.message || 'Failed to create inventory item', 400);
    return NextResponse.json({ success: true, data: data as FcsInventoryItem }, { status: 201 });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
