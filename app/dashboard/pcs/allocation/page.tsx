'use client';

import { useState } from 'react';
import { usePcsAllocation } from '@/lib/hooks/usePcsRealData';

const STATUS_ZH: Record<string, string> = {
  PENDING: '待分配',
  ALLOCATED: '已分配',
  IN_USE: '使用中',
  RETURNED: '已归还',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  ALLOCATED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_USE: 'bg-amber-50 text-amber-700 border-amber-200',
  RETURNED: 'bg-green-50 text-green-700 border-green-200',
};

export default function PcsAllocationPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const { allocations, loading, error, refetch } = usePcsAllocation();

  const filteredAllocations = allocations.filter((a) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && a.resource_type !== typeFilter) return false;
    return true;
  });

  const stats = {
    total: allocations.length,
    pending: allocations.filter((a) => a.status === 'PENDING').length,
    allocated: allocations.filter((a) => a.status === 'ALLOCATED').length,
    inUse: allocations.filter((a) => a.status === 'IN_USE').length,
    totalQty: allocations.reduce((sum, a) => sum + a.quantity, 0),
  };

  // 获取资源类型列表
  const resourceTypes = [...new Set(allocations.map((a) => a.resource_type).filter(Boolean))];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">资源分配</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建分配
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="分配总数" value={stats.total} />
        <StatCard label="待分配" value={stats.pending} highlightColor="text-gray-600" />
        <StatCard label="已分配" value={stats.allocated} highlightColor="text-blue-600" />
        <StatCard label="使用中" value={stats.inUse} highlightColor="text-amber-600" />
        <StatCard label="总数量" value={stats.totalQty} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          {resourceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待分配</option>
          <option value="ALLOCATED">已分配</option>
          <option value="IN_USE">使用中</option>
          <option value="RETURNED">已归还</option>
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

      {/* 分配列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">分配编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">资源类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">资源名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">分配目标</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">数量</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllocations.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{item.allocation_no}</td>
                    <td className="px-4 py-3 text-xs">{item.resource_type || '-'}</td>
                    <td className="px-4 py-3 font-medium">{item.resource_name}</td>
                    <td className="px-4 py-3 text-xs">{item.target || '-'}</td>
                    <td className="px-4 py-3 text-center tabular-nums">{item.quantity}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[item.status]}`}>
                        {STATUS_ZH[item.status]}
                      </span>
                    </td>
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
