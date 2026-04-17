import DashboardLayout from '../components/layout/DashboardLayout'
import { BarChart3 } from 'lucide-react'

function Reports() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
          <BarChart3 className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Berichte</h1>
        <p className="text-gray-500">Coming soon – hier findest du detaillierte Finanzberichte.</p>
      </div>
    </DashboardLayout>
  )
}

export default Reports
