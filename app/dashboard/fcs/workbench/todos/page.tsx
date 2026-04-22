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
  { basisId: 'BASIS-001', settlementPartyId: 'FACTORY-001', settlementReady: true, status: 'CONFIRMED', itemBasisIds: [], updatedAt: '2024-01-15 16:00', createdAt: '2024-01-15 15:00' },
  { basisId: 'BASIS-002', settlementPartyId: 'FACTORY-002', settlementReady: false, status: 'DRAFT', itemBasisIds: [], updatedAt: '2024-01-15 14:00', createdAt: '2024-01-15 13:00' },
  { basisId: 'BASIS-003', settlementPartyId: 'FACTORY-001', settlementReady: true, status: 'DISPUTED', itemBasisIds: [], updatedAt: '2024-01-15 12:00', createdAt: '2024-01-15 11:00' },
];

const initialStatementDrafts = [
  { statementId: 'STMT-001', totalAmount: 15000, status: 'DRAFT', itemBasisIds: ['BASIS-001'], updatedAt: '2024-01-15 17:00', createdAt: '2024-01-15 16:00' },
  { statementId: 'STMT-002', totalAmount: 28000, status: 'CONFIRMED', itemBasisIds: [], updatedAt: '2024-01-15 14:00', createdAt: '2024-01-14 10:00' },
];

type TodoKind = 'PENDING_LIABILITY' | 'PENDING_CLOSE' | 'PENDING_ARBITRATION' | 'PENDING_STATEMENT' | 'PENDING_GATE';

interface TodoItem {
  id: string;
  kind: TodoKind;
  kindZh: string;
  title: string;
  relatedObj: string;
  note: string;
  updatedAt: string;
  href: string;
  actionLabel: string;
}

const TODO_BADGE: Record<TodoKind, string> = {
  PENDING_LIABILITY: 'bg-amber-50 text-amber-700 border-amber-200',
  PENDING_CLOSE: 'bg-blue-50 text-blue-700 border-blue-200',
  PENDING_ARBITRATION: 'bg-orange-50 text-orange-700 border-orange-200',
  PENDING_STATEMENT: 'bg-green-50 text-green-700 border-green-200',
  PENDING_GATE: 'bg-red-50 text-red-700 border-red-200',
};

const formatDateTime = (dt: string) => dt.replace('T', ' ').substring(0, 16);

