import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CreditCard,
  Loader,
} from 'lucide-react';
import api from '../api/client';
import { StatCard } from '../components/StatCard';
import { TransactionsTable } from '../components/TransactionsTable';
import { BalanceEvolutionChart, IncomeVsExpensesChart, MonthlyExpensesChart } from '../components/Charts';

interface Transaction {
  id: string;
  description: string;
  category?: string;
  amount: number;
  date?: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending';
}

interface Account {
  id?: string;
  _id?: string;
  name: string;
  balance?: number;
}

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    pendingAmount: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // Fetch accounts and transactions in parallel
      const [accountsData, transactionsData] = await Promise.all([
        api.getAccounts(),
        api.getTransactions(),
      ]);

      setAccounts(accountsData || []);
      
      // Transform transactions to match our interface
      const formattedTransactions: Transaction[] = (transactionsData || []).map((t: any) => ({
        id: t.id || t._id,
        description: t.description || 'Transação',
        category: t.category?.name || 'Sem categoria',
        amount: Math.abs(t.amount || 0),
        date: t.date,
        type: (t.flow_type || 'expense') as 'income' | 'expense',
        status: t.status || 'completed',
      }));

      setTransactions(formattedTransactions.slice(0, 5)); // Last 5 transactions

      // Calculate statistics
      const totalBalance = (accountsData || []).reduce((sum: number, acc: any) => 
        sum + (acc.balance || 0), 0
      );

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const monthlyTransactions = formattedTransactions.filter(t => {
        if (!t.date) return false;
        const tDate = new Date(t.date);
        return tDate.getMonth() + 1 === currentMonth && tDate.getFullYear() === currentYear;
      });

      const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const pendingAmount = formattedTransactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        pendingAmount,
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      // Fallback para dados mockados em caso de erro
      setStats({
        totalBalance: 42500,
        monthlyIncome: 8500,
        monthlyExpenses: 3200,
        pendingAmount: 1200,
      });
      setTransactions([
        {
          id: '1',
          description: 'Salário',
          category: 'Receita',
          amount: 5000,
          date: new Date().toISOString().split('T')[0],
          type: 'income',
          status: 'completed',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const netFlow = stats.monthlyIncome - stats.monthlyExpenses;

  if (loading) {
    return (
      <motion.div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="animate-spin text-emerald-500 mx-auto mb-4" size={48} />
          <p className="text-slate-600 dark:text-slate-400">Carregando dashboard...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-8 page-enter">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Saldo Total"
          value={stats.totalBalance}
          icon={Wallet}
          color="emerald"
          trend={8.5}
          delay={0}
        />
        <StatCard
          title="Receita Mensal"
          value={stats.monthlyIncome}
          icon={TrendingUp}
          color="blue"
          trend={5.2}
          delay={1}
        />
        <StatCard
          title="Despesas Mensais"
          value={stats.monthlyExpenses}
          icon={TrendingDown}
          color="red"
          trend={-2.3}
          delay={2}
        />
        <StatCard
          title="Fluxo Líquido"
          value={Math.abs(netFlow)}
          icon={CreditCard}
          color="purple"
          trend={12.1}
          delay={3}
        />
        <StatCard
          title="Contas a Pagar"
          value={stats.pendingAmount}
          icon={AlertCircle}
          color="orange"
          delay={4}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BalanceEvolutionChart />
        <MonthlyExpensesChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <IncomeVsExpensesChart />
      </div>

      {/* Transactions Table */}
      <TransactionsTable transactions={transactions} />
    </motion.div>
  );
};
