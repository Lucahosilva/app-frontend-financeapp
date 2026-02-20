import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [costCenterId, setCostCenterId] = useState('')

  useEffect(() => { 
    fetchCostCenters()
    fetchUsers() 
  }, [])

  async function fetchCostCenters() {
    try {
      const data = await api.getCostCenters()
      setCostCenters(data || [])
      if(data?.length > 0) setCostCenterId(data[0]._id)
    } catch (e) { alert(String(e)) }
  }

  async function fetchUsers() {
    try {
      const data = await api.getUsers()
      setUsers(data || [])
    } catch (e) { alert(String(e)) }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if(!name || !email || !password || !costCenterId){ alert('Preencha todos os campos'); return }
    try {
      const res = await api.createUser({ name, email, password, cost_center_id: costCenterId })
      alert(res.message || 'Criado')
      setName(''); setEmail(''); setPassword('')
      fetchUsers()
    } catch (err) { alert(String(err)) }
  }

  return (
    <div>
      <h2>Users</h2>
      <form onSubmit={handleCreate}>
        <fieldset>
          <legend>Centro de Custo</legend>
          <select value={costCenterId} onChange={e => setCostCenterId(e.target.value)} required>
            <option value="">Selecione um centro de custo</option>
            {costCenters.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </fieldset>
        <fieldset>
          <legend>Dados Pessoais</legend>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" required />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" type="password" required />
        </fieldset>
        <button type="submit">Criar</button>
      </form>
      <ul>
        {users.map(u => <li key={u._id || u.id}>{u.name} — {u.email}</li>)}
      </ul>
    </div>
  )
}
