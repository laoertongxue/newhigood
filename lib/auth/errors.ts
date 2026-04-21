/**
 * Custom authentication error classes
 */

export class AuthError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'AuthError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = '邮箱或密码错误') {
    super('INVALID_CREDENTIALS', message);
    this.name = 'InvalidCredentialsError';
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(message = '该邮箱已被注册') {
    super('USER_ALREADY_EXISTS', message);
    this.name = 'UserAlreadyExistsError';
  }
}

export class ValidationError extends AuthError {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

export class SessionExpiredError extends AuthError {
  constructor(message = '会话已过期，请重新登录') {
    super('SESSION_EXPIRED', message);
    this.name = 'SessionExpiredError';
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = '未授权') {
    super('UNAUTHORIZED', message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Get human-readable error message
 */
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthError) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: unknown }).message);

    // Handle Supabase error messages
    if (message.includes('Invalid login credentials')) {
      return '邮箱或密码错误';
    }
    if (message.includes('User already registered')) {
      return '该邮箱已被注册';
    }
    if (message.includes('Session expired')) {
      return '会话已过期，请重新登录';
    }
    return message;
  }

  return '发生了一个错误，请稍后重试';
}
