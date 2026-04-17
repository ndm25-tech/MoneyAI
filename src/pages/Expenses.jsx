import DashboardLayout from '../components/layout/DashboardLayout'
import { TrendingDown } from 'lucide-react'

function Expenses() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
          <TrendingDown className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ausgaben</h1>
        <p className="text-gray-500">Coming soon – hier verwaltest du deine Ausgaben.</p>
      </div>
    </DashboardLayout>
  )
}

export default Expenses
