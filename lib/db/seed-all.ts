/**
 * 全系统数据导入脚本（FCS + PCS + PDA）
 * 运行: npm run seed:all
 */

import { createClient } from '@supabase/supabase-js';
import {
  seedProductionLines,
  seedProductionOrders,
  seedProductionPlans,
} from './seed-fcs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('缺少 Supabase 环境变量');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedUsers() {
  console.log('开始同步 users 画像...');

  const { data: authUsers, error: authUsersError } = await supabase.auth.admin.listUsers();
  if (authUsersError) throw authUsersError;

  if (!authUsers.users.length) {
    console.log('⚠ 当前没有 auth 用户，跳过 users 画像导入');
    return;
  }

  const userRows = authUsers.users.map((user) => ({
    id: user.id,
    email: user.email || `${user.id}@local.test`,
    name: (user.user_metadata?.name as string) || user.email?.split('@')[0] || '用户',
    role: 'operator',
    subsystems: ['fcs', 'pcs', 'pda'],
  }));

  const { error } = await supabase
    .from('users')
    .upsert(userRows, { onConflict: 'id' });

  if (error) throw error;
  console.log(`✓ users 画像同步完成，共 ${userRows.length} 条`);
}

async function seedFcsInventory() {
  console.log('开始导入 FCS 库存数据...');

  const rows = [
    { item_code: 'MAT-001', item_name: '铝板', unit: 'kg', quantity: 4200, safety_stock: 800, status: 'normal' },
    { item_code: 'MAT-002', item_name: '铜线', unit: 'm', quantity: 650, safety_stock: 500, status: 'low' },
    { item_code: 'MAT-003', item_name: '密封圈', unit: 'pcs', quantity: 0, safety_stock: 200, status: 'out_of_stock' },
    { item_code: 'MAT-004', item_name: '工业胶', unit: 'kg', quantity: 120, safety_stock: 100, status: 'normal' },
  ];

  const { error } = await supabase.from('fcs_inventory').upsert(rows, { onConflict: 'item_code' });
  if (error) throw error;

  console.log(`✓ FCS 库存导入完成，共 ${rows.length} 条`);
}

async function seedPcs() {
  console.log('开始导入 PCS 数据...');

  const categories = [
    { category_code: 'fabric', category_name: '面料' },
    { category_code: 'accessory', category_name: '辅料' },
    { category_code: 'component', category_name: '组件' },
    { category_code: 'other', category_name: '其他' },
  ];

  const { error: categoryError } = await supabase
    .from('pcs_categories')
    .upsert(categories, { onConflict: 'category_code' });
  if (categoryError) throw categoryError;

  const goods = [
    { goods_code: 'GD-001', goods_name: '防火面料A', category: 'fabric', supplier: '华纺供应链', price: 58.5, stock_quantity: 900 },
    { goods_code: 'GD-002', goods_name: '高强拉链', category: 'accessory', supplier: '联泰五金', price: 4.2, stock_quantity: 2600 },
    { goods_code: 'GD-003', goods_name: '连接支架', category: 'component', supplier: '晨星制造', price: 12.8, stock_quantity: 1400 },
  ];

  const { data: goodsRows, error: goodsError } = await supabase
    .from('pcs_goods')
    .upsert(goods, { onConflict: 'goods_code' })
    .select('id, goods_code');

  if (goodsError) throw goodsError;

  const goodsMap = new Map((goodsRows || []).map((row) => [row.goods_code, row.id]));

  const coordinationOrders = [
    { coordination_no: 'CO-2026-001', goods_id: goodsMap.get('GD-001'), quantity: 120, status: 'submitted' },
    { coordination_no: 'CO-2026-002', goods_id: goodsMap.get('GD-002'), quantity: 300, status: 'approved' },
    { coordination_no: 'CO-2026-003', goods_id: goodsMap.get('GD-003'), quantity: 80, status: 'draft' },
  ].filter((item) => Boolean(item.goods_id));

  const { data: coRows, error: coError } = await supabase
    .from('pcs_coordination_orders')
    .upsert(coordinationOrders, { onConflict: 'coordination_no' })
    .select('id, coordination_no');

  if (coError) throw coError;

  const coMap = new Map((coRows || []).map((row) => [row.coordination_no, row.id]));

  const allocations = [
    {
      goods_id: goodsMap.get('GD-001'),
      coordination_order_id: coMap.get('CO-2026-001') || null,
      allocated_quantity: 100,
      warehouse: 'A-01',
      status: 'allocated',
    },
    {
      goods_id: goodsMap.get('GD-002'),
      coordination_order_id: coMap.get('CO-2026-002') || null,
      allocated_quantity: 220,
      warehouse: 'B-03',
      status: 'allocated',
    },
  ].filter((item) => Boolean(item.goods_id));

  const { error: allocationError } = await supabase
    .from('pcs_inventory_allocations')
    .insert(allocations);

  if (allocationError && !allocationError.message.includes('duplicate')) {
    throw allocationError;
  }

  console.log('✓ PCS 数据导入完成');
}

