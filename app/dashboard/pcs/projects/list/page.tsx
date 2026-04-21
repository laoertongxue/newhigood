'use client';

import { useMemo, useState } from 'react';

type ProjectItem = {
  id: string;
  code: string;
  name: string;
  owner: string;
  phase: string;
  status: string;
  updatedAt: string;
};

const mockProjects: ProjectItem[] = [
  { id: '1', code: 'PCS-PJ-2401', name: '春夏轻运动系列', owner: '李倩', phase: '打样', status: '进行中', updatedAt: '2026-04-20 17:30' },
  { id: '2', code: 'PCS-PJ-2402', name: '商务针织套装', owner: '陈璐', phase: '版型', status: '待决策', updatedAt: '2026-04-20 14:05' },
  { id: '3', code: 'PCS-PJ-2403', name: '电商爆款补单', owner: '周晨', phase: '测款', status: '已完成', updatedAt: '2026-04-19 19:10' },
  { id: '4', code: 'PCS-PJ-2404', name: '秋冬预研款', owner: '何敏', phase: '立项', status: '进行中', updatedAt: '2026-04-19 12:45' },
];

export default function PcsProjectsListPage() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('全部');

  const rows = useMemo(() => {
    return mockProjects.filter((item) => {
      const byKeyword = !keyword || `${item.code}${item.name}${item.owner}`.includes(keyword);
      const byStatus = status === '全部' || item.status === status;
      return byKeyword && byStatus;
    });
  }, [keyword, status]);

  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-full">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">项目管理</h1>
        <button className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700">新建项目</button>
      </header>

      <section className="rounded-lg border bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="h-10 rounded-md border px-3 text-sm md:col-span-2"
            placeholder="搜索项目号/项目名称/负责人"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select className="h-10 rounded-md border px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>全部</option>
            <option>进行中</option>
            <option>待决策</option>
            <option>已完成</option>
          </select>
        </div>
      </section>

      <section className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">项目号</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">项目名称</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">负责人</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">阶段</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">状态</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">更新时间</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-blue-600 font-medium">{item.code}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.owner}</td>
                <td className="px-4 py-3">{item.phase}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3 text-gray-500">{item.updatedAt}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">暂无项目数据</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
