'use client';

import { useRouter } from 'next/navigation';

// Mock 数据
const processTasks = [
  { taskId: 'TASK-001', productionOrderId: 'PO-2024-001', status: 'BLOCKED', blockReason: 'ALLOCATION_GATE', blockNoteZh: '配货开始条件未满足', updatedAt: '2024-01-15 14:30', createdAt: '2024-01-15 09:00' },
  { taskId: 'TASK-002', productionOrderId: 'PO-2024-002', status: 'IN_PROGRESS', updatedAt: '2024-01-15 16:00', createdAt: '2024-01-15 10:00' },
  { taskId: 'TASK-003', productionOrderId: 'PO-2024-003', status: 'COMPLETED', updatedAt: '2024-01-15 17:00', createdAt: '2024-01-14 08:00' },
];

const legacyLikeQualityInspections = [
  { qcId: 'QC-001', productionOrderId: 'PO-2024-001', status: 'SUBMITTED', result: 'FAIL', liabilityStatus: 'DRAFT', updatedAt: '2024-01-15 15:00', createdAt: '2024-01-15 14:00' },
  { qcId: 'QC-002', productionOrderId: 'PO-2024-002', status: 'SUBMITTED', result: 'PASS', liabilityStatus: 'CONFIRMED', updatedAt: '2024-01-15 14:00', createdAt: '2024-01-15 13:00' },
  { qcId: 'QC-003', productionOrderId: 'PO-2024-003', status: 'CLOSED', result: 'PASS', liabilityStatus: null, updatedAt: '2024-01-14 17:00', createdAt: '2024-01-14 16:00' },
  { qcId: 'QC-004', productionOrderId: 'PO-2024-004', status: 'SUBMITTED', result: 'FAIL', liabilityStatus: 'DISPUTED', updatedAt: '2024-01-15 11:00', createdAt: '2024-01-15 10:00' },
  { qcId: 'QC-005', productionOrderId: 'PO-2024-005', status: 'SUBMITTED', result: 'PASS', liabilityStatus: 'CONFIRMED', updatedAt: '2024-01-15 09:00', createdAt: '2024-01-15 08:00' },
];

const legacyLikeDeductionBasisItems = [
  { basisId: 'BASIS-001', settlementPartyId: 'FACTORY-001', settlementReady: true, status: 'CONFIRMED', updatedAt: '2024-01-15 16:00', createdAt: '2024-01-15 15:00' },
  { basisId: 'BASIS-002', settlementPartyId: 'FACTORY-002', settlementReady: false, status: 'DRAFT', updatedAt: '2024-01-15 14:00', createdAt: '2024-01-15 13:00' },
  { basisId: 'BASIS-003', settlementPartyId: 'FACTORY-001', settlementReady: true, status: 'DISPUTED', updatedAt: '2024-01-15 12:00', createdAt: '2024-01-15 11:00' },
];

const initialStatementDrafts = [
  { statementId: 'STMT-001', totalAmount: 15000, status: 'DRAFT', itemBasisIds: ['BASIS-001'], updatedAt: '2024-01-15 17:00', createdAt: '2024-01-15 16:00' },
  { statementId: 'STMT-002', totalAmount: 28000, status: 'CONFIRMED', itemBasisIds: [], updatedAt: '2024-01-15 14:00', createdAt: '2024-01-14 10:00' },
  { statementId: 'STMT-003', totalAmount: 9500, status: 'CLOSED', itemBasisIds: [], updatedAt: '2024-01-14 18:00', createdAt: '2024-01-14 09:00' },
];

const initialSettlementBatches = [
  { batchId: 'BATCH-001', totalAmount: 50000, status: 'PROCESSING', updatedAt: '2024-01-15 16:30', createdAt: '2024-01-15 14:00' },
  { batchId: 'BATCH-002', totalAmount: 32000, status: 'COMPLETED', updatedAt: '2024-01-15 12:00', createdAt: '2024-01-14 10:00' },
];

const legacyLikeDyePrintOrders = [
  { orderId: 'DP-001', availableQty: 100, returnedFailQty: 5, returnBatches: [{ batchId: 'RB-001', qty: 5 }] },
  { orderId: 'DP-002', availableQty: 0, returnedFailQty: 20, returnBatches: [{ batchId: 'RB-002', qty: 20 }] },
  { orderId: 'DP-003', availableQty: 200, returnedFailQty: 0, returnBatches: [] },
];

const QC_STATUS_ZH: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '待处理',
  CLOSED: '已结案',
};

const LIABILITY_STATUS_ZH: Record<string, string> = {
  DRAFT: '草稿',
  CONFIRMED: '已确认',
  DISPUTED: '争议中',
  VOID: '已作废',
};

const STATEMENT_STATUS_ZH: Record<string, string> = {
  DRAFT: '草稿',
  CONFIRMED: '已确认',
  CLOSED: '已关闭',
};

const BATCH_STATUS_ZH: Record<string, string> = {
  PENDING: '待提交',
  PROCESSING: '处理中',
  COMPLETED: '已完成',
};

