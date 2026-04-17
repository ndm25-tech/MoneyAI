import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary-600 mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Seite nicht gefunden</h1>
        <p className="text-gray-500 mb-8">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md"
        >
          <Home className="w-5 h-5" />
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}

export default NotFound
