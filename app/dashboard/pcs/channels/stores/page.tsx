'use client';

import { useState } from 'react';
import { usePcsStores } from '@/lib/hooks/usePcsRealData';
import type { PcsStore } from '@/lib/hooks/usePcsRealData';

const STATUS_ZH: Record<string, string> = {
  ACTIVE: '营业中',
  INACTIVE: '休息中',
  CLOSED: '已关闭',
};

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  INACTIVE: 'bg-amber-50 text-amber-700 border-amber-200',
  CLOSED: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function PcsChannelsStoresPage() {
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 使用真实 API
  const { stores, loading, error, refetch } = usePcsStores();

  const filteredStores = stores.filter((s: PcsStore) => {
    if (channelFilter !== 'ALL' && s.channel !== channelFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: stores.length,
    active: stores.filter((s: PcsStore) => s.status === 'ACTIVE').length,
    inactive: stores.filter((s: PcsStore) => s.status === 'INACTIVE').length,
    closed: stores.filter((s: PcsStore) => s.status === 'CLOSED').length,
  };

  // 获取渠道列表
  const channels = [...new Set(stores.map((s: PcsStore) => s.channel).filter(Boolean))];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">门店管理</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新增门店
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="门店总数" value={stats.total} />
        <StatCard label="营业中" value={stats.active} highlightColor="text-green-600" />
        <StatCard label="休息中" value={stats.inactive} highlightColor="text-amber-600" />
        <StatCard label="已关闭" value={stats.closed} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
        >
          <option value="ALL">全部渠道</option>
          {channels.map((channel) => (
            <option key={channel} value={channel}>{channel}</option>
          ))}
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">营业中</option>
          <option value="INACTIVE">休息中</option>
          <option value="CLOSED">已关闭</option>
        </select>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-gray-500">加载中...</span>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">加载失败：{error}</p>
          <button onClick={refetch} className="mt-2 text-sm text-blue-600 hover:underline">
            重试
          </button>
        </div>
      )}

      {/* 门店列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">门店编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">门店名称</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">渠道</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">地区</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">联系人</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">电话</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store: PcsStore) => (
                  <tr key={store.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{store.store_no}</td>
                    <td className="px-4 py-3 font-medium">{store.store_name}</td>
                    <td className="px-4 py-3 text-xs">{store.channel}</td>
                    <td className="px-4 py-3 text-xs">{store.region}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[store.status]}`}>
                        {STATUS_ZH[store.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{store.contact || '-'}</td>
                    <td className="px-4 py-3 text-xs">{store.phone || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                        查看
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  highlight = false, 
  highlightColor = 'text-gray-900' 
}: { 
  label: string; 
  value: number; 
  highlight?: boolean;
  highlightColor?: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${highlight ? highlightColor : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}
