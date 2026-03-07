import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  Grid3x3,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transações', icon: CreditCard },
    { id: 'accounts', label: 'Contas', icon: Wallet },
    { id: 'categories', label: 'Categorias', icon: Grid3x3 },
    { id: 'cost-centers', label: 'Centros de Custo', icon: Wallet },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'entries', label: 'Entradas por Mês', icon: Calendar },
    { id: 'card', label: 'Extrato do Cartão', icon: FileText },
    { id: 'pay', label: 'Marcar como Pago', icon: CheckCircle },
  ];

  const menuContent = (
    <div className="flex-1 flex flex-col p-4">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          Finance
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">Dashboard</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsOpen(false);
              }}
              whileHover={{ x: 4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 min-h-[44px] ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Configurações"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 min-h-[44px]"
        >
          <Settings size={20} className="flex-shrink-0" />
          <span className="text-sm whitespace-nowrap">Configurações</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Sair"
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 min-h-[44px]"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="text-sm whitespace-nowrap">Sair</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Desktop Sidebar - Always Visible */}
      <aside className="hidden md:flex md:flex-col h-screen w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 overflow-hidden">
        {menuContent}
      </aside>

      {/* Mobile Sidebar - Drawer */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 overflow-hidden"
      >
        {menuContent}
      </motion.aside>
    </>
  );
};
