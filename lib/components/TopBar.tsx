'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/appStore';
import { Bell, ChevronDown, Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

// 系统列表（对齐 baseline app-shell-config.ts）
const SYSTEMS = [
  { id: 'pcs', name: '商品中心系统', shortName: 'PCS' },
  { id: 'pms', name: '采购管理系统', shortName: 'PMS' },
  { id: 'fcs', name: '工厂生产协同系统', shortName: 'FCS' },
  { id: 'wls', name: '仓储物流系统', shortName: 'WLS' },
  { id: 'los', name: '直播运营系统', shortName: 'LOS' },
  { id: 'oms', name: '订单管理系统', shortName: 'OMS' },
  { id: 'bfis', name: '业财一体化系统', shortName: 'BFIS' },
  { id: 'dds', name: '数据决策系统', shortName: 'DDS' },
];

export function TopBar() {
  const router = useRouter();
  const { currentSubsystem, setCurrentSubsystem, openTab } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSystemChange = (systemId: string) => {
    if (systemId !== currentSubsystem) {
      setCurrentSubsystem(systemId as 'fcs' | 'pcs' | 'pda');
      
      // 跳转到系统默认页面
      const defaultPages: Record<string, string> = {
        pcs: '/dashboard/pcs/workspace/overview',
        pms: '/dashboard/pms/purchase-order',
        fcs: '/dashboard/fcs/workbench/overview',
        wls: '/dashboard/wls/inventory',
        los: '/dashboard/los/live-schedule',
        oms: '/dashboard/oms/order-list',
        bfis: '/dashboard/bfis/financial-report',
        dds: '/dashboard/dds/dashboard',
      };
      
      const defaultHref = defaultPages[systemId] || '/dashboard/fcs/workbench/overview';
      
      openTab({
        id: defaultHref,
        key: defaultHref,
        title: getSystemTitle(systemId),
        href: defaultHref,
        subsystem: systemId as 'fcs' | 'pcs' | 'pda',
      });
      
      router.push(defaultHref);
    }
  };

  const getSystemTitle = (systemId: string): string => {
    return SYSTEMS.find(s => s.id === systemId)?.shortName + ' 工作台' || '工作台';
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b bg-background px-4">
      {/* 左侧：Logo */}
      <div className="flex items-center gap-2">
        <button 
          className="rounded-md p-2 hover:bg-accent lg:hidden"
          aria-label="打开菜单"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            HG
          </div>
          <span className="hidden text-lg font-semibold sm:inline">HiGood</span>
        </div>
      </div>

      {/* 中间：系统切换 */}
      <div className="mx-4 flex-1 overflow-hidden">
        <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          {SYSTEMS.map((system) => {
            const active = currentSubsystem === system.id;
            return (
              <button
                key={system.id}
                onClick={() => handleSystemChange(system.id)}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-blue-600'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <span>{system.name}</span>
                <span className="text-xs text-muted-foreground">({system.shortName})</span>
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 右侧：用户菜单 */}
      <div className="flex items-center gap-2">
        <button 
          className="relative rounded-md p-2 hover:bg-accent" 
          aria-label="通知"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User size={16} />
            </div>
            <span className="hidden text-sm md:inline">管理员</span>
            <ChevronDown size={16} className="text-muted-foreground" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-200">
                个人资料
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push('/auth/login');
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
