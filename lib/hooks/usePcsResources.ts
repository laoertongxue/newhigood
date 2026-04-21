'use client';

import { useApiList } from '@/lib/hooks/useApiList';
import type { CoordinationOrder, Goods, GoodsCategoryItem, InventoryAllocation } from '@/lib/types';

export function usePcsGoods(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<Goods>('/api/pcs/goods', params);
  return {
    goods: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}

export function usePcsCategories(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<GoodsCategoryItem>('/api/pcs/categories', params);
  return {
    categories: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}

export function usePcsCoordination(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<CoordinationOrder>('/api/pcs/coordination', params);
  return {
    coordinationOrders: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}

export function usePcsAllocation(params: Record<string, string | number | undefined> = {}) {
  const state = useApiList<InventoryAllocation>('/api/pcs/allocation', params);
  return {
    allocations: state.items,
    pagination: state.pagination,
    isLoading: state.isLoading,
    error: state.error,
    mutate: state.mutate,
  };
}
