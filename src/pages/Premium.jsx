import { useState } from 'react'
import { Check, X, Star, Lock } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const FREE_FEATURES = [
  { text: '5 Ausgaben/Monat', included: false },
  { text: 'Basic Dashboard', included: false },
  { text: '2 KI-Tipps/Woche', included: false },
  { text: 'Keine Alerts', included: false },
  { text: 'Keine Ziele', included: false },
  { text: 'Werbung', included: false },
]

const PREMIUM_FEATURES = [
  { text: 'Unbegrenzte Ausgaben', included: true },
  { text: 'Volles Dashboard', included: true },
  { text: 'Unbegrenzt KI-Chat', included: true },
  { text: 'Budget-Alerts', included: true },
  { text: 'Ziel-Tracking', included: true },
  { text: 'Keine Werbung', included: true },
  { text: 'Export (PDF/CSV)', included: true },
  { text: 'Priority Support', included: true },
]

function FeatureRow({ text, included }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {included ? (
        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
      ) : (
        <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
      )}
      <span className={included ? 'text-gray-700' : 'text-gray-400'}>{text}</span>
    </li>
  )
}

// Simple CSS confetti effect
function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => i)
  const colors = ['bg-yellow-400', 'bg-pink-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-red-400']
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((i) => (
        <div
          key={i}
          className={`absolute w-2 h-3 rounded-sm opacity-90 ${colors[i % colors.length]}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20 + 5}%`,
            animation: `fall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 1}s forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to { top: 110%; transform: rotate(720deg); }
        }
      `}</style>
    </div>
  )
}

function Premium() {
  const [yearly, setYearly] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [success, setSuccess] = useState(false)
  const [paying, setPaying] = useState(false)

  const monthlyPrice = 4.99
  const yearlyPrice = 49.99
  const displayPrice = yearly ? yearlyPrice : monthlyPrice
  const priceLabel = yearly ? '€49,99/Jahr' : '€4,99/Monat'

  const handlePay = async () => {
    setPaying(true)
    await new Promise((r) => setTimeout(r, 1200))
    setPaying(false)
    setSuccess(true)
  }

  const handleCloseCheckout = () => {
    if (success) {
      setSuccess(false)
      setCardNumber('')
      setExpiry('')
      setCvc('')
    }
    setShowCheckout(false)
  }

  return (
    <DashboardLayout>
      {success && <Confetti />}

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
            <Star className="w-4 h-4" />
            Fyniq Premium
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Upgrade auf Fyniq Premium
          </h1>
          <p className="text-lg text-gray-500">
            Nutze alle Features ohne Limits
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-medium ${!yearly ? 'text-gray-900' : 'text-gray-400'}`}>
            Monatlich
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((y) => !y)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              yearly ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ${
                yearly ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-2 ${yearly ? 'text-gray-900' : 'text-gray-400'}`}>
            Jährlich
            {yearly && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                Spare 17%
              </span>
            )}
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Free */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Free</p>
              <p className="text-4xl font-extrabold text-gray-900">€0</p>
              <p className="text-sm text-gray-400 mt-1">Aktueller Plan</p>
            </div>
            <ul className="space-y-3 flex-1">
              {FREE_FEATURES.map((feature) => (
                <FeatureRow key={feature.text} {...feature} />
              ))}
            </ul>
            <div className="mt-auto">
              <button
                disabled
                className="w-full px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-400 font-semibold text-sm cursor-not-allowed"
              >
                Aktueller Plan
              </button>
            </div>
          </div>

          {/* Premium */}
          <div className="relative rounded-2xl border-2 border-primary-600 bg-gradient-to-br from-primary-600 to-primary-800 p-8 flex flex-col gap-6 shadow-xl text-white">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full shadow">
              ⭐ Beliebt
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-200 uppercase tracking-wide mb-1">Premium</p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-extrabold">
                  {yearly ? '€49,99' : '€4,99'}
                </p>
                <p className="text-primary-200 mb-1 text-sm">{yearly ? '/Jahr' : '/Monat'}</p>
              </div>
              {yearly && (
                <p className="text-xs text-primary-200 mt-1">2 Monate gratis! (statt €59,88/Jahr)</p>
              )}
            </div>
            <ul className="space-y-3 flex-1">
              {PREMIUM_FEATURES.map((feature) => (
                <FeatureRow key={feature.text} {...feature} />
              ))}
            </ul>
            <div className="mt-auto">
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full px-6 py-3.5 rounded-xl bg-white text-primary-700 font-bold text-sm hover:bg-primary-50 transition-colors shadow-md hover:shadow-lg"
              >
                Jetzt Premium werden
              </button>
              <p className="text-center text-xs text-primary-200 mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Sichere Zahlung mit Stripe
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-3">
          <Button size="lg" onClick={() => setShowCheckout(true)}>
            Jetzt Premium werden — {priceLabel}
          </Button>
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Sichere Zahlung mit Stripe 🔒
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={handleCloseCheckout}
        title={success ? '🎉 Zahlung erfolgreich!' : 'Zahlungsinformationen'}
      >
        {success ? (
          <div className="text-center space-y-5 py-4">
            <div className="text-6xl">🎉</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Willkommen bei Premium!</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Du hast jetzt Zugriff auf alle Premium-Features. Viel Spaß!
              </p>
            </div>
            <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-xs">
              Dies ist eine Demo. Echte Zahlung wird mit Stripe integriert.
            </div>
            <Button fullWidth onClick={handleCloseCheckout}>
              Weiter zum Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="px-4 py-3 bg-primary-50 border border-primary-100 rounded-xl flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Fyniq Premium</span>
              <span className="text-sm font-bold text-primary-700">{priceLabel}</span>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Kartennummer</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Ablaufdatum</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/JJ"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">CVC</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-500 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              Dies ist eine Demo. Echte Zahlung wird mit Stripe integriert.
            </div>

            <Button fullWidth loading={paying} onClick={handlePay}>
              Jetzt bezahlen — {priceLabel}
            </Button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}

export default Premium
