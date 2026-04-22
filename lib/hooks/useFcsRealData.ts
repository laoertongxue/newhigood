'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@/lib/db/supabase-client';
import type { RealtimeChannel } from '@supabase/supabase-js';

// 类型定义
export interface ProductionOrder {
  id: string;
  order_no: string;
  customer_name: string;
  product_name: string;
  quantity: number;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  created_at: string;
}

export interface QualityRecord {
  id: string;
  record_no: string;
  production_order_id: string | null;
  factory_name: string;
  inspector: string;
  inspect_date: string;
  batch_qty: number;
  pass_qty: number;
  fail_qty: number;
  pass_rate: number;
  result: string;
  status: string;
  liability_status: string | null;
  notes: string | null;
  created_at: string;
}

export interface CuttingPlan {
  id: string;
  plan_no: string;
  production_order_id: string | null;
  factory_name: string;
  style_name: string;
  planned_date: string;
  fabric_name: string;
  layers: number;
  total_qty: number;
  cut_qty: number;
  status: string;
  created_at: string;
}

export interface InboundRecord {
  id: string;
  inbound_no: string;
  production_order_id: string | null;
  factory_name: string;
  style_name: string;
  inbound_date: string;
  total_qty: number;
  qualified_qty: number;
  rejected_qty: number;
  warehouse_name: string;
  status: string;
  operator: string | null;
  notes: string | null;
  created_at: string;
}

export interface SettlementStatement {
  id: string;
  statement_no: string;
  factory_name: string;
  statement_month: string;
  total_amount: number;
  deduction_amount: number;
  net_amount: number;
  item_count: number;
  status: string;
  confirmed_at: string | null;
  paid_at: string | null;
  created_at: string;
}

// 生产订单 Hook
export function useProductionOrders() {
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('production_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}

// 质检记录 Hook
export function useQualityRecords() {
  const [records, setRecords] = useState<QualityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('fcs_quality_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}

// 裁剪计划 Hook
export function useCuttingPlans() {
  const [plans, setPlans] = useState<CuttingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('fcs_cutting_plans')
      .select('*')
      .order('planned_date', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, refetch: fetchPlans };
}

// 入库记录 Hook
export function useInboundRecords() {
  const [records, setRecords] = useState<InboundRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('fcs_inbound_records')
      .select('*')
      .order('inbound_date', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, loading, error, refetch: fetchRecords };
}

// 对账单 Hook
export function useSettlementStatements() {
  const [statements, setStatements] = useState<SettlementStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatements = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('fcs_settlement_statements')
      .select('*')
      .order('statement_month', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setStatements(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatements();
  }, [fetchStatements]);

  return { statements, loading, error, refetch: fetchStatements };
}