export default function FcsWorkbenchTodosPage() {
  const router = useRouter();

  const buildTodos = (): TodoItem[] => {
    const todos: TodoItem[] = [];

    // 待判责
    legacyLikeQualityInspections
      .filter((qc) => qc.status === 'SUBMITTED' && (!qc.liabilityStatus || qc.liabilityStatus === 'DRAFT'))
      .forEach((qc) => {
        todos.push({
          id: qc.qcId,
          kind: 'PENDING_LIABILITY',
          kindZh: '待判责',
          title: `QC ${qc.qcId} 待判责`,
          relatedObj: qc.productionOrderId ?? qc.qcId,
          note: `质检结果：${qc.result === 'PASS' ? '合格' : qc.result === 'FAIL' ? '不合格' : '-'}`,
          updatedAt: qc.updatedAt ?? qc.createdAt,
          href: '/dashboard/fcs/quality/qc-records',
          actionLabel: '查看质检',
        });
      });

    // 待结案
    legacyLikeQualityInspections
      .filter((qc) => qc.status === 'SUBMITTED' && qc.liabilityStatus === 'CONFIRMED')
      .forEach((qc) => {
        todos.push({
          id: `close-${qc.qcId}`,
          kind: 'PENDING_CLOSE',
          kindZh: '待结案',
          title: `QC ${qc.qcId} 待结案`,
          relatedObj: qc.productionOrderId ?? qc.qcId,
          note: '责任已确认，可进行结案',
          updatedAt: qc.updatedAt ?? qc.createdAt,
          href: '/dashboard/fcs/quality/qc-records',
          actionLabel: '查看质检',
        });
      });

    // 待仲裁
    legacyLikeQualityInspections
      .filter((qc) => qc.liabilityStatus === 'DISPUTED')
      .forEach((qc) => {
        todos.push({
          id: `arb-${qc.qcId}`,
          kind: 'PENDING_ARBITRATION',
          kindZh: '待仲裁',
          title: `QC ${qc.qcId} 待处理争议`,
          relatedObj: qc.productionOrderId ?? qc.qcId,
          note: '质检结果存在争议，后续在质检记录链路内处理',
          updatedAt: qc.updatedAt ?? qc.createdAt,
          href: '/dashboard/fcs/quality/qc-records',
          actionLabel: '查看质检',
        });
      });

    // 待生成对账单
    const occupiedIds = new Set(
      initialStatementDrafts
        .filter((statement) => statement.status !== 'CLOSED')
        .flatMap((statement) => statement.itemBasisIds),
    );

    legacyLikeDeductionBasisItems
      .filter((basis) => basis.settlementReady === true && !occupiedIds.has(basis.basisId))
      .forEach((basis) => {
        todos.push({
          id: `stmt-${basis.basisId}`,
          kind: 'PENDING_STATEMENT',
          kindZh: '待生成对账单',
          title: '扣款依据待生成对账单',
          relatedObj: basis.basisId,
          note: `结算对象：${basis.settlementPartyId ?? '-'}`,
          updatedAt: basis.updatedAt ?? basis.createdAt,
          href: '/dashboard/fcs/settlement/statements',
          actionLabel: '查看对账单生成',
        });
      });

    // 待处理生产暂停
    processTasks
      .filter((task) => task.status === 'BLOCKED' && task.blockReason === 'ALLOCATION_GATE')
      .forEach((task) => {
        todos.push({
          id: `gate-${task.taskId}`,
          kind: 'PENDING_GATE',
          kindZh: '待处理当前生产暂停',
          title: `任务 ${task.taskId} 当前生产暂停`,
          relatedObj: task.productionOrderId ?? task.taskId,
          note: task.blockNoteZh ?? '配货开始条件未满足，任务生产暂停',
          updatedAt: task.updatedAt ?? task.createdAt,
          href: '/dashboard/fcs/process/task-breakdown',
          actionLabel: '查看拆解任务',
        });
      });

    return todos.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 20);
  };

  const todos = buildTodos();

  const liabilityCount = todos.filter((item) => item.kind === 'PENDING_LIABILITY').length;
  const closeCount = todos.filter((item) => item.kind === 'PENDING_CLOSE').length;
  const arbitrationCount = todos.filter((item) => item.kind === 'PENDING_ARBITRATION').length;
  const statementCount = todos.filter((item) => item.kind === 'PENDING_STATEMENT').length;
  const gateCount = todos.filter((item) => item.kind === 'PENDING_GATE').length;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold">我的待办</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard 
          label="待判责数" 
          value={liabilityCount} 
          highlight={liabilityCount > 0} 
          highlightColor="text-amber-600" 
        />
        <StatCard 
          label="待结案数" 
          value={closeCount} 
          highlight={closeCount > 0} 
          highlightColor="text-blue-600" 
        />
        <StatCard 
          label="待仲裁数" 
          value={arbitrationCount} 
          highlight={arbitrationCount > 0} 
          highlightColor="text-orange-600" 
        />
        <StatCard 
          label="待生成对账单数" 
          value={statementCount} 
          highlight={statementCount > 0} 
          highlightColor="text-green-600" 
        />
        <StatCard 
          label="待处理生产暂停数" 
          value={gateCount} 
          highlight={gateCount > 0} 
          highlightColor="text-red-600" 
        />
      </div>

      {/* 待办列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">待办类型</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">标题</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">关联对象</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">说明</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">更新时间</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {todos.length > 0 ? (
                todos.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${TODO_BADGE[item.kind]}`}>
                        {item.kindZh}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{item.title}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.relatedObj}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-xs text-gray-500">{item.note}</td>
                    <td className="px-4 py-3 text-xs tabular-nums text-gray-500">{formatDateTime(item.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => router.push(item.href)}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                      >
                        {item.actionLabel}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">暂无待办事项</td>
                </tr>
              )}
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
