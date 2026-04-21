import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

const VALID_ROLES = ['admin', 'manager', 'operator'];
const VALID_SUBSYSTEMS = ['fcs', 'pcs', 'pda'];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  if (auth.userId !== id && auth.profile.role === 'operator') {
    return jsonError('Forbidden', 403);
  }

  const { data, error } = await auth.supabase.from('users').select('*').eq('id', id).single();

  if (error || !data) return jsonError('User not found', 404);
  return NextResponse.json({ success: true, data: data as User });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const body = await request.json();

  const isSelf = auth.userId === id;
  if (!isSelf && auth.profile.role !== 'admin' && auth.profile.role !== 'manager') {
    return jsonError('Forbidden', 403);
  }

  if (body.role && !VALID_ROLES.includes(body.role)) {
    return jsonError(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`, 400);
  }

  if (body.subsystems) {
    if (
      !Array.isArray(body.subsystems) ||
      body.subsystems.some((item: string) => !VALID_SUBSYSTEMS.includes(item))
    ) {
      return jsonError(`Invalid subsystems. Must be in: ${VALID_SUBSYSTEMS.join(', ')}`, 400);
    }
  }

  if ((body.role || body.subsystems) && auth.profile.role === 'operator') {
    return jsonError('Forbidden', 403);
  }

  const payload: Record<string, unknown> = {};
  if (typeof body.name === 'string') payload.name = body.name.trim();
  if (typeof body.avatar_url === 'string') payload.avatar_url = body.avatar_url.trim();
  if (body.role) payload.role = body.role;
  if (body.subsystems) payload.subsystems = body.subsystems;

  const { data, error } = await auth.supabase.from('users').update(payload).eq('id', id).select('*').single();

  if (error || !data) return jsonError(error?.message || 'Failed to update user', 400);
  return NextResponse.json({ success: true, data: data as User });
}
