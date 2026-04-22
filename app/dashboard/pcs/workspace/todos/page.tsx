'use client';

import { useState } from 'react';
import { usePcsTodos } from '@/lib/hooks/usePcsRealData';
import type { PcsTodo } from '@/lib/hooks/usePcsRealData';

const STATUS_ZH: Record<string, string> = {
  TODO: '待处理',
  IN_PROGRESS: '进行中',
  REVIEW: '审核中',
  DONE: '已完成',
  CANCELLED: '已取消',
};

const STATUS_CLASS: Record<string, string> = {
  TODO: 'bg-gray-50 text-gray-700 border-gray-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  DONE: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-300',
};

const PRIORITY_ZH: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  URGENT: '紧急',
};

const PRIORITY_CLASS: Record<string, string> = {
  LOW: 'text-gray-500',
  MEDIUM: 'text-blue-600',
  HIGH: 'text-amber-600',
  URGENT: 'text-red-600',
};

export default function PcsWorkspaceTodosPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // 使用真实 API
  const { todos, loading, error, refetch } = usePcsTodos();

  const filteredTodos = todos.filter((t: PcsTodo) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    return true;
  });

  const stats = {
    total: todos.length,
    todo: todos.filter((t: PcsTodo) => t.status === 'TODO').length,
    inProgress: todos.filter((t: PcsTodo) => t.status === 'IN_PROGRESS').length,
    review: todos.filter((t: PcsTodo) => t.status === 'REVIEW').length,
    done: todos.filter((t: PcsTodo) => t.status === 'DONE').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">待办事项</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建待办
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="待办总数" value={stats.total} />
        <StatCard label="待处理" value={stats.todo} highlightColor="text-gray-600" />
        <StatCard label="进行中" value={stats.inProgress} highlightColor="text-blue-600" />
        <StatCard label="审核中" value={stats.review} highlightColor="text-amber-600" />
        <StatCard label="已完成" value={stats.done} highlightColor="text-green-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="TODO">待处理</option>
          <option value="IN_PROGRESS">进行中</option>
          <option value="REVIEW">审核中</option>
          <option value="DONE">已完成</option>
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

      {/* 待办列表 */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
              暂无待办事项
            </div>
          ) : (
            filteredTodos.map((todo: PcsTodo) => (
              <div key={todo.id} className="rounded-lg border bg-white p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-600">{todo.todo_no}</span>
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${PRIORITY_CLASS[todo.priority]}`}>
                      {PRIORITY_ZH[todo.priority]}
                    </span>
                  </div>
                  <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[todo.status]}`}>
                    {STATUS_ZH[todo.status]}
                  </span>
                </div>
                
                <h3 className="font-medium mb-2">{todo.title}</h3>
                
                {todo.description && (
                  <p className="text-sm text-gray-600 mb-3">{todo.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {todo.assignee && (
                      <span>负责人：{todo.assignee}</span>
                    )}
                    {todo.due_date && (
                      <span>截止：{todo.due_date}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {todo.status === 'TODO' && (
                      <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        开始处理
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
