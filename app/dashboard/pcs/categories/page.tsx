'use client';

import { useState } from 'react';
import { usePcsCategories } from '@/lib/hooks/usePcsRealData';

const STATUS_ZH: Record<string, string> = {
  ACTIVE: '启用',
  INACTIVE: '停用',
};

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  INACTIVE: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function PcsCategoriesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { categories, loading, error, refetch } = usePcsCategories();

  const filteredCategories = categories.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.status === 'ACTIVE').length,
    level1: categories.filter((c) => c.level === 1).length,
    level2: categories.filter((c) => c.level === 2).length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">商品分类</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新增分类
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="分类总数" value={stats.total} />
        <StatCard label="启用" value={stats.active} highlightColor="text-green-600" />
        <StatCard label="一级分类" value={stats.level1} />
        <StatCard label="二级分类" value={stats.level2} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">启用</option>
          <option value="INACTIVE">停用</option>
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

      {/* 分类列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">分类编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">分类名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">层级</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">排序</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{category.category_no}</td>
                    <td className="px-4 py-3 font-medium">
                      <span style={{ paddingLeft: category.level > 1 ? `${(category.level - 1) * 16}px` : '0' }}>
                        {category.category_name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded border px-2 py-0.5 text-xs bg-gray-50 border-gray-200">
                        {category.level === 1 ? '一级' : '二级'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{category.sort_order}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[category.status]}`}>
                        {STATUS_ZH[category.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                        编辑
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
