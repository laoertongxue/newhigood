/**
 * Authentication related types
 */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    role?: 'admin' | 'manager' | 'operator';
    subsystems?: string[];
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
  };
  error?: string;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    role?: string;
    subsystems?: string[];
  } | null;
  session: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    expires_at?: number;
  } | null;
  isAuthenticated: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
