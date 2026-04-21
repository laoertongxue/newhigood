import { NextRequest } from 'next/server';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('pda');
    if (auth instanceof Response) return auth;

    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');

    let query = auth.supabase
      .from('pda_production_data')
      .select('id, order_id, data_type, value, unit, recorded_by, recorded_at, created_at')
      .order('recorded_at', { ascending: false });

    if (dateFrom && dateFrom.trim()) query = query.gte('recorded_at', dateFrom);
    if (dateTo && dateTo.trim()) query = query.lte('recorded_at', dateTo);

    const { data, error } = await query;
    if (error) return jsonError(error.message || 'Failed to export data', 400);

    const headers = ['id', 'order_id', 'data_type', 'value', 'unit', 'recorded_by', 'recorded_at', 'created_at'];
    const csvRows = [headers.join(',')];

    for (const row of data || []) {
      const values = headers.map((key) => {
        const value = row[key as keyof typeof row];
        const encoded = String(value ?? '').replaceAll('"', '""');
        return `"${encoded}"`;
      });
      csvRows.push(values.join(','));
    }

    const csv = csvRows.join('\n');

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="pda-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
