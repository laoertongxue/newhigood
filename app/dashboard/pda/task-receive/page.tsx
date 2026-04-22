'use client';

import { useState } from 'react';
import { usePdaTasks } from '@/lib/hooks/usePdaRealData';
import type { PdaTask } from '@/lib/hooks/usePdaRealData';

const TASK_TYPE_ZH: Record<string, string> = {
  PRODUCTION: '生产任务',
  QUALITY: '质检任务',
  DELIVERY: '配送任务',
  MATERIAL: '物料任务',
};

const STATUS_ZH: Record<string, string> = {
  PENDING: '待领取',
  ASSIGNED: '已分配',
  IN_PROGRESS: '进行中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  ASSIGNED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-300',
};

const PRIORITY_ZH: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  URGENT: '紧急',
};

const PRIORITY_CLASS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600 border-gray-200',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
  HIGH: 'bg-amber-100 text-amber-700 border-amber-200',
  URGENT: 'bg-red-100 text-red-700 border-red-200',
};

export default function PdaTaskReceivePage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // 使用真实 API
  const { tasks, loading, error, refetch } = usePdaTasks();

  const filteredTasks = tasks.filter((t: PdaTask) => {
    if (typeFilter !== 'ALL' && t.task_type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t: PdaTask) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t: PdaTask) => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter((t: PdaTask) => t.status === 'COMPLETED').length,
    urgent: tasks.filter((t: PdaTask) => t.priority === 'URGENT').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">任务领取</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          刷新任务
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="任务总数" value={stats.total} />
        <StatCard label="待领取" value={stats.pending} highlightColor="text-gray-600" />
        <StatCard label="进行中" value={stats.inProgress} highlightColor="text-amber-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
        <StatCard label="紧急任务" value={stats.urgent} highlight={stats.urgent > 0} highlightColor="text-red-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="PRODUCTION">生产任务</option>
          <option value="QUALITY">质检任务</option>
          <option value="DELIVERY">配送任务</option>
          <option value="MATERIAL">物料任务</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待领取</option>
          <option value="ASSIGNED">已分配</option>
          <option value="IN_PROGRESS">进行中</option>
          <option value="COMPLETED">已完成</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="ALL">全部优先级</option>
          <option value="URGENT">紧急</option>
          <option value="HIGH">高</option>
          <option value="MEDIUM">中</option>
          <option value="LOW">低</option>
        </select>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-gray-500">加载中...</span>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">加载失败：{error}</p>
          <button onClick={refetch} className="mt-2 text-sm text-blue-600 hover:underline">
            重试
          </button>
        </div>
      )}

      {/* 任务列表 */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
              暂无任务
            </div>
          ) : (
            filteredTasks.map((task: PdaTask) => (
              <div key={task.id} className="rounded-lg border bg-white p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-600">{task.task_no}</span>
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${TASK_TYPE_ZH[task.task_type] ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200'}`}>
                      {TASK_TYPE_ZH[task.task_type] || task.task_type}
                    </span>
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${PRIORITY_CLASS[task.priority]}`}>
                      {PRIORITY_ZH[task.priority]}
                    </span>
                  </div>
                  <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[task.status]}`}>
                    {STATUS_ZH[task.status]}
                  </span>
                </div>
                
                {task.description && (
                  <p className="text-sm text-gray-700 mb-3">{task.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {task.deadline && (
                      <span>截止：{task.deadline}</span>
                    )}
                    {task.estimated_duration && (
                      <span>预计：{task.estimated_duration}</span>
                    )}
                    {task.assigned_to && (
                      <span>分配给：{task.assigned_to}</span>
                    )}
                    {task.production_order_id && (
                      <span>生产单：{task.production_order_id}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {task.status === 'PENDING' && (
                      <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        领取任务
                      </button>
                    )}
                    {task.status === 'ASSIGNED' && (
                      <button className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                        开始执行
                      </button>
                    )}
                    <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  highlight = false, 
  highlightColor = 'text-gray-900' 
}: { 
  label: string; 
  value: number; 
  highlight?: boolean;
  highlightColor?: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${highlight ? highlightColor : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}
