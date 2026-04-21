'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/appStore';
import { useAuthStore } from '@/lib/store/authStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { SUBSYSTEMS } from '@/lib/config/navigation';
import type { SubsystemType } from '@/lib/config/navigation';
import { LogOut, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

export function TopBar() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentSubsystem, setCurrentSubsystem, closeTabsBySubsystem } =
    useAppStore();
  const { signout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSubsystemChange = (subsystem: SubsystemType) => {
    if (subsystem !== currentSubsystem) {
      closeTabsBySubsystem(currentSubsystem);
      setCurrentSubsystem(subsystem);
      router.push(`/dashboard/${subsystem}`);
    }
  };

  const handleLogout = async () => {
    const success = await signout();
    if (success) {
      router.push('/auth/login');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
      {/* 左侧：子系统切换器 */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">子系统：</span>
        <div className="flex gap-2">
          {SUBSYSTEMS.map((sys) => (
            <button
              key={sys.type}
              onClick={() => handleSubsystemChange(sys.type)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                currentSubsystem === sys.type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {sys.label}
            </button>
          ))}
        </div>
      </div>

      {/* 右侧：用户菜单 */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {user?.name || '用户'}
            </span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {/* 用户菜单下拉列表 */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              {/* 菜单项：个人资料 */}
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-200">
                <Settings size={16} />
                个人资料
              </button>

              {/* 菜单项：登出 */}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} />
                登出
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
