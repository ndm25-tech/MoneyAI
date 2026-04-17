import DashboardLayout from '../components/layout/DashboardLayout'
import { LayoutDashboard } from 'lucide-react'

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
          <LayoutDashboard className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">Coming soon – hier kommt deine Finanzübersicht.</p>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
