import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/db/supabase-server';
import { validateSignupForm } from '@/lib/auth/validation';
import { getAuthErrorMessage } from '@/lib/auth/errors';

/**
 * POST /api/auth/signup
 * Register a new user
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    const validation = validateSignupForm(email, password, name);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: getAuthErrorMessage(error) },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { success: false, error: '注册失败' },
        { status: 400 }
      );
    }

    // Create user profile in custom users table
    const { error: profileError } = await supabase.from('users').insert([
      {
        id: data.user.id,
        email: data.user.email,
        name,
        role: 'operator',
        subsystems: ['fcs', 'pcs', 'pda'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { success: false, error: '用户资料创建失败，请重试' },
        { status: 500 }
      );
    }

    // Auto sign in after signup
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          name,
          role: 'operator',
          subsystems: ['fcs', 'pcs', 'pda'],
        },
        message: '注册成功，请登录',
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email || '',
        name,
        role: 'operator',
        subsystems: ['fcs', 'pcs', 'pda'],
      },
      session: {
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
        expires_in: signInData.session.expires_in,
        expires_at: signInData.session.expires_at,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { success: false, error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
