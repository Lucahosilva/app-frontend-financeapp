import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
}

interface TransactionsTableProps {
  transactions: Transaction[];
  onViewMore?: () => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, onViewMore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transações Recentes</h3>
        <button
          onClick={onViewMore}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm"
        >
          Ver mais →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Descrição
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Categoria
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Valor
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Estatuto
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * index }}
                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'income'
                          ? 'bg-emerald-100 dark:bg-emerald-900/20'
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowDownLeft className="text-emerald-600 dark:text-emerald-400" size={18} />
                      ) : (
                        <ArrowUpRight className="text-red-600 dark:text-red-400" size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full inline-block">
                    {transaction.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <p
                    className={`font-semibold text-sm ${
                      transaction.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full inline-block ${
                      transaction.status === 'completed'
                        ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                    }`}
                  >
                    {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
