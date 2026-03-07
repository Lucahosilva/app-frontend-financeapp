import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Loader } from 'lucide-react'
import api from '../api/client'

export default function Categories(){
  const [categories, setCategories] = useState<any[]>([])
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState<'income'|'expense'>('expense')
  const [costCenterId, setCostCenterId] = useState('')
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ 
    fetchCostCenters()
    fetchCategories() 
  }, [])

  async function fetchCostCenters(){
    try{ const data = await api.getCostCenters(); setCostCenters(data || []) }catch(e){ console.error(e) }
  }

  async function fetchCategories(){
    setLoading(true)
    try{ const data = await api.getCategories(); setCategories(data || []) }catch(e){ alert(String(e)) }
    finally{ setLoading(false) }
  }

  async function handleCreate(e: React.FormEvent){
    e.preventDefault()
    if(!costCenterId){ alert('Escolha um centro de custo'); return }
    try{
      const payload = { name, type, cost_center_id: costCenterId }
      const res = await api.createCategory(payload)
      alert(res.message || 'Criado')
      setName(''); setCostCenterId('')
      fetchCategories()
      setActiveTab('list')
    }catch(err){ alert(String(err)) }
  }

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'emerald' : 'red'
  }

  const getTypeLabel = (type: string) => {
    return type === 'income' ? 'Receita' : 'Despesa'
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Categorias</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Organize suas categorias de transações</p>
        </div>
        <button onClick={() => setActiveTab('create')} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={20} />
          Nova Categoria
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
          Lista de Categorias
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Criar Categoria
        </button>
      </div>

      {/* Content */}
      {activeTab === 'list' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">Nenhuma categoria encontrada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => {
                const colorKey = getTypeColor(category.type)
                return (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="card p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {category.name}
                        </h3>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          colorKey === 'income'
                            ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        }`}>
                          {getTypeLabel(category.type)}
                        </span>
                      </div>
                      <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="card p-4 sm:p-6 lg:p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Nova Categoria</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Nome da Categoria
                  </label>
                  <input
                    value={name}
                    onChange={e=>setName(e.target.value)}
                    placeholder="Ex: Alimentação"
                    className="input-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo
                  </label>
                  <select value={type} onChange={e=>setType(e.target.value as any)} className="input-base" required>
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Centro de Custo
                  </label>
                  <select value={costCenterId} onChange={e=>setCostCenterId(e.target.value)} className="input-base" required>
                    <option value="">-- Selecione um centro de custo --</option>
                    {costCenters.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Criar Categoria
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(''); setCostCenterId('')
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
