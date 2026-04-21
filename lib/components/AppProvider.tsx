'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/hooks/useSession';

/**
 * App provider component for initializing session on mount
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    );
  }

  return <>{children}</>;
}
