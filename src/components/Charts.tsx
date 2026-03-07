import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../api/client';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f97316', '#ef4444'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload) {
    return (
      <div className="bg-slate-900 dark:bg-slate-700 text-white p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium">{payload[0]?.name}</p>
        <p className="text-sm font-bold text-emerald-400">
          {typeof payload[0]?.value === 'number' ? `R$ ${payload[0]?.value.toFixed(2)}` : payload[0]?.value}
        </p>
      </div>
    );
  }
  return null;
};

export const BalanceEvolutionChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalanceData();
  }, []);

  async function fetchBalanceData() {
    setLoading(true);
    try {
      const transactions = await api.getTransactions();
      const now = new Date();
      const months: { [key: string]: number } = {};

      // Agrupar transações por mês (últimos 6 meses)
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString('pt-BR', { month: 'short' });
        months[key] = 0;
      }

      // Somar receitas e despesas por mês
      (transactions || []).forEach((t: any) => {
        const date = new Date(t.date);
        const key = date.toLocaleDateString('pt-BR', { month: 'short' });
        if (key in months) {
          if (t.flow_type === 'income') {
            months[key] += t.amount;
          } else if (t.flow_type === 'expense') {
            months[key] -= t.amount;
          }
        }
      });

      // Calcular saldo acumulado
      let balance = 0;
      const chartData = Object.entries(months).map(([name, change]) => {
        balance += (change as number);
        return { name, balance: Math.max(0, balance) };
      });

      setData(chartData.length > 0 ? chartData : [{ name: 'Este mês', balance: 0 }]);
    } catch (error) {
      console.error('Erro ao carregar dados de saldo:', error);
      setData([{ name: 'Erro', balance: 0 }]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 col-span-1 lg:col-span-2 flex items-center justify-center h-80"
      >
        <Loader className="animate-spin text-emerald-500" size={32} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card p-3 sm:p-6 col-span-1 md:col-span-1 lg:col-span-2"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6">
        Evolução do Saldo
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 5 }}
            activeDot={{ r: 7 }}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export const MonthlyExpensesChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpensesData();
  }, []);

  async function fetchExpensesData() {
    setLoading(true);
    try {
      const transactions = await api.getTransactions();
      const categoryMap: { [key: string]: number } = {};

      // Agrupar despesas por categoria
      (transactions || []).forEach((t: any) => {
        if (t.flow_type === 'expense') {
          const categoryName = t.category?.name || 'Sem categoria';
          categoryMap[categoryName] = (categoryMap[categoryName] || 0) + t.amount;
        }
      });

      const chartData = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }));

      setData(chartData.length > 0 ? chartData : [{ name: 'Sem despesas', value: 0 }]);
    } catch (error) {
      console.error('Erro ao carregar dados de despesas:', error);
      setData([{ name: 'Erro', value: 0 }]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 flex items-center justify-center h-80"
      >
        <Loader className="animate-spin text-emerald-500" size={32} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card p-3 sm:p-6"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6">
        Despesas por Categoria
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export const IncomeVsExpensesChart: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomeExpensesData();
  }, []);

  async function fetchIncomeExpensesData() {
    setLoading(true);
    try {
      const transactions = await api.getTransactions();
      const now = new Date();
      const months: { [key: string]: { income: number; expenses: number } } = {};

      // Inicializar últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString('pt-BR', { month: 'short' });
        months[key] = { income: 0, expenses: 0 };
      }

      // Agrupar receitas e despesas por mês
      (transactions || []).forEach((t: any) => {
        const date = new Date(t.date);
        const key = date.toLocaleDateString('pt-BR', { month: 'short' });
        if (key in months) {
          if (t.flow_type === 'income') {
            months[key].income += t.amount;
          } else if (t.flow_type === 'expense') {
            months[key].expenses += t.amount;
          }
        }
      });

      const chartData = Object.entries(months).map(([month, values]) => ({
        month,
        income: Number(values.income.toFixed(2)),
        expenses: Number(values.expenses.toFixed(2)),
      }));

      setData(chartData.length > 0 ? chartData : [{ month: 'Este mês', income: 0, expenses: 0 }]);
    } catch (error) {
      console.error('Erro ao carregar dados de receita vs despesa:', error);
      setData([{ month: 'Erro', income: 0, expenses: 0 }]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 col-span-1 lg:col-span-2 flex items-center justify-center h-80"
      >
        <Loader className="animate-spin text-emerald-500" size={32} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card p-3 sm:p-6 col-span-1 md:col-span-1 lg:col-span-2"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6">
        Receita vs Despesas
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
