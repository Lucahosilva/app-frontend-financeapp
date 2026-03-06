import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ModernPageProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const ModernPageWrapper: React.FC<ModernPageProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {description && (
          <p className="text-slate-600 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>

      {/* Content */}
      <div className="card p-6 md:p-8">
        {children}
      </div>
    </motion.div>
  );
};
