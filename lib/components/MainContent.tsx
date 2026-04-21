import { TabManager } from './TabManager';

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TabManager />
      <div className="flex-1 overflow-auto bg-white">
        {children}
      </div>
    </div>
  );
}
