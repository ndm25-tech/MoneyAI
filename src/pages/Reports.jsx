import { useState } from 'react'
import { TrendingUp, TrendingDown, Lightbulb, Download } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import { formatEuro } from '../utils/format'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MONTHS = [
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'März 2026' },
  { value: '2026-02', label: 'Februar 2026' },
  { value: '2026-01', label: 'Januar 2026' },
  { value: '2025-12', label: 'Dezember 2025' },
  { value: '2025-11', label: 'November 2025' },
]

const OVERVIEW = {
  income: 4030.0,
  expenses: 1847.5,
  balance: 2182.5,
}

const EXPENSE_CATEGORIES = [
  { label: 'Miete', amount: 800, color: 'bg-blue-500' },
  { label: 'Lebensmittel', amount: 350, color: 'bg-green-500' },
  { label: 'Shopping', amount: 200, color: 'bg-purple-500' },
  { label: 'Transport', amount: 180, color: 'bg-orange-500' },
  { label: 'Unterhaltung', amount: 150, color: 'bg-pink-500' },
  { label: 'Sonstiges', amount: 167.5, color: 'bg-gray-400' },
]

const INCOME_SOURCES = [
  { label: 'Gehalt', amount: 3250, color: 'bg-green-600' },
  { label: 'Freelance', amount: 500, color: 'bg-teal-500' },
  { label: 'Sonstiges', amount: 280, color: 'bg-gray-400' },
]

const MONTHLY_HISTORY = [
  { month: 'Nov', income: 3250, expenses: 1980, savings: 1270 },
  { month: 'Dez', income: 3750, expenses: 2450, savings: 1300 },
  { month: 'Jan', income: 3250, expenses: 1760, savings: 1490 },
  { month: 'Feb', income: 3500, expenses: 1650, savings: 1850 },
  { month: 'Mär', income: 3250, expenses: 1920, savings: 1330 },
  { month: 'Apr', income: 4030, expenses: 1847.5, savings: 2182.5 },
]

const AI_TIPS = [
  {
    emoji: '💡',
    text: 'Du gibst 19% für Lebensmittel aus. Der Durchschnitt liegt bei 14%. Tipp: Meal-Prep kann €80/Monat sparen.',
  },
  {
    emoji: '💡',
    text: 'Deine Sparquote von 43% ist überdurchschnittlich! Weiter so!',
  },
  {
    emoji: '💡',
    text: 'Shopping-Ausgaben sind um 15% gestiegen. Nutze die 48h-Regel.',
  },
]

// ─── HorizontalBar ────────────────────────────────────────────────────────────

function HorizontalBar({ label, amount, total, color }) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {formatEuro(amount)} <span className="text-gray-400">({pct}%)</span>
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

function Reports() {
  const [selectedMonth, setSelectedMonth] = useState('2026-04')

  const totalExpenses = EXPENSE_CATEGORIES.reduce((s, c) => s + c.amount, 0)
  const totalIncome = INCOME_SOURCES.reduce((s, c) => s + c.amount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Berichte &amp; Analysen</h1>
            <p className="text-gray-500 mt-0.5">Detaillierte Auswertung deiner Finanzen</p>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-400 transition-all self-start sm:self-auto"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Section 1: Monthly overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Einnahmen</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatEuro(OVERVIEW.income)}</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm font-medium text-gray-500">Ausgaben</p>
            </div>
            <p className="text-2xl font-bold text-red-500">{formatEuro(OVERVIEW.expenses)}</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">€</span>
              </div>
              <p className="text-sm font-medium text-gray-500">Bilanz</p>
            </div>
            <p className={`text-2xl font-bold ${OVERVIEW.balance >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
              {OVERVIEW.balance >= 0 ? '+' : ''}{formatEuro(OVERVIEW.balance)}
            </p>
          </Card>
        </div>

        {/* Section 2: Expenses by category */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-5">Ausgaben nach Kategorie</h2>
          <div className="space-y-4">
            {EXPENSE_CATEGORIES.map((cat) => (
              <HorizontalBar
                key={cat.label}
                label={cat.label}
                amount={cat.amount}
                total={totalExpenses}
                color={cat.color}
              />
            ))}
          </div>
        </Card>

        {/* Section 3: Income by source */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-5">Einnahmen nach Quelle</h2>
          <div className="space-y-4">
            {INCOME_SOURCES.map((src) => (
              <HorizontalBar
                key={src.label}
                label={src.label}
                amount={src.amount}
                total={totalIncome}
                color={src.color}
              />
            ))}
          </div>
        </Card>

        {/* Section 4: 6-month comparison */}
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Monatsvergleich (6 Monate)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Monat</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Einnahmen</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ausgaben</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Bilanz</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Sparquote</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_HISTORY.map((row, idx) => {
                  const savingsRate = row.income > 0 ? Math.round((row.savings / row.income) * 100) : 0
                  const prevRow = MONTHLY_HISTORY[idx - 1]
                  const trendUp = prevRow ? row.savings > prevRow.savings : null
                  const isCurrentMonth = idx === MONTHLY_HISTORY.length - 1
                  return (
                    <tr
                      key={row.month}
                      className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${isCurrentMonth ? 'bg-primary-50/40' : ''}`}
                    >
                      <td className="px-5 py-3.5 font-semibold text-gray-800">
                        {row.month}
                        {isCurrentMonth && (
                          <span className="ml-2 text-xs text-primary-600 font-medium">(aktuell)</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right text-green-600 font-medium">
                        {formatEuro(row.income)}
                      </td>
                      <td className="px-5 py-3.5 text-right text-red-500 font-medium">
                        {formatEuro(row.expenses)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-blue-600">
                        +{formatEuro(row.savings)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-semibold text-gray-800">{savingsRate}%</span>
                          {trendUp === true && <span className="text-green-500 text-base">↑</span>}
                          {trendUp === false && <span className="text-red-400 text-base">↓</span>}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section 5: AI savings tips */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900">KI-Spar-Tipps</h2>
          </div>
          <div className="space-y-3">
            {AI_TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <span className="text-lg flex-shrink-0">{tip.emoji}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Section 6: Export */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Bericht exportieren</h2>
          <div className="flex flex-wrap gap-3">
            <div className="relative group">
              <button
                disabled
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-400 text-sm font-semibold cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Als PDF exportieren
              </button>
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Coming soon
              </span>
            </div>
            <div className="relative group">
              <button
                disabled
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-400 text-sm font-semibold cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Als CSV exportieren
              </button>
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Coming soon
              </span>
            </div>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  )
}

export default Reports
