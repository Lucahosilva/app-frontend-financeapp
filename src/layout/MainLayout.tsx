import React, { ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

interface MainLayoutProps {
  children: ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  pageTitle: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeView,
  setActiveView,
  pageTitle,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full md:w-auto">
        {/* Header */}
        <Header pageTitle={pageTitle} isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-3 sm:p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
