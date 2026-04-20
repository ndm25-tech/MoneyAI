import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Globe, Bell, Sun, CreditCard, AlertTriangle, Check } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Toggle from '../components/ui/Toggle'
import Modal from '../components/ui/Modal'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const SETTINGS_STORAGE_KEY = 'moneyai_settings'

const DEFAULT_SETTINGS = {
  currency: 'EUR',
  language: 'de',
  monthlyBudget: 2000,
  weekStart: 'monday',
  notif: {
    budgetWarning: true,
    weeklyReport: false,
    aiTips: true,
    updates: true,
  },
  compactView: false,
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return DEFAULT_SETTINGS
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notif: { ...DEFAULT_SETTINGS.notif, ...(parsed.notif || {}) },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore
  }
}

function SuccessBanner({ message, onDismiss }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
      <Check className="w-4 h-4 flex-shrink-0 text-green-600" />
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="text-green-600 hover:text-green-800 text-lg leading-none">×</button>
    </div>
  )
}

function Settings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()

  // Profile
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profileSuccess, setProfileSuccess] = useState('')

  // Security
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  // Preferences
  const initial = useMemo(() => loadSettings(), [])
  const [currency, setCurrency] = useState(initial.currency)
  const [language, setLanguage] = useState(initial.language)
  const [monthlyBudget, setMonthlyBudget] = useState(initial.monthlyBudget)
  const [weekStart, setWeekStart] = useState(initial.weekStart)
  const [prefsSuccess, setPrefsSuccess] = useState('')

  // Notifications
  const [notif, setNotif] = useState(initial.notif)

  // Appearance
  const [compactView, setCompactView] = useState(initial.compactView)

  // Subscription
  const isPremium = false

  // Danger modals
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  useEffect(() => {
    saveSettings({
      currency,
      language,
      monthlyBudget,
      weekStart,
      notif,
      compactView,
    })
  }, [currency, language, monthlyBudget, weekStart, notif, compactView])

  const handleSaveProfile = () => {
    setProfileSuccess('Profil erfolgreich gespeichert!')
    setTimeout(() => setProfileSuccess(''), 4000)
  }

  const handleChangePassword = () => {
    setPwError('')
    setPwSuccess('')
    if (newPw.length < 8) {
      setPwError('Das neue Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }
    if (newPw !== confirmPw) {
      setPwError('Die Passwörter stimmen nicht überein.')
      return
    }
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    setPwSuccess('Passwort erfolgreich geändert!')
    setTimeout(() => setPwSuccess(''), 4000)
  }

  const handleSavePrefs = () => {
    setPrefsSuccess('Präferenzen gespeichert!')
    setTimeout(() => setPrefsSuccess(''), 4000)
  }

  const sectionClass = 'scroll-mt-6'

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
          <p className="text-gray-500 mt-1 text-sm">Verwalte dein Konto und deine Präferenzen</p>
        </div>

        {/* ── Section 1: Profil ── */}
        <Card id="profile" className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Profil</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {(profileName || user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{profileName || user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <SuccessBanner message={profileSuccess} onDismiss={() => setProfileSuccess('')} />
            <Input
              id="profile-name"
              label="Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Dein Name"
            />
            <Input
              id="profile-email"
              label="E-Mail"
              value={user?.email || ''}
              disabled
              className="opacity-60"
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveProfile}>Profil speichern</Button>
            </div>
          </div>
        </Card>

        {/* ── Section 2: Sicherheit ── */}
        <Card id="security" className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Lock className="w-4 h-4 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Sicherheit</h2>
          </div>

          <div className="space-y-4">
            <SuccessBanner message={pwSuccess} onDismiss={() => setPwSuccess('')} />
            {pwError && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {pwError}
              </div>
            )}
            <Input
              id="current-pw"
              label="Aktuelles Passwort"
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              id="new-pw"
              label="Neues Passwort"
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="Mindestens 8 Zeichen"
            />
            <Input
              id="confirm-pw"
              label="Passwort bestätigen"
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Passwort wiederholen"
            />
            <div className="flex justify-end">
              <Button onClick={handleChangePassword}>Passwort ändern</Button>
            </div>
          </div>
        </Card>

        {/* ── Section 3: Präferenzen ── */}
        <Card id="preferences" className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Präferenzen</h2>
          </div>

          <div className="space-y-4">
            <SuccessBanner message={prefsSuccess} onDismiss={() => setPrefsSuccess('')} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Währung</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CHF">CHF</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Sprache</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="de">Deutsch</option>
                <option value="en" disabled>English (Coming soon)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Monatsbudget (€)</label>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                min={0}
                step={100}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Wochenstart</label>
              <select
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="monday">Montag</option>
                <option value="sunday">Sonntag</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSavePrefs}>Präferenzen speichern</Button>
            </div>
          </div>
        </Card>

        {/* ── Section 4: Benachrichtigungen ── */}
        <Card id="notifications" className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Bell className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Benachrichtigungen</h2>
          </div>

          <div className="space-y-5">
            <Toggle
              id="notif-budget"
              checked={notif.budgetWarning}
              onChange={(v) => setNotif((n) => ({ ...n, budgetWarning: v }))}
              label="Budget-Warnung bei 80%"
            />
            <Toggle
              id="notif-weekly"
              checked={notif.weeklyReport}
              onChange={(v) => setNotif((n) => ({ ...n, weeklyReport: v }))}
              label="Wöchentlicher Finanzbericht per E-Mail"
            />
            <Toggle
              id="notif-ai"
              checked={notif.aiTips}
              onChange={(v) => setNotif((n) => ({ ...n, aiTips: v }))}
              label="KI-Spartipps per E-Mail"
            />
            <Toggle
              id="notif-updates"
              checked={notif.updates}
              onChange={(v) => setNotif((n) => ({ ...n, updates: v }))}
              label="Neue Features & Updates"
            />
          </div>
        </Card>

        {/* ── Section 5: Erscheinungsbild ── */}
        <Card id="appearance" className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Sun className="w-4 h-4 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Erscheinungsbild</h2>
          </div>

          <div className="space-y-5">
            <Toggle
              id="dark-mode"
              checked={darkMode}
              onChange={toggleDarkMode}
              label="Dark Mode"
            />
            <Toggle
              id="compact-view"
              checked={compactView}
              onChange={setCompactView}
              label="Kompakte Ansicht"
            />
          </div>
        </Card>

        {/* ── Section 6: Abo & Premium ── */}
        <Card id="subscription" className={sectionClass}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Abo & Premium</h2>
          </div>

          {isPremium ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                <span className="text-yellow-600 text-lg">⭐</span>
                <div>
                  <p className="font-semibold text-gray-900">Premium-Mitglied</p>
                  <p className="text-sm text-gray-500">Nächste Abrechnung: 19. Mai 2026 — €4,99</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Abo verwalten</Button>
                <Button variant="danger">Kündigen</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">Free-Plan</p>
                  <p className="text-sm text-gray-500">Begrenzte Features — Upgrade für unbegrenzte Nutzung</p>
                </div>
              </div>
              <Button onClick={() => navigate('/premium')}>
                ⭐ Upgrade auf Premium
              </Button>
            </div>
          )}
        </Card>

        {/* ── Section 7: Gefahrenzone ── */}
        <Card id="danger" className={`${sectionClass} border-2 border-red-200`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-red-700">Gefahrenzone</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <div>
                <p className="font-medium text-gray-900 text-sm">Alle Daten löschen</p>
                <p className="text-xs text-gray-500 mt-0.5">Löscht alle deine Transaktionen, Kategorien und Berichte.</p>
              </div>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteDataModal(true)}>
                Löschen
              </Button>
            </div>

            <div className="flex items-start justify-between gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
              <div>
                <p className="font-medium text-gray-900 text-sm">Konto löschen</p>
                <p className="text-xs text-gray-500 mt-0.5">Löscht dein Konto dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden.</p>
              </div>
              <Button variant="danger" size="sm" onClick={() => setShowDeleteAccountModal(true)}>
                Konto löschen
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Data Modal */}
      <Modal
        isOpen={showDeleteDataModal}
        onClose={() => setShowDeleteDataModal(false)}
        title="Alle Daten löschen"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bist du sicher? Alle deine Transaktionen, Kategorien und Berichte werden unwiderruflich gelöscht.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteDataModal(false)}>Abbrechen</Button>
            <Button variant="danger" onClick={() => setShowDeleteDataModal(false)}>Ja, alles löschen</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Konto löschen"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden. Dein Konto und alle zugehörigen Daten werden dauerhaft gelöscht.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteAccountModal(false)}>Abbrechen</Button>
            <Button variant="danger" onClick={() => setShowDeleteAccountModal(false)}>Ja, Konto löschen</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default Settings
