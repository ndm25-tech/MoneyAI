// ─── Contract billing cycles ─────────────────────────────────────────────────

export const BILLING_CYCLES = [
  { value: 'monthly',      label: 'Monatlich',       monthsPerCycle: 1  },
  { value: 'quarterly',    label: 'Quartalsweise',   monthsPerCycle: 3  },
  { value: 'semiannually', label: 'Halbjährlich',    monthsPerCycle: 6  },
  { value: 'yearly',       label: 'Jährlich',        monthsPerCycle: 12 },
]

const CYCLE_MONTHS = Object.fromEntries(
  BILLING_CYCLES.map((c) => [c.value, c.monthsPerCycle]),
)

const CYCLE_LABEL = Object.fromEntries(
  BILLING_CYCLES.map((c) => [c.value, c.label]),
)

export function getCycleLabel(cycle) {
  return CYCLE_LABEL[cycle] || cycle
}

// ─── Contract categories ─────────────────────────────────────────────────────

export const CONTRACT_CATEGORIES = [
  { value: 'Streaming',     color: 'purple' },
  { value: 'Versicherung',  color: 'blue'   },
  { value: 'Handy',         color: 'teal'   },
  { value: 'Internet',      color: 'orange' },
  { value: 'Strom',         color: 'yellow' },
  { value: 'Miete',         color: 'green'  },
  { value: 'Fitness',       color: 'pink'   },
  { value: 'Software',      color: 'gray'   },
  { value: 'Sonstiges',     color: 'gray'   },
]

// ─── Contract status ─────────────────────────────────────────────────────────

export const CONTRACT_STATUSES = [
  { value: 'active',    label: 'Aktiv'      },
  { value: 'cancelled', label: 'Gekündigt'  },
  { value: 'paused',    label: 'Pausiert'   },
]

// ─── Cost calculations ───────────────────────────────────────────────────────

/**
 * Normalisiert einen Vertragsbetrag auf Monatskosten.
 *   calculateMonthlyCost(17.99, 'monthly')     -> 17.99
 *   calculateMonthlyCost(112, 'quarterly')     -> 37.33
 *   calculateMonthlyCost(600, 'yearly')        -> 50.00
 */
export function calculateMonthlyCost(amount, cycle) {
  const value = Number(amount) || 0
  const months = CYCLE_MONTHS[cycle] || 1
  return value / months
}

/**
 * Berechnet die Jahreskosten eines Vertrags.
 *   calculateYearlyCost(17.99, 'monthly')  -> 215.88
 *   calculateYearlyCost(112,   'quarterly')-> 448.00
 *   calculateYearlyCost(600,   'yearly')   -> 600.00
 */
export function calculateYearlyCost(amount, cycle) {
  const value = Number(amount) || 0
  const months = CYCLE_MONTHS[cycle] || 1
  return (value / months) * 12
}

// ─── Date helpers ────────────────────────────────────────────────────────────

/**
 * Berechnet Tage bis zur nächsten Fälligkeit.
 * Negative Werte = überfällig.
 */
export function getDaysUntilDue(nextDueDate) {
  if (!nextDueDate) return null
  const due = new Date(nextDueDate)
  if (isNaN(due.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diffMs = due.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Berechnet die nächste Fälligkeit ausgehend von Start-Datum und Rhythmus,
 * indem so lange addiert wird, bis das Datum in der Zukunft liegt.
 */
export function calculateNextDueDate(startDate, cycle) {
  if (!startDate) return null
  const start = new Date(startDate)
  if (isNaN(start.getTime())) return null
  const months = CYCLE_MONTHS[cycle] || 1
  const next = new Date(start)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  while (next.getTime() < today.getTime()) {
    next.setMonth(next.getMonth() + months)
  }
  return next.toISOString().slice(0, 10)
}

/**
 * Prüft, ob ein Vertrag in den nächsten `withinDays` Tagen fällig wird.
 */
export function isDueSoon(nextDueDate, withinDays = 30) {
  const days = getDaysUntilDue(nextDueDate)
  if (days === null) return false
  return days >= 0 && days <= withinDays
}