async function seedPda() {
  console.log('开始导入 PDA 数据...');

  const { data: orders, error: orderError } = await supabase
    .from('production_orders')
    .select('id')
    .limit(5);
  if (orderError) throw orderError;

  if (!orders?.length) {
    console.log('⚠ 没有生产订单，跳过 PDA 数据导入');
    return;
  }

  const records = [
    { order_id: orders[0]?.id, data_type: 'temperature', value: 68.3, unit: 'C', recorded_by: '系统', recorded_at: new Date().toISOString() },
    { order_id: orders[1]?.id, data_type: 'humidity', value: 45.2, unit: '%', recorded_by: '系统', recorded_at: new Date().toISOString() },
    { order_id: orders[2]?.id, data_type: 'pressure', value: 1.23, unit: 'MPa', recorded_by: '系统', recorded_at: new Date().toISOString() },
    { order_id: orders[3]?.id, data_type: 'quantity', value: 860, unit: 'pcs', recorded_by: '系统', recorded_at: new Date().toISOString() },
  ].filter((item) => Boolean(item.order_id));

  const { error: dataError } = await supabase.from('pda_production_data').insert(records);
  if (dataError && !dataError.message.includes('duplicate')) throw dataError;

  const report = {
    report_no: `RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-1001`,
    analysis_period: {
      start: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      end: new Date().toISOString(),
    },
    summary: {
      total_records: records.length,
      data_types: {
        temperature: 1,
        humidity: 1,
        pressure: 1,
        quantity: 1,
        weight: 0,
        other: 0,
      },
      average_values: {
        temperature: 68.3,
        humidity: 45.2,
        pressure: 1.23,
        quantity: 860,
        weight: 0,
        other: 0,
      },
    },
  };

  const { error: reportError } = await supabase
    .from('pda_data_analysis_reports')
    .upsert([report], { onConflict: 'report_no' });
  if (reportError) throw reportError;

  const metrics = [
    { metric_name: '良品率', metric_value: 97.2, period: '2026-W16', subsystem_type: 'pda' },
    { metric_name: '设备利用率', metric_value: 88.5, period: '2026-W16', subsystem_type: 'pda' },
    { metric_name: '单件工时', metric_value: 2.14, period: '2026-W16', subsystem_type: 'pda' },
  ];

  const { error: metricError } = await supabase.from('pda_kpi_metrics').insert(metrics);
  if (metricError && !metricError.message.includes('duplicate')) throw metricError;

  console.log('✓ PDA 数据导入完成');
}

async function main() {
  try {
    await seedUsers();
    await seedProductionOrders();
    await seedProductionLines();
    await seedProductionPlans();
    await seedFcsInventory();
    await seedPcs();
    await seedPda();
    console.log('\n✨ 全系统数据导入完成（FCS + PCS + PDA）');
  } catch (error) {
    console.error('\n❌ 数据导入失败:', error);
    process.exit(1);
  }
}

main();
