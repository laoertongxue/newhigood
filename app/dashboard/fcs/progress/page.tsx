'use client';

import { Loader } from 'lucide-react';
import { useFcsProgress } from '@/lib/hooks/useFcsResources';

export default function FcsProgressPage() {
  const { progress, isLoading, error } = useFcsProgress();

  if (isLoading) return <div className="p-8 flex items-center text-gray-600"><Loader size={18} className="animate-spin mr-2" />加载中...</div>;
  if (error) return <div className="p-8 text-red-600">错误: {error}</div>;

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-900">生产进度</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4 flex justify-between text-sm text-gray-600">
          <span>总体完成率</span>
          <span>{progress?.completion_rate || 0}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600" style={{ width: `${progress?.completion_rate || 0}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ProgressCard title="总订单" value={progress?.total_orders || 0} />
        <ProgressCard title="已完成" value={progress?.completed_orders || 0} />
        <ProgressCard title="进行中" value={progress?.in_progress_orders || 0} />
        <ProgressCard title="待处理" value={progress?.pending_orders || 0} />
      </div>
    </div>
  );
}

function ProgressCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
