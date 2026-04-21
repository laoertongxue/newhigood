import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/db/supabase-server';
import type { PaginationInfo, SubsystemType, User } from '@/lib/types';

export interface AuthContext {
  userId: string;
  profile: User;
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
}

const ROLE_LEVEL: Record<User['role'], number> = {
  operator: 1,
  manager: 2,
  admin: 3,
};

export function jsonError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function parsePagination(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset, searchParams };
}

export function buildPagination(page: number, limit: number, total: number): PaginationInfo {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function requireAuth(
  subsystem?: SubsystemType,
  minimumRole: User['role'] = 'operator'
): Promise<AuthContext | NextResponse> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return jsonError('Unauthorized', 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return jsonError('User profile not found', 403);
  }

  const typedProfile = profile as User;

  if (subsystem && !typedProfile.subsystems.includes(subsystem)) {
    return jsonError('Forbidden', 403);
  }

  if (ROLE_LEVEL[typedProfile.role] < ROLE_LEVEL[minimumRole]) {
    return jsonError('Forbidden', 403);
  }

  return {
    userId: user.id,
    profile: typedProfile,
    supabase,
  };
}
