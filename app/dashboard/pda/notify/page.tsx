'use client';

import { useState } from 'react';
import { usePdaNotifications } from '@/lib/hooks/usePdaRealData';
import type { PdaNotification } from '@/lib/hooks/usePdaRealData';

const NOTIFY_TYPE_ZH: Record<string, string> = {
  TASK_ASSIGNED: '任务分配',
  TASK_UPDATED: '任务更新',
  DEADLINE_REMINDER: '截止提醒',
  QUALITY_ALERT: '质量预警',
  SYSTEM: '系统通知',
};

const PRIORITY_ZH: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  URGENT: '紧急',
};

const STATUS_CLASS: Record<string, string> = {
  UNREAD: 'bg-blue-50 text-blue-700 border-blue-200',
  READ: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function PdaNotifyPage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // 使用真实 API
  const { notifications, loading, error, refetch } = usePdaNotifications();

  const filteredNotifications = notifications.filter((n: PdaNotification) => {
    if (typeFilter !== 'ALL' && n.notify_type !== typeFilter) return false;
    if (priorityFilter !== 'ALL' && n.priority !== priorityFilter) return false;
    return true;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n: PdaNotification) => !n.is_read).length,
    urgent: notifications.filter((n: PdaNotification) => n.priority === 'URGENT').length,
    high: notifications.filter((n: PdaNotification) => n.priority === 'HIGH').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">PDA 通知中心</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          全部标记已读
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="通知总数" value={stats.total} />
        <StatCard label="未读通知" value={stats.unread} highlight={stats.unread > 0} highlightColor="text-blue-600" />
        <StatCard label="紧急通知" value={stats.urgent} highlight={stats.urgent > 0} highlightColor="text-red-600" />
        <StatCard label="高优先级" value={stats.high} highlightColor="text-amber-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="TASK_ASSIGNED">任务分配</option>
          <option value="TASK_UPDATED">任务更新</option>
          <option value="DEADLINE_REMINDER">截止提醒</option>
          <option value="QUALITY_ALERT">质量预警</option>
          <option value="SYSTEM">系统通知</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="ALL">全部优先级</option>
          <option value="URGENT">紧急</option>
          <option value="HIGH">高</option>
          <option value="MEDIUM">中</option>
          <option value="LOW">低</option>
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

      {/* 通知列表 */}
      {!loading && !error && (
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
              暂无通知
            </div>
          ) : (
            filteredNotifications.map((notify: PdaNotification) => (
              <div 
                key={notify.id} 
                className={`rounded-lg border p-4 hover:bg-gray-50 cursor-pointer ${notify.is_read ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[notify.is_read ? 'READ' : 'UNREAD']}`}>
                        {notify.is_read ? '已读' : '未读'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {NOTIFY_TYPE_ZH[notify.notify_type] || notify.notify_type}
                      </span>
                      <span className={`text-xs ${
                        notify.priority === 'URGENT' ? 'text-red-600 font-medium' : 
                        notify.priority === 'HIGH' ? 'text-amber-600' : 
                        'text-gray-500'
                      }`}>
                        {PRIORITY_ZH[notify.priority]}
                      </span>
                    </div>
                    <h3 className="font-medium mb-1">{notify.title}</h3>
                    {notify.content && (
                      <p className="text-sm text-gray-600">{notify.content}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>编号：{notify.notify_no}</span>
                      <span>时间：{notify.created_at}</span>
                      {notify.recipient && <span>接收人：{notify.recipient}</span>}
                    </div>
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
