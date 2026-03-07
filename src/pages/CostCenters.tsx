import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Loader } from 'lucide-react'
import api from '../api/client'

export default function CostCenters() {
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')

  useEffect(() => { fetchCostCenters() }, [])

  async function fetchCostCenters() {
    setLoading(true)
    try {
      const data = await api.getCostCenters()
      setCostCenters(data || [])
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if(!name){ alert('Preencha o nome'); return }
    try {
      const res = await api.createCostCenter({ name })
      alert(res.message || 'Criado')
      setName('')
      fetchCostCenters()
      setActiveTab('list')
    } catch (err) { alert(String(err)) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Centros de Custo</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Organize seus centros de custo</p>
        </div>
        <button onClick={() => setActiveTab('create')} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={20} />
          Novo Centro
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
          Lista de Centros
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'create'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Criar Centro
        </button>
      </div>

      {/* Content */}
      {activeTab === 'list' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-emerald-500" size={32} />
            </div>
          ) : costCenters.length === 0 ? (
            <div className="card p-4 sm:p-6 lg:p-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">Nenhum centro de custo encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {costCenters.map((center, index) => (
                <motion.div
                  key={center._id || center.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="card p-6"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{center.name}</h3>
                    <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <div className="card p-4 sm:p-6 lg:p-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Novo Centro de Custo</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nome do Centro
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Departamento de TI"
                  className="input-base"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Criar Centro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName('')
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
