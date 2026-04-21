'use client';

import { useState, useCallback } from 'react';
import { useFcsOrders } from '@/lib/hooks/useFcsOrders';
import { useAppStore } from '@/lib/store/appStore';
import type { ProductionOrder } from '@/lib/types';
import { Search, ChevronLeft, ChevronRight, Loader } from 'lucide-react';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'bg-gray-100 text-gray-700' },
  in_progress: { label: '进行中', color: 'bg-blue-100 text-blue-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '已取消', color: 'bg-red-100 text-red-700' },
};

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: '低', color: 'bg-gray-100 text-gray-700' },
  normal: { label: '中', color: 'bg-blue-100 text-blue-700' },
  high: { label: '高', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: '紧急', color: 'bg-red-100 text-red-700' },
};

export default function FcsOrdersPage() {
  const { openTab } = useAppStore();

  // 状态管理
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [limit] = useState(20);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 获取数据
  const { orders, pagination, isLoading, error } = useFcsOrders({
    page,
    limit,
    search: search || undefined,
    status: status || undefined,
    priority: priority || undefined,
    sortBy,
    order: sortOrder,
  });

  // 处理搜索
  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  // 处理状态过滤
  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  }, []);

  // 处理优先级过滤
  const handlePriorityChange = useCallback((newPriority: string) => {
    setPriority(newPriority);
    setPage(1);
  }, []);

  // 处理排序
  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  }, [sortBy, sortOrder]);

  // 打开订单详情页面（标签页）
  const handleOpenOrder = (order: ProductionOrder) => {
    openTab({
      id: `order-${order.id}`,
      key: `/dashboard/fcs/orders/${order.id}`,
      title: `订单 ${order.order_no}`,
      href: `/dashboard/fcs/orders/${order.id}`,
      subsystem: 'fcs',
    });
  };

  // 排序指示器
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return <span className="text-gray-400 ml-1">↕</span>;
    return (
      <span className="ml-1 text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">生产订单</h1>
          <p className="text-gray-600 mt-1">管理所有生产订单和计划</p>
        </div>
      </div>

      {/* 过滤和搜索栏 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 搜索框 */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索订单号、客户或产品..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* 状态过滤 */}
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">所有状态</option>
          <option value="pending">待处理</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>

        {/* 优先级过滤 */}
        <select
          value={priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">所有优先级</option>
          <option value="low">低</option>
          <option value="normal">中</option>
          <option value="high">高</option>
          <option value="urgent">紧急</option>
        </select>
      </div>

      {/* 表格容器 */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="text-blue-600 animate-spin" size={24} />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">错误: {error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">暂无数据</p>
          </div>
        ) : (
          <>
            {/* 表格 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('order_no')}>
                      订单号 {renderSortIndicator('order_no')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('customer_name')}>
                      客户 {renderSortIndicator('customer_name')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('product_name')}>
                      产品 {renderSortIndicator('product_name')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('quantity')}>
                      数量 {renderSortIndicator('quantity')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('priority')}>
                      优先级 {renderSortIndicator('priority')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}>
                      状态 {renderSortIndicator('status')}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('created_at')}>
                      创建时间 {renderSortIndicator('created_at')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order: ProductionOrder) => (
                    <tr
                      key={order.id}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => handleOpenOrder(order)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:text-blue-800">
                        {order.order_no}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.customer_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.product_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.quantity}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            PRIORITY_LABELS[order.priority]?.color || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {PRIORITY_LABELS[order.priority]?.label || order.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            STATUS_LABELS[order.status]?.color || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {STATUS_LABELS[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页器 */}
            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="text-sm text-gray-600">
                  共 <span className="font-semibold">{pagination.total}</span> 条，
                  第 <span className="font-semibold">{pagination.page}</span> /
                  <span className="font-semibold">{pagination.totalPages}</span> 页
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    title="上一页"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* 页码显示 */}
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum =
                        page <= 3
                          ? i + 1
                          : page >= pagination.totalPages - 2
                            ? pagination.totalPages - 4 + i
                            : page - 2 + i;

                      return (
                        pageNum >= 1 && pageNum <= pagination.totalPages && (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                              pageNum === page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                    disabled={page === pagination.totalPages}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    title="下一页"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 统计信息 */}
      {!isLoading && pagination && (
        <div className="text-sm text-gray-600">
          {orders.length > 0 ? (
            <>显示 {orders.length} 条数据</>
          ) : (
            <>暂无匹配的数据</>
          )}
        </div>
      )}
    </div>
  );
}
