import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { formatEuro, formatDate, getYearMonthKey, getMonthLabel } from '../utils/format'
import { useTransactions } from '../context/TransactionContext'

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'Gehalt',        color: 'green'  },
  { value: 'Freelance',     color: 'blue'   },
  { value: 'Investitionen', color: 'purple' },
  { value: 'Geschenk',      color: 'pink'   },
  { value: 'Nebenjob',      color: 'orange' },
  { value: 'Sonstiges',     color: 'gray'   },
]

const CATEGORY_COLOR = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.color]))

const CATEGORY_OPTIONS = [
  { value: '', label: '— Kategorie wählen —' },
  ...CATEGORIES.map((c) => ({ value: c.value, label: c.value })),
]

// ─── Month selector ────────────────────────────────────────────────────────────

const MONTHS = Array.from({ length: 5 }, (_, i) => ({
  value: getYearMonthKey(-i),
  label: getMonthLabel(-i),
}))

// ─── Mock Data ────────────────────────────────────────────────────────────────

let _nextId = 200

function makeId() {
  return ++_nextId
}

// ─── Empty form state ─────────────────────────────────────────────────────────

const EMPTY_FORM = { description: '', amount: '', category: '', date: '', note: '' }

// ─── Component ────────────────────────────────────────────────────────────────

function Income() {
  const { income, addIncome, updateIncome, deleteIncome } = useTransactions()
  const [selectedMonth, setSelectedMonth] = useState(getYearMonthKey)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [deleteId, setDeleteId] = useState(null)

  // ── Filtered & sorted list ─────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return income
      .filter((e) => e.date.startsWith(selectedMonth))
      .filter(
        (e) =>
          search.trim() === '' ||
          e.description.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [income, selectedMonth, search])

  // ── Summary stats for selected month ──────────────────────────────────────

  const monthIncome = useMemo(
    () => income.filter((e) => e.date.startsWith(selectedMonth)),
    [income, selectedMonth]
  )

  const total = monthIncome.reduce((s, e) => s + e.amount, 0)
  const count = monthIncome.length
  const highest = monthIncome.reduce(
    (max, e) => (e.amount > (max?.amount ?? 0) ? e : max),
    null
  )
  const mainShare =
    total > 0 && highest ? ((highest.amount / total) * 100).toFixed(1) : null

  // ── Handlers ───────────────────────────────────────────────────────────────

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  function openEdit(entry) {
    setEditingId(entry.id)
    setForm({
      description: entry.description,
      amount: String(entry.amount),
      category: entry.category,
      date: entry.date,
      note: entry.note ?? '',
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
      updateIncome(editingId, entry)
    } else {
      addIncome(entry)
    }
    closeModal()
  }

  function handleDelete(id) {
    deleteIncome(id)
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
            <h1 className="text-2xl font-bold text-gray-900">Einnahmen</h1>
            <p className="text-gray-500 mt-0.5">Verwalte deine Einnahmen</p>
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
              Neue Einnahme
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-gray-500 mb-1">Gesamteinnahmen</p>
            <p className="text-2xl font-bold text-green-600">{formatEuro(total)}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 mb-1">Quellen</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 mb-1">Haupteinnahme</p>
            {highest ? (
              <>
                <p className="text-2xl font-bold text-gray-900">{highest.category}</p>
                <p className="text-xs text-gray-400 mt-0.5">{mainShare}% des Gesamts</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-300">—</p>
            )}
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
                      Keine Einnahmen gefunden.
                    </td>
                  </tr>
                ) : (
                  filtered.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {entry.description}
                        {entry.note && (
                          <span className="block text-xs text-gray-400 font-normal">
                            {entry.note}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          text={entry.category}
                          color={CATEGORY_COLOR[entry.category] ?? 'gray'}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-green-600 whitespace-nowrap">
                        {formatEuro(entry.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(entry)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            aria-label="Bearbeiten"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(entry.id)}
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
        title={editingId ? 'Einnahme bearbeiten' : 'Neue Einnahme hinzufügen'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Betrag (€)"
              id="inc-amount"
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
              id="inc-date"
              type="date"
              value={form.date}
              onChange={(e) => handleField('date', e.target.value)}
              error={formErrors.date}
            />
          </div>

          <Input
            label="Beschreibung"
            id="inc-desc"
            type="text"
            placeholder="z.B. Gehalt April"
            value={form.description}
            onChange={(e) => handleField('description', e.target.value)}
            error={formErrors.description}
          />

          <Select
            label="Kategorie"
            id="inc-category"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(e) => handleField('category', e.target.value)}
            error={formErrors.category}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="inc-note" className="text-sm font-medium text-gray-700">
              Notiz <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="inc-note"
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
        title="Einnahme löschen"
      >
        <p className="text-gray-600 mb-6">
          Bist du sicher, dass du diese Einnahme löschen möchtest? Diese Aktion kann nicht
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

export default Income
