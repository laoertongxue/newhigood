'use client';

import { useState } from 'react';

const STATUS_ZH: Record<string, string> = {
  PENDING: '待审批',
  APPROVED: '已批准',
  PROCURED: '已采购',
  PARTIAL: '部分到货',
  COMPLETED: '已完成',
  REJECTED: '已拒绝',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCURED: 'bg-purple-50 text-purple-700 border-purple-200',
  PARTIAL: 'bg-orange-50 text-orange-700 border-orange-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default function PcsMaterialsPurchasePage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const purchases = [
    { id: '1', purchase_no: 'PUR-001', material_name: '纯棉面料（白色）', material_type: '面料', specs: '150cm幅宽', unit: '米', quantity: 100, unit_price: 35, total_price: 3500, supplier: '纺织供应商A', applicant: '张三', apply_date: '2024-01-15', status: 'COMPLETED' },
    { id: '2', purchase_no: 'PUR-002', material_name: '尼龙拉链（黑色）', material_type: '辅料', specs: '5号树脂', unit: '条', quantity: 500, unit_price: 2.5, total_price: 1250, supplier: '拉链供应商B', applicant: '李四', apply_date: '2024-01-14', status: 'PARTIAL' },
    { id: '3', purchase_no: 'PUR-003', material_name: '涤纶里布', material_type: '面料', specs: '140cm幅宽', unit: '米', quantity: 200, unit_price: 18, total_price: 3600, supplier: '纺织供应商A', applicant: '王五', apply_date: '2024-01-13', status: 'PENDING' },
    { id: '4', purchase_no: 'PUR-004', material_name: '金属纽扣', material_type: '辅料', specs: '18mm金色', unit: '颗', quantity: 1000, unit_price: 0.8, total_price: 800, supplier: '纽扣供应商C', applicant: '赵六', apply_date: '2024-01-12', status: 'REJECTED' },
  ];

  const filteredPurchases = purchases.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: purchases.length,
    pending: purchases.filter((p) => p.status === 'PENDING').length,
    inProgress: purchases.filter((p) => ['APPROVED', 'PROCURED', 'PARTIAL'].includes(p.status)).length,
    completed: purchases.filter((p) => p.status === 'COMPLETED').length,
    totalAmount: purchases.reduce((sum, p) => sum + p.total_price, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">物料采购申请</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建采购
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="采购总数" value={stats.total} />
        <StatCard label="待审批" value={stats.pending} highlightColor="text-amber-600" />
        <StatCard label="进行中" value={stats.inProgress} highlightColor="text-purple-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
        <StatCard label="总金额" value={`¥${stats.totalAmount.toLocaleString()}`} highlightColor="text-blue-600" />
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
          <option value="PROCURED">已采购</option>
          <option value="PARTIAL">部分到货</option>
          <option value="COMPLETED">已完成</option>
          <option value="REJECTED">已拒绝</option>
        </select>
      </div>

      {/* 采购列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">采购单号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">物料名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">规格</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">数量</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">单价</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">总金额</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">供应商</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">申请人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{item.purchase_no}</td>
                  <td className="px-4 py-3 font-medium">{item.material_name}</td>
                  <td className="px-4 py-3 text-xs">{item.material_type}</td>
                  <td className="px-4 py-3 text-xs">{item.specs}</td>
                  <td className="px-4 py-3 text-center">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3 text-right">¥{item.unit_price}</td>
                  <td className="px-4 py-3 text-right font-medium">¥{item.total_price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{item.supplier}</td>
                  <td className="px-4 py-3 text-xs">{item.applicant}</td>
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

function StatCard({ label, value, highlightColor = 'text-gray-900' }: { label: string; value: number | string; highlightColor?: string }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${highlightColor}`}>{value}</p>
    </div>
  );
}
