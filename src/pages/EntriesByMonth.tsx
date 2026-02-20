import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function EntriesByMonth(){
  const [entries, setEntries] = useState<any[]>([])
  const [costCenterId, setCostCenterId] = useState('')
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())
  const [month, setMonth] = useState<string>((new Date().getMonth()+1).toString())
  const [costCenters, setCostCenters] = useState<any[]>([])

  useEffect(()=>{ fetchCostCenters() }, [])

  async function fetchCostCenters(){
    try{ const data = await api.getCostCenters(); setCostCenters(data || []); if((data||[]).length>0) setCostCenterId((data||[])[0]._id || (data||[])[0].id) }catch(e){ console.error(e) }
  }

  async function fetchEntries(){
    if(!costCenterId) return setEntries([])
    try{
      const data = await api.getEntriesByMonth(Number(year), Number(month), { cost_center_id: costCenterId })
      setEntries(data || [])
    }catch(e){ alert(String(e)) }
  }

  return (
    <div>
      <h2>Entries By Month</h2>
      <div>
        <label>Centro de custo: </label>
        <select value={costCenterId} onChange={e=>setCostCenterId(e.target.value)}>
          <option value="">-- selecione --</option>
          {costCenters.map(h => <option key={h._id || h.id} value={h._id || h.id}>{h.name}</option>)}
        </select>
        <input value={year} onChange={e=>setYear(e.target.value)} placeholder="Year" />
        <input value={month} onChange={e=>setMonth(e.target.value)} placeholder="Month" />
        <button onClick={fetchEntries}>Buscar</button>
      </div>
      <ul>
        {entries.map(en=> <li key={en.id}>{en.description} — {en.competence_month} — {en.amount}</li>)}
      </ul>
    </div>
  )
}
