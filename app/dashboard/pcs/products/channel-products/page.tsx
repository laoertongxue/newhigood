'use client';

import { useState } from 'react';

const STATUS_ZH: Record<string, string> = {
  ACTIVE: '已上架',
  INACTIVE: '已下架',
  PENDING: '待上架',
};

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  INACTIVE: 'bg-gray-100 text-gray-500 border-gray-300',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function PcsChannelProductsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  // Mock 数据
  const products = [
    { id: '1', sku: 'SKU-001', product_name: '经典衬衫（男款）', channel: '天猫旗舰店', price: 299, stock: 500, status: 'ACTIVE', updated_at: '2024-01-15' },
    { id: '2', sku: 'SKU-002', product_name: '修身西装（男款）', channel: '京东自营店', price: 899, stock: 200, status: 'ACTIVE', updated_at: '2024-01-14' },
    { id: '3', sku: 'SKU-003', product_name: '休闲T恤（女款）', channel: '抖音小店', price: 129, stock: 0, status: 'INACTIVE', updated_at: '2024-01-13' },
    { id: '4', sku: 'SKU-004', product_name: '运动短裤（男女同款）', channel: '天猫旗舰店', price: 159, stock: 100, status: 'PENDING', updated_at: '2024-01-12' },
    { id: '5', sku: 'SKU-005', product_name: '定制礼服（男款）', channel: '唯品会', price: 1999, stock: 50, status: 'ACTIVE', updated_at: '2024-01-10' },
  ];

  const filteredProducts = products.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (channelFilter !== 'ALL' && p.channel !== channelFilter) return false;
    return true;
  });

  const channels = [...new Set(products.map((p) => p.channel))];

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'ACTIVE').length,
    inactive: products.filter((p) => p.status === 'INACTIVE').length,
    pending: products.filter((p) => p.status === 'PENDING').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">渠道店铺商品</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          同步商品
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="商品总数" value={stats.total} />
        <StatCard label="已上架" value={stats.active} highlightColor="text-green-600" />
        <StatCard label="已下架" value={stats.inactive} />
        <StatCard label="待上架" value={stats.pending} highlightColor="text-amber-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
        >
          <option value="ALL">全部渠道</option>
          {channels.map((ch) => (
            <option key={ch} value={ch}>{ch}</option>
          ))}
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">已上架</option>
          <option value="INACTIVE">已下架</option>
          <option value="PENDING">待上架</option>
        </select>
      </div>

      {/* 商品列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">SKU编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">商品名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">渠道</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">价格</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">库存</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3 font-medium">{product.product_name}</td>
                  <td className="px-4 py-3 text-xs">{product.channel}</td>
                  <td className="px-4 py-3 text-right">¥{product.price}</td>
                  <td className="px-4 py-3 text-right">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[product.status]}`}>
                      {STATUS_ZH[product.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{product.updated_at}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                      编辑
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
