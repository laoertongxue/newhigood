'use client';

import { useState } from 'react';
import { usePcsPatternRevisions } from '@/lib/hooks/usePcsRealData';
import type { PcsPatternRevision } from '@/lib/hooks/usePcsRealData';

const STATUS_ZH: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  REVIEWING: '审核中',
  APPROVED: '已批准',
  REJECTED: '已拒绝',
};

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'bg-gray-50 text-gray-700 border-gray-200',
  SUBMITTED: 'bg-blue-50 text-blue-700 border-blue-200',
  REVIEWING: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default function PcsPatternsRevisionPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 使用真实 API
  const { revisions, loading, error, refetch } = usePcsPatternRevisions();

  const filteredRevisions = revisions.filter((r: PcsPatternRevision) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: revisions.length,
    draft: revisions.filter((r: PcsPatternRevision) => r.status === 'DRAFT').length,
    reviewing: revisions.filter((r: PcsPatternRevision) => r.status === 'REVIEWING').length,
    approved: revisions.filter((r: PcsPatternRevision) => r.status === 'APPROVED').length,
    rejected: revisions.filter((r: PcsPatternRevision) => r.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">版单修订</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建修订
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="修订总数" value={stats.total} />
        <StatCard label="草稿" value={stats.draft} />
        <StatCard label="审核中" value={stats.reviewing} highlightColor="text-amber-600" />
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
          <option value="DRAFT">草稿</option>
          <option value="SUBMITTED">已提交</option>
          <option value="REVIEWING">审核中</option>
          <option value="APPROVED">已批准</option>
          <option value="REJECTED">已拒绝</option>
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

      {/* 修订列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">修订编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">版单名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">版本</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">修订原因</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">修订人</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">修订时间</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRevisions.map((revision: PcsPatternRevision) => (
                  <tr key={revision.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{revision.revision_no}</td>
                    <td className="px-4 py-3 font-medium">{revision.pattern_name}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded border px-2 py-0.5 text-xs bg-gray-50 border-gray-200">
                        v{revision.version}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[revision.status]}`}>
                        {STATUS_ZH[revision.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs max-w-xs truncate">{revision.revision_reason}</td>
                    <td className="px-4 py-3 text-xs">{revision.revised_by || '-'}</td>
                    <td className="px-4 py-3 text-xs">{revision.revised_at || '-'}</td>
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
