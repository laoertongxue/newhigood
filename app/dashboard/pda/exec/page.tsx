'use client';

import { useMemo, useState } from 'react';

type ExecTab = 'todo' | 'doing' | 'paused' | 'done';

const tabConfig: Array<{ key: ExecTab; label: string }> = [
  { key: 'todo', label: '未开始' },
  { key: 'doing', label: '进行中' },
  { key: 'paused', label: '已暂停' },
  { key: 'done', label: '已完成' },
];

const seed = {
  todo: [
    { id: 'E-001', name: '运动套装压胶', factory: '华南一厂', progress: '0%' },
    { id: 'E-002', name: '针织套装锁边', factory: '华南二厂', progress: '0%' },
  ],
  doing: [
    { id: 'E-011', name: '连帽卫衣印花', factory: '苏州协作厂', progress: '67%' },
  ],
  paused: [
    { id: 'E-021', name: '速干短袖后整', factory: '常州工厂', progress: '28%' },
  ],
  done: [
    { id: 'E-099', name: '休闲裤染色', factory: '华南一厂', progress: '100%' },
  ],
};

export default function PdaExecPage() {
  const [tab, setTab] = useState<ExecTab>('todo');
  const [factory, setFactory] = useState('全部工厂');
  const [keyword, setKeyword] = useState('');

  const rows = useMemo(() => {
    return seed[tab].filter((item) => {
      const byFactory = factory === '全部工厂' || item.factory === factory;
      const byKeyword = !keyword || `${item.id}${item.name}`.includes(keyword);
      return byFactory && byKeyword;
    });
  }, [tab, factory, keyword]);

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gray-50 min-h-full">
      <h1 className="text-xl font-semibold text-gray-900">执行看板</h1>

      <div className="rounded-lg border bg-blue-50 px-4 py-3 text-sm text-blue-800">
        当前可执行任务会按工厂优先级自动排序，可在移动端直接更新进度与异常。
      </div>

      <section className="rounded-lg border bg-white p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <select className="h-10 rounded-md border px-3 text-sm" value={factory} onChange={(e) => setFactory(e.target.value)}>
          <option>全部工厂</option>
          <option>华南一厂</option>
          <option>华南二厂</option>
          <option>苏州协作厂</option>
          <option>常州工厂</option>
        </select>
        <input
          className="h-10 rounded-md border px-3 text-sm md:col-span-2"
          placeholder="搜索任务编号或任务名"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </section>

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
              <p className="font-medium text-gray-900">{item.name}</p>
              <span className="text-xs text-gray-400">{item.id}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">工厂：{item.factory}</div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>进度</span>
                <span>{item.progress}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: item.progress }} />
              </div>
            </div>
          </article>
        ))}
        {rows.length === 0 && <div className="rounded-lg border bg-white p-8 text-center text-gray-500">暂无执行任务</div>}
      </section>
    </div>
  );
}
