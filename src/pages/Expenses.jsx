import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { formatEuro, formatDate } from '../utils/format'

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'Miete', color: 'blue' },
  { value: 'Lebensmittel', color: 'green' },
  { value: 'Transport', color: 'orange' },
  { value: 'Unterhaltung', color: 'purple' },
  { value: 'Shopping', color: 'yellow' },
  { value: 'Gesundheit', color: 'teal' },
  { value: 'Bildung', color: 'pink' },
  { value: 'Versicherung', color: 'gray' },
  { value: 'Sonstiges', color: 'gray' },
]

const CATEGORY_COLOR = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.color]))

const CATEGORY_OPTIONS = [
  { value: '', label: '— Kategorie wählen —' },
  ...CATEGORIES.map((c) => ({ value: c.value, label: c.value })),
]

// ─── Month selector ────────────────────────────────────────────────────────────

const MONTHS = [
  { value: '2026-04', label: 'April 2026' },
  { value: '2026-03', label: 'März 2026' },
  { value: '2026-02', label: 'Februar 2026' },
  { value: '2026-01', label: 'Januar 2026' },
  { value: '2025-12', label: 'Dezember 2025' },
]

// ─── Mock Data ────────────────────────────────────────────────────────────────

let _nextId = 100

function makeId() {
  return ++_nextId
}

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

// ─── Empty form state ─────────────────────────────────────────────────────────

const EMPTY_FORM = { description: '', amount: '', category: '', date: '', note: '' }

// ─── Component ────────────────────────────────────────────────────────────────

function Expenses() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES)
  const [selectedMonth, setSelectedMonth] = useState('2026-04')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [deleteId, setDeleteId] = useState(null)

  // ── Filtered & sorted list ─────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => e.date.startsWith(selectedMonth))
      .filter(
        (e) =>
          search.trim() === '' ||
          e.description.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [expenses, selectedMonth, search])

  // ── Summary stats for selected month ──────────────────────────────────────

  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(selectedMonth)),
    [expenses, selectedMonth]
  )

  const total = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const count = monthExpenses.length
  const highest = monthExpenses.reduce(
    (max, e) => (e.amount > (max?.amount ?? 0) ? e : max),
    null
  )
  const [year, month] = selectedMonth.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const avgPerDay = count > 0 ? total / daysInMonth : 0

  // ── Handlers ───────────────────────────────────────────────────────────────

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  function openEdit(expense) {
    setEditingId(expense.id)
    setForm({
      description: expense.description,
      amount: String(expense.amount),
      category: expense.category,
      date: expense.date,
      note: expense.note ?? '',
    })
    setFormErrors({})
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
  }

  function validate() {
    const errors = {}
    if (!form.description.trim()) errors.description = 'Bitte Beschreibung eingeben.'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errors.amount = 'Bitte einen gültigen Betrag eingeben.'
    if (!form.category) errors.category = 'Bitte eine Kategorie wählen.'
    if (!form.date) errors.date = 'Bitte ein Datum wählen.'
    return errors
  }

  function handleSave() {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    const entry = {
      id: editingId ?? makeId(),
      date: form.date,
      description: form.description.trim(),
      category: form.category,
      amount: parseFloat(form.amount.replace(',', '.')),
      note: form.note.trim(),
    }
    if (editingId) {
      setExpenses((prev) => prev.map((e) => (e.id === editingId ? entry : e)))
    } else {
      setExpenses((prev) => [entry, ...prev])
    }
    closeModal()
  }

  function handleDelete(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    setDeleteId(null)
  }

  function handleField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ausgaben</h1>
            <p className="text-gray-500 mt-0.5">Verwalte deine Ausgaben</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-400 transition-all"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <Button onClick={openAdd} size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Neue Ausgabe
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-gray-500 mb-1">Gesamtausgaben</p>
            <p className="text-2xl font-bold text-red-600">{formatEuro(total)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 mb-1">Transaktionen</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 mb-1">Höchste Ausgabe</p>
            {highest ? (
              <>
                <p className="text-2xl font-bold text-gray-900">{formatEuro(highest.amount)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{highest.description}</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-300">—</p>
            )}
          </Card>
          <Card>
            <p className="text-sm text-gray-500 mb-1">Ø pro Tag</p>
            <p className="text-2xl font-bold text-gray-900">{formatEuro(avgPerDay)}</p>
          </Card>
        </div>

        {/* Search bar */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Suche nach Beschreibung…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-400 transition-all"
          />
        </div>

        {/* Transactions table */}
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Datum</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Beschreibung</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategorie</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Betrag</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      Keine Ausgaben gefunden.
                    </td>
                  </tr>
                ) : (
                  filtered.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {expense.description}
                        {expense.note && (
                          <span className="block text-xs text-gray-400 font-normal">
                            {expense.note}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          text={expense.category}
                          color={CATEGORY_COLOR[expense.category] ?? 'gray'}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-red-600 whitespace-nowrap">
                        {formatEuro(expense.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(expense)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            aria-label="Bearbeiten"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(expense.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Ausgabe bearbeiten' : 'Neue Ausgabe hinzufügen'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Betrag (€)"
              id="exp-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => handleField('amount', e.target.value)}
              error={formErrors.amount}
            />
            <Input
              label="Datum"
              id="exp-date"
              type="date"
              value={form.date}
              onChange={(e) => handleField('date', e.target.value)}
              error={formErrors.date}
            />
          </div>

          <Input
            label="Beschreibung"
            id="exp-desc"
            type="text"
            placeholder="z.B. REWE Einkauf"
            value={form.description}
            onChange={(e) => handleField('description', e.target.value)}
            error={formErrors.description}
          />

          <Select
            label="Kategorie"
            id="exp-category"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(e) => handleField('category', e.target.value)}
            error={formErrors.category}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="exp-note" className="text-sm font-medium text-gray-700">
              Notiz <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="exp-note"
              rows={3}
              placeholder="Zusätzliche Notizen…"
              value={form.note}
              onChange={(e) => handleField('note', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-400 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} fullWidth>
              Speichern
            </Button>
            <Button variant="outline" onClick={closeModal} fullWidth>
              Abbrechen
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Ausgabe löschen"
      >
        <p className="text-gray-600 mb-6">
          Bist du sicher, dass du diese Ausgabe löschen möchtest? Diese Aktion kann nicht
          rückgängig gemacht werden.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => handleDelete(deleteId)} fullWidth>
            Löschen
          </Button>
          <Button variant="outline" onClick={() => setDeleteId(null)} fullWidth>
            Abbrechen
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default Expenses
