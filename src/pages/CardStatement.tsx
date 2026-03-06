import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader } from 'lucide-react'
import api from '../api/client'

export default function CardStatement(){
  const [accountId, setAccountId] = useState('')
  const [costCenterId, setCostCenterId] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [month, setMonth] = useState(String(new Date().getMonth()+1))
  const [statement, setStatement] = useState<any | null>(null)
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ fetchCostCenters() }, [])

  async function fetchCostCenters(){
    try{ const data = await api.getCostCenters(); setCostCenters(data || []); if((data||[]).length>0) setCostCenterId((data||[])[0]._id || (data||[])[0].id) }catch(e){ console.error(e) }
  }

  useEffect(()=>{ if(costCenterId) fetchAccounts() }, [costCenterId])

  async function fetchAccounts(){
    try{ const data = await api.getAccounts({ cost_center_id: costCenterId }); setAccounts(data || []); if((data||[]).length>0) setAccountId((data||[])[0]._id || (data||[])[0].id) }catch(e){ console.error(e) }
  }

  async function fetchStatement(){
    if(!accountId){ alert('Escolha uma conta'); return }
    setLoading(true)
    try{
      const data = await api.getCardStatement(accountId, Number(year), Number(month), costCenterId)
      setStatement(data)
    }catch(e){ alert(String(e)) }
    finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Extrato do Cartão</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Visualize o extrato do seu cartão de crédito</p>
      </div>

      <div className="card p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Filtrar Extrato</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Centro de Custo</label>
            <select value={costCenterId} onChange={e=>setCostCenterId(e.target.value)} className="input-base">
              <option value="">-- Selecione --</option>
              {costCenters.map(h => <option key={h._id || h.id} value={h._id || h.id}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Conta</label>
            <select value={accountId} onChange={e=>setAccountId(e.target.value)} className="input-base">
              <option value="">-- Selecione --</option>
              {accounts.map(a => <option key={a._id || a.id} value={a._id || a.id}>{a.name}</option>)}
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
        </div>
        <button onClick={fetchStatement} className="btn-primary mt-6 w-full">
          <Search size={18} className="inline mr-2" />
          Buscar Extrato
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-emerald-500" size={32} />
        </div>
      ) : statement ? (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Competência</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{statement.competence_month}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">R$ {Number(statement.total).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Descrição</th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.entries?.map((e:any, index:number) => (
                    <motion.tr
                      key={e.id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="py-4 px-6 text-slate-900 dark:text-white">{e.description}</td>
                      <td className="py-4 px-6 text-right font-semibold text-slate-900 dark:text-white">R$ {Number(e.amount).toFixed(2)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}
