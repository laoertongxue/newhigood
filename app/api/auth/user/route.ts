import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/db/supabase-server';

/**
 * GET /api/auth/user
 * Get current authenticated user
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({
        user: null,
        session: null,
        isAuthenticated: false,
      });
    }

    // Get user profile from custom users table
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: userProfile?.name || session.user.user_metadata?.name || '',
        avatar_url: userProfile?.avatar_url,
        role: userProfile?.role || 'operator',
        subsystems: userProfile?.subsystems || ['fcs', 'pcs', 'pda'],
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
      },
      isAuthenticated: true,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      {
        user: null,
        session: null,
        isAuthenticated: false,
      },
      { status: 200 }
    );
  }
}
