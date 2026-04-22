'use client';

import { useState } from 'react';
import { useProductionOrders } from '@/lib/hooks/useFcsRealData';
import type { ProductionOrder } from '@/lib/hooks/useFcsRealData';

const STATUS_ZH: Record<string, string> = {
  PENDING: '待生产',
  IN_PRODUCTION: '生产中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  IN_PRODUCTION: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-300',
};

const PRIORITY_ZH: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  URGENT: '紧急',
};

const PRIORITY_CLASS: Record<string, string> = {
  LOW: 'text-gray-500',
  MEDIUM: 'text-blue-600',
  HIGH: 'text-amber-600',
  URGENT: 'text-red-600',
};

export default function FcsProductionOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // 使用真实 API
  const { orders, loading, error, refetch } = useProductionOrders();

  const filteredOrders = orders.filter((o: ProductionOrder) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && o.priority !== priorityFilter) return false;
    return true;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o: ProductionOrder) => o.status === 'PENDING').length,
    inProduction: orders.filter((o: ProductionOrder) => o.status === 'IN_PRODUCTION').length,
    completed: orders.filter((o: ProductionOrder) => o.status === 'COMPLETED').length,
    totalQty: orders.reduce((sum, o: ProductionOrder) => sum + o.quantity, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">生产订单</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建订单
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="订单总数" value={stats.total} />
        <StatCard label="待生产" value={stats.pending} />
        <StatCard label="生产中" value={stats.inProduction} highlightColor="text-blue-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
        <StatCard label="订单总量" value={stats.totalQty} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待生产</option>
          <option value="IN_PRODUCTION">生产中</option>
          <option value="COMPLETED">已完成</option>
          <option value="CANCELLED">已取消</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="ALL">全部优先级</option>
          <option value="URGENT">紧急</option>
          <option value="HIGH">高</option>
          <option value="MEDIUM">中</option>
          <option value="LOW">低</option>
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

      {/* 订单列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">订单编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">客户</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">产品</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">优先级</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">数量</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">开始日期</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">截止日期</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: ProductionOrder) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{order.order_no}</td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3 font-medium">{order.product_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[order.status]}`}>
                        {STATUS_ZH[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${PRIORITY_CLASS[order.priority]}`}>
                        {PRIORITY_ZH[order.priority]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums">{order.quantity}</td>
                    <td className="px-4 py-3 text-xs">{order.start_date}</td>
                    <td className="px-4 py-3 text-xs">{order.end_date}</td>
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
