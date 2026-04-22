'use client';

import { useState } from 'react';

const CATEGORY_ZH: Record<string, string> = {
  COLLAR: '领子',
  SLEEVE: '袖子',
  POCKET: '口袋',
  CUFF: '袖口',
  HEM: '下摆',
  WAISTBAND: '腰头',
  BUTTON: '纽扣',
  ZIPPER: '拉链',
};

export default function PcsPartTemplatesPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Mock 数据
  const templates = [
    { id: '1', template_no: 'PT-001', template_name: '标准衬衫领', category: 'COLLAR', size_range: 'S-3XL', usage_count: 25, updated_at: '2024-01-15' },
    { id: '2', template_no: 'PT-002', template_name: '西装领', category: 'COLLAR', size_range: 'M-2XL', usage_count: 18, updated_at: '2024-01-14' },
    { id: '3', template_no: 'PT-003', template_name: '标准衬衫袖', category: 'SLEEVE', size_range: 'S-3XL', usage_count: 22, updated_at: '2024-01-13' },
    { id: '4', template_no: 'PT-004', template_name: '贴袋', category: 'POCKET', size_range: '通用', usage_count: 15, updated_at: '2024-01-12' },
    { id: '5', template_no: 'PT-005', template_name: '标准袖口', category: 'CUFF', size_range: 'S-3XL', usage_count: 20, updated_at: '2024-01-10' },
  ];

  const filteredTemplates = templates.filter((t) => {
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    return true;
  });

  const stats = {
    total: templates.length,
    collar: templates.filter((t) => t.category === 'COLLAR').length,
    sleeve: templates.filter((t) => t.category === 'SLEEVE').length,
    pocket: templates.filter((t) => t.category === 'POCKET').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">部位模板库</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建模板
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="模板总数" value={stats.total} />
        <StatCard label="领子" value={stats.collar} />
        <StatCard label="袖子" value={stats.sleeve} />
        <StatCard label="口袋" value={stats.pocket} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="ALL">全部部位</option>
          <option value="COLLAR">领子</option>
          <option value="SLEEVE">袖子</option>
          <option value="POCKET">口袋</option>
          <option value="CUFF">袖口</option>
          <option value="HEM">下摆</option>
          <option value="WAISTBAND">腰头</option>
          <option value="BUTTON">纽扣</option>
          <option value="ZIPPER">拉链</option>
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
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">部位</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">尺码范围</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">使用次数</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{template.template_no}</td>
                  <td className="px-4 py-3 font-medium">{template.template_name}</td>
                  <td className="px-4 py-3 text-xs">{CATEGORY_ZH[template.category]}</td>
                  <td className="px-4 py-3 text-xs">{template.size_range}</td>
                  <td className="px-4 py-3 text-right">{template.usage_count}</td>
                  <td className="px-4 py-3 text-xs">{template.updated_at}</td>
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
