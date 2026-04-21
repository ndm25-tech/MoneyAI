import { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, Lightbulb, Download } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import { formatEuro, getYearMonthKey, getMonthLabel, isSameMonth } from '../utils/format'
import { useTransactions } from '../context/TransactionContext'

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = Array.from({ length: 6 }, (_, i) => ({
  value: getYearMonthKey(-i),
  label: getMonthLabel(-i),
}))

const EXPENSE_CATEGORY_COLORS = {
  Miete: 'bg-blue-500',
  Lebensmittel: 'bg-green-500',
  Shopping: 'bg-purple-500',
  Transport: 'bg-orange-500',
  Unterhaltung: 'bg-pink-500',
  Gesundheit: 'bg-red-400',
  Bildung: 'bg-indigo-500',
  Versicherung: 'bg-cyan-500',
}

const INCOME_CATEGORY_COLORS = {
  Gehalt: 'bg-green-600',
  Freelance: 'bg-teal-500',
  Investitionen: 'bg-blue-500',
  Nebenjob: 'bg-orange-500',
  Geschenk: 'bg-pink-500',
}

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
  const [selectedMonth, setSelectedMonth] = useState(getYearMonthKey)
  const { expenses, income, totalExpenses, totalIncome, balance } = useTransactions()

  // Expenses aggregated by category
  const expensesByCategory = useMemo(() => {
    const map = new Map()
    for (const expense of expenses) {
      map.set(expense.category, (map.get(expense.category) || 0) + Number(expense.amount || 0))
    }
    return Array.from(map.entries())
      .map(([category, total]) => ({
        label: category,
        amount: total,
        color: EXPENSE_CATEGORY_COLORS[category] || 'bg-gray-400',
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [expenses])

  // Income aggregated by source/category
  const incomeBySource = useMemo(() => {
    const map = new Map()
    for (const incomeItem of income) {
      map.set(incomeItem.category, (map.get(incomeItem.category) || 0) + Number(incomeItem.amount || 0))
    }
    return Array.from(map.entries())
      .map(([category, total]) => ({
        label: category,
        amount: total,
        color: INCOME_CATEGORY_COLORS[category] || 'bg-gray-400',
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [income])

  // Last 6 months trend
  const monthlyTrend = useMemo(() => {
    const months = []
    for (let offset = 5; offset >= 0; offset--) {
      const expensesSum = expenses
        .filter(expense => isSameMonth(expense.date, -offset))
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
      const incomeSum = income
        .filter(incomeItem => isSameMonth(incomeItem.date, -offset))
        .reduce((sum, incomeItem) => sum + Number(incomeItem.amount || 0), 0)
      months.push({
        label: getMonthLabel(-offset),
        expenses: expensesSum,
        income: incomeSum,
        savings: incomeSum - expensesSum,
      })
    }
    return months
  }, [expenses, income])

  // Empty state — no crash, no NaN
  if (expenses.length === 0 && income.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Berichte &amp; Analysen</h1>
            <p className="text-gray-500 mt-2">
              Noch keine Daten vorhanden. Füge Ausgaben oder Einnahmen hinzu, um Berichte zu sehen.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

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
            <p className="text-2xl font-bold text-green-600">{formatEuro(totalIncome)}</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm font-medium text-gray-500">Ausgaben</p>
            </div>
            <p className="text-2xl font-bold text-red-500">{formatEuro(totalExpenses)}</p>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">€</span>
              </div>
              <p className="text-sm font-medium text-gray-500">Bilanz</p>
            </div>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
              {balance >= 0 ? '+' : ''}{formatEuro(balance)}
            </p>
          </Card>
        </div>

        {/* Section 2: Expenses by category */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-5">Ausgaben nach Kategorie</h2>
          <div className="space-y-4">
            {expensesByCategory.map((cat) => (
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
            {incomeBySource.map((src) => (
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
                {monthlyTrend.map((row, idx) => {
                  const savingsRate = row.income > 0 ? Math.round((row.savings / row.income) * 100) : 0
                  const prevRow = monthlyTrend[idx - 1]
                  const trendUp = prevRow ? row.savings > prevRow.savings : null
                  const isCurrentMonth = idx === monthlyTrend.length - 1
                  return (
                    <tr
                      key={row.label}
                      className={`border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${isCurrentMonth ? 'bg-primary-50/40' : ''}`}
                    >
                      <td className="px-5 py-3.5 font-semibold text-gray-800">
                        {row.label}
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
                        {row.savings >= 0 ? '+' : ''}{formatEuro(row.savings)}
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
