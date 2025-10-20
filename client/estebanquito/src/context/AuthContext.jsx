import { createContext, useContext, useEffect, useState } from 'react'
import { login as sLogin } from '../lib/storage.js'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('estebanquito_session')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const signIn = async ({ email, password }) => {
    const u = sLogin({ email, password })
    setUser(u)
    localStorage.setItem('estebanquito_session', JSON.stringify(u))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('estebanquito_session')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
