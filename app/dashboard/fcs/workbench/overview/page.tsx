'use client';

import { Loader } from 'lucide-react';
import { useFcsProgress } from '@/lib/hooks/useFcsResources';

const qualityRows = [
  { id: 'QC-202604-001', order: 'PO-202604-120', result: '合格', liability: '已确认' },
  { id: 'QC-202604-002', order: 'PO-202604-118', result: '不合格', liability: '争议中' },
  { id: 'QC-202604-003', order: 'PO-202604-116', result: '合格', liability: '草稿' },
];

const settlementRows = [
  { id: 'STM-202604-011', type: '对账单', amount: '¥86,200', status: '草稿' },
  { id: 'BAT-202604-003', type: '预付款批次', amount: '¥35,000', status: '处理中' },
  { id: 'STM-202604-009', type: '对账单', amount: '¥61,400', status: '已确认' },
];

export default function FcsWorkbenchOverviewPage() {
  const { progress, isLoading, error } = useFcsProgress();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center text-gray-600">
        <Loader size={18} className="animate-spin mr-2" /> 加载中...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-600">错误: {error}</div>;
  }

  const totalOrders = progress?.total_orders || 0;
  const inProgress = progress?.in_progress_orders || 0;
  const completed = progress?.completed_orders || 0;
  const pending = progress?.pending_orders || 0;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-full">
      <h1 className="text-xl font-semibold text-gray-900">概览看板</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500">核心运营</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="生产任务总数" value={totalOrders} />
          <StatCard label="当前生产暂停任务数" value={pending} valueClass={pending > 0 ? 'text-red-600' : ''} />
          <StatCard label="质检未结案数" value={inProgress} valueClass={inProgress > 0 ? 'text-amber-600' : ''} />
          <StatCard label="争议中数" value={Math.max(0, totalOrders - completed - inProgress)} />
          <StatCard label="可进入结算依据数" value={completed} valueClass="text-green-600" />
          <StatCard label="冻结中依据数" value={Math.max(0, pending - 1)} valueClass="text-amber-600" />
          <StatCard label="对账单草稿数" value={2} valueClass="text-blue-600" />
          <StatCard label="处理中预付款批次数" value={1} valueClass="text-blue-600" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500">染印加工</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="染印加工单总数" value={18} />
          <StatCard label="染印可继续工单数" value={13} valueClass="text-green-600" />
          <StatCard label="染印不合格处理中数" value={2} valueClass="text-red-600" />
          <StatCard label="回货批次数" value={7} />
        </div>
      </section>

      <TableCard
        title="最近质检事项"
        columns={['QC单号', '生产单', 'QC结果', '判责状态', '操作']}
        rows={qualityRows.map((row) => [
          row.id,
          row.order,
          row.result,
          row.liability,
          <button key={row.id} className="text-blue-600 hover:text-blue-700">查看质检</button>,
        ])}
      />

      <TableCard
        title="最近结算事项"
        columns={['单号', '类型', '金额', '状态', '操作']}
        rows={settlementRows.map((row) => [
          row.id,
          row.type,
          row.amount,
          row.status,
          <button key={row.id} className="text-blue-600 hover:text-blue-700">查看详情</button>,
        ])}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClass = '',
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) {
  return (
    <article className="rounded-lg border bg-white p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold text-gray-900 ${valueClass}`}>{value}</p>
    </article>
  );
}

function TableCard({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b last:border-b-0 hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 whitespace-nowrap text-gray-800">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
