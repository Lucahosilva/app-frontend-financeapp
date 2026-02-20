import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function PayEntry(){
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [costCenterId, setCostCenterId] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [month, setMonth] = useState(String(new Date().getMonth()+1))
  const [entries, setEntries] = useState<any[]>([])
  const [selectedEntry, setSelectedEntry] = useState('')

  useEffect(()=>{ fetchCostCenters() }, [])

  async function fetchCostCenters(){
    try{ const data = await api.getCostCenters(); setCostCenters(data || []); if((data||[]).length>0) setCostCenterId((data||[])[0]._id || (data||[])[0].id) }catch(e){ console.error(e) }
  }

  async function fetchEntries(){
    if(!costCenterId) return setEntries([])
    try{
      const data = await api.getEntriesByMonth(Number(year), Number(month), { cost_center_id: costCenterId })
      setEntries(data || [])
      if((data||[]).length>0) setSelectedEntry((data||[])[0].id)
    }catch(e){ alert(String(e)) }
  }

  async function handlePay(){
    if(!selectedEntry){ alert('Selecione um lançamento'); return }
    try{ const res = await api.payEntry(selectedEntry); alert(res.message || 'Marcado como pago'); fetchEntries() }catch(e){ alert(String(e)) }
  }

  return (
    <div>
      <h2>Marcar Lançamento como Pago</h2>
      <div>
        <label>Centro de Custo: </label>
        <select value={costCenterId} onChange={e=>setCostCenterId(e.target.value)}>
          <option value="">-- selecione --</option>
          {costCenters.map(h => <option key={h._id || h.id} value={h._id || h.id}>{h.name}</option>)}
        </select>
        <input value={year} onChange={e=>setYear(e.target.value)} placeholder="Year" />
        <input value={month} onChange={e=>setMonth(e.target.value)} placeholder="Month" />
        <button onClick={fetchEntries}>Buscar lançamentos</button>
      </div>

      <div>
        <label>Lançamento: </label>
        <select value={selectedEntry} onChange={e=>setSelectedEntry(e.target.value)}>
          <option value="">-- selecione --</option>
          {entries.map(en => <option key={en.id} value={en.id}>{en.description} — {en.amount}</option>)}
        </select>
        <button onClick={handlePay}>Marcar como pago</button>
      </div>
    </div>
  )
}
