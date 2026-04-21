import { NextRequest, NextResponse } from 'next/server';
import type { GoodsCategoryItem } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { data, error } = await auth.supabase.from('pcs_categories').select('*').eq('id', id).single();

  if (error || !data) return jsonError('Category not found', 404);
  return NextResponse.json({ success: true, data: data as GoodsCategoryItem });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { id } = await context.params;

  const payload: Record<string, unknown> = {
    category_code: typeof body.category_code === 'string' ? body.category_code.trim() : body.category_code,
    category_name: typeof body.category_name === 'string' ? body.category_name.trim() : body.category_name,
  };

  const { data, error } = await auth.supabase.from('pcs_categories').update(payload).eq('id', id).select('*').single();
  if (error || !data) return jsonError(error?.message || 'Failed to update category', 400);

  return NextResponse.json({ success: true, data: data as GoodsCategoryItem });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pcs', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { error } = await auth.supabase.from('pcs_categories').delete().eq('id', id);

  if (error) return jsonError(error.message || 'Failed to delete category', 400);
  return NextResponse.json({ success: true });
}
