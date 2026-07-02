import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wallet, Menu, X } from 'lucide-react'

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <Wallet className="w-7 h-7" />
            <span>MoneyAI</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Preise
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Anmelden
            </Link>
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Kostenlos starten
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü öffnen"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-3">
          <a
            href="#features"
            className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Features
          </a>
          <a
            href="#pricing"
            className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Preise
          </a>
          <hr className="border-gray-100" />
          <Link
            to="/login"
            className="block py-2 text-gray-600 hover:text-primary-600 font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Anmelden
          </Link>
          <Link
            to="/register"
            className="block text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-3 rounded-xl transition-all duration-200"
            onClick={() => setMobileOpen(false)}
          >
            Kostenlos starten
          </Link>
        </div>
      )}
    </header>
  )
}

export default Header
