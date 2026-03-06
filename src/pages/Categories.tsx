import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Categories(){
  const [categories, setCategories] = useState<any[]>([])
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [name, setName] = useState('')
  const [type, setType] = useState<'income'|'expense'>('expense')
  const [costCenterId, setCostCenterId] = useState('')
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ 
    fetchCostCenters()
    fetchCategories() 
  }, [])

  async function fetchCostCenters(){
    try{ const data = await api.getCostCenters(); setCostCenters(data || []) }catch(e){ console.error(e) }
  }

  async function fetchCategories(){
    setLoading(true)
    try{ const data = await api.getCategories(); setCategories(data || []) }catch(e){ alert(String(e)) }
    finally{ setLoading(false) }
  }

  async function handleCreate(e: React.FormEvent){
    e.preventDefault()
    if(!costCenterId){ alert('Escolha um centro de custo'); return }
    try{
      const payload = { name, type, cost_center_id: costCenterId }
      const res = await api.createCategory(payload)
      alert(res.message || 'Criado')
      setName(''); setCostCenterId('')
      fetchCategories()
    }catch(err){ alert(String(err)) }
  }

  return (
    <div>
      <h2>Categories</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('create')} 
          style={{ 
            marginRight: '10px', 
            backgroundColor: activeTab === 'create' ? 'var(--accent-blue)' : 'var(--primary-light)',
            color: activeTab === 'create' ? 'white' : 'var(--text-primary)'
          }}
        >
          Criar Categoria
        </button>
        <button 
          onClick={() => setActiveTab('list')} 
          style={{ 
            backgroundColor: activeTab === 'list' ? 'var(--accent-blue)' : 'var(--primary-light)',
            color: activeTab === 'list' ? 'white' : 'var(--text-primary)'
          }}
        >
          Listar Categorias
        </button>
      </div>

      {activeTab === 'create' && (
        <>
          <h3>Nova Categoria</h3>
      <form onSubmit={handleCreate}>
        <fieldset>
          <legend>Nova Categoria</legend>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome" required />
          <select value={type} onChange={e=>setType(e.target.value as any)} required>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select value={costCenterId} onChange={e=>setCostCenterId(e.target.value)} required>
            <option value="">-- selecione centro de custo --</option>
            {costCenters.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </fieldset>
        <button type="submit">Criar</button>
      </form>
        </>
      )}

      {activeTab === 'list' && (
        <>
          <h3>Lista de Categorias</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : categories.length === 0 ? (
            <p>Nenhuma categoria encontrada.</p>
          ) : (
            <ul>
              {categories.map(c=> <li key={c._id}>{c.name} ({c.type})</li>)}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
