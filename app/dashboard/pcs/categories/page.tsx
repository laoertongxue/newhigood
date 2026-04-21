'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { usePcsCategories } from '@/lib/hooks/usePcsResources';

export default function PcsCategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { categories, isLoading, error, pagination } = usePcsCategories({
    page,
    limit: 20,
    search: search || undefined,
  });

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
        <p className="text-gray-600 mt-1">维护商品分类编码与名称</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="搜索分类编码或名称..."
          className="w-full md:w-[420px] pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="text-blue-600 animate-spin" size={24} />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center"><p className="text-red-600">错误: {error}</p></div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center"><p className="text-gray-600">暂无数据</p></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">分类编码</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">分类名称</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{item.category_code}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.category_name}</td>
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
