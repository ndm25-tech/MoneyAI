import DashboardLayout from '../components/layout/DashboardLayout'
import { Settings as SettingsIcon } from 'lucide-react'

function Settings() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <SettingsIcon className="w-8 h-8 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Einstellungen</h1>
        <p className="text-gray-500">Coming soon – hier passt du dein Konto an.</p>
      </div>
    </DashboardLayout>
  )
}

export default Settings
