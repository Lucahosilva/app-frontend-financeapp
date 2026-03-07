import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader, Search } from 'lucide-react'
import api from '../api/client'

export default function PayEntry(){
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [costCenterId, setCostCenterId] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [month, setMonth] = useState(String(new Date().getMonth()+1))
  const [entries, setEntries] = useState<any[]>([])
  const [selectedEntry, setSelectedEntry] = useState('')
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)

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
      if((data||[]).length>0) setSelectedEntry((data||[])[0].id)
    }catch(e){ alert(String(e)) }
    finally { setLoading(false) }
  }

  async function handlePay(){
    if(!selectedEntry){ alert('Selecione um lançamento'); return }
    setPaying(true)
    try{
      const res = await api.payEntry(selectedEntry)
      alert(res.message || 'Marcado como pago')
      fetchEntries()
      setSelectedEntry('')
    }catch(e){ alert(String(e)) }
    finally { setPaying(false) }
  }

  const selectedEntryData = entries.find(e => e.id === selectedEntry)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Marcar Lançamento como Pago</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Registre o pagamento de lançamentos</p>
      </div>

      <div className="card p-4 sm:p-6 lg:p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Filtrar Lançamentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Search size={18} className="inline mr-2" />
              Buscar
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-emerald-500" size={32} />
        </div>
      ) : entries.length === 0 ? (
        <div className="card p-4 sm:p-6 lg:p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">Nenhum lançamento encontrado.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Selecione um Lançamento</h3>
            <select value={selectedEntry} onChange={e=>setSelectedEntry(e.target.value)} className="input-base mb-6">
              <option value="">-- Selecione um lançamento --</option>
              {entries.map(en => (
                <option key={en.id} value={en.id}>
                  {en.description} — R$ {Number(en.amount).toFixed(2)} — {en.competence_month}
                </option>
              ))}
            </select>

            {selectedEntryData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Descrição</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedEntryData.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Competência</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedEntryData.competence_month}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Valor</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">R$ {Number(selectedEntryData.amount).toFixed(2)}</p>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  disabled={paying}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {paying ? (
                    <><Loader size={18} className="animate-spin" /> Processando...</>
                  ) : (
                    <><Check size={18} /> Marcar como Pago</>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
