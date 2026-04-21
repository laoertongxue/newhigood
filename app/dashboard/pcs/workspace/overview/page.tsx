export default function PcsWorkspaceOverviewPage() {
  return (
    <div className="space-y-4 p-6 bg-gray-50 min-h-full">
      <header className="rounded-lg border bg-white p-5">
        <h1 className="text-2xl font-bold text-gray-900">商品中心工作台</h1>
      </header>
      <section className="rounded-lg border bg-white p-10">
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-center">
          <p className="text-lg font-semibold text-slate-900">页面已清空</p>
          <p className="mt-2 text-sm text-slate-500">当前模块已下线，等待重新开始设计。</p>
        </div>
      </section>
    </div>
  );
}
