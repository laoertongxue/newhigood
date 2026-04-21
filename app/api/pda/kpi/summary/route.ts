import { NextRequest, NextResponse } from 'next/server';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('pda');
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period');

    let query = auth.supabase.from('pda_kpi_metrics').select('metric_name, metric_value');
    if (period && period.trim()) query = query.eq('period', period);

    const { data, error } = await query;
    if (error) return jsonError(error.message || 'Failed to fetch KPI summary', 400);

    const totalMetrics = (data || []).length;
    const averageMetricValue = totalMetrics
      ? Number(((data || []).reduce((sum, item) => sum + Number(item.metric_value || 0), 0) / totalMetrics).toFixed(4))
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        total_metrics: totalMetrics,
        average_metric_value: averageMetricValue,
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
