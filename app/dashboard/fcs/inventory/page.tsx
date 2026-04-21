'use client';

import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useFcsInventory } from '@/lib/hooks/useFcsResources';

export default function FcsInventoryPage() {
  const [status, setStatus] = useState('');
  const { inventory, isLoading, error } = useFcsInventory({ status: status || undefined, limit: 20 });

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-900">库存</h1>

      <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg bg-white w-56">
        <option value="">全部状态</option>
        <option value="normal">正常</option>
        <option value="low">低库存</option>
        <option value="out_of_stock">缺货</option>
      </select>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? <div className="p-8 flex items-center text-gray-600"><Loader size={18} className="animate-spin mr-2" />加载中...</div> : error ? <div className="p-8 text-red-600">错误: {error}</div> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">物料编码</th>
                <th className="px-4 py-3 text-left">物料名称</th>
                <th className="px-4 py-3 text-left">库存</th>
                <th className="px-4 py-3 text-left">安全库存</th>
                <th className="px-4 py-3 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">{item.item_code}</td>
                  <td className="px-4 py-3">{item.item_name}</td>
                  <td className="px-4 py-3">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-3">{item.safety_stock}</td>
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
