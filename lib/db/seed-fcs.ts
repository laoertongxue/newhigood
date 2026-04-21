/**
 * FCS 系统数据导入脚本
 * 运行: npm run seed:fcs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('缺少 Supabase 环境变量');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function seedProductionOrders() {
  console.log('开始导入生产订单数据...');

  const sampleOrders = [
    {
      order_no: 'PO-2026-001',
      customer_name: '客户A有限公司',
      product_name: '电子产品零件',
      quantity: 100,
      start_date: '2026-04-20',
      end_date: '2026-04-30',
      status: 'pending',
      priority: 'high',
    },
    {
      order_no: 'PO-2026-002',
      customer_name: '客户B工业',
      product_name: '塑料配件',
      quantity: 50,
      start_date: '2026-04-21',
      end_date: '2026-05-05',
      status: 'in_progress',
      priority: 'normal',
    },
    {
      order_no: 'PO-2026-003',
      customer_name: '客户C制造',
      product_name: '金属外壳',
      quantity: 200,
      start_date: '2026-04-22',
      end_date: '2026-05-10',
      status: 'in_progress',
      priority: 'high',
    },
    {
      order_no: 'PO-2026-004',
      customer_name: '客户D贸易',
      product_name: '螺钉和螺栓',
      quantity: 1000,
      start_date: '2026-04-15',
      end_date: '2026-04-25',
      status: 'completed',
      priority: 'normal',
    },
    {
      order_no: 'PO-2026-005',
      customer_name: '客户E集团',
      product_name: '电缆和连接器',
      quantity: 300,
      start_date: '2026-04-25',
      end_date: '2026-05-15',
      status: 'pending',
      priority: 'urgent',
    },
    {
      order_no: 'PO-2026-006',
      customer_name: '客户F公司',
      product_name: '陶瓷制品',
      quantity: 150,
      start_date: '2026-04-18',
      end_date: '2026-04-28',
      status: 'completed',
      priority: 'low',
    },
    {
      order_no: 'PO-2026-007',
      customer_name: '客户G工厂',
      product_name: '润滑油和油脂',
      quantity: 500,
      start_date: '2026-04-20',
      end_date: '2026-05-01',
      status: 'in_progress',
      priority: 'normal',
    },
    {
      order_no: 'PO-2026-008',
      customer_name: '客户H企业',
      product_name: '焊接配件',
      quantity: 75,
      start_date: '2026-04-23',
      end_date: '2026-05-08',
      status: 'pending',
      priority: 'high',
    },
    {
      order_no: 'PO-2026-009',
      customer_name: '客户I有限公司',
      product_name: '涂料和胶水',
      quantity: 250,
      start_date: '2026-04-19',
      end_date: '2026-04-29',
      status: 'completed',
      priority: 'normal',
    },
    {
      order_no: 'PO-2026-010',
      customer_name: '客户J制造厂',
      product_name: '电气元器件',
      quantity: 180,
      start_date: '2026-04-24',
      end_date: '2026-05-12',
      status: 'in_progress',
      priority: 'high',
    },
  ];

  const { data, error } = await supabase
    .from('production_orders')
    .insert(sampleOrders);

  if (error) {
    console.error('❌ 生产订单导入失败:', error.message);
    throw error;
  }

  console.log(`✓ 成功导入 ${sampleOrders.length} 条生产订单数据`);
  return data;
}

export async function seedProductionLines() {
  console.log('开始导入产线数据...');

  const sampleLines = [
    {
      line_name: '产线1号',
      line_code: 'L001',
      capacity: 100,
      status: 'active',
    },
    {
      line_name: '产线2号',
      line_code: 'L002',
      capacity: 150,
      status: 'active',
    },
    {
      line_name: '产线3号',
      line_code: 'L003',
      capacity: 80,
      status: 'inactive',
    },
    {
      line_name: '产线4号',
      line_code: 'L004',
      capacity: 120,
      status: 'active',
    },
    {
      line_name: '产线5号',
      line_code: 'L005',
      capacity: 90,
      status: 'active',
    },
  ];

  const { data, error } = await supabase
    .from('production_lines')
    .insert(sampleLines);

  if (error) {
    console.error('❌ 产线导入失败:', error.message);
    throw error;
  }

  console.log(`✓ 成功导入 ${sampleLines.length} 条产线数据`);
  return data;
}

export async function seedProductionPlans() {
  console.log('开始导入生产计划数据...');

  // 先获取订单和产线
  const { data: orders } = await supabase
    .from('production_orders')
    .select('id')
    .limit(5);

  const { data: lines } = await supabase
    .from('production_lines')
    .select('id')
    .limit(3);

  if (!orders || !lines) {
    console.warn('⚠ 找不到订单或产线数据，跳过生产计划导入');
    return null;
  }

  const samplePlans = [
    {
      order_id: orders[0].id,
      plan_no: 'PLAN-2026-001',
      start_time: '2026-04-20T08:00:00Z',
      end_time: '2026-04-20T16:00:00Z',
      assigned_worker: '王师傅',
      line_id: lines[0].id,
      status: 'in_progress',
    },
    {
      order_id: orders[1].id,
      plan_no: 'PLAN-2026-002',
      start_time: '2026-04-21T08:00:00Z',
      end_time: '2026-04-21T16:00:00Z',
      assigned_worker: '李师傅',
      line_id: lines[1].id,
      status: 'scheduled',
    },
    {
      order_id: orders[2].id,
      plan_no: 'PLAN-2026-003',
      start_time: '2026-04-22T08:00:00Z',
      end_time: '2026-04-22T16:00:00Z',
      assigned_worker: '张师傅',
      line_id: lines[2].id,
      status: 'draft',
    },
  ];

  const { data, error } = await supabase
    .from('production_plans')
    .insert(samplePlans);

  if (error) {
    console.error('❌ 生产计划导入失败:', error.message);
    throw error;
  }

  console.log(`✓ 成功导入 ${samplePlans.length} 条生产计划数据`);
  return data;
}

async function main() {
  try {
    await seedProductionOrders();
    await seedProductionLines();
    await seedProductionPlans();
    console.log('\n✨ 所有 FCS 系统数据导入完成！');
  } catch (error) {
    console.error('\n❌ 数据导入失败:', error);
    process.exit(1);
  }
}

main();
