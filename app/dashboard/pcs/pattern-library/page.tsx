'use client';

import { useState } from 'react';

const PATTERN_TYPE_ZH: Record<string, string> = {
  PRINT: '印花图案',
  EMBROIDERY: '刺绣图案',
  WEAVE: '织造图案',
  COLOR: '配色方案',
};

const STATUS_ZH: Record<string, string> = {
  ACTIVE: '已发布',
  DRAFT: '草稿',
  ARCHIVED: '已归档',
};

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  ARCHIVED: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function PcsPatternLibraryPage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const patterns = [
    { id: '1', pattern_no: 'PL-001', pattern_name: '经典格纹', pattern_type: 'WEAVE', usage_count: 15, designer: '张三', status: 'ACTIVE', updated_at: '2024-01-15' },
    { id: '2', pattern_no: 'PL-002', pattern_name: '抽象花卉', pattern_type: 'PRINT', usage_count: 8, designer: '李四', status: 'ACTIVE', updated_at: '2024-01-14' },
    { id: '3', pattern_no: 'PL-003', pattern_name: '几何线条', pattern_type: 'EMBROIDERY', usage_count: 12, designer: '王五', status: 'ACTIVE', updated_at: '2024-01-13' },
    { id: '4', pattern_no: 'PL-004', pattern_name: '渐变配色方案', pattern_type: 'COLOR', usage_count: 5, designer: '赵六', status: 'DRAFT', updated_at: '2024-01-12' },
    { id: '5', pattern_no: 'PL-005', pattern_name: '复古波点', pattern_type: 'PRINT', usage_count: 20, designer: '张三', status: 'ARCHIVED', updated_at: '2023-12-20' },
  ];

  const filteredPatterns = patterns.filter((p) => {
    if (typeFilter !== 'ALL' && p.pattern_type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: patterns.length,
    active: patterns.filter((p) => p.status === 'ACTIVE').length,
    draft: patterns.filter((p) => p.status === 'DRAFT').length,
    archived: patterns.filter((p) => p.status === 'ARCHIVED').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">花型库</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          上传花型
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="花型总数" value={stats.total} />
        <StatCard label="已发布" value={stats.active} highlightColor="text-green-600" />
        <StatCard label="草稿" value={stats.draft} highlightColor="text-amber-600" />
        <StatCard label="已归档" value={stats.archived} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="PRINT">印花图案</option>
          <option value="EMBROIDERY">刺绣图案</option>
          <option value="WEAVE">织造图案</option>
          <option value="COLOR">配色方案</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">已发布</option>
          <option value="DRAFT">草稿</option>
          <option value="ARCHIVED">已归档</option>
        </select>
      </div>

      {/* 花型列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">花型编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">花型名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">使用次数</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">设计师</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatterns.map((pattern) => (
                <tr key={pattern.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{pattern.pattern_no}</td>
                  <td className="px-4 py-3 font-medium">{pattern.pattern_name}</td>
                  <td className="px-4 py-3 text-xs">{PATTERN_TYPE_ZH[pattern.pattern_type]}</td>
                  <td className="px-4 py-3 text-right">{pattern.usage_count}</td>
                  <td className="px-4 py-3 text-xs">{pattern.designer}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[pattern.status]}`}>
                      {STATUS_ZH[pattern.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{pattern.updated_at}</td>
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
