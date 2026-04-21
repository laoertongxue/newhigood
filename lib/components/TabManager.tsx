'use client';

import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store/appStore';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function TabManager() {
  const router = useRouter();
  const { openTabs, activeTabId, setActiveTab, closeTab } = useAppStore();

  if (openTabs.length === 0) {
    return null;
  }

  return (
    <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center overflow-x-auto">
      {openTabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            'flex items-center gap-2 px-4 py-2 border-b-2 cursor-pointer whitespace-nowrap transition-colors',
            activeTabId === tab.id
              ? 'border-blue-600 bg-white text-blue-600'
              : 'border-transparent text-gray-700 hover:bg-gray-100'
          )}
          onClick={() => {
            setActiveTab(tab.id);
            router.push(tab.href);
          }}
        >
          <span className="text-sm font-medium">{tab.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className={cn(
              'p-0.5 rounded transition-colors',
              activeTabId === tab.id
                ? 'hover:bg-blue-100'
                : 'hover:bg-gray-200'
            )}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
