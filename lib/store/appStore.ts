/**
 * 全局应用状态（Zustand）
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Tab, SubsystemType } from '@/lib/types';

export interface AppState {
  // UI 状态
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  currentSubsystem: SubsystemType;

  // 标签页状态
  openTabs: Tab[];
  activeTabId: string | null;

  // 操作方法
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setCurrentSubsystem: (subsystem: SubsystemType) => void;

  // 标签页操作
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (tabId: string) => void;
  closeTabsBySubsystem: (subsystem: SubsystemType) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 初始状态
      sidebarOpen: true,
      sidebarCollapsed: false,
      currentSubsystem: 'fcs',
      openTabs: [],
      activeTabId: null,

      // UI 操作
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapsed: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCurrentSubsystem: (subsystem) => set({ currentSubsystem: subsystem }),

      // 标签页操作
      openTab: (tab) =>
        set((state) => {
          // 检查标签页是否已打开
          const exists = state.openTabs.find((t) => t.id === tab.id);
          if (exists) {
            return { activeTabId: tab.id };
          }
          return {
            openTabs: [...state.openTabs, tab],
            activeTabId: tab.id,
          };
        }),

      closeTab: (tabId) =>
        set((state) => {
          const filtered = state.openTabs.filter((t) => t.id !== tabId);
          let newActiveTabId = state.activeTabId;

          if (state.activeTabId === tabId) {
            newActiveTabId = filtered.length > 0 ? filtered[filtered.length - 1].id : null;
          }

          return {
            openTabs: filtered,
            activeTabId: newActiveTabId,
          };
        }),

      closeAllTabs: () =>
        set({
          openTabs: [],
          activeTabId: null,
        }),

      setActiveTab: (tabId) => set({ activeTabId: tabId }),

      closeTabsBySubsystem: (subsystem) =>
        set((state) => {
          const filtered = state.openTabs.filter((t) => t.subsystem !== subsystem);
          let newActiveTabId = state.activeTabId;

          if (
            state.activeTabId &&
            !filtered.find((t) => t.id === state.activeTabId)
          ) {
            newActiveTabId = filtered.length > 0 ? filtered[filtered.length - 1].id : null;
          }

          return {
            openTabs: filtered,
            activeTabId: newActiveTabId,
          };
        }),
    }),
    {
      name: 'app-store', // localStorage 键名
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        openTabs: state.openTabs,
        activeTabId: state.activeTabId,
      }),
    }
  )
);
