import { NextResponse } from 'next/server';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

export async function GET() {
  try {
    const auth = await requireAuth('fcs');
    if (auth instanceof NextResponse) return auth;

    const [{ count: totalOrders }, { count: completedOrders }, { count: inProgressOrders }, { count: pendingOrders }] =
      await Promise.all([
        auth.supabase.from('production_orders').select('*', { count: 'exact', head: true }),
        auth.supabase.from('production_orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        auth.supabase.from('production_orders').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        auth.supabase.from('production_orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

    const completionRate = totalOrders ? Number((((completedOrders || 0) / totalOrders) * 100).toFixed(2)) : 0;

    return NextResponse.json({
      success: true,
      data: {
        total_orders: totalOrders || 0,
        completed_orders: completedOrders || 0,
        in_progress_orders: inProgressOrders || 0,
        pending_orders: pendingOrders || 0,
        completion_rate: completionRate,
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
