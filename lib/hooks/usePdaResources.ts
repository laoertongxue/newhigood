'use client';

import useSWR from 'swr';
import { useApiList } from '@/lib/hooks/useApiList';
import type { DataAnalysisReport, KpiMetric, ProductionData } from '@/lib/types';

interface KpiSummary {
  total_metrics: number;
  average_metric_value: number;
}

export function usePdaData(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<ProductionData>('/api/pda/data', params);
  return {
    dataRows: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}

export function usePdaAnalysis(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<DataAnalysisReport>('/api/pda/analysis', params);
  return {
    reports: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}

export function usePdaKpi(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<KpiMetric>('/api/pda/kpi', params);
  return {
    metrics: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}

export function usePdaKpiSummary(period?: string) {
  const url = period ? `/api/pda/kpi/summary?period=${encodeURIComponent(period)}` : '/api/pda/kpi/summary';
  const fetcher = async (requestUrl: string) => {
    const res = await fetch(requestUrl);
    if (!res.ok) throw new Error('Failed to fetch KPI summary');
    const body = await res.json() as { success: boolean; data: KpiSummary };
    return body.data;
  };

  const { data, error, isLoading, mutate } = useSWR<KpiSummary>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  return {
    summary: data,
    isLoading,
    error: error?.message,
    mutate,
  };
}
