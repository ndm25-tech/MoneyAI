import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const SETTINGS_STORAGE_KEY = 'moneyai_settings'

const DEFAULT_SETTINGS = {
  currency: 'EUR',
  language: 'de',
  monthlyBudget: 2000,
  weekStart: 'monday',
  notif: {
    budgetWarning: true,
    weeklyReport: false,
    aiTips: true,
    updates: true,
  },
  compactView: false,
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return DEFAULT_SETTINGS
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notif: { ...DEFAULT_SETTINGS.notif, ...(parsed.notif || {}) },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSettings())

  const refreshSettings = useCallback(() => {
    setSettings(loadSettings())
  }, [])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === SETTINGS_STORAGE_KEY) refreshSettings()
    }
    const onCustom = () => refreshSettings()

    window.addEventListener('storage', onStorage)
    window.addEventListener('moneyai:settings-changed', onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('moneyai:settings-changed', onCustom)
    }
  }, [refreshSettings])

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return ctx
}
