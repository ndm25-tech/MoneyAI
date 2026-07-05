import { FileText } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import { useContracts } from '../context/ContractContext'
import { useSettings } from '../context/SettingsContext'
import { formatMoney } from '../utils/format'

function Contracts() {
  const { contracts, activeCount, totalMonthly, totalYearly, upcomingDueCount } = useContracts()
  const { settings } = useSettings()
  const currency = settings.currency

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verträge</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Behalte deine laufenden Verträge und Abos im Überblick.
          </p>
        </div>

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

        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {contracts.length === 0
                ? 'Noch keine Verträge angelegt'
                : `${contracts.length} Verträge gespeichert`}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md">
              Die vollständige Vertragsverwaltung mit Hinzufügen, Bearbeiten und
              Filtern folgt im nächsten Schritt.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default Contracts
