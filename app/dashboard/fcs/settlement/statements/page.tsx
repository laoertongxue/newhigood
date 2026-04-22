'use client';

import { useState } from 'react';
import { useSettlementStatements } from '@/lib/hooks/useFcsRealData';
import type { SettlementStatement } from '@/lib/hooks/useFcsRealData';

const STATUS_ZH: Record<string, string> = {
  DRAFT: '草稿',
  CONFIRMED: '已确认',
  CLOSED: '已关闭',
  PAID: '已付款',
};

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'bg-gray-50 text-gray-700 border-gray-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  CLOSED: 'bg-green-50 text-green-700 border-green-200',
  PAID: 'bg-green-50 text-green-700 border-green-200',
};

export default function FcsSettlementStatementsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 使用真实 API
  const { statements, loading, error, refetch } = useSettlementStatements();

  const filteredStatements = statements.filter((s: SettlementStatement) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: statements.length,
    draft: statements.filter((s: SettlementStatement) => s.status === 'DRAFT').length,
    confirmed: statements.filter((s: SettlementStatement) => s.status === 'CONFIRMED').length,
    paid: statements.filter((s: SettlementStatement) => s.status === 'PAID').length + statements.filter((s: SettlementStatement) => s.status === 'CLOSED').length,
    totalAmount: statements.reduce((sum, s: SettlementStatement) => sum + s.total_amount, 0),
    pendingPayment: statements.filter((s: SettlementStatement) => s.status === 'CONFIRMED').reduce((sum, s: SettlementStatement) => sum + s.net_amount, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">对账单</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          生成对账单
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="对账单总数" value={stats.total} />
        <StatCard label="草稿" value={stats.draft} highlight={stats.draft > 0} highlightColor="text-gray-600" />
        <StatCard label="已确认" value={stats.confirmed} highlightColor="text-blue-600" />
        <StatCard label="已关闭" value={stats.paid} highlightColor="text-green-600" />
        <StatCard label="待付款金额" value={`¥${(stats.pendingPayment / 10000).toFixed(1)}万`} highlight={stats.pendingPayment > 0} highlightColor="text-amber-600" />
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
          <option value="CONFIRMED">已确认</option>
          <option value="PAID">已付款</option>
          <option value="CLOSED">已关闭</option>
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

      {/* 对账单列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">对账单号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">工厂</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">账单月份</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">明细项数</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">总金额</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">扣款金额</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">结算金额</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">创建时间</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredStatements.map((stmt: SettlementStatement) => (
                  <tr key={stmt.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{stmt.statement_no}</td>
                    <td className="px-4 py-3 text-xs">{stmt.factory_name}</td>
                    <td className="px-4 py-3 text-xs">{stmt.statement_month}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[stmt.status]}`}>
                        {STATUS_ZH[stmt.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{stmt.item_count}</td>
                    <td className="px-4 py-3 text-right tabular-nums">¥{stmt.total_amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-red-600">-¥{stmt.deduction_amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">¥{stmt.net_amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs">{stmt.created_at}</td>
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
