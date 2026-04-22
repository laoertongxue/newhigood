'use client';

import { useState } from 'react';
import { usePcsSamples } from '@/lib/hooks/usePcsRealData';
import type { PcsSample } from '@/lib/hooks/usePcsRealData';

const SAMPLE_TYPE_ZH: Record<string, string> = {
  FIRST_SAMPLE: '首件样衣',
  SIZE_SAMPLE: '尺寸样',
  SALES_SAMPLE: '销售样',
  PRODUCTION_SAMPLE: '生产样',
};

const STATUS_ZH: Record<string, string> = {
  PENDING: '待接收',
  RECEIVED: '已接收',
  IN_REVIEW: '审核中',
  APPROVED: '已批准',
  REJECTED: '已拒绝',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  RECEIVED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default function PcsSamplesFirstSamplePage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // 使用真实 API
  const { samples, loading, error, refetch } = usePcsSamples();

  // 过滤首件样衣
  const firstSamples = samples.filter((s: PcsSample) => 
    s.sample_type === 'FIRST_SAMPLE' || s.sample_type === 'first_sample'
  );

  const filteredSamples = firstSamples.filter((s: PcsSample) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && s.sample_type !== typeFilter) return false;
    return true;
  });

  const stats = {
    total: firstSamples.length,
    pending: firstSamples.filter((s: PcsSample) => s.status === 'PENDING').length,
    inReview: firstSamples.filter((s: PcsSample) => s.status === 'IN_REVIEW').length,
    approved: firstSamples.filter((s: PcsSample) => s.status === 'APPROVED').length,
    rejected: firstSamples.filter((s: PcsSample) => s.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">首件样衣</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建首件
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="首件总数" value={stats.total} />
        <StatCard label="待接收" value={stats.pending} />
        <StatCard label="审核中" value={stats.inReview} highlightColor="text-amber-600" />
        <StatCard label="已批准" value={stats.approved} highlightColor="text-green-600" />
        <StatCard label="已拒绝" value={stats.rejected} highlightColor="text-red-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待接收</option>
          <option value="RECEIVED">已接收</option>
          <option value="IN_REVIEW">审核中</option>
          <option value="APPROVED">已批准</option>
          <option value="REJECTED">已拒绝</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="FIRST_SAMPLE">首件样衣</option>
          <option value="SIZE_SAMPLE">尺寸样</option>
          <option value="SALES_SAMPLE">销售样</option>
          <option value="PRODUCTION_SAMPLE">生产样</option>
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

      {/* 样衣列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">样衣编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">项目</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">样衣名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">款式编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">尺码</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">接收日期</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredSamples.map((sample: PcsSample) => (
                  <tr key={sample.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{sample.sample_no}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs">
                        {SAMPLE_TYPE_ZH[sample.sample_type] || sample.sample_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{sample.project_id || '-'}</td>
                    <td className="px-4 py-3 font-medium">{sample.sample_name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{sample.style_no || '-'}</td>
                    <td className="px-4 py-3 text-xs">{sample.size || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[sample.status]}`}>
                        {STATUS_ZH[sample.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{sample.received_date || '-'}</td>
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
