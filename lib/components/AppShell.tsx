'use client';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { TabManager } from './TabManager';
import { useAppStore } from '@/lib/store/appStore';
import { cn } from '@/lib/utils/cn';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'transition-all duration-200 overflow-hidden flex-shrink-0',
          sidebarCollapsed ? 'w-16' : 'w-60'
        )}
      >
        <Sidebar />
      </aside>

      {/* 右侧主区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <TabManager />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-full p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
