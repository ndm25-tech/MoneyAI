import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  Plus,
  ArrowRight,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import { useAuth } from '../context/AuthContext'
import { useTransactions } from '../context/TransactionContext'
import { formatEuro } from '../utils/format'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EXPENSE_CATEGORIES = [
  { label: 'Miete', amount: 800, color: 'bg-blue-500' },
  { label: 'Lebensmittel', amount: 350, color: 'bg-green-500' },
  { label: 'Shopping', amount: 200, color: 'bg-yellow-500' },
  { label: 'Transport', amount: 180, color: 'bg-orange-500' },
  { label: 'Unterhaltung', amount: 150, color: 'bg-purple-500' },
  { label: 'Sonstiges', amount: 167.5, color: 'bg-gray-400' },
]

const MONTHLY_DATA = [
  { month: 'Nov', income: 3100, expenses: 1950 },
  { month: 'Dez', income: 3100, expenses: 2300 },
  { month: 'Jan', income: 3250, expenses: 1800 },
  { month: 'Feb', income: 3250, expenses: 1700 },
  { month: 'Mär', income: 3250, expenses: 1900 },
  { month: 'Apr', income: 3250, expenses: 1847.5 },
]

const BUDGET = { total: 2000, spent: 1847.5}

// ─── Constants ────────────────────────────────────────────────────────────────

const AFTERNOON_START = 12
const EVENING_START = 18
// Maximum Y-axis value for the monthly chart (€4,000 covers all data with headroom)
const MONTHLY_CHART_MAX = 4000

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < AFTERNOON_START) return 'Guten Morgen'
  if (hour < EVENING_START) return 'Guten Tag'
  return 'Guten Abend'
}

