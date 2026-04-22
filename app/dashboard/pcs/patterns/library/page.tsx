'use client';

import { useState } from 'react';
import Link from 'next/link';

const PATTERN_TYPE_ZH: Record<string, string> = {
  BASIC: '基础版',
  ADVANCED: '进阶版',
  CUSTOM: '自定义',
};

const STATUS_ZH: Record<string, string> = {
  DRAFT: '草稿',
  ACTIVE: '启用',
  ARCHIVED: '归档',
};

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'bg-gray-50 text-gray-700 border-gray-200',
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  ARCHIVED: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function PcsPatternsLibraryPage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const patterns = [
    { id: '1', pattern_no: 'PTL-001', pattern_name: '经典衬衫版', pattern_type: 'BASIC', size_range: 'S-3XL', version: 'v2.1', status: 'ACTIVE', updated_at: '2024-01-15' },
    { id: '2', pattern_no: 'PTL-002', pattern_name: '修身西装版', pattern_type: 'ADVANCED', size_range: 'M-2XL', version: 'v1.5', status: 'ACTIVE', updated_at: '2024-01-10' },
    { id: '3', pattern_no: 'PTL-003', pattern_name: '休闲T恤版', pattern_type: 'BASIC', size_range: 'XS-4XL', version: 'v3.0', status: 'ACTIVE', updated_at: '2024-01-08' },
    { id: '4', pattern_no: 'PTL-004', pattern_name: '定制礼服版', pattern_type: 'CUSTOM', size_range: '定制', version: 'v1.0', status: 'DRAFT', updated_at: '2024-01-05' },
    { id: '5', pattern_no: 'PTL-005', pattern_name: '运动短裤版', pattern_type: 'BASIC', size_range: 'S-3XL', version: 'v2.0', status: 'ARCHIVED', updated_at: '2023-12-20' },
  ];

  const filteredPatterns = patterns.filter((p) => {
    if (typeFilter !== 'ALL' && p.pattern_type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: patterns.length,
    active: patterns.filter((p) => p.status === 'ACTIVE').length,
    draft: patterns.filter((p) => p.status === 'DRAFT').length,
    archived: patterns.filter((p) => p.status === 'ARCHIVED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">版单库</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/pcs/patterns/create" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            新建版单
          </Link>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="版单总数" value={stats.total} />
        <StatCard label="启用中" value={stats.active} highlightColor="text-green-600" />
        <StatCard label="草稿" value={stats.draft} />
        <StatCard label="已归档" value={stats.archived} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="BASIC">基础版</option>
          <option value="ADVANCED">进阶版</option>
          <option value="CUSTOM">自定义</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">启用</option>
          <option value="DRAFT">草稿</option>
          <option value="ARCHIVED">归档</option>
        </select>
      </div>

      {/* 版单列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">版单编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">版单名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">尺码范围</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">版本</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatterns.map((pattern) => (
                <tr key={pattern.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{pattern.pattern_no}</td>
                  <td className="px-4 py-3 font-medium">{pattern.pattern_name}</td>
                  <td className="px-4 py-3 text-xs">{PATTERN_TYPE_ZH[pattern.pattern_type]}</td>
                  <td className="px-4 py-3 text-xs">{pattern.size_range}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded border px-2 py-0.5 text-xs bg-gray-50 border-gray-200">
                      {pattern.version}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[pattern.status]}`}>
                      {STATUS_ZH[pattern.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{pattern.updated_at}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/pcs/patterns/library/${pattern.id}`} className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                      查看
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
