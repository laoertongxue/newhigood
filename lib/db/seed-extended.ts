/**
 * 扩展数据导入脚本
 * 运行: npx tsx lib/db/seed-extended.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('缺少 Supabase 环境变量');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedQualityRecords() {
  console.log('开始导入质检记录...');
  const { data, error } = await supabase.from('fcs_quality_records').insert([
    { record_no: 'QC-2024-001', inspector: '质检员A', inspect_date: '2024-01-15', batch_qty: 100, pass_qty: 85, fail_qty: 15, pass_rate: 85, result: 'FAIL', status: 'SUBMITTED', liability_status: 'DRAFT', notes: '多处线头' },
    { record_no: 'QC-2024-002', inspector: '质检员B', inspect_date: '2024-01-14', batch_qty: 150, pass_qty: 150, fail_qty: 0, pass_rate: 100, result: 'PASS', status: 'CLOSED', notes: '全部合格' },
    { record_no: 'QC-2024-003', inspector: '质检员A', inspect_date: '2024-01-13', batch_qty: 200, pass_qty: 180, fail_qty: 20, pass_rate: 90, result: 'FAIL', status: 'SUBMITTED', liability_status: 'CONFIRMED', notes: '尺寸偏差' },
  ]);
  if (error) console.error('❌ 质检记录导入失败:', error.message);
  else console.log('✓ 导入 3 条质检记录');
  return data;
}

async function seedCuttingPlans() {
  console.log('开始导入裁剪计划...');
  const { data, error } = await supabase.from('fcs_cutting_plans').insert([
    { plan_no: 'CUT-PLAN-001', planned_date: '2024-01-15', style_name: '碎花雪纺连衣裙', factory_name: '华东服装厂', layers: 50, total_qty: 500, cut_qty: 250, status: 'IN_PROGRESS' },
    { plan_no: 'CUT-PLAN-002', planned_date: '2024-01-20', style_name: '连帽卫衣经典款', factory_name: '华南制衣有限公司', layers: 40, total_qty: 300, cut_qty: 0, status: 'PENDING' },
    { plan_no: 'CUT-PLAN-003', planned_date: '2024-01-18', style_name: '弹力运动裤', factory_name: '北方服装加工厂', layers: 60, total_qty: 800, cut_qty: 800, status: 'COMPLETED' },
  ]);
  if (error) console.error('❌ 裁剪计划导入失败:', error.message);
  else console.log('✓ 导入 3 条裁剪计划');
  return data;
}

async function seedInboundRecords() {
  console.log('开始导入入库记录...');
  const { data, error } = await supabase.from('fcs_inbound_records').insert([
    { inbound_no: 'INB-001', inbound_date: '2024-01-15', style_name: '碎花雪纺连衣裙', factory_name: '华东服装厂', total_qty: 100, qualified_qty: 95, rejected_qty: 5, warehouse_name: 'A区仓库', status: 'COMPLETED', operator: '仓管员A' },
    { inbound_no: 'INB-002', inbound_date: '2024-01-14', style_name: '连帽卫衣经典款', factory_name: '华南制衣有限公司', total_qty: 150, qualified_qty: 150, rejected_qty: 0, warehouse_name: 'A区仓库', status: 'COMPLETED', operator: '仓管员B' },
    { inbound_no: 'INB-003', inbound_date: '2024-01-16', style_name: '弹力运动裤', factory_name: '北方服装加工厂', total_qty: 200, qualified_qty: 0, rejected_qty: 0, warehouse_name: 'B区仓库', status: 'PENDING', operator: '仓管员A', notes: '待质检' },
  ]);
  if (error) console.error('❌ 入库记录导入失败:', error.message);
  else console.log('✓ 导入 3 条入库记录');
  return data;
}

async function seedSettlementStatements() {
  console.log('开始导入对账单...');
  const { data, error } = await supabase.from('fcs_settlement_statements').insert([
    { statement_no: 'STMT-001', factory_name: '华东服装厂', statement_month: '2024-01', total_amount: 85000, deduction_amount: 3500, net_amount: 81500, item_count: 12, status: 'DRAFT' },
    { statement_no: 'STMT-002', factory_name: '华南制衣有限公司', statement_month: '2024-01', total_amount: 62000, deduction_amount: 1800, net_amount: 60200, item_count: 8, status: 'CONFIRMED', confirmed_at: '2024-01-12' },
    { statement_no: 'STMT-003', factory_name: '北方服装加工厂', statement_month: '2023-12', total_amount: 120000, deduction_amount: 8500, net_amount: 111500, item_count: 15, status: 'CLOSED', confirmed_at: '2024-01-03', paid_at: '2024-01-05' },
  ]);
  if (error) console.error('❌ 对账单导入失败:', error.message);
  else console.log('✓ 导入 3 条对账单');
  return data;
}

async function seedPcsProjects() {
  console.log('开始导入PCS项目...');
  const { data, error } = await supabase.from('pcs_projects').insert([
    { project_no: 'PROJ-001', project_name: '2024春夏新款连衣裙系列', style_code: 'STYLE-A001', style_name: '碎花雪纺连衣裙', status: 'IN_PROGRESS', priority: 'HIGH', planned_start_date: '2024-01-01', planned_end_date: '2024-03-31', budget: 500000 },
    { project_no: 'PROJ-002', project_name: '秋冬卫衣改版项目', style_code: 'STYLE-B001', style_name: '连帽卫衣经典款', status: 'APPROVED', priority: 'NORMAL', planned_start_date: '2024-02-01', planned_end_date: '2024-04-30', budget: 300000 },
    { project_no: 'PROJ-003', project_name: '运动休闲裤上新', style_code: 'STYLE-C001', style_name: '弹力运动裤', status: 'DRAFT', priority: 'HIGH', planned_start_date: '2024-03-01', planned_end_date: '2024-05-31', budget: 400000 },
  ]);
  if (error) console.error('❌ PCS项目导入失败:', error.message);
  else console.log('✓ 导入 3 条PCS项目');
  return data;
}

async function seedPcsSamples() {
  console.log('开始导入样衣记录...');
  const { data: projects } = await supabase.from('pcs_projects').select('id, project_no').limit(3);
  const { data, error } = await supabase.from('pcs_sample_records').insert([
    { sample_no: 'SAMPLE-001', project_id: projects?.[0]?.id, style_code: 'STYLE-A001', style_name: '碎花雪纺连衣裙', sample_type: 'FIRST_SAMPLE', status: 'PENDING_APPROVAL', submitter: '设计师A', submit_date: '2024-01-15', expected_date: '2024-01-20', actual_date: '2024-01-18', quality_score: 85 },
    { sample_no: 'SAMPLE-002', project_id: projects?.[1]?.id, style_code: 'STYLE-B001', style_name: '连帽卫衣经典款', sample_type: 'FIRST_SAMPLE', status: 'APPROVED', submitter: '设计师B', submit_date: '2024-01-12', expected_date: '2024-01-18', actual_date: '2024-01-17', quality_score: 92 },
    { sample_no: 'SAMPLE-003', project_id: projects?.[2]?.id, style_code: 'STYLE-C001', style_name: '弹力运动裤', sample_type: 'FIRST_SAMPLE', status: 'IN_PROGRESS', submitter: '设计师C', submit_date: '2024-01-16', expected_date: '2024-01-22' },
  ]);
  if (error) console.error('❌ 样衣记录导入失败:', error.message);
  else console.log('✓ 导入 3 条样衣记录');
  return data;
}

async function seedPdaTasks() {
  console.log('开始导入PDA任务...');
  const { data, error } = await supabase.from('pda_tasks').insert([
    { task_no: 'PDA-001', task_type: 'CUTTING', description: '裁剪任务批次A', priority: 'HIGH', status: 'PENDING', deadline: '2024-01-16', estimated_duration: '2小时' },
    { task_no: 'PDA-002', task_type: 'SEWING', description: '车缝工序批次B', priority: 'MEDIUM', status: 'PENDING', deadline: '2024-01-17', estimated_duration: '4小时' },
    { task_no: 'PDA-003', task_type: 'QC', description: '质检批次A半成品', priority: 'HIGH', status: 'ACCEPTED', deadline: '2024-01-15', estimated_duration: '1小时' },
    { task_no: 'PDA-004', task_type: 'INBOUND', description: '入库扫描任务', priority: 'LOW', status: 'PENDING', deadline: '2024-01-18', estimated_duration: '3小时' },
  ]);
  if (error) console.error('❌ PDA任务导入失败:', error.message);
  else console.log('✓ 导入 4 条PDA任务');
  return data;
}

async function seedPdaNotifications() {
  console.log('开始导入PDA通知...');
  const { data, error } = await supabase.from('pda_notifications').insert([
    { notify_no: 'NOTIFY-001', notify_type: 'TASK_ASSIGNMENT', title: '新任务分配', content: '裁剪任务批次A已分配给您', priority: 'HIGH', is_read: false },
    { notify_no: 'NOTIFY-002', notify_type: 'DEADLINE_REMINDER', title: '任务截止提醒', content: '质检批次A半成品任务将于今天17:00截止', priority: 'MEDIUM', is_read: false },
    { notify_no: 'NOTIFY-003', notify_type: 'QC_RESULT', title: '质检结果通知', content: '批次B产品质检合格，数量150件', priority: 'LOW', is_read: true },
    { notify_no: 'NOTIFY-004', notify_type: 'SYSTEM_ALERT', title: '设备异常提醒', content: '裁剪设备A-01检测到异常', priority: 'HIGH', is_read: false },
  ]);
  if (error) console.error('❌ PDA通知导入失败:', error.message);
  else console.log('✓ 导入 4 条PDA通知');
  return data;
}

async function main() {
  try {
    console.log('开始导入扩展数据...\n');
    await seedQualityRecords();
    await seedCuttingPlans();
    await seedInboundRecords();
    await seedSettlementStatements();
    await seedPcsProjects();
    await seedPcsSamples();
    await seedPdaTasks();
    await seedPdaNotifications();
    console.log('\n✨ 所有扩展数据导入完成！');
  } catch (error) {
    console.error('\n❌ 数据导入失败:', error);
    process.exit(1);
  }
}

main();
