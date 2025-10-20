import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { addTransaction, getTransactionsByUser, getUserAccounts } from '../lib/storage.js'
import { fmtCOP, nowISO } from '../utils/format.js'

export default function Transactions() {
  const { user } = useAuth()
  const accounts = useMemo(() => getUserAccounts(user.id), [user.id])
  const [tipo, setTipo] = useState('depósito')
  const [origen, setOrigen] = useState(accounts[0]?.id || '')
  const [destino, setDestino] = useState('')
  const [monto, setMonto] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [list, setList] = useState([])

  useEffect(() => setList(getTransactionsByUser(user.id)), [user.id])

  const submit = (e) => {
    e.preventDefault()
    setMsg(''); setErr('')
    try {
      const value = Number(monto)
      if (!value || value <= 0) throw new Error('Monto inválido.')
      const meta = {}
      if (tipo === 'transferencia') {
        if (!destino) throw new Error('Selecciona cuenta destino.')
        meta.destino_id = destino
        meta.destino_es_mio = accounts.some(a => a.id === destino)
      }
      addTransaction({ cuenta_id: origen, tipo, monto: value, fecha: nowISO(), meta })
      setMsg('Transacción registrada.')
      setList(getTransactionsByUser(user.id))
      setMonto('')
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="grid cols-2">
      <section className="card">
        <h3 className="section-title">Nueva transacción</h3>
        {msg && <p style={{ color: '#22c55e' }}>{msg}</p>}
        {err && <p style={{ color: 'salmon' }}>{err}</p>}
        <form className="grid" onSubmit={submit}>
          <label>
            <span className="small">Tipo</span>
            <select className="select" value={tipo} onChange={e=>setTipo(e.target.value)}>
              <option>depósito</option>
              <option>retiro</option>
              <option>transferencia</option>
            </select>
          </label>

          <label>
            <span className="small">Cuenta origen</span>
            <select className="select" value={origen} onChange={e=>setOrigen(e.target.value)}>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.tipo} · #{a.numero}</option>)}
            </select>
          </label>

          {tipo === 'transferencia' && (
            <label>
              <span className="small">Cuenta destino (puede ser tuya)</span>
              <select className="select" value={destino} onChange={e=>setDestino(e.target.value)}>
                <option value="">-- Selecciona --</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.tipo} · #{a.numero}</option>)}
              </select>
            </label>
          )}

          <input className="input" placeholder="Monto (COP)" value={monto} onChange={e=>setMonto(e.target.value)} />

          <button className="btn" type="submit">Registrar</button>
        </form>
      </section>

      <section className="card">
        <h3 className="section-title">Historial</h3>
        <div className="grid">
          {list.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{t.tipo}</strong>
                <div className="small">{new Date(t.fecha).toLocaleString()}</div>
                <div className="small mono">#{t.cuenta_id}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{fmtCOP(t.monto)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
