'use client';

import { useState } from 'react';

// Mock 数据 - 任务进度看板
const mockTasks = [
  { taskId: 'TASK-001', productionOrderId: 'PO-2024-001', styleName: '碎花雪纺连衣裙', factoryName: '华东服装厂', currentProcess: '裁剪', status: 'IN_PROGRESS', progress: 45, plannedQty: 500, completedQty: 225, plannedEndDate: '2024-02-15', blockerReason: null, updatedAt: '2024-01-15 14:00' },
  { taskId: 'TASK-002', productionOrderId: 'PO-2024-002', styleName: '连帽卫衣经典款', factoryName: '华南制衣有限公司', currentProcess: '车缝', status: 'IN_PROGRESS', progress: 30, plannedQty: 300, completedQty: 90, plannedEndDate: '2024-03-15', blockerReason: null, updatedAt: '2024-01-15 13:00' },
  { taskId: 'TASK-003', productionOrderId: 'PO-2024-003', styleName: '弹力运动裤', factoryName: '北方服装加工厂', currentProcess: '车缝', status: 'BLOCKED', progress: 25, plannedQty: 800, completedQty: 200, plannedEndDate: '2024-02-28', blockerReason: '面料供应延迟', updatedAt: '2024-01-15 12:00' },
  { taskId: 'TASK-004', productionOrderId: 'PO-2024-004', styleName: '纯棉T恤', factoryName: '华东服装厂', currentProcess: '后整', status: 'IN_PROGRESS', progress: 80, plannedQty: 1000, completedQty: 800, plannedEndDate: '2024-02-10', blockerReason: null, updatedAt: '2024-01-15 11:00' },
  { taskId: 'TASK-005', productionOrderId: 'PO-2024-005', styleName: '牛仔裤', factoryName: '南方制衣厂', currentProcess: '水洗', status: 'DELAYED', progress: 60, plannedQty: 400, completedQty: 240, plannedEndDate: '2024-02-05', blockerReason: '水洗设备故障', updatedAt: '2024-01-15 10:00' },
];

const STATUS_ZH: Record<string, string> = {
  PENDING: '待开始',
  IN_PROGRESS: '进行中',
  BLOCKED: '已暂停',
  DELAYED: '已延期',
  COMPLETED: '已完成',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  BLOCKED: 'bg-red-50 text-red-700 border-red-200',
  DELAYED: 'bg-amber-50 text-amber-700 border-amber-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
};

const PROCESS_ZH: Record<string, string> = {
  '裁剪': '裁剪',
  '车缝': '车缝',
  '水洗': '水洗',
  '后整': '后整理',
  '质检': '质检',
};

export default function FcsProgressBoardPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTasks = mockTasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: mockTasks.length,
    inProgress: mockTasks.filter((t) => t.status === 'IN_PROGRESS').length,
    blocked: mockTasks.filter((t) => t.status === 'BLOCKED').length,
    delayed: mockTasks.filter((t) => t.status === 'DELAYED').length,
    completed: mockTasks.filter((t) => t.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">任务进度看板</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="任务总数" value={stats.total} />
        <StatCard label="进行中" value={stats.inProgress} highlightColor="text-blue-600" />
        <StatCard label="已暂停" value={stats.blocked} highlight={stats.blocked > 0} highlightColor="text-red-600" />
        <StatCard label="已延期" value={stats.delayed} highlight={stats.delayed > 0} highlightColor="text-amber-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待开始</option>
          <option value="IN_PROGRESS">进行中</option>
          <option value="BLOCKED">已暂停</option>
          <option value="DELAYED">已延期</option>
          <option value="COMPLETED">已完成</option>
        </select>
      </div>

      {/* 任务列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">任务编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">生产单</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">款式</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">工厂</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">当前工序</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">进度</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">完成数量</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">计划完成</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">阻塞原因</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.taskId} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{task.taskId}</td>
                  <td className="px-4 py-3 font-mono text-xs">{task.productionOrderId}</td>
                  <td className="px-4 py-3 font-medium">{task.styleName}</td>
                  <td className="px-4 py-3 text-xs">{task.factoryName}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded border bg-blue-50 px-2 py-0.5 text-xs text-blue-700 border-blue-200">
                      {PROCESS_ZH[task.currentProcess] ?? task.currentProcess}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[task.status]}`}>
                      {STATUS_ZH[task.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div 
                          className={`h-full ${task.status === 'BLOCKED' ? 'bg-red-500' : task.status === 'DELAYED' ? 'bg-amber-500' : task.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{task.completedQty}/{task.plannedQty}</td>
                  <td className="px-4 py-3 text-xs">{task.plannedEndDate}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs text-red-600">
                    {task.blockerReason ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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
