import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Transactions(){
  const [transactions, setTransactions] = useState<any[]>([])
  const [costCenters, setCostCenters] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const [costCenterId, setCostCenterId] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [flowType, setFlowType] = useState<'income'|'expense'>('expense')
  const [transactionType, setTransactionType] = useState<'single'|'installment'|'recurring'>('single')
  const [paymentMethodType, setPaymentMethodType] = useState<'cash'|'debit'|'credit_card'|'pix'>('cash')
  const [closingDay, setClosingDay] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [accountId, setAccountId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [installments, setInstallments] = useState('')
  const [totalAmount, setTotalAmount] = useState('')
  const [splitType, setSplitType] = useState('')
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create')


  async function fetchAccountsAndCategories(){
    try{
      const [accs, cats] = await Promise.all([
        api.getAccounts(costCenterId ? { cost_center_id: costCenterId } : undefined),
        api.getCategories(costCenterId ? { cost_center_id: costCenterId } : undefined)
      ])
      setAccounts(accs || [])
      setCategories(cats || [])
    }catch(e){ console.error('Erro ao buscar contas/categorias', e) }
  }

  async function fetchAllAccountsAndCategories(){
    try{
      const [accs, cats] = await Promise.all([
        api.getAccounts(),
        api.getCategories()
      ])
      setAccounts(accs || [])
      setCategories(cats || [])
    }catch(e){ console.error('Erro ao buscar todas as contas/categorias', e) }
  }

  useEffect(() => {
    if(activeTab === 'create') {
      fetchAccountsAndCategories()
    } else if(activeTab === 'list') {
      fetchAllAccountsAndCategories()
    }
  }, [costCenterId, activeTab])


  useEffect(() => {
    (async () => {
      try{
        const data = await api.getCostCenters()
        setCostCenters(data || [])
      }catch(e){ console.error('Erro ao buscar centros de custo', e) }
    })()
  }, [])

  useEffect(() => {
    if(activeTab === 'list') {
      fetchTransactions(false) // Buscar todas as transações na aba de listagem
    } else {
      fetchTransactions(true) // Manter filtro por cost_center na aba de criação
    }
  }, [activeTab, costCenterId])

  async function fetchTransactions(filterCostCenter: boolean = true){
    if(filterCostCenter && !costCenterId) return setTransactions([])
    setLoading(true)
    try{
      const params = filterCostCenter && costCenterId ? { cost_center_id: costCenterId } : undefined
      const data = await api.getTransactions(params)
      setTransactions(data || [])
    }catch(e){ alert(String(e)) }
    finally{ setLoading(false) }
  }

  async function handleCreate(e: React.FormEvent){
    e.preventDefault()
    if(!costCenterId){ alert('Escolha um centro de custo'); return }
    try{
      const total_amount_value = transactionType === 'installment' ? Number(totalAmount) : Number(amount)
      const payload: any = {
        description,
        total_amount: total_amount_value,
        flow_type: flowType,
        transaction_type: transactionType,
        payment_method: {
          type: paymentMethodType,
          closing_day: closingDay ? Number(closingDay) : null,
          due_day: dueDay ? Number(dueDay) : null
        },
        date: transactionDate,
        account_id: accountId || null,
        category_id: categoryId || null,
        cost_center_id: costCenterId,
        split_type: splitType || null,
      }
      if(transactionType === 'installment'){
        payload.installments = Number(installments)
      }
      const res = await api.createTransaction(payload)
      alert(res.message || 'Criado')
      setDescription(''); setAmount(''); setAccountId(''); setCategoryId(''); setInstallments(''); setTotalAmount(''); setSplitType('')
      fetchTransactions()
    }catch(err){ alert(String(err)) }
  }

  return (
    <div>
      <h2>Transactions</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('create')} 
          style={{ 
            marginRight: '10px', 
            backgroundColor: activeTab === 'create' ? 'var(--accent-blue)' : 'var(--primary-light)',
            color: activeTab === 'create' ? 'white' : 'var(--text-primary)'
          }}
        >
          Criar Transação
        </button>
        <button 
          onClick={() => setActiveTab('list')} 
          style={{ 
            backgroundColor: activeTab === 'list' ? 'var(--accent-blue)' : 'var(--primary-light)',
            color: activeTab === 'list' ? 'white' : 'var(--text-primary)'
          }}
        >
          Listar Transações
        </button>
      </div>

      {activeTab === 'create' && (
        <>
          <h3>Nova Transação</h3>
          <form onSubmit={handleCreate}>
        <fieldset>
          <legend>Centro de Custo</legend>
          <select value={costCenterId} onChange={e=>setCostCenterId(e.target.value)} required>
            <option value="">-- centro de custo --</option>
            {costCenters.map(cc => <option key={cc._id || cc.id} value={cc._id || cc.id}>{cc.name}</option>)}
          </select>
        </fieldset>

        <fieldset>
          <legend>Dados Básicos</legend>
          <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descrição" required />
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Valor" type="number" step="0.01" required />
          <select value={flowType} onChange={e=>setFlowType(e.target.value as any)} required>
            <option value="">-- tipo de fluxo --</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input type="date" value={transactionDate} onChange={e=>setTransactionDate(e.target.value)} required />
        </fieldset>

        <fieldset>
          <legend>Tipo de Transação</legend>
          <select value={transactionType} onChange={e=>setTransactionType(e.target.value as any)}>
            <option value="single">Single</option>
            <option value="installment">Installment</option>
            <option value="recurring">Recurring</option>
          </select>
          {transactionType === 'installment' && (
            <>
              <input value={installments} onChange={e=>setInstallments(e.target.value)} placeholder="Número de parcelas" type="number" />
              <input value={totalAmount} onChange={e=>setTotalAmount(e.target.value)} placeholder="Valor total" type="number" step="0.01" />
            </>
          )}
        </fieldset>

        <fieldset>
          <legend>Forma de Pagamento</legend>
          <select value={paymentMethodType} onChange={e=>setPaymentMethodType(e.target.value as any)}>
            <option value="cash">Cash</option>
            <option value="debit">Debit</option>
            <option value="credit_card">Credit Card</option>
            <option value="pix">PIX</option>
          </select>
          {(paymentMethodType === 'credit_card' || paymentMethodType === 'debit') && (
            <>
              <input value={closingDay} onChange={e=>setClosingDay(e.target.value)} placeholder="Closing day (opcional)" type="number" />
              <input value={dueDay} onChange={e=>setDueDay(e.target.value)} placeholder="Due day (opcional)" type="number" />
            </>
          )}
        </fieldset>

        <fieldset>
          <legend>Referências</legend>
          <select value={accountId} onChange={e=>setAccountId(e.target.value)}>
            <option value="">-- conta (opcional) --</option>
            {accounts.map(a => <option key={a._id || a.id} value={a._id || a.id}>{a.name}</option>)}
          </select>
          <select value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
            <option value="">-- categoria (opcional) --</option>
            {categories.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
          </select>
        </fieldset>


        <button type="submit">Criar transação</button>
      </form>
        </>
      )}

      {activeTab === 'list' && (
        <>
          <h3>Lista de Transações</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : transactions.length === 0 ? (
            <p>Nenhuma transação encontrada.</p>
          ) : (
            <ul>
              {transactions.map(t => (
                <li key={t._id || t.id}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>{t.description}</strong> — R$ {Number(t.amount).toFixed(2)} — {new Date(t.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Tipo: {t.flow_type} | Método: {t.payment_method?.type || 'N/A'} | 
                    Conta: {accounts.find(a => a._id === t.account_id)?.name || 'N/A'} | 
                    Categoria: {categories.find(c => c._id === t.category_id)?.name || 'N/A'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
