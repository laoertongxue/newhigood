'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { usePcsGoods } from '@/lib/hooks/usePcsResources';

const CATEGORY_LABELS: Record<string, string> = {
  fabric: '面料',
  accessory: '辅料',
  component: '组件',
  other: '其他',
};

export default function PcsGoodsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { goods, isLoading, error, pagination } = usePcsGoods({
    page,
    limit: 20,
    search: search || undefined,
    category: category || undefined,
  });

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">商品列表</h1>
        <p className="text-gray-600 mt-1">管理商品主数据与库存信息</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="搜索商品编码、名称或供应商..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">全部分类</option>
          <option value="fabric">面料</option>
          <option value="accessory">辅料</option>
          <option value="component">组件</option>
          <option value="other">其他</option>
        </select>
      </div>

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
        ) : goods.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">暂无数据</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">商品编码</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">商品名称</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">分类</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">供应商</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">单价</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">库存</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {goods.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{item.goods_code}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.goods_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{CATEGORY_LABELS[item.category] || item.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.supplier}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.price}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.stock_quantity}</td>
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
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                    disabled={page === pagination.totalPages}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
