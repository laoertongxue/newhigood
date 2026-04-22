'use client';

import { useState } from 'react';

const TEMPLATE_TYPE_ZH: Record<string, string> = {
  TECH_PACK: '技术包模板',
  SAMPLE: '样衣模板',
  QC: '质检模板',
  PROCESS: '工艺模板',
};

const STATUS_ZH: Record<string, string> = {
  ACTIVE: '启用',
  INACTIVE: '停用',
};

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  INACTIVE: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function PcsTemplatesPage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const templates = [
    { id: '1', template_no: 'TPL-001', template_name: '标准技术包模板', template_type: 'TECH_PACK', fields: 25, status: 'ACTIVE', updated_at: '2024-01-15' },
    { id: '2', template_no: 'TPL-002', template_name: '精简技术包模板', template_type: 'TECH_PACK', fields: 15, status: 'ACTIVE', updated_at: '2024-01-10' },
    { id: '3', template_no: 'TPL-003', template_name: '首件样衣检查模板', template_type: 'SAMPLE', fields: 20, status: 'ACTIVE', updated_at: '2024-01-08' },
    { id: '4', template_no: 'TPL-004', template_name: '成衣质检模板', template_type: 'QC', fields: 30, status: 'ACTIVE', updated_at: '2024-01-05' },
    { id: '5', template_no: 'TPL-005', template_name: '缝制工艺模板', template_type: 'PROCESS', fields: 18, status: 'INACTIVE', updated_at: '2023-12-20' },
  ];

  const filteredTemplates = templates.filter((t) => {
    if (typeFilter !== 'ALL' && t.template_type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: templates.length,
    active: templates.filter((t) => t.status === 'ACTIVE').length,
    inactive: templates.filter((t) => t.status === 'INACTIVE').length,
    totalFields: templates.reduce((sum, t) => sum + t.fields, 0),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">模板管理</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建模板
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="模板总数" value={stats.total} />
        <StatCard label="启用" value={stats.active} highlightColor="text-green-600" />
        <StatCard label="停用" value={stats.inactive} />
        <StatCard label="字段总数" value={stats.totalFields} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="TECH_PACK">技术包模板</option>
          <option value="SAMPLE">样衣模板</option>
          <option value="QC">质检模板</option>
          <option value="PROCESS">工艺模板</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">启用</option>
          <option value="INACTIVE">停用</option>
        </select>
      </div>

      {/* 模板列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">模板编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">模板名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 whitespace-nowrap">字段数</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{template.template_no}</td>
                  <td className="px-4 py-3 font-medium">{template.template_name}</td>
                  <td className="px-4 py-3 text-xs">{TEMPLATE_TYPE_ZH[template.template_type]}</td>
                  <td className="px-4 py-3 text-center">{template.fields}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[template.status]}`}>
                      {STATUS_ZH[template.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{template.updated_at}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                      编辑
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
