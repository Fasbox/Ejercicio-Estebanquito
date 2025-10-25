import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { addTransaction, getTransactionsByUser, getUserAccounts } from '../lib/storage.js'
import { fmtCOP, nowISO } from '../utils/format.js'

export default function Transactions() {
  const { user } = useAuth()
  const accounts = useMemo(() => getUserAccounts(user.id), [user.id])

  // Estado del formulario
  const [tipo, setTipo] = useState('depósito')
  const [origen, setOrigen] = useState(accounts[0]?.id || '')
  const [destino, setDestino] = useState('')
  const [monto, setMonto] = useState('')

  // Mensajes UI
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  // Historial de transacciones del usuario
  const [list, setList] = useState([])
  useEffect(() => setList(getTransactionsByUser(user.id)), [user.id])

  // Registrar transacción con reglas de negocio básicas en storage.js
  const submit = (e) => {
    e.preventDefault()
    setMsg(''); setErr('')
    try {
      // Sanitiza: permite "2.000.000" o "2 000 000"
      const value = Number(String(monto).replace(/[^\d]/g, ''))
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
      {/* Formulario de nueva transacción */}
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

          <input
            className="input"
            placeholder="Monto (COP)"
            value={monto}
            onChange={e=>setMonto(e.target.value)}
          />

          <button className="btn" type="submit">Registrar</button>
        </form>
      </section>

      {/* Historial con timeline + badges */}
      <section className="card">
        <h3 className="section-title">Historial</h3>
        <div className="timeline">
          {list.map(t => {
            const income = t.tipo === 'depósito' || (t.tipo === 'transferencia' && t.meta?.destino_es_mio)
            const outcome = t.tipo === 'retiro' || (t.tipo === 'transferencia' && !t.meta?.destino_es_mio)
            const badgeClass = income ? 'badge income' : outcome ? 'badge outcome' : 'badge transfer'
            const amountClass = income ? 'amount income' : outcome ? 'amount outcome' : 'amount'
            const icon = income ? '⬆️' : outcome ? '⬇️' : '🔁'

            return (
              <div key={t.id} className="timeline-item">
                <div className="timeline-icon">{icon}</div>
                <div>
                  <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                    <strong style={{ textTransform: 'capitalize' }}>{t.tipo}</strong>
                    <span className={badgeClass}>
                      {income ? 'Ingreso' : outcome ? 'Egreso' : 'Transferencia'}
                    </span>
                  </div>
                  <div className="small">{new Date(t.fecha).toLocaleString()}</div>
                  <div className="small mono">Cuenta: {t.cuenta_id}</div>
                </div>
                <div className={amountClass}>{fmtCOP(t.monto)}</div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
