'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/appStore';
import { menusBySubsystem } from '@/lib/config/navigation';
import type { MenuItem } from '@/lib/types';
import { getIcon } from '@/lib/utils/icons';
import { ChevronLeft, ChevronRight, ChevronDown, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

// 获取当前系统信息
const getSystemInfo = (systemId: string) => {
  const systemMap: Record<string, { name: string; shortName: string }> = {
    pcs: { name: '商品中心系统', shortName: 'PCS' },
    pms: { name: '采购管理系统', shortName: 'PMS' },
    fcs: { name: '工厂生产协同系统', shortName: 'FCS' },
    wls: { name: '仓储物流系统', shortName: 'WLS' },
    los: { name: '直播运营系统', shortName: 'LOS' },
    oms: { name: '订单管理系统', shortName: 'OMS' },
    bfis: { name: '业财一体化系统', shortName: 'BFIS' },
    dds: { name: '数据决策系统', shortName: 'DDS' },
  };
  return systemMap[systemId] || { name: '系统', shortName: 'SYS' };
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentSubsystem,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    openTab,
  } = useAppStore();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const menu = menusBySubsystem[currentSubsystem] || [];
  const systemInfo = getSystemInfo(currentSubsystem);

  const isMenuItemActive = (itemHref?: string): boolean => {
    if (!itemHref) return false;
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

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const toggleItem = (itemKey: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const Icon = item.icon ? getIcon(item.icon) : null;
    const isActive = hasActiveDescendant(item);
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isExpanded = expandedItems[item.key] ?? false;

    return (
      <div key={item.key} className="space-y-1">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleItem(item.key);
            } else if (item.href) {
              handleMenuClick(item.href, item.title);
            }
          }}
          disabled={!item.href && !hasChildren}
          className={cn(
            'w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-default',
            isActive
              ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
              : 'text-gray-700 hover:bg-gray-100',
            sidebarCollapsed && 'justify-center px-2'
          )}
          title={sidebarCollapsed ? item.title : undefined}
          style={
            !sidebarCollapsed && depth > 0
              ? { paddingLeft: `${12 + depth * 16}px` }
              : undefined
          }
        >
          {Icon && (
            <Icon size={20} className="flex-shrink-0" />
          )}
          {!sidebarCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              {hasChildren && (
                isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
              )}
            </>
          )}
        </button>

        {!sidebarCollapsed && hasChildren && isExpanded && (
          <div className="ml-4 mt-1 space-y-1 border-l pl-3">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderMenuGroup = (group: { key: string; title: string; items: MenuItem[] }, index: number) => {
    const groupKey = `${index}-${group.key}`;
    const isExpanded = expandedGroups[groupKey] ?? true;
    const hasActive = group.items.some(hasActiveDescendant);

    if (sidebarCollapsed) {
      return (
        <div key={group.key}>
          {index > 0 && <div className="my-2 border-t" />}
          <div className="space-y-1 px-2 py-3">
            {group.items.map((item) => renderMenuItem(item))}
          </div>
        </div>
      );
    }

    return (
      <div key={group.key}>
        <button
          onClick={() => toggleGroup(groupKey)}
          className={cn(
            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
            'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            hasActive && 'text-primary'
          )}
        >
          <span className="flex-1 text-left">{group.title}</span>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-1 px-3 py-2">
            {group.items.map((item) => renderMenuItem(item))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Logo / 系统名称区域 */}
      <div className={cn(
        'h-14 shrink-0 items-center border-b',
        sidebarCollapsed ? 'flex justify-center px-2' : 'flex justify-between px-4'
      )}>
        {sidebarCollapsed ? (
          <span className="font-bold text-sm text-gray-900">
            {systemInfo.shortName}
          </span>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold">{systemInfo.name}</h2>
              <p className="text-xs text-muted-foreground">{systemInfo.shortName}</p>
            </div>
            <button
              onClick={toggleSidebarCollapsed}
              className="h-8 w-8 shrink-0 rounded-md hover:bg-gray-100"
              title="收起菜单"
            >
              <PanelLeftClose size={16} className="mx-auto" />
            </button>
          </>
        )}
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {menu.map((group, index) => renderMenuGroup(group, index))}
      </nav>

      {/* Footer - 折叠按钮（仅在展开时显示） */}
      {!sidebarCollapsed && (
        <div className="h-14 shrink-0 border-t border-gray-200 flex items-center justify-center">
          <button
            onClick={toggleSidebarCollapsed}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="收起菜单"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>
      )}

      {/* 折叠状态下的展开按钮 */}
      {sidebarCollapsed && (
        <div className="h-14 shrink-0 border-t border-gray-200 flex items-center justify-center">
          <button
            onClick={toggleSidebarCollapsed}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            title="展开菜单"
          >
            <PanelLeft size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
