/**
 * PCS 系统（商品协调）相关类型
 */

export type GoodsCategory = 'fabric' | 'accessory' | 'component' | 'other';
export type CoordinationOrderStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'completed';
export type InventoryAllocationStatus = 'allocated' | 'released' | 'cancelled';

export interface GoodsCategoryItem {
  id: string;
  category_code: string;
  category_name: string;
  created_at: string;
  updated_at: string;
}

// 商品
export interface Goods {
  id: string;
  goods_code: string;
  goods_name: string;
  category: GoodsCategory;
  supplier: string;
  price: number;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CreateGoodsDTO {
  goods_code: string;
  goods_name: string;
  category: GoodsCategory;
  supplier: string;
  price: number;
  stock_quantity: number;
}

export interface UpdateGoodsDTO {
  goods_code?: string;
  goods_name?: string;
  category?: GoodsCategory;
  supplier?: string;
  price?: number;
  stock_quantity?: number;
}

// 协调单
export interface CoordinationOrder {
  id: string;
  coordination_no: string;
  goods_id: string;
  quantity: number;
  status: CoordinationOrderStatus;
  created_at: string;
  updated_at: string;
}

export interface InventoryAllocation {
  id: string;
  goods_id: string;
  coordination_order_id?: string | null;
  allocated_quantity: number;
  warehouse: string;
  status: InventoryAllocationStatus;
  created_at: string;
  updated_at: string;
}

// PCS 列表过滤条件
export interface PcsListFilter {
  page?: number;
  limit?: number;
  category?: GoodsCategory;
  search?: string;
  sortBy?: keyof Goods;
  order?: 'asc' | 'desc';
}
