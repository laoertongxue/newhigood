import { NextRequest, NextResponse } from 'next/server';
import type { ListResponse, User } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(undefined, 'manager');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let query = auth.supabase.from('users').select('*', { count: 'exact' });

    if (role && role.trim()) query = query.eq('role', role);
    if (search && search.trim()) query = query.or(`email.ilike.%${search.trim()}%,name.ilike.%${search.trim()}%`);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    if (error) return jsonError(error.message || 'Failed to fetch users', 400);

    const response: ListResponse<User> = {
      items: (data || []) as User[],
      pagination: buildPagination(page, limit, count || 0),
    };

    return NextResponse.json(response);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
