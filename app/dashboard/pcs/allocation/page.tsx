'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { usePcsAllocation } from '@/lib/hooks/usePcsResources';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  allocated: { label: '已分配', color: 'bg-blue-100 text-blue-700' },
  released: { label: '已释放', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-700' },
};

export default function PcsAllocationPage() {
  const [page, setPage] = useState(1);
  const [warehouse, setWarehouse] = useState('');
  const [status, setStatus] = useState('');

  const { allocations, isLoading, error, pagination } = usePcsAllocation({
    page,
    limit: 20,
    warehouse: warehouse || undefined,
    status: status || undefined,
  });

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">库存调度</h1>
        <p className="text-gray-600 mt-1">查看库存分配与库位执行状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            value={warehouse}
            onChange={(e) => {
              setWarehouse(e.target.value);
              setPage(1);
            }}
            placeholder="搜索库位..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">全部状态</option>
          <option value="allocated">已分配</option>
          <option value="released">已释放</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader className="text-blue-600 animate-spin" size={24} /><span className="ml-2 text-gray-600">加载中...</span></div>
        ) : error ? (
          <div className="p-8 text-center"><p className="text-red-600">错误: {error}</p></div>
        ) : allocations.length === 0 ? (
          <div className="p-8 text-center"><p className="text-gray-600">暂无数据</p></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">商品ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">协调单ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">分配数量</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">库位</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allocations.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{item.goods_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.coordination_order_id || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.allocated_quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.warehouse}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_LABELS[item.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_LABELS[item.status]?.label || item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-600">
                  共 <span className="font-semibold">{pagination.total}</span> 条，
                  第 <span className="font-semibold">{pagination.page}</span> /
                  <span className="font-semibold">{pagination.totalPages}</span> 页
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"><ChevronLeft size={18} /></button>
                  <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page === pagination.totalPages} className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"><ChevronRight size={18} /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
