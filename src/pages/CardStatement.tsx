import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function CardStatement(){
  const [accountId, setAccountId] = useState('')
  const [costCenterId, setCostCenterId] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [month, setMonth] = useState(String(new Date().getMonth()+1))
  const [statement, setStatement] = useState<any | null>(null)
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])

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
    try{
      const data = await api.getCardStatement(accountId, Number(year), Number(month), costCenterId)
      setStatement(data)
    }catch(e){ alert(String(e)) }
  }

  return (
    <div>
      <h2>Card Statement</h2>
      <div>
        <label>Centro de custo: </label>
        <select value={costCenterId} onChange={e=>setCostCenterId(e.target.value)}>
          <option value="">-- selecione --</option>
          {costCenters.map(h => <option key={h._id || h.id} value={h._id || h.id}>{h.name}</option>)}
        </select>
        <label>Conta: </label>
        <select value={accountId} onChange={e=>setAccountId(e.target.value)}>
          <option value="">-- selecione --</option>
          {accounts.map(a => <option key={a._id || a.id} value={a._id || a.id}>{a.name}</option>)}
        </select>
        <input value={year} onChange={e=>setYear(e.target.value)} placeholder="Year" />
        <input value={month} onChange={e=>setMonth(e.target.value)} placeholder="Month" />
        <button onClick={fetchStatement}>Buscar</button>
      </div>
      {statement && (
        <div>
          <p>Competence: {statement.competence_month}</p>
          <p>Total: {statement.total}</p>
          <ul>
            {statement.entries.map((e:any)=> <li key={e.id}>{e.description} — {e.amount}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}
