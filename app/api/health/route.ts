import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

/**
 * Health check endpoint for Supabase connection
 * GET /api/health
 */
export async function GET() {
  try {
    // Test the connection by querying the auth tables
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Supabase connection failed',
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connected successfully',
      timestamp: new Date().toISOString(),
      usersCount: data?.users?.length || 0,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to Supabase',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
