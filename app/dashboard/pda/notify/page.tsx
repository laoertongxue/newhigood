'use client';

import { useMemo, useState } from 'react';

type TabType = 'todo' | 'notice';

const todoItems = [
  { id: '1', title: '待确认打样回传', from: 'FCS 生产一组', time: '10:25' },
  { id: '2', title: '待确认报价单', from: 'PCS 商品中心', time: '09:40' },
  { id: '3', title: '待提交工序反馈', from: '执行看板', time: '昨天' },
];

const noticeItems = [
  { id: 'N1', title: '系统公告：周末发布窗口调整', time: '今天 08:30' },
  { id: 'N2', title: '供应链通知：印花产能恢复', time: '昨天 16:12' },
];

export default function PdaNotifyPage() {
  const [tab, setTab] = useState<TabType>('todo');

  const summary = useMemo(() => {
    return {
      todo: todoItems.length,
      notice: noticeItems.length,
      urgent: 1,
      done: 8,
    };
  }, []);

  return (
    <div className="space-y-4 p-4 md:p-6 bg-gray-50 min-h-full">
      <h1 className="text-xl font-semibold text-gray-900">消息通知</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Summary title="待办" value={summary.todo} />
        <Summary title="通知" value={summary.notice} />
        <Summary title="紧急" value={summary.urgent} />
        <Summary title="已完成" value={summary.done} />
      </div>

      <div className="inline-flex rounded-md border overflow-hidden bg-white">
        <button
          className={`px-4 py-2 text-sm ${tab === 'todo' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          onClick={() => setTab('todo')}
        >
          待办
        </button>
        <button
          className={`px-4 py-2 text-sm ${tab === 'notice' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
          onClick={() => setTab('notice')}
        >
          通知
        </button>
      </div>

      <section className="rounded-lg border bg-white divide-y">
        {tab === 'todo' && todoItems.map((item) => (
          <article key={item.id} className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">来源：{item.from}</p>
            </div>
            <span className="text-xs text-gray-400">{item.time}</span>
          </article>
        ))}

        {tab === 'notice' && noticeItems.map((item) => (
          <article key={item.id} className="px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-900">{item.title}</p>
            <span className="text-xs text-gray-400">{item.time}</span>
          </article>
        ))}
      </section>
    </div>
  );
}

function Summary({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border bg-white px-3 py-3">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
