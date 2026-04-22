'use client';

import { useState } from 'react';
import { usePcsAccessories } from '@/lib/hooks/usePcsRealData';
import type { PcsAccessory } from '@/lib/hooks/usePcsRealData';

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

export default function PcsMaterialsAccessoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // 使用真实 API
  const { accessories, loading, error, refetch } = usePcsAccessories();

  const filteredAccessories = accessories.filter((a: PcsAccessory) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && a.accessory_type !== typeFilter) return false;
    return true;
  });

  const stats = {
    total: accessories.length,
    active: accessories.filter((a: PcsAccessory) => a.status === 'ACTIVE').length,
    lowStock: accessories.filter((a: PcsAccessory) => a.min_stock && a.stock_qty < a.min_stock).length,
    totalStock: accessories.reduce((sum, a: PcsAccessory) => sum + a.stock_qty, 0),
  };

  // 获取辅料类型列表
  const accessoryTypes = [...new Set(accessories.map((a: PcsAccessory) => a.accessory_type).filter(Boolean))];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">辅料管理</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新增辅料
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="辅料种类" value={stats.total} />
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
          {accessoryTypes.map((type) => (
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

      {/* 辅料列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">辅料编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">辅料名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">供应商</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">单价</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">库存</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">最小库存</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccessories.map((accessory: PcsAccessory) => {
                  const isLowStock = accessory.min_stock && accessory.stock_qty < accessory.min_stock;
                  return (
                    <tr key={accessory.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{accessory.accessory_no}</td>
                      <td className="px-4 py-3 font-medium">{accessory.accessory_name}</td>
                      <td className="px-4 py-3 text-xs">{accessory.accessory_type}</td>
                      <td className="px-4 py-3 text-xs">{accessory.supplier || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[accessory.status]}`}>
                          {STATUS_ZH[accessory.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {accessory.unit_price ? `¥${accessory.unit_price.toFixed(2)}/${accessory.unit}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`tabular-nums ${isLowStock ? 'text-red-600 font-medium' : ''}`}>
                          {accessory.stock_qty} {accessory.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs">
                        {accessory.min_stock ? `${accessory.min_stock} ${accessory.unit}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                          查看
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
