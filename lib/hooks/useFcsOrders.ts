'use client';

import useSWR from 'swr';
import type { ListResponse, ProductionOrder } from '@/lib/types';

type RequestError = Error & {
  status?: number;
  info?: unknown;
};

export interface FcsOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * Hook to fetch production orders from the API
 * Returns orders data, pagination info, loading state, and error
 */
export function useFcsOrders(params: FcsOrdersParams = {}) {
  // Build query string
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const url = `/api/fcs/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  // Fetch function
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('Failed to fetch orders');
      const data = await res.json();
      const requestError = error as RequestError;
      requestError.status = res.status;
      requestError.info = data;
      throw error;
    }
    return res.json() as Promise<ListResponse<ProductionOrder>>;
  };

  // SWR hook
  const { data, error, isLoading, mutate } = useSWR<ListResponse<ProductionOrder>>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 second deduping interval
    }
  );

  return {
    orders: data?.items || [],
    pagination: data?.pagination,
    isLoading,
    error: error?.message,
    mutate,
  };
}
