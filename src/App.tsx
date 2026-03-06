import React, { useState } from 'react';
import { MainLayout } from './layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { useDarkMode } from './hooks/useTheme';
import CostCenters from './pages/CostCenters';
import Users from './pages/Users';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Accounts from './pages/Accounts';
import EntriesByMonth from './pages/EntriesByMonth';
import CardStatement from './pages/CardStatement';
import PayEntry from './pages/PayEntry';
import './styles.css';

const pageNames: Record<string, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transações',
  accounts: 'Contas',
  categories: 'Categorias',
  'cost-centers': 'Centros de Custo',
  users: 'Usuários',
  entries: 'Entradas por Mês',
  card: 'Extrato do Cartão',
  pay: 'Entrada de Pagamento',
};

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const renderPage = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'accounts':
        return <Accounts />;
      case 'categories':
        return <Categories />;
      case 'cost-centers':
        return <CostCenters />;
      case 'users':
        return <Users />;
      case 'entries':
        return <EntriesByMonth />;
      case 'card':
        return <CardStatement />;
      case 'pay':
        return <PayEntry />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout
      activeView={activeView}
      setActiveView={setActiveView}
      pageTitle={pageNames[activeView]}
      isDarkMode={isDarkMode}
      onToggleDarkMode={toggleDarkMode}
    >
      {renderPage()}
    </MainLayout>
  );
}
