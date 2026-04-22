'use client';

import { useState } from 'react';

const STATUS_ZH: Record<string, string> = {
  IN_STOCK: '库存',
  BORROWED: '借出',
  DAMAGED: '损坏',
  DISPOSED: '已处理',
};

const STATUS_CLASS: Record<string, string> = {
  IN_STOCK: 'bg-green-50 text-green-700 border-green-200',
  BORROWED: 'bg-amber-50 text-amber-700 border-amber-200',
  DAMAGED: 'bg-red-50 text-red-700 border-red-200',
  DISPOSED: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function PcsSamplesInventoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const inventory = [
    { id: '1', sample_no: 'SMP-001', sample_name: '经典衬衫样衣', size: 'M', location: 'A区-01-01', status: 'IN_STOCK', last_updated: '2024-01-15' },
    { id: '2', sample_no: 'SMP-002', sample_name: '修身西装样衣', size: 'L', location: 'A区-01-02', status: 'BORROWED', last_updated: '2024-01-14' },
    { id: '3', sample_no: 'SMP-003', sample_name: '休闲T恤样衣', size: 'S', location: 'B区-02-01', status: 'IN_STOCK', last_updated: '2024-01-13' },
    { id: '4', sample_no: 'SMP-004', sample_name: '运动短裤样衣', size: 'XL', location: 'B区-02-02', status: 'DAMAGED', last_updated: '2024-01-10' },
    { id: '5', sample_no: 'SMP-005', sample_name: '定制礼服样衣', size: 'M', location: 'C区-01-01', status: 'IN_STOCK', last_updated: '2024-01-08' },
  ];

  const filteredInventory = inventory.filter((i) => {
    if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: inventory.length,
    inStock: inventory.filter((i) => i.status === 'IN_STOCK').length,
    borrowed: inventory.filter((i) => i.status === 'BORROWED').length,
    damaged: inventory.filter((i) => i.status === 'DAMAGED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">样衣库存</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          扫码入库
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="库存总数" value={stats.total} />
        <StatCard label="在库" value={stats.inStock} highlightColor="text-green-600" />
        <StatCard label="借出" value={stats.borrowed} highlightColor="text-amber-600" />
        <StatCard label="损坏" value={stats.damaged} highlightColor="text-red-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="IN_STOCK">库存</option>
          <option value="BORROWED">借出</option>
          <option value="DAMAGED">损坏</option>
          <option value="DISPOSED">已处理</option>
        </select>
      </div>

      {/* 库存列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">样衣编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">样衣名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">尺码</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">存放位置</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{item.sample_no}</td>
                  <td className="px-4 py-3 font-medium">{item.sample_name}</td>
                  <td className="px-4 py-3 text-xs">{item.size}</td>
                  <td className="px-4 py-3 text-xs">{item.location}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[item.status]}`}>
                      {STATUS_ZH[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{item.last_updated}</td>
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