function getCurrentDate() {
  return new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OverviewCard({ title, value, subtitle, icon: Icon, iconBg, iconColor, borderColor, trend }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card border border-gray-100 p-6 border-l-4 ${borderColor} hover:shadow-card-hover transition-shadow duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
      {trend && (
        <p className="text-sm text-gray-500">
          {trend}
        </p>
      )}
      {subtitle && !trend && (
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  )
}

function CategoryBars() {
  const total = EXPENSE_CATEGORIES.reduce((s, c) => s + c.amount, 0)
  if (total === 0) return null
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 mb-5">Ausgaben nach Kategorie</h2>
      <div className="space-y-4">
        {EXPENSE_CATEGORIES.map((cat) => {
          const pct = Math.round((cat.amount / total) * 100)
          return (
            <div key={cat.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{cat.label}</span>
                <span className="text-gray-500">
                  {formatEuro(cat.amount)}{' '}
                  <span className="text-gray-400">({pct}%)</span>
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function MonthlyChart() {
  const MAX_Y = MONTHLY_CHART_MAX
  return (
    <Card>
      <h2 className="text-lg font-bold text-gray-900 mb-5">Monatsübersicht</h2>
      <div className="flex items-end gap-3 h-48">
        {/* Y-axis label */}
        <div className="flex flex-col justify-between h-full text-xs text-gray-400 text-right w-10 flex-shrink-0 pb-6">
          <span>€4.000</span>
          <span>€3.000</span>
          <span>€2.000</span>
          <span>€1.000</span>
          <span>€0</span>
        </div>

        {/* Bars */}
        <div className="flex-1 flex items-end gap-2 h-full">
          {MONTHLY_DATA.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full flex items-end gap-0.5 justify-center" style={{ height: '80%' }}>
                {/* Income bar */}
                <div
                  className="flex-1 bg-green-400 rounded-t-sm transition-all duration-500"
                  style={{ height: `${(m.income / MAX_Y) * 100}%` }}
                  title={`Einnahmen: ${formatEuro(m.income)}`}
                />
                {/* Expense bar */}
                <div
                  className="flex-1 bg-red-400 rounded-t-sm transition-all duration-500"
                  style={{ height: `${(m.expenses / MAX_Y) * 100}%` }}
                  title={`Ausgaben: ${formatEuro(m.expenses)}`}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">{m.month}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> Einnahmen
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> Ausgaben
        </span>
      </div>
    </Card>
  )
}

function TransactionRow({ tx }) {
  const isPositive = tx.amount > 0
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-0">
      <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">{tx.date}</td>
      <td className="py-3 px-4 text-sm font-medium text-gray-900">{tx.description}</td>
      <td className="py-3 px-4">
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {tx.category}
        </span>
      </td>
      <td className={`py-3 px-4 text-sm font-bold text-right whitespace-nowrap ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{formatEuro(tx.amount)}
      </td>
    </tr>
  )
}

function TransactionCard({ tx }) {
  const isPositive = tx.amount > 0
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{tx.description}</span>
        <span className="text-xs text-gray-400">{tx.date} · {tx.category}</span>
      </div>
      <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{formatEuro(tx.amount)}
      </span>
    </div>
  )
}

function BudgetProgress() {
  const pct = Math.round((BUDGET.spent / BUDGET.total) * 100)
  const remaining = BUDGET.total - BUDGET.spent
  const barColor = pct >= 95 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-green-500'

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Budget diesen Monat</h2>
        <span className="text-sm text-gray-500">
          {formatEuro(BUDGET.spent)} / {formatEuro(BUDGET.total)}
        </span>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-500 mb-3">
        <span>Ausgegeben: <span className="font-semibold text-gray-800">{formatEuro(BUDGET.spent)}</span> ({pct}%)</span>
        <span>Verbleibend: <span className="font-semibold text-gray-800">{formatEuro(remaining)}</span></span>
      </div>

      {pct >= 80 && (
        <div className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl ${pct >= 95 ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
          <span>⚠️</span>
          <span>Du hast {pct}% deines Budgets erreicht!</span>
        </div>
      )}
    </Card>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function Dashboard() {
  const { user } = useAuth()
  const { expenses, income, totalExpenses, totalIncome, balance, savingsRate } = useTransactions()
  const username = user?.name || 'Nutzer'

  // ── Combined last transactions (expenses + income), sorted by date desc, max 7
  const recentTransactions = useMemo(() => {
    const expenseRows = expenses.map((e) => ({
      id: `e-${e.id}`,
      date: e.date,
      description: e.description,
      category: e.category,
      amount: -e.amount,
    }))
    const incomeRows = income.map((i) => ({
      id: `i-${i.id}`,
      date: i.date,
      description: i.description,
      category: i.category,
      amount: i.amount,
    }))
    return [...expenseRows, ...incomeRows]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7)
      .map((tx) => {
        const [, month, day] = tx.date.split('-')
        return { ...tx, date: `${day}.${month}` }
      })
  }, [expenses, income])

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* 1. Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {username}! 👋
          </h1>
          <p className="text-gray-500 mt-1">{getCurrentDate()}</p>
          <p className="text-sm text-gray-400">Hier ist dein finanzieller Überblick</p>
        </div>

        {/* 2. Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <OverviewCard
            title="Einnahmen"
            value={formatEuro(totalIncome)}
            trend="+12% vs. letzter Monat"
            icon={TrendingUp}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            borderColor="border-green-500"
          />
          <OverviewCard
            title="Ausgaben"
            value={formatEuro(totalExpenses)}
            trend="-5% vs. letzter Monat"
            icon={TrendingDown}
            iconBg="bg-red-100"
            iconColor="text-red-600"
            borderColor="border-red-500"
          />
          <OverviewCard
            title="Bilanz"
            value={formatEuro(balance)}
            subtitle="Einnahmen − Ausgaben"
            icon={Wallet}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            borderColor="border-blue-500"
          />
          <OverviewCard
            title="Sparquote"
            value={`${savingsRate.toFixed(1)}%`}
            subtitle="diesen Monat"
            icon={Target}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            borderColor="border-purple-500"
          />
        </div>

        {/* 3. Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryBars />
          <MonthlyChart />
        </div>

        {/* 4. Transactions */}
        <Card padding={false}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Letzte Transaktionen</h2>
            <Link
              to="/expenses"
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Alle anzeigen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-4">Datum</th>
                  <th className="py-3 px-4">Beschreibung</th>
                  <th className="py-3 px-4">Kategorie</th>
                  <th className="py-3 px-4 text-right">Betrag</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <TransactionRow key={tx.id} tx={tx} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden px-6 py-2">
            {recentTransactions.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </div>
        </Card>

        {/* 5. Budget progress */}
        <BudgetProgress />

        {/* 6. Quick actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/expenses"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Ausgabe hinzufügen
          </Link>
          <Link
            to="/income"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Einnahme hinzufügen
          </Link>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default Dashboard
