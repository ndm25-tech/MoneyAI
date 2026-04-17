import DashboardLayout from '../components/layout/DashboardLayout'
import { TrendingUp } from 'lucide-react'

function Income() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-accent-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Einnahmen</h1>
        <p className="text-gray-500">Coming soon – hier verwaltest du deine Einnahmen.</p>
      </div>
    </DashboardLayout>
  )
}

export default Income
