'use client';

import { useState } from 'react';
import { usePcsProjects } from '@/lib/hooks/usePcsRealData';
import type { PcsProject } from '@/lib/hooks/usePcsRealData';

const STATUS_ZH: Record<string, string> = {
  DRAFT: '草稿',
  PLANNING: '规划中',
  IN_PROGRESS: '进行中',
  REVIEW: '审核中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'bg-gray-50 text-gray-700 border-gray-200',
  PLANNING: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border-amber-200',
  REVIEW: 'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-300',
};

const PRIORITY_ZH: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  URGENT: '紧急',
};

export default function PcsProjectsListPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const { projects, loading, error, refetch } = usePcsProjects();

  const filteredProjects = projects.filter((p: PcsProject) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && p.priority !== priorityFilter) return false;
    return true;
  });

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p: PcsProject) => p.status === 'IN_PROGRESS').length,
    review: projects.filter((p: PcsProject) => p.status === 'REVIEW').length,
    completed: projects.filter((p: PcsProject) => p.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">项目列表</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建项目
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="项目总数" value={stats.total} />
        <StatCard label="进行中" value={stats.inProgress} highlightColor="text-amber-600" />
        <StatCard label="审核中" value={stats.review} highlightColor="text-purple-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="DRAFT">草稿</option>
          <option value="PLANNING">规划中</option>
          <option value="IN_PROGRESS">进行中</option>
          <option value="REVIEW">审核中</option>
          <option value="COMPLETED">已完成</option>
          <option value="CANCELLED">已取消</option>
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

      {/* 项目列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">项目编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">项目名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">客户</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">分类</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">优先级</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">进度</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">目标日期</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project: PcsProject) => (
                  <tr key={project.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{project.project_no}</td>
                    <td className="px-4 py-3 font-medium">{project.project_name}</td>
                    <td className="px-4 py-3 text-xs">{project.customer_name || '-'}</td>
                    <td className="px-4 py-3 text-xs">{project.category || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs">{PRIORITY_ZH[project.priority] || project.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[project.status]}`}>
                        {STATUS_ZH[project.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded bg-gray-200">
                          <div 
                            className="h-full rounded bg-blue-600" 
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs">{project.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{project.target_date || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, highlightColor = 'text-gray-900' }: { label: string; value: number; highlightColor?: string }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${highlightColor}`}>{value}</p>
    </div>
  );
}
