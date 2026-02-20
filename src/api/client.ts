const BASE = 'http://localhost:8000'

async function request(path: string, options: RequestInit = {}) {
  const url = `${BASE}${path}`
  try {
    console.log('[api] request', url, options)
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })

    console.log('[api] response status', res.status, url)

    if (!res.ok) {
      const text = await res.text()
      console.error('[api] error response', res.status, text)
      throw new Error(text || res.statusText)
    }
    if (res.status === 204) return null
    const data = await res.json()
    console.log('[api] response json', url, data)
    return data
  } catch (err: any) {
    console.error('[api] fetch failed', url, err && err.message ? err.message : err)
    throw err
  }
}

export const api = {
  // Cost Centers
  getCostCenters: () => request('/cost-centers/'),
  createCostCenter: (payload: any) => request('/cost-centers/', { method: 'POST', body: JSON.stringify(payload) }),

  // Households
  getHouseholds: () => request('/households/'),
  createHousehold: (payload: any) => request('/households/', { method: 'POST', body: JSON.stringify(payload) }),

  // Users
  getUsers: (params?: Record<string,string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/users/${q}`)
  },
  createUser: (payload: any) => request('/users/', { method: 'POST', body: JSON.stringify(payload) }),

  // Categories
  getCategories: (params?: Record<string,string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/categories/${q}`)
  },
  createCategory: (payload: any) => request('/categories/', { method: 'POST', body: JSON.stringify(payload) }),

  // Accounts
  getAccounts: () => {
    return request(`/accounts/`)
  },
  createAccount: (payload: any) => request('/accounts/', { method: 'POST', body: JSON.stringify(payload) }),
  getAccount: (account_id: string) => request(`/accounts/${account_id}`),

  // Delete multiple transactions
  deleteTransactions: (filter: any) => request('/transactions/', { method: 'DELETE', body: JSON.stringify(filter) }),

  // Transactions
  getTransactions: (params?: Record<string,string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/transactions/${q}`)
  },
  createTransaction: (payload: any) => request('/transactions/', { method: 'POST', body: JSON.stringify(payload) }),

  // Transactions entries by month
  getEntriesByMonth: (year: number, month: number, params?: Record<string,string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/transactions/entries/month/${year}/${month}${q}`)
  },

  // Card statement
  getCardStatement: (account_id: string, year: number, month: number, cost_center_id: string) => {
    const q = cost_center_id ? `?cost_center_id=${encodeURIComponent(cost_center_id)}` : ''
    return request(`/transactions/entries/card/${account_id}/${year}/${month}${q}`)
  },

  // Mark entry as paid
  payEntry: (entry_id: string) => request(`/transactions/entries/${entry_id}/pay`, { method: 'PATCH' }),
}

export default api
