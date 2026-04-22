'use client';

import { useState } from 'react';

// Mock 数据 - 直播测款
const mockLiveTests = [
  { testId: 'LIVE-001', projectId: 'PROJ-001', projectName: '2024春夏新款连衣裙系列', styleCode: 'STYLE-A001', styleName: '碎花雪纺连衣裙', testStatus: 'SCHEDULED', scheduledDate: '2024-01-20', scheduledTime: '14:00', channel: '抖音直播间A', expectedDuration: 120, notes: '计划测试3款颜色', createdAt: '2024-01-15' },
  { testId: 'LIVE-002', projectId: 'PROJ-001', projectName: '2024春夏新款连衣裙系列', styleCode: 'STYLE-A002', styleName: '波点雪纺连衣裙', testStatus: 'COMPLETED', scheduledDate: '2024-01-18', scheduledTime: '15:00', channel: '抖音直播间A', actualViews: 12500, conversionRate: 8.5, revenue: 28500, createdAt: '2024-01-12' },
  { testId: 'LIVE-003', projectId: 'PROJ-002', projectName: '秋冬卫衣改版项目', styleCode: 'STYLE-B001', styleName: '连帽卫衣经典款', testStatus: 'IN_PROGRESS', scheduledDate: '2024-01-19', scheduledTime: '20:00', channel: '淘宝直播间B', expectedDuration: 180, notes: '晚场黄金时段测试', createdAt: '2024-01-14' },
  { testId: 'LIVE-004', projectId: 'PROJ-005', projectName: '夏季T恤爆款', styleCode: 'STYLE-C001', styleName: '纯棉基础款T恤', testStatus: 'PENDING_REVIEW', scheduledDate: '2024-01-17', scheduledTime: '16:00', channel: '快手直播间C', expectedDuration: 90, notes: '待确认最终价格', createdAt: '2024-01-13' },
];

const TEST_STATUS_ZH: Record<string, string> = {
  PENDING: '待安排',
  SCHEDULED: '已排期',
  IN_PROGRESS: '测试中',
  COMPLETED: '已完成',
  PENDING_REVIEW: '待评审',
};

const TEST_STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  PENDING_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function PcsLiveTestingPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTests = mockLiveTests.filter((t) => {
    if (statusFilter !== 'ALL' && t.testStatus !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: mockLiveTests.length,
    scheduled: mockLiveTests.filter((t) => t.testStatus === 'SCHEDULED').length,
    inProgress: mockLiveTests.filter((t) => t.testStatus === 'IN_PROGRESS').length,
    completed: mockLiveTests.filter((t) => t.testStatus === 'COMPLETED').length,
    pendingReview: mockLiveTests.filter((t) => t.testStatus === 'PENDING_REVIEW').length,
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">直播测款</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="测款总数" value={stats.total} />
        <StatCard label="已排期" value={stats.scheduled} highlightColor="text-blue-600" />
        <StatCard label="测试中" value={stats.inProgress} highlightColor="text-indigo-600" />
        <StatCard label="已完成" value={stats.completed} highlightColor="text-green-600" />
        <StatCard label="待评审" value={stats.pendingReview} highlightColor="text-amber-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待安排</option>
          <option value="SCHEDULED">已排期</option>
          <option value="IN_PROGRESS">测试中</option>
          <option value="COMPLETED">已完成</option>
          <option value="PENDING_REVIEW">待评审</option>
        </select>
      </div>

      {/* 测款列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">测款编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">项目名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">款式编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">款式名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">直播渠道</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">排期时间</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">预估时长</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">查看详情</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.testId} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{test.testId}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs">{test.projectName}</td>
                  <td className="px-4 py-3 font-mono text-xs">{test.styleCode}</td>
                  <td className="px-4 py-3 font-medium">{test.styleName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${TEST_STATUS_CLASS[test.testStatus]}`}>
                      {TEST_STATUS_ZH[test.testStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{test.channel}</td>
                  <td className="px-4 py-3 text-xs">
                    <div>{test.scheduledDate}</div>
                    <div className="text-gray-500">{test.scheduledTime}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">{test.expectedDuration}分钟</td>
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

      {/* 已完成测试数据 */}
      {stats.completed > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-gray-500">已完成测试数据</h2>
          <div className="rounded-lg border bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">测款编号</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">款式</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">观看人数</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">转化率</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">预估销售额</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLiveTests.filter((t) => t.testStatus === 'COMPLETED').map((test) => (
                    <tr key={test.testId} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{test.testId}</td>
                      <td className="px-4 py-3 font-medium">{test.styleName}</td>
                      <td className="px-4 py-3 tabular-nums">{test.actualViews?.toLocaleString()}</td>
                      <td className="px-4 py-3 tabular-nums">{test.conversionRate}%</td>
                      <td className="px-4 py-3 tabular-nums">¥{test.revenue?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
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
