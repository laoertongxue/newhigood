'use client';

import { useState } from 'react';
import { usePdaExportRecords } from '@/lib/hooks/usePdaRealData';
import type { PdaExportRecord } from '@/lib/hooks/usePdaRealData';

const EXPORT_TYPE_ZH: Record<string, string> = {
  PRODUCTION: '生产数据',
  QUALITY: '质检数据',
  INVENTORY: '库存数据',
  EXECUTION: '执行数据',
};

const FORMAT_ZH: Record<string, string> = {
  EXCEL: 'Excel',
  CSV: 'CSV',
  PDF: 'PDF',
};

const STATUS_ZH: Record<string, string> = {
  PENDING: '等待中',
  PROCESSING: '处理中',
  COMPLETED: '已完成',
  FAILED: '失败',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
};

export default function PdaExportPage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 使用真实 API
  const { records, loading, error, refetch } = usePdaExportRecords();

  const filteredRecords = records.filter((r: PdaExportRecord) => {
    if (typeFilter !== 'ALL' && r.export_type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: records.length,
    pending: records.filter((r: PdaExportRecord) => r.status === 'PENDING' || r.status === 'PROCESSING').length,
    completed: records.filter((r: PdaExportRecord) => r.status === 'COMPLETED').length,
    failed: records.filter((r: PdaExportRecord) => r.status === 'FAILED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">数据导出</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建导出
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="导出总数" value={stats.total} />
        <StatCard label="进行中" value={stats.pending} highlightColor="text-blue-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
        <StatCard label="失败" value={stats.failed} highlight={stats.failed > 0} highlightColor="text-red-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="PRODUCTION">生产数据</option>
          <option value="QUALITY">质检数据</option>
          <option value="INVENTORY">库存数据</option>
          <option value="EXECUTION">执行数据</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">等待中</option>
          <option value="PROCESSING">处理中</option>
          <option value="COMPLETED">已完成</option>
          <option value="FAILED">失败</option>
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

      {/* 导出记录列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">导出编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">格式</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">日期范围</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">记录数</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">文件大小</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">创建人</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record: PdaExportRecord) => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{record.export_no}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs">
                        {EXPORT_TYPE_ZH[record.export_type] || record.export_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded border px-2 py-0.5 text-xs bg-gray-50 border-gray-200">
                        {FORMAT_ZH[record.export_format] || record.export_format}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[record.status]}`}>
                        {STATUS_ZH[record.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{record.date_range || '-'}</td>
                    <td className="px-4 py-3 text-center tabular-nums">{record.record_count}</td>
                    <td className="px-4 py-3 text-xs">{record.file_size || '-'}</td>
                    <td className="px-4 py-3 text-xs">{record.created_by || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      {record.status === 'COMPLETED' && record.download_url ? (
                        <a 
                          href={record.download_url} 
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-50"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          下载
                        </a>
                      ) : (
                        <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                          查看
                        </button>
                      )}
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
