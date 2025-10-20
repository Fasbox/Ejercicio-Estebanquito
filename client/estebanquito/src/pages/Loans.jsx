import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { createLoan, getLoans } from '../lib/storage.js'
import { fmtCOP } from '../utils/format.js'

export default function Loans() {
  const { user } = useAuth()
  const [monto, setMonto] = useState('')
  const [plazo, setPlazo] = useState('12')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loans, setLoans] = useState([])

  const refresh = () => setLoans(getLoans(user.id))
  useEffect(refresh, [user.id])

  const solicitar = (e) => {
    e.preventDefault()
    setMsg(''); setErr('')
    try {
      const v = Number(monto)
      if (!v || v <= 0) throw new Error('Monto inválido.')
      createLoan({ usuario_id: user.id, monto: v, plazo_meses: Number(plazo) })
      setMsg('Solicitud enviada (acreditada como depósito).')
      setMonto('')
      refresh()
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="grid cols-2">
      <section className="card">
        <h3 className="section-title">Solicitar préstamo</h3>
        {msg && <p style={{ color: '#22c55e' }}>{msg}</p>}
        {err && <p style={{ color: 'salmon' }}>{err}</p>}
        <form className="grid" onSubmit={solicitar}>
          <input className="input" placeholder="Monto (COP)" value={monto} onChange={e=>setMonto(e.target.value)} />
          <select className="select" value={plazo} onChange={e=>setPlazo(e.target.value)}>
            <option value="6">6 meses</option>
            <option value="12">12 meses</option>
            <option value="24">24 meses</option>
          </select>
          <button className="btn">Solicitar</button>
        </form>
        <p className="small" style={{ marginTop: '.5rem' }}>
          * Para el demo, el préstamo queda en “pendiente” y el dinero se acredita a tu primera cuenta.
        </p>
      </section>

      <section className="card">
        <h3 className="section-title">Mis préstamos</h3>
        <div className="grid">
          {loans.length === 0 && <p className="small">Aún no tienes préstamos.</p>}
          {loans.map(l => (
            <div key={l.id} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>Estado: {l.estado}</strong>
                <div className="small">{new Date(l.fecha_solicitud).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>{fmtCOP(l.monto)}</div>
                <div className="small">{l.plazo} meses</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
