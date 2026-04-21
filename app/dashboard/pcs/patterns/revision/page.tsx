'use client';

import { useMemo, useState } from 'react';

type RevisionTask = {
  id: string;
  code: string;
  project: string;
  changeType: string;
  assignee: string;
  dueDate: string;
  status: string;
};

const seedTasks: RevisionTask[] = [
  { id: '1', code: 'RV-240401', project: '春夏轻运动系列', changeType: '版型调整', assignee: '张燕', dueDate: '2026-04-24', status: '待处理' },
  { id: '2', code: 'RV-240402', project: '商务针织套装', changeType: '面辅料替换', assignee: '周晨', dueDate: '2026-04-23', status: '进行中' },
  { id: '3', code: 'RV-240403', project: '电商爆款补单', changeType: '工艺优化', assignee: '陈璐', dueDate: '2026-04-21', status: '已完成' },
  { id: '4', code: 'RV-240404', project: '秋冬预研款', changeType: '尺码扩展', assignee: '李倩', dueDate: '2026-04-25', status: '待处理' },
];

export default function PcsPatternRevisionPage() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('全部');

  const rows = useMemo(() => {
    return seedTasks.filter((item) => {
      const byKeyword = !keyword || `${item.code}${item.project}${item.assignee}`.includes(keyword);
      const byStatus = status === '全部' || item.status === status;
      return byKeyword && byStatus;
    });
  }, [keyword, status]);

  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-full">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">改款任务</h1>
        <button className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700">新建改款任务</button>
      </header>

      <section className="rounded-lg border bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="h-10 rounded-md border px-3 text-sm md:col-span-2"
            placeholder="搜索任务号/项目/负责人"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select className="h-10 rounded-md border px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>全部</option>
            <option>待处理</option>
            <option>进行中</option>
            <option>已完成</option>
          </select>
        </div>
      </section>

      <section className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">任务号</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">项目</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">改款类型</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">负责人</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">截止日期</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">状态</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-blue-600 font-medium">{item.code}</td>
                <td className="px-4 py-3">{item.project}</td>
                <td className="px-4 py-3">{item.changeType}</td>
                <td className="px-4 py-3">{item.assignee}</td>
                <td className="px-4 py-3 text-gray-500">{item.dueDate}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">暂无改款任务</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
