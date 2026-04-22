'use client';

import { useState } from 'react';

const MATERIAL_TYPE_ZH: Record<string, string> = {
  FABRIC: '面料',
  ACCESSORY: '辅料',
  YARN: '纱线',
  CONSUMABLE: '耗材',
};

const STATUS_ZH: Record<string, string> = {
  ACTIVE: '正常',
  LOW_STOCK: '库存不足',
  PHASED_OUT: '已淘汰',
};

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700 border-green-200',
  LOW_STOCK: 'bg-red-50 text-red-700 border-red-200',
  PHASED_OUT: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function PcsMaterialsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Mock 数据
  const materials = [
    { id: '1', material_no: 'MAT-001', material_name: '纯棉面料（白色）', material_type: 'FABRIC', specs: '150cm幅宽', unit: '米', stock: 500, status: 'ACTIVE', supplier: '纺织供应商A' },
    { id: '2', material_no: 'MAT-002', material_name: '尼龙拉链（黑色）', material_type: 'ACCESSORY', specs: '5号树脂', unit: '条', stock: 100, status: 'LOW_STOCK', supplier: '拉链供应商B' },
    { id: '3', material_no: 'MAT-003', material_name: '涤纶纱线', material_type: 'YARN', specs: '150D', unit: '千克', stock: 200, status: 'ACTIVE', supplier: '纱线供应商C' },
    { id: '4', material_no: 'MAT-004', material_name: '缝纫线', material_type: 'CONSUMABLE', specs: '402卷装', unit: '卷', stock: 50, status: 'ACTIVE', supplier: '耗材供应商D' },
    { id: '5', material_no: 'MAT-005', material_name: '金属纽扣', material_type: 'ACCESSORY', specs: '18mm金色', unit: '颗', stock: 0, status: 'PHASED_OUT', supplier: '纽扣供应商E' },
  ];

  const filteredMaterials = materials.filter((m) => {
    if (typeFilter !== 'ALL' && m.material_type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: materials.length,
    fabric: materials.filter((m) => m.material_type === 'FABRIC').length,
    accessory: materials.filter((m) => m.material_type === 'ACCESSORY').length,
    lowStock: materials.filter((m) => m.status === 'LOW_STOCK').length,
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">物料档案</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          新建物料
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="物料总数" value={stats.total} />
        <StatCard label="面料" value={stats.fabric} />
        <StatCard label="辅料" value={stats.accessory} />
        <StatCard label="库存不足" value={stats.lowStock} highlightColor="text-red-600" />
      </div>

      {/* 筛选器 */}
      <div className="flex gap-4 flex-wrap">
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">全部类型</option>
          <option value="FABRIC">面料</option>
          <option value="ACCESSORY">辅料</option>
          <option value="YARN">纱线</option>
          <option value="CONSUMABLE">耗材</option>
        </select>
        <select 
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">全部状态</option>
          <option value="ACTIVE">正常</option>
          <option value="LOW_STOCK">库存不足</option>
          <option value="PHASED_OUT">已淘汰</option>
        </select>
      </div>

      {/* 物料列表 */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">物料编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">物料名称</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">类型</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">规格</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">库存</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">状态</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">供应商</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{material.material_no}</td>
                  <td className="px-4 py-3 font-medium">{material.material_name}</td>
                  <td className="px-4 py-3 text-xs">{MATERIAL_TYPE_ZH[material.material_type]}</td>
                  <td className="px-4 py-3 text-xs">{material.specs}</td>
                  <td className="px-4 py-3 text-right">{material.stock} {material.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${STATUS_CLASS[material.status]}`}>
                      {STATUS_ZH[material.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{material.supplier}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-md px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                      详情
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

function StatCard({ label, value, highlightColor = 'text-gray-900' }: { label: string; value: number; highlightColor?: string }) {
  return (
    <div className="rounded-lg border bg-white p-5">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${highlightColor}`}>{value}</p>
    </div>
  );
}
