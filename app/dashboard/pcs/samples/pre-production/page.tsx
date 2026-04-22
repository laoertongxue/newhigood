'use client';

import { useState } from 'react';

const STATUS_ZH: Record<string, string> = {
  PENDING: '待生产',
  IN_PRODUCTION: '生产中',
  QC_PASSED: '质检通过',
  QC_FAILED: '质检未通过',
  COMPLETED: '已完成',
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  IN_PRODUCTION: 'bg-blue-50 text-blue-700 border-blue-200',
  QC_PASSED: 'bg-green-50 text-green-700 border-green-200',
  QC_FAILED: 'bg-red-50 text-red-700 border-red-200',
  COMPLETED: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function PcsPreProductionSamplesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const samples = [
    { id: '1', sample_no: 'PP-001', sample_name: '春季新品衬衫（大货版）', project_name: '春季新品项目A', size: 'M', quantity: 3, applicant: '张三', apply_date: '2024-01-15', status: 'QC_PASSED' },
    { id: '2', sample_no: 'PP-002', sample_name: '夏季连衣裙（大货版）', project_name: '夏季系列项目B', size: 'S', quantity: 2, applicant: '李四', apply_date: '2024-01-14', status: 'IN_PRODUCTION' },
    { id: '3', sample_no: 'PP-003', sample_name: '西装套装（大货版）', project_name: '定制西装项目C', size: 'L', quantity: 1, applicant: '王五', apply_date: '2024-01-13', status: 'PENDING' },
    { id: '4', sample_no: 'PP-004', sample_name: '运动套装（大货版）', project_name: '运动系列项目D', size: 'XL', quantity: 2, applicant: '赵六', apply_date: '2024-01-12', status: 'COMPLETED' },
  ];

  const filteredSamples = samples.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: samples.length,
    pending: samples.filter((s) => s.status === 'PENDING').length,
    inProduction: samples.filter((s) => s.status === 'IN_PRODUCTION').length,
    qcPassed: samples.filter((s) => s.status === 'QC_PASSED').length,
    completed: samples.filter((s) => s.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">产前版样衣</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建申请
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="总数" value={stats.total} />
        <StatCard label="待生产" value={stats.pending} />
        <StatCard label="生产中" value={stats.inProduction} highlightColor="text-blue-600" />
        <StatCard label="质检通过" value={stats.qcPassed} highlightColor="text-green-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-purple-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待生产</option>
          <option value="IN_PRODUCTION">生产中</option>
          <option value="QC_PASSED">质检通过</option>
          <option value="QC_FAILED">质检未通过</option>
          <option value="COMPLETED">已完成</option>
        </select>
      </div>

      {/* 列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">样衣编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">样衣名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">所属项目</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">尺码</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">数量</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">申请人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">申请日期</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.map((sample) => (
                <tr key={sample.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{sample.sample_no}</td>
                  <td className="px-4 py-3 font-medium">{sample.sample_name}</td>
                  <td className="px-4 py-3 text-xs">{sample.project_name}</td>
                  <td className="px-4 py-3 text-center">{sample.size}</td>
                  <td className="px-4 py-3 text-center">{sample.quantity}</td>
                  <td className="px-4 py-3 text-xs">{sample.applicant}</td>
                  <td className="px-4 py-3 text-xs">{sample.apply_date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[sample.status]}`}>
                      {STATUS_ZH[sample.status]}
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
