'use client';

import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useFcsPlans } from '@/lib/hooks/useFcsResources';

export default function FcsPlansPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { plans, isLoading, error, pagination } = useFcsPlans({ search: search || undefined, status: status || undefined, limit: 20 });

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-900">生产计划</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索计划号/负责人"
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg bg-white">
          <option value="">全部状态</option>
          <option value="draft">草稿</option>
          <option value="scheduled">已排产</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? <Loading /> : error ? <ErrorMessage error={error} /> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">计划号</th>
                <th className="px-4 py-3 text-left">负责人</th>
                <th className="px-4 py-3 text-left">开始</th>
                <th className="px-4 py-3 text-left">结束</th>
                <th className="px-4 py-3 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">{item.plan_no}</td>
                  <td className="px-4 py-3">{item.assigned_worker}</td>
                  <td className="px-4 py-3">{new Date(item.start_time).toLocaleString('zh-CN')}</td>
                  <td className="px-4 py-3">{new Date(item.end_time).toLocaleString('zh-CN')}</td>
                  <td className="px-4 py-3">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-sm text-gray-600">共 {pagination?.total || 0} 条</p>
    </div>
  );
}

function Loading() {
  return <div className="p-8 flex items-center text-gray-600"><Loader size={18} className="animate-spin mr-2" />加载中...</div>;
}

function ErrorMessage({ error }: { error: string }) {
  return <div className="p-8 text-red-600">错误: {error}</div>;
}
