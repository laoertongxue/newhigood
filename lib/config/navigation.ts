/**
 * 应用导航菜单配置
 */

import type { MenuGroup } from '@/lib/types';

export type SubsystemType = 'fcs' | 'pcs' | 'pda';

export const SUBSYSTEMS: Array<{ type: SubsystemType; label: string }> = [
  { type: 'fcs', label: 'FCS' },
  { type: 'pcs', label: 'PCS' },
  { type: 'pda', label: 'PDA' },
];

// FCS 菜单（对齐 baseline IA）
export const fcsMenuGroups: MenuGroup[] = [
  {
    key: 'fcs-platform',
    title: '平台运营系统',
    items: [
      {
        key: 'fcs-platform-workbench',
        title: '工作台',
        icon: 'LayoutDashboard',
        children: [
          { key: 'fcs-platform-workbench-overview', title: '运营看板', href: '/dashboard/fcs/workbench/overview' },
          { key: 'fcs-platform-workbench-todos', title: '待办中心', href: '/dashboard/fcs/workbench/todos' },
        ],
      },
      {
        key: 'fcs-platform-factories',
        title: '工厂管理',
        icon: 'Factory',
        children: [
          { key: 'fcs-platform-factories-profile', title: '工厂档案', href: '/dashboard/fcs/factories/profile' },
          { key: 'fcs-platform-factories-capacity-profile', title: '产能画像', href: '/dashboard/fcs/factories/capacity-profile' },
          { key: 'fcs-platform-factories-capability', title: '能力标签', href: '/dashboard/fcs/factories/capability' },
          { key: 'fcs-platform-factories-settlement', title: '结算配置', href: '/dashboard/fcs/factories/settlement' },
          { key: 'fcs-platform-factories-status', title: '状态监控', href: '/dashboard/fcs/factories/status' },
          { key: 'fcs-platform-factories-performance', title: '绩效评估', href: '/dashboard/fcs/factories/performance' },
        ],
      },
      {
        key: 'fcs-platform-production',
        title: '生产管理',
        icon: 'Calendar',
        children: [
          { key: 'fcs-platform-production-demand-inbox', title: '需求池', href: '/dashboard/fcs/production/demand-inbox' },
          { key: 'fcs-platform-production-orders', title: '生产订单', href: '/dashboard/fcs/production/orders' },
          { key: 'fcs-platform-production-plan', title: '计划排程', href: '/dashboard/fcs/production/plan' },
          { key: 'fcs-platform-production-delivery-warehouse', title: '入库管理', href: '/dashboard/fcs/production/delivery-warehouse' },
          { key: 'fcs-platform-production-changes', title: '变更管理', href: '/dashboard/fcs/production/changes' },
          { key: 'fcs-platform-production-status', title: '执行状态', href: '/dashboard/fcs/production/status' },
          { key: 'fcs-platform-production-craft-dict', title: '工艺字典', href: '/dashboard/fcs/production/craft-dict' },
        ],
      },
      {
        key: 'fcs-platform-process',
        title: '任务协同',
        icon: 'ClipboardList',
        children: [
          { key: 'fcs-platform-process-task-breakdown', title: '任务拆解', href: '/dashboard/fcs/process/task-breakdown' },
          { key: 'fcs-platform-process-dye-requirements', title: '染色要求', href: '/dashboard/fcs/process/dye-requirements' },
          { key: 'fcs-platform-process-print-requirements', title: '印花要求', href: '/dashboard/fcs/process/print-requirements' },
          { key: 'fcs-platform-process-dye-orders', title: '染色工单', href: '/dashboard/fcs/process/dye-orders' },
          { key: 'fcs-platform-process-print-orders', title: '印花工单', href: '/dashboard/fcs/process/print-orders' },
        ],
      },
      {
        key: 'fcs-platform-dispatch',
        title: '派工与招标',
        icon: 'Send',
        children: [
          { key: 'fcs-platform-dispatch-board', title: '派工看板', href: '/dashboard/fcs/dispatch/board' },
          { key: 'fcs-platform-dispatch-tenders', title: '招标管理', href: '/dashboard/fcs/dispatch/tenders' },
        ],
      },
      {
        key: 'fcs-platform-progress',
        title: '进度管理',
        icon: 'TrendingUp',
        children: [
          { key: 'fcs-platform-progress-board', title: '进度看板', href: '/dashboard/fcs/progress/board' },
          { key: 'fcs-platform-progress-exceptions', title: '异常中心', href: '/dashboard/fcs/progress/exceptions' },
          { key: 'fcs-platform-progress-urge', title: '催办中心', href: '/dashboard/fcs/progress/urge' },
          { key: 'fcs-platform-progress-handover', title: '交接追踪', href: '/dashboard/fcs/progress/handover' },
          { key: 'fcs-platform-progress-material', title: '物料跟进', href: '/dashboard/fcs/progress/material' },
          { key: 'fcs-platform-progress-milestone-config', title: '里程碑配置', href: '/dashboard/fcs/progress/milestone-config' },
          { key: 'fcs-platform-progress-cutting-overview', title: '裁床总览', href: '/dashboard/fcs/progress/cutting-overview' },
          { key: 'fcs-platform-progress-cutting-exception-center', title: '裁床异常中心', href: '/dashboard/fcs/progress/cutting-exception-center' },
        ],
      },
      {
        key: 'fcs-platform-quality',
        title: '质量管理',
        icon: 'ShieldCheck',
        children: [
          { key: 'fcs-platform-quality-qc-records', title: '质检记录', href: '/dashboard/fcs/quality/qc-records' },
          { key: 'fcs-platform-quality-deduction-analysis', title: '扣款分析', href: '/dashboard/fcs/quality/deduction-analysis' },
        ],
      },
      {
        key: 'fcs-platform-settlement',
        title: '结算中心',
        icon: 'Wallet',
        children: [
          { key: 'fcs-platform-settlement-statements', title: '结算单', href: '/dashboard/fcs/settlement/statements' },
          { key: 'fcs-platform-settlement-adjustments', title: '差异调整', href: '/dashboard/fcs/settlement/adjustments' },
          { key: 'fcs-platform-settlement-material-statements', title: '物料对账', href: '/dashboard/fcs/settlement/material-statements' },
          { key: 'fcs-platform-settlement-batches', title: '批次管理', href: '/dashboard/fcs/settlement/batches' },
        ],
      },
      {
        key: 'fcs-platform-trace',
        title: '追溯中心',
        icon: 'Box',
        children: [
          { key: 'fcs-platform-trace-parent-codes', title: '母码管理', href: '/dashboard/fcs/trace/parent-codes' },
          { key: 'fcs-platform-trace-unique-codes', title: '唯一码管理', href: '/dashboard/fcs/trace/unique-codes' },
          { key: 'fcs-platform-trace-mapping', title: '映射关系', href: '/dashboard/fcs/trace/mapping' },
          { key: 'fcs-platform-trace-unit-price', title: '单价维护', href: '/dashboard/fcs/trace/unit-price' },
        ],
      },
      {
        key: 'fcs-platform-capacity',
        title: '产能决策',
        icon: 'Gauge',
        children: [
          { key: 'fcs-platform-capacity-overview', title: '产能总览', href: '/dashboard/fcs/capacity/overview' },
          { key: 'fcs-platform-capacity-constraints', title: '约束分析', href: '/dashboard/fcs/capacity/constraints' },
          { key: 'fcs-platform-capacity-risk', title: '风险预警', href: '/dashboard/fcs/capacity/risk' },
          { key: 'fcs-platform-capacity-bottleneck', title: '瓶颈诊断', href: '/dashboard/fcs/capacity/bottleneck' },
          { key: 'fcs-platform-capacity-policies', title: '策略建议', href: '/dashboard/fcs/capacity/policies' },
        ],
      },
    ],
  },
  {
    key: 'fcs-craft',
    title: '工艺工厂运营系统',
    items: [
      {
        key: 'fcs-craft-workbench',
        title: '工艺工作台',
        icon: 'LayoutDashboard',
        children: [{ key: 'fcs-craft-workbench-overview', title: '运营总览', href: '/dashboard/fcs/craft/workbench/overview' }],
      },
      {
        key: 'fcs-craft-cutting',
        title: '裁床管理',
        icon: 'Scissors',
        children: [
          { key: 'fcs-craft-cutting-overview', title: '裁床看板', href: '/dashboard/fcs/craft/cutting/overview' },
          { key: 'fcs-craft-cutting-prep', title: '备料准备', href: '/dashboard/fcs/craft/cutting/prep' },
          { key: 'fcs-craft-cutting-execution', title: '执行记录', href: '/dashboard/fcs/craft/cutting/execution' },
          { key: 'fcs-craft-cutting-closed-loop', title: '闭环管理', href: '/dashboard/fcs/craft/cutting/closed-loop' },
          { key: 'fcs-craft-cutting-handover', title: '交接管理', href: '/dashboard/fcs/craft/cutting/handover' },
        ],
      },
      {
        key: 'fcs-craft-printing',
        title: '印花管理',
        icon: 'Printer',
        children: [
          { key: 'fcs-craft-printing-work-orders', title: '印花工单', href: '/dashboard/fcs/craft/printing/work-orders' },
          { key: 'fcs-craft-printing-pending-review', title: '待审核', href: '/dashboard/fcs/craft/printing/pending-review' },
          { key: 'fcs-craft-printing-progress', title: '执行进度', href: '/dashboard/fcs/craft/printing/progress' },
          { key: 'fcs-craft-printing-statistics', title: '统计分析', href: '/dashboard/fcs/craft/printing/statistics' },
          { key: 'fcs-craft-printing-dashboards', title: '可视化看板', href: '/dashboard/fcs/craft/printing/dashboards' },
        ],
      },
      {
        key: 'fcs-craft-dyeing',
        title: '染色管理',
        icon: 'Droplets',
        children: [
          { key: 'fcs-craft-dyeing-work-orders', title: '染色工单', href: '/dashboard/fcs/craft/dyeing/work-orders' },
          { key: 'fcs-craft-dyeing-dye-orders', title: '投缸单', href: '/dashboard/fcs/craft/dyeing/dye-orders' },
          { key: 'fcs-craft-dyeing-reports', title: '报表中心', href: '/dashboard/fcs/craft/dyeing/reports' },
        ],
      },
    ],
  },
];

