import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Search, AlertTriangle, FileText } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { formatMoney, formatDate } from '../utils/format'
import { useContracts } from '../context/ContractContext'
import { useSettings } from '../context/SettingsContext'
import {
  BILLING_CYCLES,
  CONTRACT_CATEGORIES,
  CONTRACT_STATUSES,
  calculateMonthlyCost,
  calculateNextDueDate,
  getCycleLabel,
  getDaysUntilDue,
} from '../utils/contracts'

// ─── Options for selects ─────────────────────────────────────────────────────

const CATEGORY_COLOR = Object.fromEntries(
  CONTRACT_CATEGORIES.map((c) => [c.value, c.color]),
)

const CATEGORY_OPTIONS = [
  { value: '', label: '— Kategorie wählen —' },
  ...CONTRACT_CATEGORIES.map((c) => ({ value: c.value, label: c.value })),
]

const CYCLE_OPTIONS = BILLING_CYCLES.map((c) => ({ value: c.value, label: c.label }))

const STATUS_OPTIONS = CONTRACT_STATUSES.map((s) => ({ value: s.value, label: s.label }))

const STATUS_COLOR = {
  active: 'green',
  paused: 'yellow',
  cancelled: 'gray',
}

const STATUS_LABEL = Object.fromEntries(
  CONTRACT_STATUSES.map((s) => [s.value, s.label]),
)

const FILTER_OPTIONS = [
  { value: 'all', label: 'Alle' },
  { value: 'active', label: 'Aktiv' },
  { value: 'paused', label: 'Pausiert' },
  { value: 'cancelled', label: 'Gekündigt' },
]

// ─── Empty form state ────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  provider: '',
  category: '',
  amount: '',
  cycle: 'monthly',
  startDate: '',
  nextDueDate: '',
  cancellationPeriod: '',
  cancellationDate: '',
  status: 'active',
  note: '',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDueLabel(days) {
  if (days === null) return '—'
  if (days < 0) return `${Math.abs(days)} Tage überfällig`
  if (days === 0) return 'Heute fällig'
  if (days === 1) return 'Morgen fällig'
  return `In ${days} Tagen`
}

function dueColor(days) {
  if (days === null) return 'text-gray-400'
  if (days < 0) return 'text-red-600 font-semibold'
  if (days <= 7) return 'text-red-600 font-semibold'
  if (days <= 30) return 'text-orange-600'
  return 'text-gray-500'
}

// ─── Component ───────────────────────────────────────────────────────────────

