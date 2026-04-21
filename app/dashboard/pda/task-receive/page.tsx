'use client';

import { useMemo, useState } from 'react';

type ReceiveTab = 'waitReceive' | 'waitQuote' | 'quoted' | 'won';

const tabConfig: Array<{ key: ReceiveTab; label: string }> = [
  { key: 'waitReceive', label: '待接单' },
  { key: 'waitQuote', label: '待报价' },
  { key: 'quoted', label: '已报价' },
  { key: 'won', label: '已中标' },
];

const seed = {
  waitReceive: [
    { id: 'R-001', title: '春夏连帽卫衣印花', qty: '2,500 件', deadline: '04-23 18:00' },
    { id: 'R-002', title: '速干短袖补单', qty: '1,200 件', deadline: '04-24 12:00' },
  ],
  waitQuote: [
    { id: 'Q-010', title: '商务针织套装-后整', qty: '800 件', deadline: '04-22 15:00' },
  ],
  quoted: [
    { id: 'Q-003', title: '休闲裤染色批次', qty: '1,500 件', deadline: '已提交' },
  ],
  won: [
    { id: 'W-001', title: '运动套装拉链工序', qty: '3,000 件', deadline: '已中标' },
  ],
};

export default function PdaTaskReceivePage() {
  const [tab, setTab] = useState<ReceiveTab>('waitReceive');
  const [keyword, setKeyword] = useState('');

  const rows = useMemo(() => {
    return seed[tab].filter((item) => `${item.id}${item.title}`.includes(keyword));
  }, [tab, keyword]);

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gray-50 min-h-full">
      <h1 className="text-xl font-semibold text-gray-900">接单与报价</h1>

      <div className="rounded-lg border bg-white p-3">
        <input
          className="h-10 w-full rounded-md border px-3 text-sm"
          placeholder="搜索任务编号或任务名"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {tabConfig.map((item) => (
          <button
            key={item.key}
            className={`rounded-md border px-3 py-2 text-sm ${tab === item.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        {rows.map((item) => (
          <article key={item.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">{item.title}</p>
              <span className="text-xs text-gray-400">{item.id}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-500">数量：{item.qty}</span>
              <span className="text-gray-500">{item.deadline}</span>
            </div>
            <div className="mt-3 text-right">
              <button className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700">
                {tab === 'waitReceive' ? '立即接单' : tab === 'waitQuote' ? '提交报价' : '查看详情'}
              </button>
            </div>
          </article>
        ))}
        {rows.length === 0 && <div className="rounded-lg border bg-white p-8 text-center text-gray-500">暂无任务</div>}
      </section>
    </div>
  );
}
