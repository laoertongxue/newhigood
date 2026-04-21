'use client';

import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useFcsProgress } from '@/lib/hooks/useFcsResources';

type Dimension = 'task' | 'order';

export default function FcsProgressBoardPage() {
  const [dimension, setDimension] = useState<Dimension>('task');
  const { progress, isLoading, error } = useFcsProgress();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center text-gray-600">
        <Loader size={18} className="animate-spin mr-2" /> 加载中...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-600">错误: {error}</div>;
  }

  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-full">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">进度看板</h1>
        <div className="inline-flex rounded-md border overflow-hidden">
          <button
            className={`px-3 py-2 text-sm ${dimension === 'task' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setDimension('task')}
          >
            任务维度
          </button>
          <button
            className={`px-3 py-2 text-sm ${dimension === 'order' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
            onClick={() => setDimension('order')}
          >
            生产单维度
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card title="总订单" value={progress?.total_orders || 0} />
        <Card title="进行中" value={progress?.in_progress_orders || 0} />
        <Card title="已完成" value={progress?.completed_orders || 0} />
        <Card title="完成率" value={`${progress?.completion_rate || 0}%`} />
      </div>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-sm text-gray-500 mb-3">{dimension === 'task' ? '任务进度列表' : '生产单进度列表'}</h2>
        <div className="space-y-2">
          <Row label="裁片任务" value={dimension === 'task' ? '进行中 12 / 已完成 6' : '关联生产单 8'} />
          <Row label="印花任务" value={dimension === 'task' ? '进行中 9 / 已完成 4' : '关联生产单 7'} />
          <Row label="染色任务" value={dimension === 'task' ? '进行中 5 / 已完成 3' : '关联生产单 6'} />
          <Row label="后整任务" value={dimension === 'task' ? '进行中 4 / 已完成 2' : '关联生产单 4'} />
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
      <span className="text-gray-700">{label}</span>
      <span className="text-gray-500">{value}</span>
    </div>
  );
}
