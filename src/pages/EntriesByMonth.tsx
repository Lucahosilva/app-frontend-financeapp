import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader } from 'lucide-react'
import api from '../api/client'

export default function EntriesByMonth(){
  const [entries, setEntries] = useState<any[]>([])
  const [costCenterId, setCostCenterId] = useState('')
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())
  const [month, setMonth] = useState<string>((new Date().getMonth()+1).toString())
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchCostCenters() }, [])

  async function fetchCostCenters(){
    try{ const data = await api.getCostCenters(); setCostCenters(data || []); if((data||[]).length>0) setCostCenterId((data||[])[0]._id || (data||[])[0].id) }catch(e){ console.error(e) }
  }

  async function fetchEntries(){
    if(!costCenterId) return setEntries([])
    setLoading(true)
    try{
      const data = await api.getEntriesByMonth(Number(year), Number(month), { cost_center_id: costCenterId })
      setEntries(data || [])
    }catch(e){ alert(String(e)) }
    finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Lançamentos por Mês</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Visualize os lançamentos por período</p>
      </div>

      <div className="card p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Filtrar Lançamentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Centro de Custo</label>
            <select value={costCenterId} onChange={e=>setCostCenterId(e.target.value)} className="input-base">
              <option value="">-- Selecione --</option>
              {costCenters.map(h => <option key={h._id || h.id} value={h._id || h.id}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Ano</label>
            <input value={year} onChange={e=>setYear(e.target.value)} type="number" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mês</label>
            <input value={month} onChange={e=>setMonth(e.target.value)} type="number" min="1" max="12" className="input-base" />
          </div>
          <div className="flex items-end">
            <button onClick={fetchEntries} className="btn-primary w-full">
              <Search size={18} className="mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-emerald-500" size={32} />
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">Nenhum lançamento encontrado.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Descrição</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Competência</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Valor</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <motion.tr
                    key={entry.id || entry._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-slate-900 dark:text-white">{entry.description}</td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{entry.competence_month}</td>
                    <td className="py-4 px-6 text-right font-semibold text-emerald-600 dark:text-emerald-400">R$ {Number(entry.amount).toFixed(2)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}
