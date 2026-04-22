'use client';

import { ReactNode } from 'react';

/**
 * App provider component - simplified version
 */
export function AppProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
