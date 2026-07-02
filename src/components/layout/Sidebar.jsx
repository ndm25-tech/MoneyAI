import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  TrendingDown,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Star,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import FyniqLogo from '../ui/FyniqLogo'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: TrendingDown, label: 'Ausgaben' },
  { to: '/income', icon: TrendingUp, label: 'Einnahmen' },
  { to: '/reports', icon: BarChart3, label: 'Berichte' },
  { to: '/ai-chat', icon: MessageSquare, label: 'KI-Chat' },
  { to: '/settings', icon: Settings, label: 'Einstellungen' },
]

function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full bg-sidebar text-white w-64">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <FyniqLogo size={32} />
        <span className="font-bold text-xl">Fyniq</span>
      </div>

      {/* User info */}
      {user && (
        <div className="px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center font-semibold text-sm">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-sidebar-light hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}

        {/* Premium link */}
        <NavLink
          to="/premium"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-yellow-500 text-white shadow-md'
                : 'text-yellow-400 hover:bg-yellow-500/20 hover:text-yellow-300'
            }`
          }
        >
          <Star className="w-5 h-5 flex-shrink-0" />
          Premium
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5" />
          Abmelden
        </button>
      </div>
    </div>
  )
}

export default Sidebar
