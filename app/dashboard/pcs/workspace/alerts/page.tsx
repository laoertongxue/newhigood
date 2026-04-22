'use client';

import { useState } from 'react';
import { usePcsAlerts } from '@/lib/hooks/usePcsRealData';
import type { PcsAlert } from '@/lib/hooks/usePcsRealData';

const ALERT_TYPE_ZH: Record<string, string> = {
  QUALITY: '质量告警',
  DELIVERY: '交付告警',
  STOCK: '库存告警',
  COST: '成本告警',
  SYSTEM: '系统告警',
};

const SEVERITY_ZH: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  CRITICAL: '严重',
};

const SEVERITY_CLASS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600 border-gray-200',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
  HIGH: 'bg-amber-100 text-amber-700 border-amber-200',
  CRITICAL: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_ZH: Record<string, string> = {
  OPEN: '待处理',
  ACKNOWLEDGED: '已确认',
  RESOLVED: '已解决',
  CLOSED: '已关闭',
};

const STATUS_CLASS: Record<string, string> = {
  OPEN: 'bg-red-50 text-red-700 border-red-200',
  ACKNOWLEDGED: 'bg-amber-50 text-amber-700 border-amber-200',
  RESOLVED: 'bg-blue-50 text-blue-700 border-blue-200',
  CLOSED: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function PcsWorkspaceAlertsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // 使用真实 API
  const { alerts, loading, error, refetch } = usePcsAlerts();

  const filteredAlerts = alerts.filter((a: PcsAlert) => {
    if (typeFilter !== 'ALL' && a.alert_type !== typeFilter) return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: alerts.length,
    open: alerts.filter((a: PcsAlert) => a.status === 'OPEN').length,
    critical: alerts.filter((a: PcsAlert) => a.severity === 'CRITICAL').length,
    high: alerts.filter((a: PcsAlert) => a.severity === 'HIGH').length,
    resolved: alerts.filter((a: PcsAlert) => a.status === 'RESOLVED' || a.status === 'CLOSED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">告警中心</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          全部已读
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="告警总数" value={stats.total} />
        <StatCard label="待处理" value={stats.open} highlight={stats.open > 0} highlightColor="text-red-600" />
        <StatCard label="严重" value={stats.critical} highlight={stats.critical > 0} highlightColor="text-red-600" />
        <StatCard label="高风险" value={stats.high} highlightColor="text-amber-600" />
        <StatCard label="已解决" value={stats.resolved} highlightColor="text-green-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="QUALITY">质量告警</option>
          <option value="DELIVERY">交付告警</option>
          <option value="STOCK">库存告警</option>
          <option value="COST">成本告警</option>
          <option value="SYSTEM">系统告警</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="ALL">全部严重性</option>
          <option value="CRITICAL">严重</option>
          <option value="HIGH">高</option>
          <option value="MEDIUM">中</option>
          <option value="LOW">低</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="OPEN">待处理</option>
          <option value="ACKNOWLEDGED">已确认</option>
          <option value="RESOLVED">已解决</option>
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

      {/* 告警列表 */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
              暂无告警
            </div>
          ) : (
            filteredAlerts.map((alert: PcsAlert) => (
              <div 
                key={alert.id} 
                className={`rounded-lg border p-4 hover:shadow-md transition-shadow ${
                  alert.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                  alert.severity === 'HIGH' ? 'border-amber-200 bg-amber-50' :
                  'bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gray-600">{alert.alert_no}</span>
                    <span className="inline-flex rounded border px-2 py-0.5 text-xs bg-gray-50 border-gray-200">
                      {ALERT_TYPE_ZH[alert.alert_type] || alert.alert_type}
                    </span>
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${SEVERITY_CLASS[alert.severity]}`}>
                      {SEVERITY_ZH[alert.severity]}
                    </span>
                  </div>
                  <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[alert.status]}`}>
                    {STATUS_ZH[alert.status]}
                  </span>
                </div>
                
                <h3 className="font-medium mb-2">{alert.title}</h3>
                
                {alert.content && (
                  <p className="text-sm text-gray-600 mb-3">{alert.content}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">时间：{alert.created_at}</span>
                  
                  <div className="flex gap-2">
                    {alert.status === 'OPEN' && (
                      <button className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
                        确认告警
                      </button>
                    )}
                    <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
