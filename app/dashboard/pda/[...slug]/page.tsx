import Link from 'next/link';

interface CatchAllPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function PdaCatchAllPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const path = `/dashboard/pda/${slug.join('/')}`;

  return (
    <div className="p-8 space-y-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-semibold text-gray-900">PDA 页面开发中</h1>
      <p className="text-gray-600">当前路由：{path}</p>
      <p className="text-gray-600">该页面已按 baseline 信息架构占位，后续将补齐 1:1 业务内容。</p>
      <Link href="/dashboard/pda/notify" className="text-blue-600 hover:text-blue-700">
        返回 PDA 通知页
      </Link>
    </div>
  );
}
