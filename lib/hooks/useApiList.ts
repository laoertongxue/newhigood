'use client';

import useSWR from 'swr';
import type { ListResponse, PaginationInfo } from '@/lib/types';

type RequestError = Error & {
  status?: number;
  info?: unknown;
};

function buildQuery(params: Record<string, string | number | undefined>) {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  return queryParams.toString();
}

export function useApiList<T>(basePath: string, params: Record<string, string | number | undefined> = {}) {
  const query = buildQuery(params);
  const url = query ? `${basePath}?${query}` : basePath;

  const fetcher = async (requestUrl: string) => {
    const res = await fetch(requestUrl);
    if (!res.ok) {
      const error = new Error('Failed to fetch data');
      const body = await res.json().catch(() => null);
      const requestError = error as RequestError;
      requestError.status = res.status;
      requestError.info = body;
      throw requestError;
    }
    return res.json() as Promise<ListResponse<T>>;
  };

  const { data, error, isLoading, mutate } = useSWR<ListResponse<T>>(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  return {
    items: data?.items || [],
    pagination: data?.pagination as PaginationInfo | undefined,
    isLoading,
    error: error?.message,
    mutate,
  };
}
