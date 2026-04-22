'use client';

import { useState } from 'react';

const OPERATION_ZH: Record<string, string> = {
  IN: '入库',
  OUT: '出库',
  TRANSFER: '调拨',
  ADJUST: '调整',
  DISPOSE: '处理',
};

export default function PcsSamplesLedgerPage() {
  const [dateRange, setDateRange] = useState<string>('ALL');

  // Mock 数据
  const ledger = [
    { id: '1', sample_no: 'SMP-001', operation: 'IN', quantity: 2, operator: '张三', time: '2024-01-15 10:30', note: '首批入库' },
    { id: '2', sample_no: 'SMP-002', operation: 'OUT', quantity: 1, operator: '李四', time: '2024-01-14 14:20', note: '借出给设计部' },
    { id: '3', sample_no: 'SMP-003', operation: 'TRANSFER', quantity: 1, operator: '王五', time: '2024-01-13 09:15', note: '从A区调至B区' },
    { id: '4', sample_no: 'SMP-004', operation: 'DISPOSE', quantity: 1, operator: '赵六', time: '2024-01-12 16:45', note: '损坏处理' },
    { id: '5', sample_no: 'SMP-001', operation: 'OUT', quantity: 1, operator: '李四', time: '2024-01-11 11:00', note: '送检' },
  ];

  const stats = {
    totalIn: ledger.filter((l) => l.operation === 'IN').reduce((sum, l) => sum + l.quantity, 0),
    totalOut: ledger.filter((l) => l.operation === 'OUT').reduce((sum, l) => sum + l.quantity, 0),
    totalTransfer: ledger.filter((l) => l.operation === 'TRANSFER').reduce((sum, l) => sum + l.quantity, 0),
    totalDispose: ledger.filter((l) => l.operation === 'DISPOSE').reduce((sum, l) => sum + l.quantity, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">样衣台账</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          导出台账
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="入库总数" value={stats.totalIn} highlightColor="text-green-600" />
        <StatCard label="出库总数" value={stats.totalOut} highlightColor="text-blue-600" />
        <StatCard label="调拨总数" value={stats.totalTransfer} highlightColor="text-amber-600" />
        <StatCard label="处理总数" value={stats.totalDispose} highlightColor="text-red-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="ALL">全部时间</option>
          <option value="TODAY">今天</option>
          <option value="WEEK">本周</option>
          <option value="MONTH">本月</option>
        </select>
      </div>

      {/* 台账列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">样衣编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">操作类型</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">数量</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">操作人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">操作时间</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">备注</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{item.sample_no}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${
                      item.operation === 'IN' ? 'bg-green-50 text-green-700 border-green-200' :
                      item.operation === 'OUT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      item.operation === 'TRANSFER' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      item.operation === 'DISPOSE' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {OPERATION_ZH[item.operation]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-xs">{item.operator}</td>
                  <td className="px-4 py-3 text-xs">{item.time}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{item.note}</td>
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
