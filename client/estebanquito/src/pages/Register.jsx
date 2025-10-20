import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../lib/storage.js'

export default function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [numero, setNumero] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  const nav = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    setErr(''); setOk('')
    try {
      registerUser({ nombre, email, password, numero })
      setOk('Registro exitoso. Ahora puedes iniciar sesión.')
      setTimeout(() => nav('/login'), 800)
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 520, marginTop: '8vh' }}>
      <div className="card">
        <h2>Crear cuenta</h2>
        {err && <p style={{ color: 'salmon' }}>{err}</p>}
        {ok && <p style={{ color: '#22c55e' }}>{ok}</p>}
        <form onSubmit={onSubmit} className="grid">
          <input className="input" placeholder="Nombre completo"
            value={nombre} onChange={e => setNombre(e.target.value)} />
          <input className="input" placeholder="Email"
            value={email} onChange={e => setEmail(e.target.value)} />
          <input className="input" placeholder="Contraseña" type="password"
            value={password} onChange={e => setPassword(e.target.value)} />
          <input className="input" placeholder="Número de cuenta (celular)"
            value={numero} onChange={e => setNumero(e.target.value)} />
          <button className="btn" type="submit">Registrar</button>
        </form>
        <p className="small" style={{ marginTop: '.75rem' }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
