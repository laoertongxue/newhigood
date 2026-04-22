'use client';

import { useState } from 'react';

const CONFIG_TYPE_ZH: Record<string, string> = {
  BASIC: '基础配置',
  WORKFLOW: '工作流配置',
  NOTIFICATION: '通知配置',
  INTEGRATION: '集成配置',
};

export default function PcsConfigWorkspacePage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Mock 数据
  const configs = [
    { id: '1', config_key: 'default_size_range', config_name: '默认尺码范围', config_type: 'BASIC', config_value: 'XS-5XL', description: '商品默认使用的尺码范围', updated_at: '2024-01-15' },
    { id: '2', config_key: 'approval_workflow', config_name: '审批工作流', config_type: 'WORKFLOW', config_value: '二级审批', description: '样品申请审批流程配置', updated_at: '2024-01-14' },
    { id: '3', config_key: 'email_notification', config_name: '邮件通知', config_type: 'NOTIFICATION', config_value: '已启用', description: '是否启用邮件通知', updated_at: '2024-01-13' },
    { id: '4', config_key: 'erp_integration', config_name: 'ERP系统集成', config_type: 'INTEGRATION', config_value: 'SAP', description: '对接的ERP系统类型', updated_at: '2024-01-10' },
    { id: '5', config_key: 'auto_sync', config_name: '自动同步', config_type: 'INTEGRATION', config_value: '已启用', description: '自动同步渠道商品数据', updated_at: '2024-01-08' },
  ];

  const filteredConfigs = configs.filter((c) => {
    if (typeFilter !== 'ALL' && c.config_type !== typeFilter) return false;
    return true;
  });

  const stats = {
    total: configs.length,
    basic: configs.filter((c) => c.config_type === 'BASIC').length,
    workflow: configs.filter((c) => c.config_type === 'WORKFLOW').length,
    notification: configs.filter((c) => c.config_type === 'NOTIFICATION').length,
    integration: configs.filter((c) => c.config_type === 'INTEGRATION').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">基础配置</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建配置
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="配置总数" value={stats.total} />
        <StatCard label="基础配置" value={stats.basic} />
        <StatCard label="工作流" value={stats.workflow} />
        <StatCard label="通知配置" value={stats.notification} />
        <StatCard label="集成配置" value={stats.integration} />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="BASIC">基础配置</option>
          <option value="WORKFLOW">工作流配置</option>
          <option value="NOTIFICATION">通知配置</option>
          <option value="INTEGRATION">集成配置</option>
        </select>
      </div>

      {/* 配置列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">配置键</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">配置名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">配置值</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">描述</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigs.map((config) => (
                <tr key={config.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{config.config_key}</td>
                  <td className="px-4 py-3 font-medium">{config.config_name}</td>
                  <td className="px-4 py-3 text-xs">{CONFIG_TYPE_ZH[config.config_type]}</td>
                  <td className="px-4 py-3 text-xs">{config.config_value}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{config.description}</td>
                  <td className="px-4 py-3 text-xs">{config.updated_at}</td>
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
