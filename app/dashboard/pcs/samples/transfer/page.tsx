'use client';

import { useState } from 'react';

const STATUS_ZH: Record<string, string> = {
  PENDING: '待审批',
  APPROVED: '已批准',
  IN_TRANSIT: '调拨中',
  COMPLETED: '已完成',
  REJECTED: '已拒绝',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_TRANSIT: 'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default function PcsSamplesTransferPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const transfers = [
    { id: '1', transfer_no: 'TRF-001', sample_no: 'SMP-001', sample_name: '经典衬衫样衣', from_location: 'A区-01-01', to_location: 'B区-02-01', quantity: 1, applicant: '张三', apply_date: '2024-01-15', status: 'COMPLETED' },
    { id: '2', transfer_no: 'TRF-002', sample_no: 'SMP-002', sample_name: '修身西装样衣', from_location: 'A区-01-02', to_location: 'C区-01-01', quantity: 1, applicant: '李四', apply_date: '2024-01-14', status: 'IN_TRANSIT' },
    { id: '3', transfer_no: 'TRF-003', sample_no: 'SMP-003', sample_name: '休闲T恤样衣', from_location: 'B区-02-01', to_location: 'A区-01-03', quantity: 1, applicant: '王五', apply_date: '2024-01-13', status: 'PENDING' },
    { id: '4', transfer_no: 'TRF-004', sample_no: 'SMP-004', sample_name: '运动短裤样衣', from_location: 'B区-02-02', to_location: 'D区-01-01', quantity: 1, applicant: '赵六', apply_date: '2024-01-12', status: 'REJECTED' },
  ];

  const filteredTransfers = transfers.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: transfers.length,
    pending: transfers.filter((t) => t.status === 'PENDING').length,
    inTransit: transfers.filter((t) => t.status === 'IN_TRANSIT').length,
    completed: transfers.filter((t) => t.status === 'COMPLETED').length,
    rejected: transfers.filter((t) => t.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">样衣调拨</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建调拨
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="调拨总数" value={stats.total} />
        <StatCard label="待审批" value={stats.pending} highlightColor="text-amber-600" />
        <StatCard label="调拨中" value={stats.inTransit} highlightColor="text-purple-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
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
          <option value="PENDING">待审批</option>
          <option value="APPROVED">已批准</option>
          <option value="IN_TRANSIT">调拨中</option>
          <option value="COMPLETED">已完成</option>
          <option value="REJECTED">已拒绝</option>
        </select>
      </div>

      {/* 调拨列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">调拨编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">样衣编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">样衣名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">调出位置</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">调入位置</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">数量</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">申请人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">申请日期</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{item.transfer_no}</td>
                  <td className="px-4 py-3 font-mono text-xs">{item.sample_no}</td>
                  <td className="px-4 py-3 font-medium">{item.sample_name}</td>
                  <td className="px-4 py-3 text-xs">{item.from_location}</td>
                  <td className="px-4 py-3 text-xs">{item.to_location}</td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-xs">{item.applicant}</td>
                  <td className="px-4 py-3 text-xs">{item.apply_date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[item.status]}`}>
                      {STATUS_ZH[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                      详情
                    </button>
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
