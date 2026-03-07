import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Trash2, Edit2, Loader, X } from 'lucide-react'
import api from '../api/client'

interface Account {
  id?: string
  _id?: string
  name: string
  type: 'checking' | 'savings' | 'credit_card'
  balance?: number
  initial_balance?: number
  closing_day?: number
  due_day?: number
}

export default function Accounts(){
  const [accounts, setAccounts] = useState<Account[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState<'checking'|'savings'|'credit_card'>('checking')
  const [initialBalance, setInitialBalance] = useState('0')
  const [closingDay, setClosingDay] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [recalcLoading, setRecalcLoading] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Account | null>(null)

  useEffect(()=>{ 
    fetchAccounts() 
  }, [])

  async function fetchAccounts(){
    setLoading(true)
    try{ 
      const data = await api.getAccounts()
      setAccounts(data || [])
    }catch(e){ 
      console.error(e)
    }
    finally{ 
      setLoading(false)
    }
  }

  async function handleCreate(e: React.FormEvent){
    e.preventDefault()
    if(!name){ alert('Preencha o nome'); return }
    try{
      const payload = { 
        name, 
        type, 
        initial_balance: Number(initialBalance),
        closing_day: closingDay ? Number(closingDay) : null, 
        due_day: dueDay ? Number(dueDay) : null 
      }
      const res = await api.createAccount(payload)
      alert(res.message || 'Conta criada com sucesso')
      setName(''); setInitialBalance('0'); setClosingDay(''); setDueDay(''); setType('checking')
      fetchAccounts()
      setActiveTab('list')
    }catch(err){ alert(String(err)) }
  }

  async function handleDelete(accountId: string){
    if(!confirm('Tem certeza que deseja deletar esta conta?')) return
    setDeleting(true)
    try{
      await fetch(`/api/accounts/${accountId}`, { method: 'DELETE' })
      alert('Conta deletada com sucesso')
      fetchAccounts()
    }catch(err){ 
      alert('Erro ao deletar: ' + String(err))
    }finally{
      setDeleting(false)
    }
  }

  async function handleRecalculate(accountId: string) {
    if (!accountId) return
    try {
      setRecalcLoading(prev => [...prev, accountId])
      await api.recalculateAccountBalance(accountId)
      alert('Saldo recalculado com sucesso')
      fetchAccounts()
    } catch (err) {
      alert('Erro ao recalcular saldo: ' + String(err))
    } finally {
      setRecalcLoading(prev => prev.filter(id => id !== accountId))
    }
  }

  function handleEditStart(account: Account){
    setEditingId(account.id || account._id || '')
    setEditValues({ ...account })
  }

  function handleEditCancel(){
    setEditingId(null)
    setEditValues(null)
  }

  async function handleEditSave(){
    if(!editValues || !editingId) return
    try{
      const payload = {
        name: editValues.name,
        type: editValues.type,
        closing_day: editValues.closing_day || null,
        due_day: editValues.due_day || null
      }
      await fetch(`/api/accounts/${editingId}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      alert('Conta atualizada com sucesso')
      fetchAccounts()
      handleEditCancel()
    }catch(err){
      alert('Erro ao atualizar: ' + String(err))
    }
  }

  const accountTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'checking': 'Corrente',
      'savings': 'Poupança',
      'credit_card': 'Cartão de Crédito'
    }
    return types[type] || type
  }

  const getAccountId = (account: Account) => account.id || account._id || ''
  const getBalance = (account: Account) => account.balance ?? account.initial_balance ?? 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contas</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gerencie suas contas bancárias</p>
        </div>
        <button onClick={() => setActiveTab('create')} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={20} />
          Nova Conta
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
          Lista de Contas
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Criar Conta
        </button>
      </div>

      {/* Content */}
      {activeTab === 'list' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Accounts Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">Nenhuma conta encontrada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {accounts.map((account, index) => (
                <motion.div
                  key={getAccountId(account)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {account.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{accountTypeLabel(account.type)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditStart(account)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} className="text-slate-600 dark:text-slate-400" />
                      </button>
                      <button 
                        onClick={() => handleDelete(getAccountId(account))}
                        disabled={deleting}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      R$ {Number(getBalance(account)).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRecalculate(getAccountId(account))}
                      disabled={recalcLoading.includes(getAccountId(account))}
                      className="mt-2 text-sm text-blue-500 hover:underline disabled:text-gray-400"
                    >
                      {recalcLoading.includes(getAccountId(account)) ? 'Atualizando...' : 'Recalcular saldo'}
                    </button>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {account.closing_day && <p>Fechamento: dia {account.closing_day}</p>}
                    {account.due_day && <p>Vencimento: dia {account.due_day}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="card p-4 sm:p-6 lg:p-4 sm:p-6 lg:p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Nova Conta</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Dados Básicos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nome da Conta
                    </label>
                    <input
                      value={name}
                      onChange={e=>setName(e.target.value)}
                      placeholder="Ex: Conta do Banco X"
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tipo
                    </label>
                    <select value={type} onChange={e=>setType(e.target.value as any)} className="input-base" required>
                      <option value="checking">Conta Corrente</option>
                      <option value="savings">Poupança</option>
                      <option value="credit_card">Cartão de Crédito</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Saldo Inicial
                  </label>
                  <input
                    value={initialBalance}
                    onChange={e=>setInitialBalance(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    className="input-base"
                    required
                  />
                </div>
              </div>

              {/* Dates */}
              {(type === 'credit_card' || type === 'checking') && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Datas (Opcional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Dia de Fechamento
                      </label>
                      <input
                        value={closingDay}
                        onChange={e=>setClosingDay(e.target.value)}
                        placeholder="Ex: 10"
                        type="number"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Dia de Vencimento
                      </label>
                      <input
                        value={dueDay}
                        onChange={e=>setDueDay(e.target.value)}
                        placeholder="Ex: 20"
                        type="number"
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Criar Conta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(''); setInitialBalance('0'); setClosingDay(''); setDueDay(''); setType('checking')
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

      {/* Edit Modal */}
      {editingId && editValues && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Editar Conta</h3>
              <button onClick={handleEditCancel} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nome
                </label>
                <input
                  value={editValues.name}
                  onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tipo
                </label>
                <select 
                  value={editValues.type} 
                  onChange={e => setEditValues({ ...editValues, type: e.target.value as any })}
                  className="input-base"
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Poupança</option>
                  <option value="credit_card">Cartão de Crédito</option>
                </select>
              </div>

              {(editValues.type === 'credit_card' || editValues.type === 'checking') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Dia de Fechamento
                    </label>
                    <input
                      value={editValues.closing_day || ''}
                      onChange={e => setEditValues({ ...editValues, closing_day: e.target.value ? Number(e.target.value) : undefined })}
                      type="number"
                      className="input-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Dia de Vencimento
                    </label>
                    <input
                      value={editValues.due_day || ''}
                      onChange={e => setEditValues({ ...editValues, due_day: e.target.value ? Number(e.target.value) : undefined })}
                      type="number"
                      className="input-base"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleEditSave} className="btn-primary flex-1">
                Salvar
              </button>
              <button onClick={handleEditCancel} className="btn-secondary flex-1">
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
