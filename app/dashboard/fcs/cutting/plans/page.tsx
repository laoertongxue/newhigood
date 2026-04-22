'use client';

import { useState } from 'react';
import { useCuttingPlans } from '@/lib/hooks/useFcsRealData';
import type { CuttingPlan } from '@/lib/hooks/useFcsRealData';

const STATUS_ZH: Record<string, string> = {
  PENDING: '待裁剪',
  IN_PROGRESS: '裁剪中',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function FcsCuttingPlansPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 使用真实 API
  const { plans, loading, error, refetch } = useCuttingPlans();

  const filteredPlans = plans.filter((p: CuttingPlan) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: plans.length,
    pending: plans.filter((p: CuttingPlan) => p.status === 'PENDING').length,
    inProgress: plans.filter((p: CuttingPlan) => p.status === 'IN_PROGRESS').length,
    completed: plans.filter((p: CuttingPlan) => p.status === 'COMPLETED').length,
    totalQty: plans.reduce((sum, p: CuttingPlan) => sum + p.total_qty, 0),
    cutQty: plans.reduce((sum, p: CuttingPlan) => sum + p.cut_qty, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">裁剪计划</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建裁剪计划
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="计划总数" value={stats.total} />
        <StatCard label="待裁剪" value={stats.pending} />
        <StatCard label="裁剪中" value={stats.inProgress} highlightColor="text-blue-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
        <StatCard label="裁剪进度" value={`${Math.round(stats.cutQty / stats.totalQty * 100)}%`} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待裁剪</option>
          <option value="IN_PROGRESS">裁剪中</option>
          <option value="COMPLETED">已完成</option>
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

      {/* 裁剪计划列表 */}
      {!loading && !error && (
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">计划编号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">生产单</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">款式</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">工厂</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">计划日期</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">面料</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">铺布层数</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">裁剪数量</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan: CuttingPlan) => (
                  <tr key={plan.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{plan.plan_no}</td>
                    <td className="px-4 py-3 font-mono text-xs">{plan.production_order_id || '-'}</td>
                    <td className="px-4 py-3 font-medium">{plan.style_name}</td>
                    <td className="px-4 py-3 text-xs">{plan.factory_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[plan.status]}`}>
                        {STATUS_ZH[plan.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{plan.planned_date}</td>
                    <td className="px-4 py-3 text-xs">{plan.fabric_name}</td>
                    <td className="px-4 py-3 text-center tabular-nums">{plan.layers}层</td>
                    <td className="px-4 py-3 text-center">
                      <span className="tabular-nums">{plan.cut_qty}/{plan.total_qty}</span>
                      <div className="w-16 h-1.5 rounded-full bg-gray-200 mt-1 overflow-hidden mx-auto">
                        <div 
                          className={`h-full ${plan.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${plan.total_qty > 0 ? plan.cut_qty / plan.total_qty * 100 : 0}%` }}
                        />
                      </div>
                    </td>
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
  value: string | number; 
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
