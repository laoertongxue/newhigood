'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@/lib/db/supabase-client';

// 类型定义
export interface PdaTask {
  id: string;
  task_no: string;
  task_type: string;
  production_order_id: string | null;
  description: string | null;
  priority: string;
  status: string;
  deadline: string | null;
  estimated_duration: string | null;
  assigned_to: string | null;
  created_at: string;
}

export interface PdaExecRecord {
  id: string;
  exec_no: string;
  task_id: string | null;
  worker_name: string;
  start_time: string;
  end_time: string | null;
  completed_qty: number;
  target_qty: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface PdaCollectRecord {
  id: string;
  collect_no: string;
  collect_type: string;
  production_order_id: string | null;
  worker_name: string;
  quantity: number;
  unit: string;
  batch_no: string | null;
  status: string;
  collect_time: string;
  created_at: string;
}

export interface PdaNotification {
  id: string;
  notify_no: string;
  notify_type: string;
  title: string;
  content: string | null;
  priority: string;
  recipient: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PdaExportRecord {
  id: string;
  export_no: string;
  export_type: string;
  export_format: string;
  date_range: string | null;
  record_count: number;
  file_size: string | null;
  status: string;
  created_by: string | null;
  download_url: string | null;
  created_at: string;
}

// PDA 任务 Hook
export function usePdaTasks() {
  const [tasks, setTasks] = useState<PdaTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pda_tasks')
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

// PDA 执行记录 Hook
export function usePdaExecRecords() {
  const [records, setRecords] = useState<PdaExecRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pda_exec_records')
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

// PDA 采集记录 Hook
export function usePdaCollectRecords() {
  const [records, setRecords] = useState<PdaCollectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pda_collect_records')
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

// PDA 通知 Hook
export function usePdaNotifications() {
  const [notifications, setNotifications] = useState<PdaNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pda_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, error, refetch: fetchNotifications };
}

// PDA 导出记录 Hook
export function usePdaExportRecords() {
  const [records, setRecords] = useState<PdaExportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabaseClient
      .from('pda_export_records')
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
