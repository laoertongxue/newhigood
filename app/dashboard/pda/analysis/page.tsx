'use client';

import { Loader } from 'lucide-react';
import { usePdaAnalysis, usePdaKpi, usePdaKpiSummary } from '@/lib/hooks/usePdaResources';

export default function PdaAnalysisPage() {
  const { reports, isLoading, error, pagination } = usePdaAnalysis({ limit: 20 });
  const { metrics } = usePdaKpi({ limit: 20 });
  const { summary } = usePdaKpiSummary();

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">数据分析</h1>
        <p className="text-gray-600 mt-1">分析报告与 KPI 汇总</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="报告数量" value={String(reports.length)} />
        <MetricCard title="KPI 指标数" value={String(summary?.total_metrics || metrics.length)} />
        <MetricCard title="KPI 平均值" value={String(summary?.average_metric_value || 0)} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="text-blue-600 animate-spin" size={24} />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center"><p className="text-red-600">错误: {error}</p></div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center"><p className="text-gray-600">暂无分析报告</p></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">报告号</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">开始时间</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">结束时间</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">记录数</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{item.report_no}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.analysis_period?.start || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.analysis_period?.end || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.summary?.total_records ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-600 bg-gray-50">
                共 <span className="font-semibold">{pagination.total}</span> 条，
                第 <span className="font-semibold">{pagination.page}</span> /
                <span className="font-semibold">{pagination.totalPages}</span> 页
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
