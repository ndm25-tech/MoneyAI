import { createContext, useContext, useState, useMemo, useEffect } from 'react'

const TransactionContext = createContext(null)

const EXPENSES_STORAGE_KEY = 'moneyai_expenses'
const INCOME_STORAGE_KEY = 'moneyai_income'

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return fallback
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

// ─── Mock initial data (moved from Expenses.jsx and Income.jsx) ───────────────

const INITIAL_EXPENSES = [
  { id: 1,  date: '2026-04-01', description: 'Miete April',         category: 'Miete',         amount: 800.00, note: 'Monatliche Miete' },
  { id: 2,  date: '2026-04-02', description: 'REWE Einkauf',        category: 'Lebensmittel',  amount: 87.45,  note: '' },
  { id: 3,  date: '2026-04-03', description: 'BVG Monatskarte',     category: 'Transport',     amount: 86.00,  note: 'April Ticket' },
  { id: 4,  date: '2026-04-05', description: 'Netflix',             category: 'Unterhaltung',  amount: 17.99,  note: '' },
  { id: 5,  date: '2026-04-07', description: 'Lidl Wocheneinkauf',  category: 'Lebensmittel',  amount: 63.20,  note: '' },
  { id: 6,  date: '2026-04-09', description: 'Zara Jacke',          category: 'Shopping',      amount: 89.99,  note: 'Frühlingsjacke' },
  { id: 7,  date: '2026-04-10', description: 'Zahnarzt',            category: 'Gesundheit',    amount: 45.00,  note: 'Routineuntersuchung' },
  { id: 8,  date: '2026-04-12', description: 'Udemy Kurs',          category: 'Bildung',       amount: 19.99,  note: 'React Kurs' },
  { id: 9,  date: '2026-04-14', description: 'KFZ-Versicherung',    category: 'Versicherung',  amount: 112.00, note: 'Quartalsrate' },
  { id: 10, date: '2026-04-15', description: 'Rossmann',            category: 'Lebensmittel',  amount: 34.70,  note: '' },
  { id: 11, date: '2026-04-16', description: 'Spotify',             category: 'Unterhaltung',  amount: 9.99,   note: '' },
  { id: 12, date: '2026-04-17', description: 'Tank (Benzin)',       category: 'Transport',     amount: 72.50,  note: '' },
  { id: 13, date: '2026-04-18', description: 'Amazon Bestellung',   category: 'Shopping',      amount: 54.99,  note: 'Bücherpakete' },
  { id: 14, date: '2026-04-20', description: 'ALDI Wocheneinkauf',  category: 'Lebensmittel',  amount: 52.10,  note: '' },
  { id: 15, date: '2026-04-22', description: 'Kino',                category: 'Unterhaltung',  amount: 15.60,  note: 'Avengers' },
]

const INITIAL_INCOME = [
  { id: 1, date: '2026-04-01', description: 'Gehalt April',       category: 'Gehalt',        amount: 3250.00, note: 'Netto-Gehalt' },
  { id: 2, date: '2026-04-05', description: 'Freelance Projekt',  category: 'Freelance',     amount: 500.00,  note: 'Website für Kunde Schmidt' },
  { id: 3, date: '2026-04-10', description: 'Dividenden',         category: 'Investitionen', amount: 45.00,   note: 'ETF Ausschüttung' },
  { id: 4, date: '2026-04-15', description: 'Nebenjob Samstag',   category: 'Nebenjob',      amount: 200.00,  note: 'Barkeeper' },
  { id: 5, date: '2026-04-20', description: 'Rückerstattung',     category: 'Sonstiges',     amount: 35.00,   note: 'Krankenkasse' },
]

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TransactionProvider({ children }) {
  const [expenses, setExpenses] = useState(() => loadFromStorage(EXPENSES_STORAGE_KEY, INITIAL_EXPENSES))
  const [income, setIncome] = useState(() => loadFromStorage(INCOME_STORAGE_KEY, INITIAL_INCOME))

  const addExpense = (expense) => setExpenses((prev) => [expense, ...prev])
  const updateExpense = (id, updated) =>
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)))
  const deleteExpense = (id) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id))

  const addIncome = (entry) => setIncome((prev) => [entry, ...prev])
  const updateIncome = (id, updated) =>
    setIncome((prev) => prev.map((i) => (i.id === id ? { ...i, ...updated } : i)))
  const deleteIncome = (id) =>
    setIncome((prev) => prev.filter((i) => i.id !== id))

  useEffect(() => {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses))
    } catch {
      // ignore quota / private mode errors
    }
  }, [expenses])

  useEffect(() => {
    try {
      localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(income))
    } catch {
      // ignore quota / private mode errors
    }
  }, [income])

  const totals = useMemo(() => {
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
    const totalIncome = income.reduce((sum, i) => sum + Number(i.amount || 0), 0)
    const balance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0
    return { totalExpenses, totalIncome, balance, savingsRate }
  }, [expenses, income])

  return (
    <TransactionContext.Provider
      value={{
        expenses,
        income,
        addExpense,
        updateExpense,
        deleteExpense,
        addIncome,
        updateIncome,
        deleteIncome,
        ...totals,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionContext)
  if (!ctx) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return ctx
}

export default TransactionContext
