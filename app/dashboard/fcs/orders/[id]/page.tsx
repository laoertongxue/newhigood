'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader } from 'lucide-react';
import type { ProductionOrder } from '@/lib/types';

interface OrderDetailResponse {
  success: boolean;
  data?: ProductionOrder;
  error?: string;
}

export default function FcsOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<ProductionOrder | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/fcs/orders/${params.id}`);
        const json = (await res.json()) as OrderDetailResponse;

        if (!res.ok || !json.success || !json.data) {
          throw new Error(json.error || '加载订单详情失败');
        }

        setOrder(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载订单详情失败');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      void run();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center text-gray-600">
        <Loader size={18} className="animate-spin mr-2" />加载中...
      </div>
    );
  }

  if (error || !order) {
    return <div className="p-8 text-red-600">错误: {error || '订单不存在'}</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard/fcs/orders')}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-100"
        >
          <ArrowLeft size={16} /> 返回订单列表
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
        <p className="text-gray-600 mt-1">{order.order_no}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="订单号" value={order.order_no} />
        <Field label="客户" value={order.customer_name} />
        <Field label="产品" value={order.product_name} />
        <Field label="数量" value={String(order.quantity)} />
        <Field label="状态" value={order.status} />
        <Field label="优先级" value={order.priority} />
        <Field label="开始日期" value={order.start_date} />
        <Field label="结束日期" value={order.end_date} />
        <Field label="创建时间" value={new Date(order.created_at).toLocaleString('zh-CN')} />
        <Field label="更新时间" value={new Date(order.updated_at).toLocaleString('zh-CN')} />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-gray-900 font-medium">{value}</p>
    </div>
  );
}
