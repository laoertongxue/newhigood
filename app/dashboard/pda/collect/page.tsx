'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { usePdaData } from '@/lib/hooks/usePdaResources';

const TYPE_LABELS: Record<string, string> = {
  temperature: '温度',
  humidity: '湿度',
  pressure: '压力',
  quantity: '数量',
  weight: '重量',
  other: '其他',
};

export default function PdaCollectPage() {
  const [page, setPage] = useState(1);
  const [orderId, setOrderId] = useState('');
  const [dataType, setDataType] = useState('');

  const { dataRows, isLoading, error, pagination } = usePdaData({
    page,
    limit: 20,
    order_id: orderId || undefined,
    data_type: dataType || undefined,
  });

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">数据采集</h1>
        <p className="text-gray-600 mt-1">查看生产现场上报的数据记录</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              setPage(1);
            }}
            placeholder="按订单ID过滤..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <select
          value={dataType}
          onChange={(e) => {
            setDataType(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">全部类型</option>
          <option value="temperature">温度</option>
          <option value="humidity">湿度</option>
          <option value="pressure">压力</option>
          <option value="quantity">数量</option>
          <option value="weight">重量</option>
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
          <div className="p-8 text-center"><p className="text-red-600">错误: {error}</p></div>
        ) : dataRows.length === 0 ? (
          <div className="p-8 text-center"><p className="text-gray-600">暂无数据</p></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">订单ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">类型</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">数值</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">单位</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">记录人</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">记录时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataRows.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{item.order_id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{TYPE_LABELS[item.data_type] || item.data_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.value}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.unit}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.recorded_by}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(item.recorded_at).toLocaleString('zh-CN')}</td>
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
                  <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page === pagination.totalPages} className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100">
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
