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
  ChevronLeft,
  Menu,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [isOpen, setIsOpen] = useState(true);

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

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-500 text-white rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative h-screen flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 overflow-hidden"
      >
        <div className="flex-1 flex flex-col p-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            className="mb-8 px-2"
          >
            <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              Finance
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Dashboard</p>
          </motion.div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                  }}
                  whileHover={{ x: isOpen ? 4 : 0, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  } ${!isOpen ? 'justify-center' : ''}`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {isOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                </motion.button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 border-t border-slate-200 dark:border-slate-700 pt-4">
            <motion.button
              whileHover={{ x: isOpen ? 4 : 0, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Configurações"
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <Settings size={20} className="flex-shrink-0" />
              {isOpen && <span className="text-sm whitespace-nowrap">Configurações</span>}
            </motion.button>
            <motion.button
              whileHover={{ x: isOpen ? 4 : 0, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Sair"
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 ${
                !isOpen ? 'justify-center' : ''
              }`}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {isOpen && <span className="text-sm whitespace-nowrap">Sair</span>}
            </motion.button>
          </div>
        </div>

        {/* Collapse/Expand Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-full py-4 border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isOpen ? 'Retrair menu' : 'Expandir menu'}
        >
          <motion.div animate={{ rotate: isOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-400" />
          </motion.div>
        </motion.button>
      </motion.aside>

      {/* Mobile Overlay */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(true)}
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
        />
      )}
    </>
  );
};
