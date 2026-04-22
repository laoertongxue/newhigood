'use client';

import { useState } from 'react';
import { usePcsFabrics } from '@/lib/hooks/usePcsRealData';
import type { PcsFabric } from '@/lib/hooks/usePcsRealData';

const STATUS_ZH: Record<string, string> = {
  ACTIVE: '在用',
  INACTIVE: '停用',
  LOW_STOCK: '库存不足',
};

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  INACTIVE: 'bg-gray-100 text-gray-500 border-gray-300',
  LOW_STOCK: 'bg-red-50 text-red-700 border-red-200',
};

export default function PcsMaterialsFabricPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // 使用真实 API
  const { fabrics, loading, error, refetch } = usePcsFabrics();

  const filteredFabrics = fabrics.filter((f: PcsFabric) => {
    if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && f.fabric_type !== typeFilter) return false;
    return true;
  });

  const stats = {
    total: fabrics.length,
    active: fabrics.filter((f: PcsFabric) => f.status === 'ACTIVE').length,
    lowStock: fabrics.filter((f: PcsFabric) => f.stock_qty < 100).length,
    totalStock: fabrics.reduce((sum, f: PcsFabric) => sum + f.stock_qty, 0),
  };

  // 获取面料类型列表
  const fabricTypes = [...new Set(fabrics.map((f: PcsFabric) => f.fabric_type).filter(Boolean))];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">面料管理</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新增面料
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="面料种类" value={stats.total} />
        <StatCard label="在用" value={stats.active} highlightColor="text-green-600" />
        <StatCard label="库存不足" value={stats.lowStock} highlight={stats.lowStock > 0} highlightColor="text-red-600" />
        <StatCard label="总库存" value={stats.totalStock} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          {fabricTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">在用</option>
          <option value="INACTIVE">停用</option>
          <option value="LOW_STOCK">库存不足</option>
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

      {/* 面料列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">面料编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">面料名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">成分</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">供应商</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">单价</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">库存</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredFabrics.map((fabric: PcsFabric) => (
                  <tr key={fabric.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{fabric.fabric_no}</td>
                    <td className="px-4 py-3 font-medium">{fabric.fabric_name}</td>
                    <td className="px-4 py-3 text-xs">{fabric.fabric_type}</td>
                    <td className="px-4 py-3 text-xs">{fabric.composition || '-'}</td>
                    <td className="px-4 py-3 text-xs">{fabric.supplier || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[fabric.status]}`}>
                        {STATUS_ZH[fabric.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {fabric.unit_price ? `¥${fabric.unit_price.toFixed(2)}/${fabric.unit}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`tabular-nums ${fabric.stock_qty < 100 ? 'text-red-600 font-medium' : ''}`}>
                        {fabric.stock_qty} {fabric.unit}
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
