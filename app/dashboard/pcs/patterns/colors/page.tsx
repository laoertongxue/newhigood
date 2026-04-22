'use client';

import { useState } from 'react';

const STATUS_ZH: Record<string, string> = {
  PENDING: '待设计',
  IN_PROGRESS: '设计中',
  REVIEWING: '审核中',
  APPROVED: '已通过',
  REJECTED: '已驳回',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  REVIEWING: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default function PcsColorTasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const tasks = [
    { id: '1', task_no: 'CT-001', task_name: '春季新品花型设计', project_name: '春季新品项目A', designer: '张三', submit_date: '2024-01-15', status: 'APPROVED' },
    { id: '2', task_no: 'CT-002', task_name: '夏季系列配色方案', project_name: '夏季系列项目B', designer: '李四', submit_date: '2024-01-14', status: 'IN_PROGRESS' },
    { id: '3', task_no: 'CT-003', task_name: '西装面料花型', project_name: '定制西装项目C', designer: '王五', submit_date: '2024-01-13', status: 'REVIEWING' },
    { id: '4', task_no: 'CT-004', task_name: '运动系列图案设计', project_name: '运动系列项目D', designer: '赵六', submit_date: '2024-01-12', status: 'PENDING' },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    reviewing: tasks.filter((t) => t.status === 'REVIEWING').length,
    approved: tasks.filter((t) => t.status === 'APPROVED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">花型任务</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建任务
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="任务总数" value={stats.total} />
        <StatCard label="待设计" value={stats.pending} />
        <StatCard label="设计中" value={stats.inProgress} highlightColor="text-blue-600" />
        <StatCard label="审核中" value={stats.reviewing} highlightColor="text-amber-600" />
        <StatCard label="已通过" value={stats.approved} highlightColor="text-green-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待设计</option>
          <option value="IN_PROGRESS">设计中</option>
          <option value="REVIEWING">审核中</option>
          <option value="APPROVED">已通过</option>
          <option value="REJECTED">已驳回</option>
        </select>
      </div>

      {/* 任务列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">任务编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">任务名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">所属项目</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">设计师</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">提交日期</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{task.task_no}</td>
                  <td className="px-4 py-3 font-medium">{task.task_name}</td>
                  <td className="px-4 py-3 text-xs">{task.project_name}</td>
                  <td className="px-4 py-3 text-xs">{task.designer}</td>
                  <td className="px-4 py-3 text-xs">{task.submit_date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[task.status]}`}>
                      {STATUS_ZH[task.status]}
                    </span>
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

function StatCard({ label, value, highlightColor = 'text-gray-900' }: { label: string; value: number; highlightColor?: string }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${highlightColor}`}>{value}</p>
    </div>
  );
}
