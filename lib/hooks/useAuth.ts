'use client';

import { useCallback, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { validateLoginForm, validateSignupForm } from '@/lib/auth/validation';
import type { LoginFormData, SignupFormData, AuthResponse } from '@/lib/types/auth';
import type { SubsystemType } from '@/lib/types';

const VALID_SUBSYSTEMS: SubsystemType[] = ['fcs', 'pcs', 'pda'];

function normalizeSubsystems(input?: string[]): SubsystemType[] {
  if (!input || input.length === 0) return VALID_SUBSYSTEMS;
  const normalized = input.filter((item): item is SubsystemType =>
    VALID_SUBSYSTEMS.includes(item as SubsystemType)
  );
  return normalized.length > 0 ? normalized : VALID_SUBSYSTEMS;
}

/**
 * Custom hook for authentication operations
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser, setLoading, setError: setStoreError, logout } = useAuthStore();

  const signin = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      const validation = validateLoginForm(email, password);
      if (!validation.valid) {
        setError(validation.error || '表单验证失败');
        setIsLoading(false);
        return false;
      }

      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data: AuthResponse = await response.json();

        if (!data.success) {
          setError(data.error || '登录失败');
          setStoreError(data.error || '登录失败');
          return false;
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            avatar_url: data.user.avatar_url,
            role: data.user.role || 'operator',
            subsystems: normalizeSubsystems(data.user.subsystems),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : '登录失败';
        setError(message);
        setStoreError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setStoreError]
  );

  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true);
      setError(null);

      const validation = validateSignupForm(email, password, name);
      if (!validation.valid) {
        setError(validation.error || '表单验证失败');
        setIsLoading(false);
        return false;
      }

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        const data: AuthResponse = await response.json();

        if (!data.success) {
          setError(data.error || '注册失败');
          setStoreError(data.error || '注册失败');
          return false;
        }

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            avatar_url: data.user.avatar_url,
            role: data.user.role || 'operator',
            subsystems: normalizeSubsystems(data.user.subsystems),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : '注册失败';
        setError(message);
        setStoreError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setStoreError]
  );

  const signout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '登出失败');
      }

      logout();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '登出失败';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  return {
    signin,
    signup,
    signout,
    isLoading,
    error,
    setError,
  };
}
