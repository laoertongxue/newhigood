/**
 * Authentication validation utilities
 */

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return { valid: false, error: '邮箱不能为空' };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: '邮箱格式不正确' };
  }
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: '密码不能为空' };
  }
  if (password.length < 6) {
    return { valid: false, error: '密码至少需要6个字符' };
  }
  return { valid: true };
}

export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name.trim()) {
    return { valid: false, error: '姓名不能为空' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: '姓名至少需要2个字符' };
  }
  return { valid: true };
}

export function validateLoginForm(email: string, password: string) {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  return { valid: true };
}

export function validateSignupForm(email: string, password: string, name: string) {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  return { valid: true };
}
