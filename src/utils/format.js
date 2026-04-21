export function formatEuro(amount) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const MONTH_NAMES_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

/**
 * Gibt z.B. "April 2026" für das aktuelle Datum zurück.
 * Optional: offset in Monaten (negativ = Vergangenheit).
 */
export function getMonthLabel(offset = 0) {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + offset)
  return `${MONTH_NAMES_DE[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Gibt das aktuelle Jahr-Monat als ISO-ähnlichen String zurück: "2026-04"
 * Optional: offset in Monaten.
 */
export function getYearMonthKey(offset = 0) {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() + offset)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Prüft, ob ein Datum (ISO-String oder Date) im selben Monat wie offset liegt.
 */
export function isSameMonth(dateInput, offset = 0) {
  if (!dateInput) return false
  const d = new Date(dateInput)
  if (isNaN(d.getTime())) return false
  const ref = new Date()
  ref.setDate(1)
  ref.setMonth(ref.getMonth() + offset)
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth()
}
