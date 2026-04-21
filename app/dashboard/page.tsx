'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store/appStore';
import { useAuthStore } from '@/lib/store/authStore';

export default function Dashboard() {
  const { openTab, activeTabId } = useAppStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // 打开默认欢迎标签页
    if (!activeTabId) {
      openTab({
        id: 'welcome',
        key: 'welcome',
        title: '欢迎',
        href: '/dashboard',
        subsystem: 'fcs',
      });
    }
  }, [activeTabId, openTab]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        欢迎，{user?.name || '用户'}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        祝你工作愉快！请从左侧菜单开始使用系统。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 统计卡片示例 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">活跃系统</h3>
          <p className="text-3xl font-bold text-gray-900">3</p>
          <p className="text-sm text-gray-600">FCS / PCS / PDA</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">用户角色</h3>
          <p className="text-3xl font-bold text-gray-900 capitalize">
            {user?.role || 'operator'}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">邮箱</h3>
          <p className="text-sm font-medium text-gray-900 break-all">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}
