import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  color: 'emerald' | 'blue' | 'purple' | 'orange' | 'red';
  currency?: boolean;
  delay?: number;
}

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-700',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-700',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-700',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-700',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-700',
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
  currency = true,
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const colors = colorMap[color];

  // Animate counter
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className={`card p-6 active:scale-[0.98] cursor-pointer overflow-hidden relative`}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 opacity-5 ${colors.bg.split(' ')[0]}`}
        style={{
          background: `radial-gradient(circle at top right, var(--color) 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon size={20} className={colors.text} />
          </div>
        </div>

        {/* Value */}
        <div className="mb-3">
          <p className="text-4xl font-bold text-slate-900 dark:text-white">
            {currency ? formatCurrency(displayValue) : Math.round(displayValue)}
          </p>
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(trend)}% vs. mês anterior</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
