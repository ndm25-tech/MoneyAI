import DashboardLayout from '../components/layout/DashboardLayout'
import { MessageSquare } from 'lucide-react'

function AIChat() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">KI-Chat</h1>
        <p className="text-gray-500">Coming soon – hier sprichst du mit deinem KI-Finanzberater.</p>
      </div>
    </DashboardLayout>
  )
}

export default AIChat
