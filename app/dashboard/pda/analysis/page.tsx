'use client';

import { useState } from 'react';

// Mock 数据 - PDA 分析
const mockAnalysisData = [
  { metricId: '001', metricName: '今日完成任务数', value: 12, unit: '个', trend: 'up', changeRate: 20, baseline: 10 },
  { metricId: '002', metricName: '今日产出数量', value: 350, unit: '件', trend: 'up', changeRate: 15, baseline: 300 },
  { metricId: '003', metricName: '平均任务耗时', value: 2.5, unit: '小时', trend: 'down', changeRate: -10, baseline: 2.8 },
  { metricId: '004', metricName: '任务完成率', value: 95, unit: '%', trend: 'up', changeRate: 5, baseline: 90 },
  { metricId: '005', metricName: '设备利用率', value: 85, unit: '%', trend: 'stable', changeRate: 0, baseline: 85 },
  { metricId: '006', metricName: '异常任务数', value: 2, unit: '个', trend: 'down', changeRate: -50, baseline: 4 },
];

export default function PdaAnalysisPage() {
  const [dateRange, setDateRange] = useState<string>('TODAY');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">数据分析</h1>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="TODAY">今日</option>
          <option value="WEEK">本周</option>
          <option value="MONTH">本月</option>
        </select>
      </div>

      {/* 指标卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {mockAnalysisData.map((item) => (
          <div key={item.metricId} className="rounded-lg border bg-white p-4">
            <p className="mb-1 text-xs text-gray-500">{item.metricName}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold tabular-nums">
                {item.value}
                <span className="ml-1 text-sm font-normal text-gray-500">{item.unit}</span>
              </p>
              <TrendBadge trend={item.trend} changeRate={item.changeRate} />
            </div>
            <div className="mt-2">
              <div className="h-1.5 w-full rounded-full bg-gray-200">
                <div 
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${Math.min(item.value / (item.baseline * 1.5) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 趋势图表占位 */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 font-medium">产出趋势</h2>
        <div className="flex h-48 items-end justify-between gap-2">
          {[65, 80, 75, 90, 85, 95, 100].map((value, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-1">
              <div 
                className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                style={{ height: `${value}%` }}
              />
              <span className="text-xs text-gray-500">
                {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 效率分析 */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 font-medium">工序效率对比</h2>
        <div className="space-y-4">
          {[
            { process: '裁剪', efficiency: 92 },
            { process: '车缝', efficiency: 85 },
            { process: '质检', efficiency: 88 },
            { process: '包装', efficiency: 95 },
          ].map((item) => (
            <div key={item.process} className="flex items-center gap-4">
              <span className="w-16 text-sm">{item.process}</span>
              <div className="flex-1">
                <div className="h-4 w-full rounded-full bg-gray-200">
                  <div 
                    className={`h-full rounded-full ${item.efficiency >= 90 ? 'bg-green-500' : item.efficiency >= 80 ? 'bg-blue-500' : 'bg-amber-500'}`}
                    style={{ width: `${item.efficiency}%` }}
                  />
                </div>
              </div>
              <span className="w-12 text-right text-sm tabular-nums">{item.efficiency}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrendBadge({ trend, changeRate }: { trend: string; changeRate: number }) {
  if (trend === 'stable') {
    return <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">持平</span>;
  }
  const isUp = trend === 'up';
  return (
    <span className={`rounded px-2 py-0.5 text-xs ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {isUp ? '↑' : '↓'} {Math.abs(changeRate)}%
    </span>
  );
}
