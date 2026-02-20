import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Accounts(){
  const [accounts, setAccounts] = useState<any[]>([])
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState<'checking'|'savings'|'credit_card'>('checking')
  const [initialBalance, setInitialBalance] = useState('0')
  const [closingDay, setClosingDay] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [costCenterId, setCostCenterId] = useState('')

  useEffect(()=>{ 
    fetchAccounts() 
  }, [])


  async function fetchAccounts(){
    try{ const data = await api.getAccounts(); setAccounts(data || []) }catch(e){ alert(String(e)) }
  }

  async function handleCreate(e: React.FormEvent){
    e.preventDefault()
    if(!costCenterId){ alert('Escolha um centro de custo'); return }
    try{
      const payload = { name, type, initial_balance: Number(initialBalance), cost_center_id: costCenterId, closing_day: closingDay ? Number(closingDay) : null, due_day: dueDay ? Number(dueDay) : null }
      const res = await api.createAccount(payload)
      alert(res.message || 'Criado')
      setName(''); setInitialBalance('0'); setClosingDay(''); setDueDay(''); setCostCenterId('')
      fetchAccounts()
    }catch(err){ alert(String(err)) }
  }

  return (
    <div>
      <h2>Accounts</h2>
      <form onSubmit={handleCreate}>
        <fieldset>
          <legend>Dados Básicos</legend>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" required />
          <select value={type} onChange={e=>setType(e.target.value as any)} required>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit_card">Credit Card</option>
          </select>
          <input value={initialBalance} onChange={e=>setInitialBalance(e.target.value)} placeholder="Saldo inicial" type="number" step="0.01" required />
        </fieldset>
        {(type === 'credit_card' || type === 'checking') && (
          <fieldset>
            <legend>Datas (opcional)</legend>
            <input value={closingDay} onChange={e=>setClosingDay(e.target.value)} placeholder="Dia de fechamento" type="number" />
            <input value={dueDay} onChange={e=>setDueDay(e.target.value)} placeholder="Dia de vencimento" type="number" />
          </fieldset>
        )}
        <fieldset>
          <legend>Centro de Custo</legend>
          <select value={costCenterId} onChange={e=>setCostCenterId(e.target.value)} required>
            <option value="">-- selecione --</option>
            {costCenters.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </fieldset>
        <button type="submit">Criar</button>
      </form>
      <ul>
        {accounts.map(a=> <li key={a._id}>{a.name} ({a.type}) — {a.current_balance ?? a.initial_balance}</li>)}
      </ul>
    </div>
  )
}
