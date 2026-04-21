'use client';

import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useFcsLines } from '@/lib/hooks/useFcsResources';

export default function FcsLinesPage() {
  const [status, setStatus] = useState('');
  const { lines, isLoading, error } = useFcsLines({ status: status || undefined, limit: 20 });

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-900">产线管理</h1>

      <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg bg-white w-56">
        <option value="">全部状态</option>
        <option value="active">启用</option>
        <option value="inactive">停用</option>
      </select>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? <div className="p-8 flex items-center text-gray-600"><Loader size={18} className="animate-spin mr-2" />加载中...</div> : error ? <div className="p-8 text-red-600">错误: {error}</div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">产线名称</th>
                <th className="px-4 py-3 text-left">编码</th>
                <th className="px-4 py-3 text-left">产能</th>
                <th className="px-4 py-3 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">{item.line_name}</td>
                  <td className="px-4 py-3">{item.line_code}</td>
                  <td className="px-4 py-3">{item.capacity}</td>
                  <td className="px-4 py-3">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
