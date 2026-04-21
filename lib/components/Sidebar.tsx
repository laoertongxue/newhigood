'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/appStore';
import { menusBySubsystem } from '@/lib/config/navigation';
import type { MenuItem } from '@/lib/types';
import { getIcon } from '@/lib/utils/icons';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentSubsystem,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    openTab,
  } = useAppStore();

  const menu = menusBySubsystem[currentSubsystem] || [];

  const isMenuItemActive = (itemHref: string): boolean => {
    if (itemHref === pathname) return true;
    if (pathname.startsWith(itemHref + '/')) return true;
    return false;
  };

  const hasActiveDescendant = (item: MenuItem): boolean => {
    if (item.href && isMenuItemActive(item.href)) {
      return true;
    }

    return (item.children || []).some(hasActiveDescendant);
  };

  const handleMenuClick = (href: string, title: string) => {
    openTab({
      id: href,
      key: href,
      title,
      href,
      subsystem: currentSubsystem,
    });
    router.push(href);
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const Icon = item.icon ? getIcon(item.icon) : null;
    const isActive = hasActiveDescendant(item);
    const hasChildren = Boolean(item.children && item.children.length > 0);

    return (
      <div key={item.key} className="space-y-1">
        <button
          onClick={() => item.href && handleMenuClick(item.href, item.title)}
          disabled={!item.href}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:cursor-default',
            isActive
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-700 hover:bg-gray-100',
            depth > 0 && !sidebarCollapsed && 'py-1.5 text-[13px]'
          )}
          style={
            !sidebarCollapsed
              ? { paddingLeft: `${12 + depth * 16}px` }
              : undefined
          }
          title={sidebarCollapsed ? item.title : undefined}
        >
          {Icon ? (
            <Icon size={20} className="flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 flex-shrink-0" />
          )}
          {!sidebarCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                  {item.badge.count}
                </span>
              )}
            </>
          )}
        </button>

        {!sidebarCollapsed && hasChildren && (
          <div className="space-y-1">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Logo 区域 */}
      <div className="h-16 border-b border-gray-200 flex items-center px-4 justify-center">
        {!sidebarCollapsed && (
          <span className="font-bold text-lg text-gray-900">HiGood</span>
        )}
        {sidebarCollapsed && (
          <span className="font-bold text-sm text-gray-900">H</span>
        )}
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {menu.map((group) => (
          <div key={group.key} className="mb-4">
            {/* 菜单组标题（仅在展开时显示） */}
            {!sidebarCollapsed && (
              <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {group.title}
              </div>
            )}

            {group.items.map((item) => renderMenuItem(item))}
          </div>
        ))}
      </nav>

      {/* Footer - 折叠按钮 */}
      <div className="h-16 border-t border-gray-200 flex items-center justify-center">
        <button
          onClick={toggleSidebarCollapsed}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          title={sidebarCollapsed ? '展开' : '折叠'}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
