import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { calculateMonthlyCost, calculateYearlyCost, isDueSoon } from '../utils/contracts'

const ContractContext = createContext(null)

const CONTRACTS_STORAGE_KEY = 'fyniq_contracts'

// ─── Storage helpers ─────────────────────────────────────────────────────────

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

// ─── ID generator ────────────────────────────────────────────────────────────

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

// ─── Initial empty state ─────────────────────────────────────────────────────
// PR-A: leer starten. Mock-Daten und Auto-Detection kommen in späteren PRs.

const INITIAL_CONTRACTS = []

// ─── Provider ────────────────────────────────────────────────────────────────

export function ContractProvider({ children }) {
  const [contracts, setContracts] = useState(() =>
    loadFromStorage(CONTRACTS_STORAGE_KEY, INITIAL_CONTRACTS),
  )

  const addContract = (contract) =>
    setContracts((prev) => [{ ...contract, id: generateId() }, ...prev])

  const updateContract = (id, updated) =>
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)))

  const deleteContract = (id) =>
    setContracts((prev) => prev.filter((c) => c.id !== id))

  useEffect(() => {
    try {
      localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts))
    } catch {
      // ignore quota / private mode errors
    }
  }, [contracts])

  const totals = useMemo(() => {
    const activeContracts = contracts.filter((c) => c.status === 'active')
    const totalMonthly = activeContracts.reduce(
      (sum, c) => sum + calculateMonthlyCost(c.amount, c.cycle),
      0,
    )
    const totalYearly = activeContracts.reduce(
      (sum, c) => sum + calculateYearlyCost(c.amount, c.cycle),
      0,
    )
    const upcomingDueContracts = activeContracts.filter((c) => isDueSoon(c.nextDueDate, 30))
    return {
      activeCount: activeContracts.length,
      totalMonthly,
      totalYearly,
      upcomingDueContracts,
      upcomingDueCount: upcomingDueContracts.length,
    }
  }, [contracts])

  return (
    <ContractContext.Provider
      value={{
        contracts,
        addContract,
        updateContract,
        deleteContract,
        ...totals,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useContracts() {
  const ctx = useContext(ContractContext)
  if (!ctx) {
    throw new Error('useContracts must be used within a ContractProvider')
  }
  return ctx
}

export default ContractContext