export default function FcsWorkbenchOverviewPage() {
  const router = useRouter();

  const blockedTasks = processTasks.filter((task) => task.status === 'BLOCKED' && task.blockReason === 'ALLOCATION_GATE');
  const openQc = legacyLikeQualityInspections.filter((item) => item.status !== 'CLOSED');
  const disputedQc = legacyLikeQualityInspections.filter((item) => item.liabilityStatus === 'DISPUTED');
  const disputedBasis = legacyLikeDeductionBasisItems.filter((item) => item.status === 'DISPUTED');
  const readyBasis = legacyLikeDeductionBasisItems.filter((item) => item.settlementReady === true);
  const frozenBasis = legacyLikeDeductionBasisItems.filter((item) => !item.settlementReady && item.status !== 'VOID');
  const draftStatements = initialStatementDrafts.filter((item) => item.status === 'DRAFT');
  const processingBatches = initialSettlementBatches.filter((item) => item.status === 'PROCESSING');
  const dpTotal = legacyLikeDyePrintOrders.length;
  const dpAvailable = legacyLikeDyePrintOrders.filter((item) => item.availableQty > 0).length;
  const dpFail = legacyLikeDyePrintOrders.filter((item) => item.returnedFailQty > 0).length;

  const disputedCount = new Set([
    ...disputedQc.map((item) => item.qcId),
    ...disputedBasis.map((item) => item.basisId),
  ]).size;

  const recentQc = [...legacyLikeQualityInspections]
    .sort((a, b) => (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt))
    .slice(0, 5);

  const recentSettlement = [
    ...[...initialStatementDrafts]
      .sort((a, b) => (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt))
      .slice(0, 3)
      .map((item) => ({
        id: item.statementId,
        type: 'statement' as const,
        amount: item.totalAmount,
        statusZh: STATEMENT_STATUS_ZH[item.status] ?? item.status,
      })),
    ...[...initialSettlementBatches]
      .sort((a, b) => (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt))
      .slice(0, 2)
      .map((item) => ({
        id: item.batchId,
        type: 'batch' as const,
        amount: item.totalAmount,
        statusZh: BATCH_STATUS_ZH[item.status] ?? item.status,
      })),
  ].slice(0, 5);

  const formatDateTime = (dt: string) => dt.replace('T', ' ').substring(0, 16);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-xl font-semibold">概览看板</h1>

      {/* 核心运营 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500">核心运营</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="生产任务总数" value={processTasks.length} />
          <StatCard 
            label="当前生产暂停任务数" 
            value={blockedTasks.length} 
            highlight={blockedTasks.length > 0} 
            highlightColor="text-red-600" 
          />
          <StatCard 
            label="质检未结案数" 
            value={openQc.length} 
            highlight={openQc.length > 0} 
            highlightColor="text-amber-600" 
          />
          <StatCard 
            label="争议中数" 
            value={disputedCount} 
            highlight={disputedCount > 0} 
            highlightColor="text-orange-600" 
          />
          <StatCard 
            label="可进入结算依据数" 
            value={readyBasis.length} 
            highlightColor="text-green-600" 
          />
          <StatCard 
            label="冻结中依据数" 
            value={frozenBasis.length} 
            highlight={frozenBasis.length > 0} 
            highlightColor="text-amber-600" 
          />
          <StatCard 
            label="对账单草稿数" 
            value={draftStatements.length} 
            highlight={draftStatements.length > 0} 
            highlightColor="text-blue-600" 
          />
          <StatCard 
            label="处理中预付款批次数" 
            value={processingBatches.length} 
            highlight={processingBatches.length > 0} 
            highlightColor="text-blue-600" 
          />
        </div>
      </section>

      {/* 染印加工 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500">染印加工</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="染印加工单总数" value={dpTotal} />
          <StatCard 
            label="染印可继续工单数" 
            value={dpAvailable} 
            highlightColor="text-green-600" 
          />
          <StatCard 
            label="染印不合格处理中数" 
            value={dpFail} 
            highlight={dpFail > 0} 
            highlightColor="text-red-600" 
          />
          <StatCard 
            label="回货批次数" 
            value={legacyLikeDyePrintOrders.reduce((sum, item) => sum + item.returnBatches.length, 0)} 
          />
        </div>
      </section>

      {/* 最近质检事项 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500">最近质检事项</h2>
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">QC单号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">生产单</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">QC结果</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">判责状态</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {recentQc.length > 0 ? (
                  recentQc.map((qc) => {
                    const resultClass =
                      qc.result === 'PASS'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : qc.result === 'FAIL'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200';

                    const liabilityClass =
                      qc.liabilityStatus === 'DISPUTED'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : qc.liabilityStatus === 'CONFIRMED'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200';

                    return (
                      <tr key={qc.qcId} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{qc.qcId}</td>
                        <td className="px-4 py-3 text-xs">{qc.productionOrderId}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${resultClass}`}>
                            {qc.result === 'PASS' ? '合格' : qc.result === 'FAIL' ? '不合格' : QC_STATUS_ZH[qc.status] ?? qc.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${liabilityClass}`}>
                            {LIABILITY_STATUS_ZH[qc.liabilityStatus ?? 'DRAFT'] ?? qc.liabilityStatus ?? '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => router.push('/dashboard/fcs/quality/qc-records')}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                          >
                            查看质检
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">暂无质检记录</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 最近结算事项 */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-gray-500">最近结算事项</h2>
        <div className="rounded-lg border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">单号</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">金额</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {recentSettlement.length > 0 ? (
                  recentSettlement.map((item) => {
                    const href = item.type === 'statement' ? '/dashboard/fcs/settlement/statements' : '/dashboard/fcs/settlement/batches';
                    const actionText = item.type === 'statement' ? '查看对账单' : '查看批次';
                    return (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                        <td className="px-4 py-3 text-xs">{item.type === 'statement' ? '对账单' : '预付款批次'}</td>
                        <td className="px-4 py-3 tabular-nums">¥{item.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded border bg-gray-50 px-2 py-0.5 text-xs">{item.statusZh}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => router.push(href)}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                          >
                            {actionText}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">暂无结算记录</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
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
