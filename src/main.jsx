import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { TransactionProvider } from './context/TransactionContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <TransactionProvider>
              <App />
            </TransactionProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
