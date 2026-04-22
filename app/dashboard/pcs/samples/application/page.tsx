'use client';

import { useState } from 'react';

const STATUS_ZH: Record<string, string> = {
  PENDING: '待审批',
  APPROVED: '已批准',
  REJECTED: '已拒绝',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default function PcsSamplesApplicationPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const applications = [
    { id: '1', app_no: 'SAP-001', project_name: '春季新品项目A', sample_type: '首件样衣', size: 'M', quantity: 2, applicant: '张三', apply_date: '2024-01-15', status: 'APPROVED' },
    { id: '2', app_no: 'SAP-002', project_name: '夏季系列项目B', sample_type: '尺寸样', size: 'L', quantity: 1, applicant: '李四', apply_date: '2024-01-14', status: 'PENDING' },
    { id: '3', app_no: 'SAP-003', project_name: '定制西装项目C', sample_type: '销售样', size: 'S', quantity: 3, applicant: '王五', apply_date: '2024-01-13', status: 'APPROVED' },
    { id: '4', app_no: 'SAP-004', project_name: '运动系列项目D', sample_type: '生产样', size: 'XL', quantity: 2, applicant: '赵六', apply_date: '2024-01-12', status: 'REJECTED' },
  ];

  const filteredApplications = applications.filter((a) => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    approved: applications.filter((a) => a.status === 'APPROVED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">样衣申请</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建申请
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="申请总数" value={stats.total} />
        <StatCard label="待审批" value={stats.pending} highlightColor="text-amber-600" />
        <StatCard label="已批准" value={stats.approved} highlightColor="text-green-600" />
        <StatCard label="已拒绝" value={stats.rejected} highlightColor="text-red-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待审批</option>
          <option value="APPROVED">已批准</option>
          <option value="REJECTED">已拒绝</option>
        </select>
      </div>

      {/* 申请列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">申请编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">项目名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">样衣类型</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">尺码</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">数量</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">申请人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">申请日期</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{app.app_no}</td>
                  <td className="px-4 py-3 font-medium">{app.project_name}</td>
                  <td className="px-4 py-3 text-xs">{app.sample_type}</td>
                  <td className="px-4 py-3 text-xs">{app.size}</td>
                  <td className="px-4 py-3 text-center">{app.quantity}</td>
                  <td className="px-4 py-3 text-xs">{app.applicant}</td>
                  <td className="px-4 py-3 text-xs">{app.apply_date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[app.status]}`}>
                      {STATUS_ZH[app.status]}
                    </span>
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
