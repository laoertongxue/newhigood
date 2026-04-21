/**
 * PDA 系统（生产数据助手）相关类型
 */

export type DataType = 'temperature' | 'humidity' | 'pressure' | 'quantity' | 'weight' | 'other';

// 生产数据记录
export interface ProductionData {
  id: string;
  order_id: string;
  data_type: DataType;
  value: number;
  unit: string;
  recorded_by: string;
  recorded_at: string;
  created_at: string;
}

export interface CreateProductionDataDTO {
  order_id: string;
  data_type: DataType;
  value: number;
  unit: string;
}

// 数据分析报告
export interface DataAnalysisReport {
  id: string;
  report_no: string;
  analysis_period: {
    start: string;
    end: string;
  };
  summary: {
    total_records: number;
    data_types: Record<DataType, number>;
    average_values: Record<DataType, number>;
  };
  created_at: string;
}

// KPI 指标
export interface KpiMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  period: string;
  subsystem_type: string;
  created_at: string;
}

// PDA 列表过滤条件
export interface PdaListFilter {
  page?: number;
  limit?: number;
  data_type?: DataType;
  order_id?: string;
  date_from?: string;
  date_to?: string;
  sortBy?: keyof ProductionData;
  order?: 'asc' | 'desc';
}