// PCS 菜单（对齐 baseline IA）
export const pcsMenuGroups: MenuGroup[] = [
  {
    key: 'pcs-main',
    title: '商品协调系统',
    items: [
      {
        key: 'pcs-menu-workspace',
        title: '工作台',
        icon: 'LayoutDashboard',
        children: [
          { key: 'pcs-menu-workspace-overview', title: '总览', href: '/dashboard/pcs/workspace/overview' },
          { key: 'pcs-menu-workspace-todos', title: '待办', href: '/dashboard/pcs/workspace/todos' },
          { key: 'pcs-menu-workspace-alerts', title: '预警', href: '/dashboard/pcs/workspace/alerts' },
        ],
      },
      {
        key: 'pcs-menu-projects',
        title: '项目管理',
        icon: 'Package',
        children: [
          { key: 'pcs-menu-projects-list', title: '项目列表', href: '/dashboard/pcs/projects/list' },
          { key: 'pcs-menu-projects-templates', title: '模板配置', href: '/dashboard/pcs/projects/templates' },
          { key: 'pcs-menu-projects-work-items', title: '工作项', href: '/dashboard/pcs/projects/work-items' },
        ],
      },
      {
        key: 'pcs-menu-testing',
        title: '直播与测款',
        icon: 'Monitor',
        children: [
          { key: 'pcs-menu-testing-live', title: '直播测款', href: '/dashboard/pcs/testing/live' },
          { key: 'pcs-menu-testing-video', title: '短视频测款', href: '/dashboard/pcs/testing/video' },
          { key: 'pcs-menu-testing-stores', title: '门店渠道', href: '/dashboard/pcs/channels/stores' },
        ],
      },
      {
        key: 'pcs-menu-patterns',
        title: '版型管理',
        icon: 'RefreshCw',
        children: [
          { key: 'pcs-menu-patterns-revision', title: '改款管理', href: '/dashboard/pcs/patterns/revision' },
          { key: 'pcs-menu-patterns-creation', title: '创款管理', href: '/dashboard/pcs/patterns/creation' },
          { key: 'pcs-menu-patterns-part-templates', title: '部位模板', href: '/dashboard/pcs/patterns/part-templates' },
          { key: 'pcs-menu-patterns-colors', title: '颜色管理', href: '/dashboard/pcs/patterns/colors' },
          { key: 'pcs-menu-patterns-library', title: '版型库', href: '/dashboard/pcs/patterns/library' },
          { key: 'pcs-menu-patterns-first-sample', title: '头版打样', href: '/dashboard/pcs/samples/first-sample' },
          { key: 'pcs-menu-patterns-pre-production', title: '产前样管理', href: '/dashboard/pcs/samples/pre-production' },
        ],
      },
      {
        key: 'pcs-menu-products',
        title: '产品档案',
        icon: 'Move',
        children: [
          { key: 'pcs-menu-products-styles', title: '款式档案', href: '/dashboard/pcs/products/styles' },
          { key: 'pcs-menu-products-specifications', title: '规格管理', href: '/dashboard/pcs/products/specifications' },
          { key: 'pcs-menu-products-channel-products', title: '渠道商品', href: '/dashboard/pcs/products/channel-products' },
        ],
      },
      {
        key: 'pcs-menu-materials',
        title: '物料档案',
        icon: 'Database',
        children: [
          { key: 'pcs-menu-materials-fabric', title: '面料', href: '/dashboard/pcs/materials/fabric' },
          { key: 'pcs-menu-materials-accessory', title: '辅料', href: '/dashboard/pcs/materials/accessory' },
          { key: 'pcs-menu-materials-yarn', title: '纱线', href: '/dashboard/pcs/materials/yarn' },
          { key: 'pcs-menu-materials-consumable', title: '耗材', href: '/dashboard/pcs/materials/consumable' },
        ],
      },
      {
        key: 'pcs-menu-settings',
        title: '设置中心',
        icon: 'Settings',
        children: [{ key: 'pcs-menu-settings-config-workspace', title: '工作区配置', href: '/dashboard/pcs/settings/config-workspace' }],
      },
    ],
  },
];

// PDA 菜单（对齐 baseline IA）
export const pdaMenuGroups: MenuGroup[] = [
  {
    key: 'pda-main',
    title: '工厂端移动应用',
    items: [
      { key: 'fcs-pda-notify', title: '通知与待办', href: '/dashboard/pda/notify', icon: 'LayoutDashboard' },
      { key: 'fcs-pda-task-receive', title: '任务接收', href: '/dashboard/pda/task-receive', icon: 'Database' },
      { key: 'fcs-pda-exec', title: '执行上报', href: '/dashboard/pda/exec', icon: 'BarChart3' },
      { key: 'fcs-pda-handover', title: '工序交接', href: '/dashboard/pda/handover', icon: 'RefreshCw' },
      { key: 'fcs-pda-settlement', title: '结算中心', href: '/dashboard/pda/settlement', icon: 'Download' },
    ],
  },
];

export const menusBySubsystem = {
  fcs: fcsMenuGroups,
  pcs: pcsMenuGroups,
  pda: pdaMenuGroups,
} as const;
