'use client';

import { useMemo, useState } from 'react';
import { Search, RefreshCw, Download, FileText, Loader } from 'lucide-react';
import { useFcsOrders } from '@/lib/hooks/useFcsOrders';

const statusOptions = [
  { value: '', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

export default function FcsProductionOrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page] = useState(1);

  const { orders, isLoading, error } = useFcsOrders({
    page,
    limit: 20,
    search: search || undefined,
    status: status || undefined,
    sortBy: 'created_at',
    order: 'desc',
  });

  const reminder = useMemo(() => {
    const preview = Math.max(0, orders.length - 2);
    const pending = orders.filter((o) => o.status === 'pending').length;
    const confirmed = orders.filter((o) => o.status === 'completed').length;
    return { preview, pending, confirmed };
  }, [orders]);

  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-full">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">生产单管理</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-100">
            <FileText size={16} className="mr-1" /> 从需求生成
          </button>
          <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-100">
            <Download size={16} className="mr-1" /> 导出
          </button>
          <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-gray-100">
            <RefreshCw size={16} className="mr-1" /> 刷新
          </button>
        </div>
      </header>

      <section className="rounded-lg border bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              className="h-10 w-full rounded-md border pl-9 pr-3 text-sm"
              placeholder="单号/客户/产品"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-md border px-3 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="rounded-lg border bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">领料待处理提示：</span>
          <Tag text={`预览草稿：${reminder.preview} 单`} tone="slate" />
          <Tag text={`实际草稿待确认：${reminder.pending} 单`} tone="amber" />
          <Tag text={`已确认领料：${reminder.confirmed} 单`} tone="green" />
        </div>
      </section>

      <section className="rounded-lg border bg-white overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center text-gray-600">
            <Loader size={18} className="animate-spin mr-2" /> 加载中...
          </div>
        ) : error ? (
          <div className="p-8 text-red-600">错误: {error}</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-gray-500 text-center">暂无生产单</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">订单号</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">客户</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">产品</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">数量</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">状态</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-medium">优先级</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-blue-600 font-medium">{order.order_no}</td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3">{order.product_name}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3">{order.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Tag({ text, tone }: { text: string; tone: 'slate' | 'amber' | 'green' }) {
  const toneClass = {
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    green: 'border-green-200 bg-green-50 text-green-700',
  }[tone];

  return <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs ${toneClass}`}>{text}</span>;
}
