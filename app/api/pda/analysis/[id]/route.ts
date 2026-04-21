import { NextRequest, NextResponse } from 'next/server';
import type { DataAnalysisReport } from '@/lib/types';
import { jsonError, requireAuth } from '@/lib/api/route-utils';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pda');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { data, error } = await auth.supabase.from('pda_data_analysis_reports').select('*').eq('id', id).single();

  if (error || !data) return jsonError('Analysis report not found', 404);
  return NextResponse.json({ success: true, data: data as DataAnalysisReport });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth('pda', 'manager');
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { error } = await auth.supabase.from('pda_data_analysis_reports').delete().eq('id', id);

  if (error) return jsonError(error.message || 'Failed to delete report', 400);
  return NextResponse.json({ success: true });
}
