import { createContext, useContext, useState } from 'react'

const STORAGE_KEY = 'moneyai_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      // Mock login — replace with Firebase Auth later
      await new Promise((resolve) => setTimeout(resolve, 800))
      const newUser = { email, name: email.split('@')[0], uid: 'mock-uid-123' }
      setUser(newUser)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      } catch {
        // ignore storage errors (e.g. quota, private mode)
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      // Mock register — replace with Firebase Auth later
      await new Promise((resolve) => setTimeout(resolve, 800))
      const newUser = { email, name, uid: 'mock-uid-456' }
      setUser(newUser)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      } catch {
        // ignore storage errors
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setUser(null)
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore storage errors
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
