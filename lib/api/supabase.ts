/**
 * Supabase 客户端初始化
 * 用于浏览器端和服务器端
 */

import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient as createDbSupabaseServerClient } from '@/lib/db/supabase-server';

// 环境变量
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * 创建浏览器客户端（在客户端组件中使用）
 */
export function createSupabaseBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * 创建服务器客户端（在服务器端使用）
 */
export async function createSupabaseServerClient() {
  return createDbSupabaseServerClient();
}

// 默认导出浏览器客户端
export const supabase = createSupabaseBrowserClient();

// 验证环境变量
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ Supabase 环境变量未设置。请在 .env.local 中配置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}
