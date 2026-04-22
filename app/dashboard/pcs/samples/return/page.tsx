'use client';

import { useState } from 'react';

const STATUS_ZH: Record<string, string> = {
  PENDING: '待处理',
  RETURNED: '已退回',
  INSPECTED: '已验收',
  REJECTED: '已拒收',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  RETURNED: 'bg-blue-50 text-blue-700 border-blue-200',
  INSPECTED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default function PcsSamplesReturnPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const returns = [
    { id: '1', return_no: 'RET-001', sample_no: 'SMP-001', sample_name: '经典衬衫样衣', borrower: '张三', borrow_date: '2024-01-10', return_date: '2024-01-15', status: 'RETURNED', condition: '良好' },
    { id: '2', return_no: 'RET-002', sample_no: 'SMP-002', sample_name: '修身西装样衣', borrower: '李四', borrow_date: '2024-01-08', return_date: '2024-01-14', status: 'INSPECTED', condition: '良好' },
    { id: '3', return_no: 'RET-003', sample_no: 'SMP-003', sample_name: '休闲T恤样衣', borrower: '王五', borrow_date: '2024-01-12', return_date: '2024-01-16', status: 'PENDING', condition: '-' },
    { id: '4', return_no: 'RET-004', sample_no: 'SMP-004', sample_name: '运动短裤样衣', borrower: '赵六', borrow_date: '2024-01-05', return_date: '2024-01-12', status: 'REJECTED', condition: '损坏' },
  ];

  const filteredReturns = returns.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: returns.length,
    pending: returns.filter((r) => r.status === 'PENDING').length,
    returned: returns.filter((r) => r.status === 'RETURNED').length,
    inspected: returns.filter((r) => r.status === 'INSPECTED').length,
    rejected: returns.filter((r) => r.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">样衣退回</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          扫码退回
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="退回总数" value={stats.total} />
        <StatCard label="待处理" value={stats.pending} highlightColor="text-amber-600" />
        <StatCard label="已退回" value={stats.returned} highlightColor="text-blue-600" />
        <StatCard label="已验收" value={stats.inspected} highlightColor="text-green-600" />
        <StatCard label="已拒收" value={stats.rejected} highlightColor="text-red-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待处理</option>
          <option value="RETURNED">已退回</option>
          <option value="INSPECTED">已验收</option>
          <option value="REJECTED">已拒收</option>
        </select>
      </div>

      {/* 退回列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">退回编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">样衣编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">样衣名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">借用人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">借出日期</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">退回日期</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{item.return_no}</td>
                  <td className="px-4 py-3 font-mono text-xs">{item.sample_no}</td>
                  <td className="px-4 py-3 font-medium">{item.sample_name}</td>
                  <td className="px-4 py-3 text-xs">{item.borrower}</td>
                  <td className="px-4 py-3 text-xs">{item.borrow_date}</td>
                  <td className="px-4 py-3 text-xs">{item.return_date}</td>
                  <td className="px-4 py-3 text-xs">{item.condition}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[item.status]}`}>
                      {STATUS_ZH[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                      处理
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
