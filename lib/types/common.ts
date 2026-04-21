/**
 * 通用类型定义
 */

// 用户相关
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'manager' | 'operator';
  subsystems: ('fcs' | 'pcs' | 'pda')[];
  created_at: string;
  updated_at: string;
}

// 标签页相关
export interface Tab {
  id: string;
  key: string;
  title: string;
  href: string;
  subsystem: 'fcs' | 'pcs' | 'pda';
  closable?: boolean;
  isDirty?: boolean;
}

// 菜单相关
export interface MenuItem {
  key: string;
  title: string;
  href?: string;
  icon?: string;
  children?: MenuItem[];
  badge?: {
    count: number;
    type: 'danger' | 'warning' | 'info';
  };
}

export interface MenuGroup {
  key: string;
  title: string;
  icon?: string;
  items: MenuItem[];
  collapsible?: boolean;
}

// 子系统类型
export type SubsystemType = 'fcs' | 'pcs' | 'pda';

export const SUBSYSTEMS: Record<SubsystemType, { name: string; shortName: string }> = {
  fcs: { name: '工厂生产协同', shortName: 'FCS' },
  pcs: { name: '商品协调', shortName: 'PCS' },
  pda: { name: '生产数据助手', shortName: 'PDA' },
};

// 通用状态
export interface CommonStatus {
  loading: boolean;
  error: string | null;
}

// 分页信息
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API 响应通用格式
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface ListResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// 操作日志
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, unknown>;
  created_at: string;
}
