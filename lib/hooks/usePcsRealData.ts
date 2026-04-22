'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@/lib/db/supabase-client';

// 类型定义
export interface PcsProject {
  id: string;
  project_no: string;
  project_name: string;
  customer_name: string;
  category: string;
  status: string;
  priority: string;
  start_date: string;
  target_date: string;
  progress: number;
  created_at: string;
}

export interface PcsTodo {
  id: string;
  todo_no: string;
  title: string;
  description: string | null;
  assignee: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  created_at: string;
}

export interface PcsAlert {
  id: string;
  alert_no: string;
  alert_type: string;
  title: string;
  content: string | null;
  severity: string;
  status: string;
  created_at: string;
}

export interface PcsTesting {
  id: string;
  testing_no: string;
  testing_type: string;
  project_id: string | null;
  sample_name: string;
  tester: string | null;
  test_date: string;
  result: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface PcsStore {
  id: string;
  store_no: string;
  store_name: string;
  channel: string;
  region: string;
  contact: string | null;
  phone: string | null;
  status: string;
  created_at: string;
}

export interface PcsPatternRevision {
  id: string;
  revision_no: string;
  pattern_name: string;
  version: string;
  revision_reason: string;
  status: string;
  revised_by: string | null;
  revised_at: string | null;
  created_at: string;
}

export interface PcsFabric {
  id: string;
  fabric_no: string;
  fabric_name: string;
  fabric_type: string;
  composition: string | null;
  width: string | null;
  weight: string | null;
  supplier: string | null;
  unit_price: number | null;
  unit: string;
  stock_qty: number;
  status: string;
  created_at: string;
}

export interface PcsAccessory {
  id: string;
  accessory_no: string;
  accessory_name: string;
  accessory_type: string;
  supplier: string | null;
  unit_price: number | null;
  unit: string;
  stock_qty: number;
  min_stock: number | null;
  status: string;
  created_at: string;
}

export interface PcsSample {
  id: string;
  sample_no: string;
  sample_type: string;
  project_id: string | null;
  sample_name: string;
  style_no: string | null;
  size: string | null;
  status: string;
  received_date: string | null;
  notes: string | null;
  created_at: string;
}

// PCS 项目 Hook
export function usePcsProjects() {
  const [projects, setProjects] = useState<PcsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}

// PCS 待办事项 Hook
export function usePcsTodos() {
  const [todos, setTodos] = useState<PcsTodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return { todos, loading, error, refetch: fetchTodos };
}

// PCS 告警 Hook
export function usePcsAlerts() {
  const [alerts, setAlerts] = useState<PcsAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setAlerts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return { alerts, loading, error, refetch: fetchAlerts };
}

// PCS 测试记录 Hook
export function usePcsTesting() {
  const [records, setRecords] = useState<PcsTesting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_testing')
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

// PCS 门店 Hook
export function usePcsStores() {
  const [stores, setStores] = useState<PcsStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setStores(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, loading, error, refetch: fetchStores };
}

// PCS 版单修订 Hook
export function usePcsPatternRevisions() {
  const [revisions, setRevisions] = useState<PcsPatternRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRevisions = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_pattern_revisions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setRevisions(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRevisions();
  }, [fetchRevisions]);

  return { revisions, loading, error, refetch: fetchRevisions };
}

// PCS 面料 Hook
export function usePcsFabrics() {
  const [fabrics, setFabrics] = useState<PcsFabric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFabrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_fabrics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setFabrics(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFabrics();
  }, [fetchFabrics]);

  return { fabrics, loading, error, refetch: fetchFabrics };
}

// PCS 辅料 Hook
export function usePcsAccessories() {
  const [accessories, setAccessories] = useState<PcsAccessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_accessories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setAccessories(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  return { accessories, loading, error, refetch: fetchAccessories };
}

// PCS 样衣 Hook
export function usePcsSamples() {
  const [samples, setSamples] = useState<PcsSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSamples = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_samples')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setSamples(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSamples();
  }, [fetchSamples]);

  return { samples, loading, error, refetch: fetchSamples };
}

// PCS 工作台概览 Hook
export function usePcsWorkspaceOverview() {
  const [overview, setOverview] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingTodos: 0,
    openAlerts: 0,
    testingRecords: 0,
    recentUpdates: [] as Array<{type: string; content: string; time: string}>,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [projectsRes, todosRes, alertsRes, testingRes] = await Promise.all([
        supabaseClient.from('pcs_projects').select('*'),
        supabaseClient.from('pcs_todos').select('*'),
        supabaseClient.from('pcs_alerts').select('*'),
        supabaseClient.from('pcs_testing').select('*'),
      ]);

      const projects = projectsRes.data || [];
      const todos = todosRes.data || [];
      const alerts = alertsRes.data || [];
      const testing = testingRes.data || [];

      setOverview({
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'ACTIVE').length,
        pendingTodos: todos.filter(t => t.status === 'TODO' || t.status === 'PENDING').length,
        openAlerts: alerts.filter(a => a.status === 'OPEN').length,
        testingRecords: testing.length,
        recentUpdates: [
          { type: '项目', content: `共 ${projects.length} 个项目`, time: new Date().toLocaleString('zh-CN') },
          { type: '待办', content: `${todos.filter(t => t.status === 'TODO').length} 条待处理`, time: new Date().toLocaleString('zh-CN') },
          { type: '告警', content: `${alerts.filter(a => a.status === 'OPEN').length} 条待处理`, time: new Date().toLocaleString('zh-CN') },
        ],
      });
    } catch (e: any) {
      setError(e.message);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return { overview, loading, error, refetch: fetchOverview };
}

// PCS 商品 Hook
export function usePcsGoods() {
  const [goods, setGoods] = useState<Array<{
    id: string;
    goods_no: string;
    goods_name: string;
    category: string;
    channel: string;
    price: number;
    status: string;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_goods')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setGoods(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGoods();
  }, [fetchGoods]);

  return { goods, loading, error, refetch: fetchGoods };
}

// PCS 分类 Hook
export function usePcsCategories() {
  const [categories, setCategories] = useState<Array<{
    id: string;
    category_no: string;
    category_name: string;
    parent_id: string | null;
    level: number;
    sort_order: number;
    status: string;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

// PCS 协同 Hook
export function usePcsCoordination() {
  const [tasks, setTasks] = useState<Array<{
    id: string;
    task_no: string;
    task_name: string;
    assignee: string;
    status: string;
    due_date: string;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_coordination')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}

// PCS 分配 Hook
export function usePcsAllocation() {
  const [allocations, setAllocations] = useState<Array<{
    id: string;
    allocation_no: string;
    resource_type: string;
    resource_name: string;
    target: string;
    quantity: number;
    status: string;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pcs_allocation')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setAllocations(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  return { allocations, loading, error, refetch: fetchAllocations };
}
