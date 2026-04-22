'use client';

import { useState } from 'react';

const PRIORITY_ZH: Record<string, string> = {
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
  URGENT: '紧急',
};

const PRIORITY_CLASS: Record<string, string> = {
  LOW: 'bg-gray-50 text-gray-700 border-gray-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
  URGENT: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_ZH: Record<string, string> = {
  TODO: '待处理',
  IN_PROGRESS: '进行中',
  DONE: '已完成',
  CANCELLED: '已取消',
};

export default function PcsWorkItemsPage() {
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const workItems = [
    { id: '1', item_no: 'WI-001', item_name: '确认面料规格', project_name: '春季新品项目A', priority: 'HIGH', status: 'IN_PROGRESS', assignee: '张三', due_date: '2024-01-20' },
    { id: '2', item_no: 'WI-002', item_name: '提交版型确认', project_name: '夏季系列项目B', priority: 'MEDIUM', status: 'TODO', assignee: '李四', due_date: '2024-01-22' },
    { id: '3', item_no: 'WI-003', item_name: '花型设计审核', project_name: '定制西装项目C', priority: 'URGENT', status: 'TODO', assignee: '王五', due_date: '2024-01-18' },
    { id: '4', item_no: 'WI-004', item_name: '样衣尺寸调整', project_name: '运动系列项目D', priority: 'MEDIUM', status: 'DONE', assignee: '赵六', due_date: '2024-01-15' },
  ];

  const filteredItems = workItems.filter((item) => {
    if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: workItems.length,
    todo: workItems.filter((i) => i.status === 'TODO').length,
    inProgress: workItems.filter((i) => i.status === 'IN_PROGRESS').length,
    done: workItems.filter((i) => i.status === 'DONE').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">工作项库</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建工作项
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="工作项总数" value={stats.total} />
        <StatCard label="待处理" value={stats.todo} highlightColor="text-amber-600" />
        <StatCard label="进行中" value={stats.inProgress} highlightColor="text-blue-600" />
        <StatCard label="已完成" value={stats.done} highlightColor="text-green-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="ALL">全部优先级</option>
          <option value="LOW">低</option>
          <option value="MEDIUM">中</option>
          <option value="HIGH">高</option>
          <option value="URGENT">紧急</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="TODO">待处理</option>
          <option value="IN_PROGRESS">进行中</option>
          <option value="DONE">已完成</option>
          <option value="CANCELLED">已取消</option>
        </select>
      </div>

      {/* 工作项列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">工作项编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">工作项名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">所属项目</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">优先级</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">负责人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">截止日期</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{item.item_no}</td>
                  <td className="px-4 py-3 font-medium">{item.item_name}</td>
                  <td className="px-4 py-3 text-xs">{item.project_name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${PRIORITY_CLASS[item.priority]}`}>
                      {PRIORITY_ZH[item.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{STATUS_ZH[item.status]}</td>
                  <td className="px-4 py-3 text-xs">{item.assignee}</td>
                  <td className="px-4 py-3 text-xs">{item.due_date}</td>
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
