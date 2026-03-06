import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function CostCenters() {
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')

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
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('create')} 
          style={{ 
            marginRight: '10px', 
            backgroundColor: activeTab === 'create' ? 'var(--accent-blue)' : 'var(--primary-light)',
            color: activeTab === 'create' ? 'white' : 'var(--text-primary)'
          }}
        >
          Criar Centro de Custo
        </button>
        <button 
          onClick={() => setActiveTab('list')} 
          style={{ 
            backgroundColor: activeTab === 'list' ? 'var(--accent-blue)' : 'var(--primary-light)',
            color: activeTab === 'list' ? 'white' : 'var(--text-primary)'
          }}
        >
          Listar Centros de Custo
        </button>
      </div>

      {activeTab === 'create' && (
        <>
          <h3>Novo Centro de Custo</h3>
      <form onSubmit={handleCreate}>
        <fieldset>
          <legend>Novo Centro de Custo</legend>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do centro de custo" required />
          <button type="submit">Criar</button>
        </fieldset>
      </form>
        </>
      )}

      {activeTab === 'list' && (
        <>
          <h3>Lista de Centros de Custo</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : costCenters.length === 0 ? (
            <p>Nenhum centro de custo encontrado.</p>
          ) : (
            <ul>
              {costCenters.map(h => <li key={h._id || h.id}>{h.name}</li>)}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
