import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Loader, Mail, User } from 'lucide-react'
import api from '../api/client'

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [costCenterId, setCostCenterId] = useState('')
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')
  const [loading, setLoading] = useState(false)

  useEffect(() => { 
    fetchCostCenters()
    fetchUsers() 
  }, [])

  async function fetchCostCenters() {
    try {
      const data = await api.getCostCenters()
      setCostCenters(data || [])
      if(data?.length > 0) setCostCenterId(data[0]._id)
    } catch (e) { console.error(e) }
  }

  async function fetchUsers() {
    setLoading(true)
    try {
      const data = await api.getUsers()
      setUsers(data || [])
    } catch (e) { alert(String(e)) }
    finally { setLoading(false) }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if(!name || !email || !password || !costCenterId){ alert('Preencha todos os campos'); return }
    try {
      const res = await api.createUser({ name, email, password, cost_center_id: costCenterId })
      alert(res.message || 'Criado')
      setName(''); setEmail(''); setPassword('')
      fetchUsers()
      setActiveTab('list')
    } catch (err) { alert(String(err)) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Usuários</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gerencie os usuários do sistema</p>
        </div>
        <button onClick={() => setActiveTab('create')} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'list'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Lista de Usuários
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Criar Usuário
        </button>
      </div>

      {/* Content */}
      {activeTab === 'list' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : users.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <motion.div
                  key={user._id || user.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                      <User className="text-emerald-600 dark:text-emerald-400" size={24} />
                    </div>
                    <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail size={16} />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Novo Usuário</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Centro de Custo
                </label>
                <select value={costCenterId} onChange={e => setCostCenterId(e.target.value)} className="input-base" required>
                  <option value="">-- Selecione um centro de custo --</option>
                  {costCenters.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Dados Pessoais</h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nome
                  </label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="joao@example.com"
                    type="email"
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Senha
                  </label>
                  <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                    className="input-base"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Criar Usuário
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName('')
                    setEmail('')
                    setPassword('')
                    setActiveTab('list')
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
