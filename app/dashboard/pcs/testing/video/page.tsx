'use client';

import { useState } from 'react';

// Mock 数据 - 短视频测款
const mockVideoTests = [
  { testId: 'VIDEO-001', projectId: 'PROJ-001', projectName: '2024春夏新款连衣裙系列', styleCode: 'STYLE-A001', styleName: '碎花雪纺连衣裙', testStatus: 'PUBLISHED', videoId: 'VID123456', platform: '抖音', views: 85000, likes: 3200, comments: 580, shares: 1200, conversionRate: 4.2, revenue: 15600, publishedAt: '2024-01-15' },
  { testId: 'VIDEO-002', projectId: 'PROJ-001', projectName: '2024春夏新款连衣裙系列', styleCode: 'STYLE-A003', styleName: '蕾丝拼接连衣裙', testStatus: 'PUBLISHED', videoId: 'VID123457', platform: '小红书', views: 42000, likes: 2800, comments: 420, shares: 890, conversionRate: 6.8, revenue: 22800, publishedAt: '2024-01-14' },
  { testId: 'VIDEO-003', projectId: 'PROJ-002', projectName: '秋冬卫衣改版项目', styleCode: 'STYLE-B001', styleName: '连帽卫衣经典款', testStatus: 'UPLOADING', platform: '抖音', publishedAt: '2024-01-20' },
  { testId: 'VIDEO-004', projectId: 'PROJ-005', projectName: '夏季T恤爆款', styleCode: 'STYLE-C001', styleName: '纯棉基础款T恤', testStatus: 'PENDING', platform: '快手', publishedAt: null },
  { testId: 'VIDEO-005', projectId: 'PROJ-001', projectName: '2024春夏新款连衣裙系列', styleCode: 'STYLE-A004', styleName: '波西米亚长裙', testStatus: 'EDITING', platform: '抖音', publishedAt: null },
];

const TEST_STATUS_ZH: Record<string, string> = {
  PENDING: '待拍摄',
  EDITING: '剪辑中',
  UPLOADING: '上传中',
  PUBLISHED: '已发布',
  REJECTED: '已驳回',
};

const TEST_STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-gray-50 text-gray-700 border-gray-200',
  EDITING: 'bg-amber-50 text-amber-700 border-amber-200',
  UPLOADING: 'bg-blue-50 text-blue-700 border-blue-200',
  PUBLISHED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

const PLATFORM_CLASS: Record<string, string> = {
  '抖音': 'bg-pink-50 text-pink-700 border-pink-200',
  '小红书': 'bg-red-50 text-red-700 border-red-200',
  '快手': 'bg-orange-50 text-orange-700 border-orange-200',
};

export default function PcsVideoTestingPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');

  const filteredTests = mockVideoTests.filter((t) => {
    if (statusFilter !== 'ALL' && t.testStatus !== statusFilter) return false;
    if (platformFilter !== 'ALL' && t.platform !== platformFilter) return false;
    return true;
  });

  const stats = {
    total: mockVideoTests.length,
    published: mockVideoTests.filter((t) => t.testStatus === 'PUBLISHED').length,
    editing: mockVideoTests.filter((t) => t.testStatus === 'EDITING' || t.testStatus === 'UPLOADING').length,
    pending: mockVideoTests.filter((t) => t.testStatus === 'PENDING').length,
  };

  const totalViews = mockVideoTests.filter((t) => t.views).reduce((sum, t) => sum + (t.views ?? 0), 0);
  const totalRevenue = mockVideoTests.filter((t) => t.revenue).reduce((sum, t) => sum + (t.revenue ?? 0), 0);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">短视频测款</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="视频总数" value={stats.total} />
        <StatCard label="已发布" value={stats.published} highlightColor="text-green-600" />
        <StatCard label="制作中" value={stats.editing} highlightColor="text-amber-600" />
        <StatCard label="待拍摄" value={stats.pending} />
      </div>

      {/* 数据概览 */}
      {stats.published > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border bg-white p-4">
            <p className="mb-1 text-sm text-gray-500">总观看量</p>
            <p className="text-xl font-semibold tabular-nums">{totalViews.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="mb-1 text-sm text-gray-500">总销售额</p>
            <p className="text-xl font-semibold tabular-nums text-green-600">¥{totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* 筛选器 */}
      <div className="flex gap-4">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="PENDING">待拍摄</option>
          <option value="EDITING">剪辑中</option>
          <option value="UPLOADING">上传中</option>
          <option value="PUBLISHED">已发布</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
        >
          <option value="ALL">全部平台</option>
          <option value="抖音">抖音</option>
          <option value="小红书">小红书</option>
          <option value="快手">快手</option>
        </select>
      </div>

      {/* 视频列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">视频编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">项目名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">款式</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">平台</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">观看</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">点赞</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">转化率</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">销售额</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.testId} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{test.testId}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-xs">{test.projectName}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{test.styleName}</div>
                    <div className="text-xs text-gray-500">{test.styleCode}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${TEST_STATUS_CLASS[test.testStatus]}`}>
                      {TEST_STATUS_ZH[test.testStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${PLATFORM_CLASS[test.platform] ?? ''}`}>
                      {test.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{test.views ? test.views.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 tabular-nums">{test.likes ? test.likes.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 tabular-nums">{test.conversionRate ? `${test.conversionRate}%` : '-'}</td>
                  <td className="px-4 py-3 tabular-nums">{test.revenue ? `¥${test.revenue.toLocaleString()}` : '-'}</td>
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
