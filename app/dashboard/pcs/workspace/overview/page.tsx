'use client';

import { usePcsWorkspaceOverview } from '@/lib/hooks/usePcsRealData';

export default function PcsWorkspaceOverviewPage() {
  const { overview, loading, error, refetch } = usePcsWorkspaceOverview();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">PCS 工作台</h1>

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

      {/* 概览统计 */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <StatCard label="项目总数" value={overview.totalProjects} />
            <StatCard label="进行中" value={overview.activeProjects} highlightColor="text-blue-600" />
            <StatCard label="待办事项" value={overview.pendingTodos} highlightColor="text-amber-600" />
            <StatCard label="待处理告警" value={overview.openAlerts} highlightColor="text-red-600" />
            <StatCard label="测试记录" value={overview.testingRecords} highlightColor="text-green-600" />
          </div>

          {/* 快捷入口 */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <QuickLink href="/dashboard/pcs/projects" label="项目管理" icon="📋" />
            <QuickLink href="/dashboard/pcs/workspace/todos" label="待办事项" icon="✅" />
            <QuickLink href="/dashboard/pcs/workspace/alerts" label="告警中心" icon="🔔" />
            <QuickLink href="/dashboard/pcs/testing/live" label="测试记录" icon="🧪" />
          </div>

          {/* 最近更新 */}
          <div className="rounded-lg border bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">最近更新</h2>
            <div className="space-y-3">
              {overview.recentUpdates.map((update, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs">{update.type}</span>
                    <span className="text-sm">{update.content}</span>
                  </div>
                  <span className="text-xs text-gray-500">{update.time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, highlightColor = 'text-gray-900' }: { label: string; value: number; highlightColor?: string }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${highlightColor}`}>{value}</p>
    </div>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a href={href} className="flex items-center gap-3 rounded-lg border bg-white p-4 hover:bg-gray-50 transition-colors">
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </a>
  );
}
