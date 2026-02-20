import React, { useState } from 'react'
import CostCenters from './pages/CostCenters'
import Users from './pages/Users'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Accounts from './pages/Accounts'
import EntriesByMonth from './pages/EntriesByMonth'
import CardStatement from './pages/CardStatement'
import PayEntry from './pages/PayEntry'

export default function App() {
  const [view, setView] = useState<'home' | 'cost-centers' | 'users' | 'transactions' | 'categories' | 'accounts' | 'entries' | 'card' | 'pay'>('home')

  return (
    <div className="app">
      <header>
        <h1>Finance App (Front)</h1>
        <nav>
          <button onClick={() => setView('home')}>Home</button>
          <button onClick={() => setView('cost-centers')}>Centros de Custo</button>
          <button onClick={() => setView('users')}>Users</button>
          <button onClick={() => setView('transactions')}>Transactions</button>
          <button onClick={() => setView('categories')}>Categories</button>
          <button onClick={() => setView('accounts')}>Accounts</button>
          <button onClick={() => setView('entries')}>Entries By Month</button>
          <button onClick={() => setView('card')}>Card Statement</button>
          <button onClick={() => setView('pay')}>Pay Entry</button>
        </nav>
      </header>
      <main>
        {view === 'home' && <p>Bem vindo ao sistema de transações financeiras</p>}
        {view === 'cost-centers' && <CostCenters />}
        {view === 'users' && <Users />}
        {view === 'transactions' && <Transactions />}
        {view === 'categories' && <Categories />}
        {view === 'accounts' && <Accounts />}
        {view === 'entries' && <EntriesByMonth />}
        {view === 'card' && <CardStatement />}
        {view === 'pay' && <PayEntry />}
      </main>
    </div>
  )
}
