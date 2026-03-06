import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Loader, ArrowUpRight, ArrowDownLeft, Trash2, Edit2, X } from 'lucide-react'
import api from '../api/client'

export default function Transactions(){
  const [transactions, setTransactions] = useState<any[]>([])
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const [costCenterId, setCostCenterId] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [flowType, setFlowType] = useState<'income'|'expense'>('expense')
  const [transactionType, setTransactionType] = useState<'single'|'installment'|'recurring'>('single')
  const [paymentMethodType, setPaymentMethodType] = useState<'cash'|'debit'|'credit_card'|'pix'>('cash')
  const [closingDay, setClosingDay] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [accountId, setAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [installments, setInstallments] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [splitType, setSplitType] = useState('')
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)


  async function fetchAccountsAndCategories(){
    try{
      const [accs, cats] = await Promise.all([
        api.getAccounts(costCenterId ? { cost_center_id: costCenterId } : undefined),
        api.getCategories(costCenterId ? { cost_center_id: costCenterId } : undefined)
      ])
      setAccounts(accs || [])
      setCategories(cats || [])
    }catch(e){ console.error('Erro ao buscar contas/categorias', e) }
  }

  async function fetchAllAccountsAndCategories(){
    try{
      const [accs, cats] = await Promise.all([
        api.getAccounts(),
        api.getCategories()
      ])
      setAccounts(accs || [])
      setCategories(cats || [])
    }catch(e){ console.error('Erro ao buscar todas as contas/categorias', e) }
  }

  useEffect(() => {
    if(activeTab === 'create') {
      fetchAccountsAndCategories()
    } else if(activeTab === 'list') {
      fetchAllAccountsAndCategories()
    }
  }, [costCenterId, activeTab])


  useEffect(() => {
    (async () => {
      try{
        const data = await api.getCostCenters()
        setCostCenters(data || [])
      }catch(e){ console.error('Erro ao buscar centros de custo', e) }
    })()
  }, [])

  useEffect(() => {
    if(activeTab === 'list') {
      fetchTransactions(false) // Buscar todas as transações na aba de listagem
    } else {
      fetchTransactions(true) // Manter filtro por cost_center na aba de criação
    }
  }, [activeTab, costCenterId])

  async function fetchTransactions(filterCostCenter: boolean = true){
    if(filterCostCenter && !costCenterId) return setTransactions([])
    setLoading(true)
    try{
      const params = filterCostCenter && costCenterId ? { cost_center_id: costCenterId } : undefined
      const data = await api.getTransactions(params)
      setTransactions(data || [])
    }catch(e){ alert(String(e)) }
    finally{ setLoading(false) }
  }

  async function handleCreate(e: React.FormEvent){
    e.preventDefault()
    if(!costCenterId){ alert('Escolha um centro de custo'); return }
    try{
      const total_amount_value = transactionType === 'installment' ? Number(totalAmount) : Number(amount)
      const payload: any = {
        description,
        total_amount: total_amount_value,
        flow_type: flowType,
        transaction_type: transactionType,
        payment_method: {
          type: paymentMethodType,
          closing_day: closingDay ? Number(closingDay) : null,
          due_day: dueDay ? Number(dueDay) : null
        },
        date: transactionDate,
        account_id: accountId || null,
        category_id: categoryId || null,
        cost_center_id: costCenterId,
        split_type: splitType || null,
      }
      if(transactionType === 'installment'){
        payload.installments = Number(installments)
      }
      const res = await api.createTransaction(payload)
      alert(res.message || 'Criado')
      setDescription(''); setAmount(''); setAccountId(''); setCategoryId(''); setInstallments(''); setTotalAmount(''); setSplitType('')
      fetchTransactions()
    }catch(err){ alert(String(err)) }
  }

  async function handleDelete(transactionId: string){
    if(!confirm('Tem certeza que deseja deletar esta transação?')) return
    setDeleting(true)
    try{
      await fetch(`/api/transactions/${transactionId}`, { method: 'DELETE' })
      alert('Transação deletada com sucesso')
      fetchTransactions()
    }catch(err){ 
      alert('Erro ao deletar: ' + String(err))
    }finally{
      setDeleting(false)
    }
  }

  function handleEditStart(transaction: any){
    setEditingId(transaction._id || transaction.id || '')
    setEditValues({ ...transaction })
  }

  function handleEditCancel(){
    setEditingId(null)
    setEditValues(null)
  }

  async function handleEditSave(){
    if(!editValues || !editingId) return
    try{
      const payload = {
        description: editValues.description,
        total_amount: Number(editValues.amount || editValues.total_amount),
        flow_type: editValues.flow_type,
        category_id: editValues.category_id || null,
        account_id: editValues.account_id || null,
        date: editValues.date,
        payment_method: editValues.payment_method
      }
      await fetch(`/api/transactions/${editingId}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      alert('Transação atualizada com sucesso')
      fetchTransactions()
      handleEditCancel()
    }catch(err){
      alert('Erro ao atualizar: ' + String(err))
    }
  }

  const getPaymentMethodLabel = (method: any) => {
    const labels: Record<string, string> = {
      'cash': 'Dinheiro',
      'debit': 'Débito',
      'credit_card': 'Cartão',
      'pix': 'PIX'
    }
    const methodType = typeof method === 'object' ? method.type : method
    return labels[methodType] || methodType || 'N/A'
  }

  const getCategoryName = (transaction: any) => {
    if(transaction.category?.name) return transaction.category.name
    if(categories.length > 0){
      return categories.find(c => c._id === transaction.category_id)?.name || 'N/A'
    }
    return 'N/A'
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transações</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Gerencie suas transações financeiras</p>
        </div>
        <button onClick={() => setActiveTab('create')} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={20} />
          Nova Transação
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
          Lista de Transações
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Criar Transação
        </button>
      </div>

      {/* Content */}
      {activeTab === 'list' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : transactions.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">Nenhuma transação encontrada.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Descrição</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Categoria</th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Valor</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Data</th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Método</th>
                      <th className="text-center py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, index) => (
                      <motion.tr
                        key={t._id || t.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                t.flow_type === 'income'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/20'
                                  : 'bg-red-100 dark:bg-red-900/20'
                              }`}
                            >
                              {t.flow_type === 'income' ? (
                                <ArrowDownLeft className="text-emerald-600 dark:text-emerald-400" size={18} />
                              ) : (
                                <ArrowUpRight className="text-red-600 dark:text-red-400" size={18} />
                              )}
                            </div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm">
                              {t.description}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {getCategoryName(t)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <p
                            className={`font-semibold text-sm ${
                              t.flow_type === 'income'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {t.flow_type === 'income' ? '+' : '-'} R$ {Number(t.amount || t.total_amount).toFixed(2)}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(t.date).toLocaleDateString('pt-BR')}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 inline-block">
                            {getPaymentMethodLabel(t.payment_method)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2 justify-center">
                            <button 
                              onClick={() => handleEditStart(t)}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} className="text-slate-600 dark:text-slate-400" />
                            </button>
                            <button 
                              onClick={() => handleDelete(t._id || t.id)}
                              disabled={deleting}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Nova Transação</h3>
            <form onSubmit={handleCreate} className="space-y-8">
              {/* Centro de Custo */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Centro de Custo</h4>
                <select
                  value={costCenterId}
                  onChange={e => setCostCenterId(e.target.value)}
                  className="input-base"
                  required
                >
                  <option value="">-- Selecione um centro de custo --</option>
                  {costCenters.map(cc => (
                    <option key={cc._id || cc.id} value={cc._id || cc.id}>
                      {cc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dados Básicos */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Dados Básicos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Descrição
                    </label>
                    <input
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Ex: Compra no supermercado"
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Valor
                    </label>
                    <input
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      className="input-base"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tipo de Fluxo
                    </label>
                    <select
                      value={flowType}
                      onChange={e => setFlowType(e.target.value as any)}
                      className="input-base"
                      required
                    >
                      <option value="expense">Despesa</option>
                      <option value="income">Receita</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Data
                    </label>
                    <input
                      type="date"
                      value={transactionDate}
                      onChange={e => setTransactionDate(e.target.value)}
                      className="input-base"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de Transação */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Tipo de Transação</h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={transactionType}
                    onChange={e => setTransactionType(e.target.value as any)}
                    className="input-base"
                  >
                    <option value="single">Única</option>
                    <option value="installment">Parcelada</option>
                    <option value="recurring">Recorrente</option>
                  </select>
                </div>
                {transactionType === 'installment' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Número de Parcelas
                      </label>
                      <input
                        value={installments}
                        onChange={e => setInstallments(e.target.value)}
                        placeholder="Ex: 12"
                        type="number"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Valor Total
                      </label>
                      <input
                        value={totalAmount}
                        onChange={e => setTotalAmount(e.target.value)}
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        className="input-base"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Forma de Pagamento</h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Método
                  </label>
                  <select
                    value={paymentMethodType}
                    onChange={e => setPaymentMethodType(e.target.value as any)}
                    className="input-base"
                  >
                    <option value="cash">Dinheiro</option>
                    <option value="debit">Débito</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="pix">PIX</option>
                  </select>
                </div>
                {(paymentMethodType === 'credit_card' || paymentMethodType === 'debit') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Dia de Fechamento
                      </label>
                      <input
                        value={closingDay}
                        onChange={e => setClosingDay(e.target.value)}
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
                        onChange={e => setDueDay(e.target.value)}
                        placeholder="Ex: 20"
                        type="number"
                        className="input-base"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Referências */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Referências (Opcional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Conta
                    </label>
                    <select value={accountId} onChange={e => setAccountId(e.target.value)} className="input-base">
                      <option value="">-- Selecione uma conta --</option>
                      {accounts.map(a => (
                        <option key={a._id || a.id} value={a._id || a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Categoria
                    </label>
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input-base">
                      <option value="">-- Selecione uma categoria --</option>
                      {categories.map(c => (
                        <option key={c._id || c.id} value={c._id || c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button type="submit" className="btn-primary flex-1">
                  Criar Transação
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDescription('')
                    setAmount('')
                    setAccountId('')
                    setCategoryId('')
                    setInstallments('')
                    setTotalAmount('')
                    setSplitType('')
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
            className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Editar Transação</h3>
              <button onClick={handleEditCancel} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Descrição
                </label>
                <input
                  value={editValues.description}
                  onChange={e => setEditValues({ ...editValues, description: e.target.value })}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Valor
                </label>
                <input
                  value={editValues.amount || editValues.total_amount}
                  onChange={e => setEditValues({ ...editValues, amount: Number(e.target.value), total_amount: Number(e.target.value) })}
                  type="number"
                  step="0.01"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tipo de Fluxo
                </label>
                <select 
                  value={editValues.flow_type} 
                  onChange={e => setEditValues({ ...editValues, flow_type: e.target.value })}
                  className="input-base"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  value={editValues.date ? new Date(editValues.date).toISOString().slice(0, 10) : ''}
                  onChange={e => setEditValues({ ...editValues, date: e.target.value })}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Categoria
                </label>
                <select 
                  value={editValues.category_id || ''} 
                  onChange={e => setEditValues({ ...editValues, category_id: e.target.value || null })}
                  className="input-base"
                >
                  <option value="">-- Sem categoria --</option>
                  {categories.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Conta
                </label>
                <select 
                  value={editValues.account_id || ''} 
                  onChange={e => setEditValues({ ...editValues, account_id: e.target.value || null })}
                  className="input-base"
                >
                  <option value="">-- Sem conta --</option>
                  {accounts.map(a => (
                    <option key={a._id || a.id} value={a._id || a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
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
