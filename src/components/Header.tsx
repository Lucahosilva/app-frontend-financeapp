import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Moon, Sun, User } from 'lucide-react';

interface HeaderProps {
  pageTitle: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, isDarkMode, onToggleDarkMode }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30"
    >
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">{pageTitle}</h2>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg px-4 py-2">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="bg-transparent text-sm outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 w-40"
            />
          </div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Notificações"
          >
            <Bell size={20} className="text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleDarkMode}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Alternar modo escuro"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-slate-600" />
            )}
          </motion.button>

          {/* User Avatar */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              LC
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300">
              Lucas
            </span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
