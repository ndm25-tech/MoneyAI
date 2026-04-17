import { Link } from 'react-router-dom'
import { Wallet } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Wallet className="w-6 h-6 text-primary-400" />
            <span>MoneyAI</span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Datenschutz
            </a>
            <a href="#" className="hover:text-white transition-colors">
              AGB
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Kontakt
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Impressum
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm">© 2026 MoneyAI. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
