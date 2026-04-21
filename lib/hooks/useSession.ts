'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import type { User } from '@/lib/types/common';

/**
 * Custom hook to initialize and manage user session
 */
export function useSession() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await fetch('/api/auth/user', {
          method: 'GET',
        });

        const data = await response.json();

        if (data.isAuthenticated && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            avatar_url: data.user.avatar_url,
            role: data.user.role || 'operator',
            subsystems: data.user.subsystems || ['fcs'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [setUser, logout]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
