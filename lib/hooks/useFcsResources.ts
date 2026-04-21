'use client';

import useSWR from 'swr';
import { useApiList } from '@/lib/hooks/useApiList';
import type { ProductionLine, ProductionPlan } from '@/lib/types';

interface FcsInventoryItem {
  id: string;
  item_code: string;
  item_name: string;
  unit: string;
  quantity: number;
  safety_stock: number;
  status: 'normal' | 'low' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

interface FcsProgressSummary {
  total_orders: number;
  completed_orders: number;
  in_progress_orders: number;
  pending_orders: number;
  completion_rate: number;
}

export function useFcsPlans(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<ProductionPlan>('/api/fcs/plans', params);
  return {
    plans: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}

export function useFcsLines(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<ProductionLine>('/api/fcs/lines', params);
  return {
    lines: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}

export function useFcsInventory(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<FcsInventoryItem>('/api/fcs/inventory', params);
  return {
    inventory: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}

export function useFcsProgress() {
  const fetcher = async () => {
    const res = await fetch('/api/fcs/progress');
    if (!res.ok) throw new Error('Failed to fetch progress');
    const data = await res.json() as { success: boolean; data: FcsProgressSummary };
    return data.data;
  };

  const { data, error, isLoading, mutate } = useSWR('/api/fcs/progress', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  return {
    progress: data as FcsProgressSummary | undefined,
    isLoading,
    error: (error as Error | undefined)?.message,
    mutate,
  };
}
