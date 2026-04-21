/**
 * FCS 系统（工厂生产协同）相关类型
 */

export type ProductionOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type ProductionOrderPriority = 'low' | 'normal' | 'high' | 'urgent';
export type ProductionPlanStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed';

// 生产订单
export interface ProductionOrder {
  id: string;
  order_no: string;
  customer_name: string;
  product_name: string;
  quantity: number;
  start_date: string; // ISO date
  end_date: string;
  status: ProductionOrderStatus;
  priority: ProductionOrderPriority;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// 创建/更新生产订单的 DTO
export interface CreateProductionOrderDTO {
  order_no: string;
  customer_name: string;
  product_name: string;
  quantity: number;
  start_date: string;
  end_date: string;
  priority?: ProductionOrderPriority;
}

export interface UpdateProductionOrderDTO {
  order_no?: string;
  customer_name?: string;
  product_name?: string;
  quantity?: number;
  start_date?: string;
  end_date?: string;
  status?: ProductionOrderStatus;
  priority?: ProductionOrderPriority;
}

// 产线
export interface ProductionLine {
  id: string;
  line_name: string;
  line_code: string;
  capacity: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// 生产计划
export interface ProductionPlan {
  id: string;
  order_id: string;
  plan_no: string;
  start_time: string;
  end_time: string;
  assigned_worker: string;
  line_id: string;
  status: ProductionPlanStatus;
  created_at: string;
  updated_at: string;
}

// FCS 列表过滤条件
export interface FcsListFilter {
  page?: number;
  limit?: number;
  status?: ProductionOrderStatus;
  priority?: ProductionOrderPriority;
  search?: string;
  sortBy?: keyof ProductionOrder;
  order?: 'asc' | 'desc';
}
