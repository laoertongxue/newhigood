'use client';

import { useState } from 'react';
import { useQualityRecords } from '@/lib/hooks/useFcsRealData';
import type { QualityRecord } from '@/lib/hooks/useFcsRealData';

const RESULT_ZH: Record<string, string> = {
  PASS: '合格',
  FAIL: '不合格',
};

const RESULT_CLASS: Record<string, string> = {
  PASS: 'bg-green-50 text-green-700 border-green-200',
  FAIL: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_ZH: Record<string, string> = {
  SUBMITTED: '待处理',
  CLOSED: '已结案',
};

const STATUS_CLASS: Record<string, string> = {
  SUBMITTED: 'bg-blue-50 text-blue-700 border-blue-200',
  CLOSED: 'bg-gray-50 text-gray-700 border-gray-200',
};

const LIABILITY_ZH: Record<string, string> = {
  DRAFT: '草稿',
  CONFIRMED: '已确认',
  DISPUTED: '争议中',
  VOID: '已作废',
};

const LIABILITY_CLASS: Record<string, string> = {
  DRAFT: 'bg-gray-50 text-gray-700 border-gray-200',
  CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
  DISPUTED: 'bg-orange-50 text-orange-700 border-orange-200',
  VOID: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function FcsQualityQcRecordsPage() {
  const [resultFilter, setResultFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 使用真实 API
  const { records, loading, error, refetch } = useQualityRecords();

  const filteredRecords = records.filter((r: QualityRecord) => {
    if (resultFilter !== 'ALL' && r.result !== resultFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: records.length,
    pass: records.filter((r: QualityRecord) => r.result === 'PASS').length,
    fail: records.filter((r: QualityRecord) => r.result === 'FAIL').length,
    pending: records.filter((r: QualityRecord) => r.status === 'SUBMITTED').length,
    disputed: records.filter((r: QualityRecord) => r.liability_status === 'DISPUTED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">质检记录</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建质检
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="质检总数" value={stats.total} />
        <StatCard label="合格" value={stats.pass} highlightColor="text-green-600" />
        <StatCard label="不合格" value={stats.fail} highlight={stats.fail > 0} highlightColor="text-red-600" />
        <StatCard label="待处理" value={stats.pending} highlight={stats.pending > 0} highlightColor="text-blue-600" />
        <StatCard label="争议中" value={stats.disputed} highlight={stats.disputed > 0} highlightColor="text-orange-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={resultFilter}
          onChange={(e) => setResultFilter(e.target.value)}
        >
          <option value="ALL">全部结果</option>
          <option value="PASS">合格</option>
          <option value="FAIL">不合格</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="SUBMITTED">待处理</option>
          <option value="CLOSED">已结案</option>
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

      {/* 质检记录列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">质检单号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">生产单</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">工厂</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">质检结果</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">判责状态</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">批次数量</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">合格率</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">质检日期</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record: QualityRecord) => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{record.record_no}</td>
                    <td className="px-4 py-3 font-mono text-xs">{record.production_order_id || '-'}</td>
                    <td className="px-4 py-3 text-xs">{record.factory_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${RESULT_CLASS[record.result]}`}>
                        {RESULT_ZH[record.result]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[record.status]}`}>
                        {STATUS_ZH[record.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record.liability_status ? (
                        <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${LIABILITY_CLASS[record.liability_status]}`}>
                          {LIABILITY_ZH[record.liability_status]}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">{record.batch_qty}</td>
                    <td className="px-4 py-3">
                      <span className={`tabular-nums ${record.pass_rate >= 90 ? 'text-green-600' : record.pass_rate >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
                        {record.pass_rate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{record.inspect_date}</td>
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
