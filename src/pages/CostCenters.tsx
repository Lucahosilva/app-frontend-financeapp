import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function CostCenters() {
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchCostCenters() }, [])

  async function fetchCostCenters() {
    setLoading(true)
    try {
      const data = await api.getCostCenters()
      setCostCenters(data || [])
    } catch (e) {
      alert(String(e))
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
    } catch (err) { alert(String(err)) }
  }

  return (
    <div>
      <h2>Centros de Custo</h2>
      <form onSubmit={handleCreate}>
        <fieldset>
          <legend>Novo Centro de Custo</legend>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do centro de custo" required />
          <button type="submit">Criar</button>
        </fieldset>
      </form>
      {loading ? <p>Carregando...</p> : (
        <ul>
          {costCenters.map(h => <li key={h._id || h.id}>{h.name} ({h._id || h.cost_center_id})</li>)}
        </ul>
      )}
    </div>
  )
}
