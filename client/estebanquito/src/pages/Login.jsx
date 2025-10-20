import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('demo@estebanquito.co')
  const [password, setPassword] = useState('123456')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from || '/dashboard'

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      await signIn({ email, password })
      nav(from, { replace: true })
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: '10vh' }}>
      <div className="card">
        <h2>Iniciar sesión</h2>
        <p className="small">Usa el demo: demo@estebanquito.co / 123456</p>
        {err && <p style={{ color: 'salmon' }}>{err}</p>}
        <form onSubmit={onSubmit} className="grid" style={{ gap: '0.8rem' }}>
          <input className="input" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" placeholder="Contraseña" type="password"
            value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn" type="submit">Entrar</button>
        </form>
        <p className="small" style={{ marginTop: '.75rem' }}>
          ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
        </p>
      </div>
    </div>
  )
}