function Contracts() {
  const {
    contracts,
    addContract,
    updateContract,
    deleteContract,
    activeCount,
    totalMonthly,
    totalYearly,
    upcomingDueContracts,
    upcomingDueCount,
  } = useContracts()
  const { settings } = useSettings()
  const currency = settings.currency

  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [deleteId, setDeleteId] = useState(null)

  // ── Filtered & sorted list ─────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return contracts
      .filter((c) => statusFilter === 'all' || c.status === statusFilter)
      .filter((c) => {
        if (search.trim() === '') return true
        const q = search.toLowerCase()
        return (
          c.name?.toLowerCase().includes(q) ||
          c.provider?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        // Aktive zuerst, dann nach nächster Fälligkeit
        if (a.status !== b.status) {
          if (a.status === 'active') return -1
          if (b.status === 'active') return 1
        }
        const da = a.nextDueDate ? new Date(a.nextDueDate).getTime() : Infinity
        const db = b.nextDueDate ? new Date(b.nextDueDate).getTime() : Infinity
        return da - db
      })
  }, [contracts, statusFilter, search])

  // ── Handlers ───────────────────────────────────────────────────────────────

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  function openEdit(contract) {
    setEditingId(contract.id)
    setForm({
      name: contract.name ?? '',
      provider: contract.provider ?? '',
      category: contract.category ?? '',
      amount: String(contract.amount ?? ''),
      cycle: contract.cycle ?? 'monthly',
      startDate: contract.startDate ?? '',
      nextDueDate: contract.nextDueDate ?? '',
      cancellationPeriod: contract.cancellationPeriod ?? '',
      cancellationDate: contract.cancellationDate ?? '',
      status: contract.status ?? 'active',
      note: contract.note ?? '',
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
    if (!form.name.trim()) errors.name = 'Bitte einen Namen eingeben.'
    if (!form.category) errors.category = 'Bitte eine Kategorie wählen.'
    if (!form.amount || isNaN(Number(form.amount.replace(',', '.'))) || Number(form.amount.replace(',', '.')) <= 0)
      errors.amount = 'Bitte einen gültigen Betrag eingeben.'
    if (!form.cycle) errors.cycle = 'Bitte einen Rhythmus wählen.'
    if (!form.startDate) errors.startDate = 'Bitte ein Startdatum wählen.'
    return errors
  }

  function handleSave() {
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    // nextDueDate automatisch berechnen, wenn leer
    const nextDueDate =
      form.nextDueDate?.trim() ||
      calculateNextDueDate(form.startDate, form.cycle) ||
      form.startDate

    const entry = {
      name: form.name.trim(),
      provider: form.provider.trim(),
      category: form.category,
      amount: parseFloat(form.amount.replace(',', '.')),
      cycle: form.cycle,
      startDate: form.startDate,
      nextDueDate,
      cancellationPeriod: form.cancellationPeriod.trim(),
      cancellationDate: form.cancellationDate || '',
      status: form.status,
      note: form.note.trim(),
    }
    if (editingId) {
      updateContract(editingId, entry)
    } else {
      addContract(entry)
    }
    closeModal()
  }

  function handleDelete(id) {
    deleteContract(id)
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verträge</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              Behalte deine laufenden Verträge und Abos im Überblick.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-400 transition-all"
            >
              {FILTER_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <Button onClick={openAdd} size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Neuer Vertrag
            </Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-xs text-gray-500 dark:text-gray-400">Aktive Verträge</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{activeCount}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 dark:text-gray-400">Monatskosten</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {formatMoney(totalMonthly, currency)}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 dark:text-gray-400">Jahreskosten</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {formatMoney(totalYearly, currency)}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 dark:text-gray-400">Bald fällig</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{upcomingDueCount}</p>
          </Card>
        </div>

        {/* Upcoming-due banner */}
        {upcomingDueCount > 0 && (
          <Card className="border-l-4 border-orange-400 bg-orange-50 dark:bg-orange-900/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-orange-900 dark:text-orange-200">
                  {upcomingDueCount === 1
                    ? '1 Vertrag wird in den nächsten 30 Tagen fällig'
                    : `${upcomingDueCount} Verträge werden in den nächsten 30 Tagen fällig`}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-orange-800 dark:text-orange-300">
                  {upcomingDueContracts.slice(0, 3).map((c) => {
                    const days = getDaysUntilDue(c.nextDueDate)
                    return (
                      <li key={c.id}>
                        <span className="font-medium">{c.name}</span>
                        {' — '}
                        {formatDueLabel(days)}
                        {c.nextDueDate && ` (${formatDate(c.nextDueDate)})`}
                      </li>
                    )
                  })}
                  {upcomingDueContracts.length > 3 && (
                    <li className="text-orange-700 dark:text-orange-400">
                      …und {upcomingDueContracts.length - 3} weitere.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Search bar */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Suche nach Name, Anbieter…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-400 transition-all"
          />
        </div>

        {/* Contracts table */}
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategorie</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rhythmus</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Betrag</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Monatlich</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nächste Fälligkeit</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-400">
                      {contracts.length === 0 ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <p className="text-gray-500">Noch keine Verträge angelegt.</p>
                          <Button onClick={openAdd} size="sm">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Ersten Vertrag anlegen
                          </Button>
                        </div>
                      ) : (
                        'Keine Verträge gefunden.'
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map((contract) => {
                    const days = getDaysUntilDue(contract.nextDueDate)
                    const monthly = calculateMonthlyCost(contract.amount, contract.cycle)
                    return (
                      <tr
                        key={contract.id}
                        className="border-b border-gray-50 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-gray-100">
                          {contract.name}
                          {contract.provider && (
                            <span className="block text-xs text-gray-400 font-normal">
                              {contract.provider}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            text={contract.category}
                            color={CATEGORY_COLOR[contract.category] ?? 'gray'}
                          />
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                          {getCycleLabel(contract.cycle)}
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          {formatMoney(contract.amount, currency)}
                        </td>
                        <td className="px-5 py-3.5 text-right text-gray-500 whitespace-nowrap">
                          {formatMoney(monthly, currency)}
                        </td>
                        <td className={`px-5 py-3.5 whitespace-nowrap ${dueColor(days)}`}>
                          {contract.nextDueDate ? (
                            <>
                              <span>{formatDate(contract.nextDueDate)}</span>
                              <span className="block text-xs">{formatDueLabel(days)}</span>
                            </>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            text={STATUS_LABEL[contract.status] ?? contract.status}
                            color={STATUS_COLOR[contract.status] ?? 'gray'}
                          />
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEdit(contract)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                              aria-label="Bearbeiten"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(contract.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              aria-label="Löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
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
        title={editingId ? 'Vertrag bearbeiten' : 'Neuen Vertrag hinzufügen'}
      >
        <div className="space-y-4">
          <Input
            label="Name"
            id="ct-name"
            type="text"
            placeholder="z.B. Netflix Premium"
            value={form.name}
            onChange={(e) => handleField('name', e.target.value)}
            error={formErrors.name}
          />

          <Input
            label="Anbieter (optional)"
            id="ct-provider"
            type="text"
            placeholder="z.B. Netflix Inc."
            value={form.provider}
            onChange={(e) => handleField('provider', e.target.value)}
          />

          <Select
            label="Kategorie"
            id="ct-category"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(e) => handleField('category', e.target.value)}
            error={formErrors.category}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Betrag"
              id="ct-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => handleField('amount', e.target.value)}
              error={formErrors.amount}
            />
            <Select
              label="Rhythmus"
              id="ct-cycle"
              options={CYCLE_OPTIONS}
              value={form.cycle}
              onChange={(e) => handleField('cycle', e.target.value)}
              error={formErrors.cycle}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Startdatum"
              id="ct-start"
              type="date"
              value={form.startDate}
              onChange={(e) => handleField('startDate', e.target.value)}
              error={formErrors.startDate}
            />
            <Input
              label="Nächste Fälligkeit"
              id="ct-next"
              type="date"
              value={form.nextDueDate}
              onChange={(e) => handleField('nextDueDate', e.target.value)}
              helpText="Wird sonst automatisch berechnet"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Kündigungsfrist (optional)"
              id="ct-cancel-period"
              type="text"
              placeholder="z.B. 1 Monat zum Monatsende"
              value={form.cancellationPeriod}
              onChange={(e) => handleField('cancellationPeriod', e.target.value)}
            />
            <Input
              label="Kündbar bis (optional)"
              id="ct-cancel-date"
              type="date"
              value={form.cancellationDate}
              onChange={(e) => handleField('cancellationDate', e.target.value)}
            />
          </div>

          <Select
            label="Status"
            id="ct-status"
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={(e) => handleField('status', e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="ct-note" className="text-sm font-medium text-gray-700">
              Notiz <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="ct-note"
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
        title="Vertrag löschen"
      >
        <p className="text-gray-600 mb-6">
          Bist du sicher, dass du diesen Vertrag löschen möchtest? Diese Aktion kann nicht
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

export default Contracts
