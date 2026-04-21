import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/db/supabase-server';
import { validateLoginForm } from '@/lib/auth/validation';
import { getAuthErrorMessage } from '@/lib/auth/errors';

/**
 * POST /api/auth/signin
 * Sign in with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    const validation = validateLoginForm(email, password);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: getAuthErrorMessage(error) },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    // Get user profile from custom users table
    let { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Backfill profile for old accounts that only exist in auth.users
    if (!userProfile) {
      const fallbackName = data.user.user_metadata?.name || data.user.email?.split('@')[0] || '用户';
      const { data: createdProfile, error: profileCreateError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: fallbackName,
            role: 'operator',
            subsystems: ['fcs', 'pcs', 'pda'],
          },
        ])
        .select('*')
        .single();

      if (!profileCreateError) {
        userProfile = createdProfile;
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name: userProfile?.name || data.user.user_metadata?.name || '',
        avatar_url: userProfile?.avatar_url,
        role: userProfile?.role || 'operator',
        subsystems: userProfile?.subsystems || ['fcs', 'pcs', 'pda'],
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        expires_at: data.session.expires_at,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
