'use client';

import { useState } from 'react';
import { usePdaExecRecords } from '@/lib/hooks/usePdaRealData';
import type { PdaExecRecord } from '@/lib/hooks/usePdaRealData';

const STATUS_ZH: Record<string, string> = {
  RUNNING: '进行中',
  PAUSED: '已暂停',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const STATUS_CLASS: Record<string, string> = {
  RUNNING: 'bg-blue-50 text-blue-700 border-blue-200',
  PAUSED: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function PdaExecPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 使用真实 API
  const { records, loading, error, refetch } = usePdaExecRecords();

  const filteredRecords = records.filter((r: PdaExecRecord) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: records.length,
    running: records.filter((r: PdaExecRecord) => r.status === 'RUNNING').length,
    completed: records.filter((r: PdaExecRecord) => r.status === 'COMPLETED').length,
    totalQty: records.reduce((sum, r: PdaExecRecord) => sum + r.completed_qty, 0),
    targetQty: records.reduce((sum, r: PdaExecRecord) => sum + r.target_qty, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">执行记录</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建执行
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="执行总数" value={stats.total} />
        <StatCard label="进行中" value={stats.running} highlightColor="text-blue-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
        <StatCard label="完成进度" value={`${Math.round(stats.totalQty / stats.targetQty * 100)}%`} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="RUNNING">进行中</option>
          <option value="PAUSED">已暂停</option>
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

      {/* 执行记录列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">执行编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">任务</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">工人</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">开始时间</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">结束时间</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">完成数量</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record: PdaExecRecord) => (
                  <tr key={record.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{record.exec_no}</td>
                    <td className="px-4 py-3 font-mono text-xs">{record.task_id || '-'}</td>
                    <td className="px-4 py-3">{record.worker_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[record.status]}`}>
                        {STATUS_ZH[record.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{record.start_time}</td>
                    <td className="px-4 py-3 text-xs">{record.end_time || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="tabular-nums">{record.completed_qty}/{record.target_qty}</span>
                      <div className="w-16 h-1.5 rounded-full bg-gray-200 mt-1 overflow-hidden mx-auto">
                        <div 
                          className={`h-full ${record.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${record.target_qty > 0 ? record.completed_qty / record.target_qty * 100 : 0}%` }}
                        />
                      </div>
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
