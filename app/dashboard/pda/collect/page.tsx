'use client';

import { useState } from 'react';
import { usePdaCollectRecords } from '@/lib/hooks/usePdaRealData';
import type { PdaCollectRecord } from '@/lib/hooks/usePdaRealData';

const COLLECT_TYPE_ZH: Record<string, string> = {
  PRODUCTION: '生产采集',
  QUALITY: '质检采集',
  MATERIAL: '物料采集',
};

const STATUS_ZH: Record<string, string> = {
  PENDING: '待处理',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function PdaCollectPage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 使用真实 API
  const { records, loading, error, refetch } = usePdaCollectRecords();

  const filteredRecords = records.filter((r: PdaCollectRecord) => {
    if (typeFilter !== 'ALL' && r.collect_type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: records.length,
    pending: records.filter((r: PdaCollectRecord) => r.status === 'PENDING').length,
    completed: records.filter((r: PdaCollectRecord) => r.status === 'COMPLETED').length,
    totalQty: records.reduce((sum, r: PdaCollectRecord) => sum + r.quantity, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">采集记录</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建采集
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="采集总数" value={stats.total} />
        <StatCard label="待处理" value={stats.pending} highlightColor="text-amber-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
        <StatCard label="采集总量" value={stats.totalQty} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="PRODUCTION">生产采集</option>
          <option value="QUALITY">质检采集</option>
          <option value="MATERIAL">物料采集</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待处理</option>
          <option value="COMPLETED">已完成</option>
          <option value="CANCELLED">已取消</option>
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

      {/* 采集记录列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">采集编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">生产单</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">工人</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">数量</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">批次</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">采集时间</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record: PdaCollectRecord) => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{record.collect_no}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs">
                        {COLLECT_TYPE_ZH[record.collect_type] || record.collect_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{record.production_order_id || '-'}</td>
                    <td className="px-4 py-3">{record.worker_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[record.status]}`}>
                        {STATUS_ZH[record.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{record.quantity} {record.unit}</td>
                    <td className="px-4 py-3 text-xs">{record.batch_no || '-'}</td>
                    <td className="px-4 py-3 text-xs">{record.collect_time}</td>
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
  value: string | number; 
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
