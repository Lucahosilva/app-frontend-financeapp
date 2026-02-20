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


  async function fetchAccountsAndCategories(){
    if(!costCenterId) return
    try{
      const [accs, cats] = await Promise.all([
        api.getAccounts(),
        api.getCategories()
      ])
      setAccounts(accs || [])
      setCategories(cats || [])
    }catch(e){ console.error('Erro ao buscar contas/categorias', e) }
  }

  useEffect(() => {
    fetchAccountsAndCategories()
  }, [costCenterId])

  async function fetchTransactions(){
    if(!costCenterId) return setTransactions([])
    setLoading(true)
    try{
      const data = await api.getTransactions({ cost_center_id: costCenterId })
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


      <h3>Nova Transação</h3>
      <form onSubmit={handleCreate}>
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
            {accounts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
          <select value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
            <option value="">-- categoria (opcional) --</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </fieldset>


        <button type="submit">Criar transação</button>
      </form>

      <ul>
        {transactions.map(t=> <li key={t.id}>{t.description} — {t.amount} — {t.date}</li>)}
      </ul>
    </div>
  )
}
