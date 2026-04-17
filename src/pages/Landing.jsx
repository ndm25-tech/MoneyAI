import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Brain,
  Target,
  Shield,
  ArrowRight,
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Check,
} from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Intelligentes Dashboard',
    description:
      'Behalte den Überblick über alle deine Finanzen auf einen Blick. Einnahmen, Ausgaben und Bilanz – übersichtlich und aktuell.',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    icon: Brain,
    title: 'KI-Finanzberater',
    description:
      'Unser KI-Assistent analysiert deine Ausgaben und gibt dir personalisierte Tipps, wie du mehr sparen und investieren kannst.',
    color: 'text-accent-600',
    bg: 'bg-accent-50',
  },
  {
    icon: Target,
    title: 'Budget-Ziele',
    description:
      'Setze dir finanzielle Ziele und verfolge deinen Fortschritt. Die KI hilft dir, auf Kurs zu bleiben.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Shield,
    title: '100% Sicher',
    description:
      'Deine Daten sind mit Bank-Level Verschlüsselung geschützt. Wir verkaufen niemals deine Daten.',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
]

const steps = [
  {
    number: '01',
    title: 'Registrieren',
    description: 'Erstelle in 30 Sekunden kostenlos ein Konto. Keine Kreditkarte nötig.',
  },
  {
    number: '02',
    title: 'Tracken',
    description: 'Erfasse deine Einnahmen und Ausgaben mühelos und kategorisiere sie automatisch.',
  },
  {
    number: '03',
    title: 'KI-Tipps erhalten',
    description: 'Lass die KI deine Finanzen analysieren und erhalte personalisierte Empfehlungen.',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Freelancerin',
    text: 'MoneyAI hat mir geholfen, endlich den Überblick über meine Finanzen zu behalten. Die KI-Tipps sind wirklich hilfreich!',
    stars: 5,
  },
  {
    name: 'Thomas K.',
    role: 'Software-Entwickler',
    text: 'Endlich eine App, die meine Finanzen versteht. Das Dashboard ist super übersichtlich und die Berichte sind detailliert.',
    stars: 5,
  },
  {
    name: 'Lisa H.',
    role: 'Studentin',
    text: 'Perfekt für Studenten! Die kostenlose Version reicht völlig aus und ich spare jetzt viel mehr als vorher.',
    stars: 5,
  },
]

const freeFeatures = [
  'Bis zu 50 Transaktionen/Monat',
  'Basis-Dashboard',
  'Ausgaben-Kategorien',
  '1 Budget-Ziel',
]

const premiumFeatures = [
  'Unbegrenzte Transaktionen',
  'KI-Finanzberater',
  'Erweiterte Berichte',
  'Unbegrenzte Budget-Ziele',
  'Export als PDF/Excel',
  'Priority Support',
]

function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-gray-900 text-white py-20 lg:py-32 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
                KI-gestützte Finanz-App 2026
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Deine Finanzen.{' '}
                <span className="text-accent-400">Deine KI.</span>{' '}
                Dein Erfolg.
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                MoneyAI hilft dir, deine Finanzen intelligent zu verwalten. Mit KI-gestützten
                Analysen, personalisierten Tipps und einem übersichtlichen Dashboard behältst
                du immer den Überblick.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                >
                  Kostenlos starten
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg border border-white/20"
                >
                  Mehr erfahren
                </a>
              </div>
              <p className="mt-4 text-sm text-blue-200">
                ✓ Kostenlos starten &nbsp;·&nbsp; ✓ Keine Kreditkarte &nbsp;·&nbsp; ✓ Jederzeit kündbar
              </p>
            </div>

            {/* Dashboard Mockup */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-2xl">
                {/* Mockup header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Finanz-Übersicht</h3>
                  <span className="text-xs bg-accent-500/20 text-accent-300 px-2 py-1 rounded-full">April 2026</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <DollarSign className="w-5 h-5 text-accent-400 mx-auto mb-1" />
                    <p className="text-xs text-blue-200">Bilanz</p>
                    <p className="font-bold text-accent-400">+€1.240</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-blue-200">Einnahmen</p>
                    <p className="font-bold">€3.500</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <TrendingDown className="w-5 h-5 text-red-400 mx-auto mb-1" />
                    <p className="text-xs text-blue-200">Ausgaben</p>
                    <p className="font-bold text-red-300">€2.260</p>
                  </div>
                </div>

                {/* Fake chart bars */}
                <div className="mb-4">
                  <p className="text-xs text-blue-200 mb-2">Ausgaben dieser Woche</p>
                  <div className="flex items-end gap-2 h-20">
                    {[40, 65, 30, 80, 55, 70, 45].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-primary-400/60"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
                      <span key={d} className="text-xs text-blue-300 flex-1 text-center">{d}</span>
                    ))}
                  </div>
                </div>

                {/* KI tip */}
                <div className="bg-accent-500/20 rounded-xl p-3 flex items-start gap-2">
                  <Brain className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-100">
                    <strong className="text-accent-400">KI-Tipp:</strong> Du kannst €180/Monat sparen, indem du deine Abo-Kosten optimierst.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Alles was du brauchst
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              MoneyAI bietet dir alle Tools, um deine Finanzen professionell zu verwalten.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-200 border border-gray-100 group"
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              In 3 Schritten zum Erfolg
            </h2>
            <p className="text-xl text-gray-600">So einfach geht's</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ number, title, description }, idx) => (
              <div key={number} className="relative text-center">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+3rem)] right-0 h-0.5 bg-gradient-to-r from-primary-300 to-primary-100" />
                )}
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold">{number}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Einfache Preise
            </h2>
            <p className="text-xl text-gray-600">Starte kostenlos, wechsle wenn du bereit bist</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Free</h3>
              <p className="text-gray-500 mb-6">Für Einsteiger</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">€0</span>
                <span className="text-gray-500">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block text-center border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                Kostenlos starten
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 shadow-xl text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                ⭐ Beliebt
              </div>
              <h3 className="text-xl font-bold mb-1">Premium</h3>
              <p className="text-blue-200 mb-6">Für ernsthafte Sparer</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">€4,99</span>
                <span className="text-blue-200">/Monat</span>
              </div>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-blue-100">
                    <Check className="w-5 h-5 text-accent-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block text-center bg-accent-500 hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md"
              >
                Jetzt upgraden
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Das sagen unsere Nutzer
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(({ name, role, text, stars }) => (
              <div key={name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex mb-3">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed italic">"{text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="text-sm text-gray-500">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Bereit, deine Finanzen zu transformieren?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schließe dich tausenden von Nutzern an, die mit MoneyAI ihre finanzielle Zukunft gestalten.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-10 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Jetzt kostenlos starten
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-blue-200">Keine Kreditkarte erforderlich</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Landing
