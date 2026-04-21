'use client';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MainContent } from './MainContent';
import { useAppStore } from '@/lib/store/appStore';
import { cn } from '@/lib/utils/cn';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'transition-all duration-200 overflow-hidden',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <Sidebar />
      </aside>

      {/* 右侧主区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
}
