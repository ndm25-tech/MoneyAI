# Fyniq 💰

**Fyniq** ist eine moderne, KI-gestützte Finanz-App, die dir hilft, deine Einnahmen und Ausgaben zu verwalten, Budget-Ziele zu setzen und personalisierte Finanztipps von einer KI zu erhalten.

## ✨ Features

- 📊 **Intelligentes Dashboard** – Übersicht über Einnahmen, Ausgaben und Bilanz
- 🤖 **KI-Finanzberater** – Personalisierte Spartipps basierend auf deinen Daten
- 🎯 **Budget-Ziele** – Setze und verfolge deine finanziellen Ziele
- 🔒 **100% Sicher** – Bank-Level Verschlüsselung mit Firebase
- 📱 **Responsive** – Optimiert für Desktop und Mobile

## 🛠️ Tech Stack

| Technologie | Version | Zweck |
|-------------|---------|-------|
| React | 18.2 | UI Framework |
| Vite | 5.0 | Build Tool |
| Tailwind CSS | 3.3 | Styling |
| React Router | 6.20 | Navigation |
| Lucide React | 0.294 | Icons |
| Firebase | 10.7 | Backend & Auth |

## 🚀 Setup & Installation

### Voraussetzungen

- Node.js >= 18
- npm >= 9

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/ndm25-tech/Fyniq.git
cd Fyniq

# 2. Dependencies installieren
npm install

# 3. Umgebungsvariablen konfigurieren
cp .env.example .env
# → .env mit deinen Firebase-Credentials ausfüllen

# 4. Entwicklungsserver starten
npm run dev
```

Der Dev-Server läuft dann auf [http://localhost:5173](http://localhost:5173).

### Build für Produktion

```bash
npm run build
npm run preview
```

## 🔑 Firebase Setup

1. Gehe zu [console.firebase.google.com](https://console.firebase.google.com)
2. Erstelle ein neues Projekt
3. Aktiviere **Authentication** (Email/Password)
4. Erstelle eine **Firestore** Datenbank
5. Kopiere die Config-Werte in deine `.env`-Datei

## 📁 Projektstruktur

```
Fyniq/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── src/
    ├── assets/               # Bilder, Icons, Platzhalter-Dateien
    ├── main.jsx              # App-Einstiegspunkt
    ├── App.jsx               # Router & Routen
    ├── index.css             # Tailwind CSS
    ├── hooks/                # Platz für Custom Hooks
    ├── styles/
    │   └── tokens.css        # Zentrale Design Tokens
    ├── context/
    │   └── AuthContext.jsx   # Auth-State Management
    ├── components/
    │   ├── common/
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Loader.jsx
    │   ├── ui/
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   └── Input.jsx
    │   └── layout/
    │       ├── Header.jsx
    │       ├── Footer.jsx
    │       ├── Sidebar.jsx
    │       └── DashboardLayout.jsx
    ├── pages/
    │   ├── Landing.jsx       # Landing Page
    │   ├── Login.jsx         # Login
    │   ├── Register.jsx      # Registrierung
    │   ├── Dashboard.jsx
    │   ├── Expenses.jsx
    │   ├── Income.jsx
    │   ├── Reports.jsx
    │   ├── AIChat.jsx
    │   ├── Settings.jsx
    │   └── NotFound.jsx
    └── services/
        ├── firebase.js       # Firebase Config
        └── api.js            # API Helper
```

## 📜 Scripts

```bash
npm run dev       # Entwicklungsserver starten
npm run build     # Produktions-Build erstellen
npm run preview   # Produktions-Build vorschauen
```

## 🎨 Design

- **Primärfarbe:** Blau (`#2563EB`)
- **Akzentfarbe:** Grün (`#10B981`)
- **Sidebar:** Dunkel (`#0F172A`)
- **Framework:** Tailwind CSS (Mobile-First)

## 📄 Lizenz

© 2026 Fyniq. Alle Rechte vorbehalten.
