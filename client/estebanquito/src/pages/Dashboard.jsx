import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getUserAccounts, getTransactionsByUser } from '../lib/storage.js'
import { fmtCOP } from '../utils/format.js'

export default function Dashboard() {
  const { user } = useAuth()
  const accounts = useMemo(() => getUserAccounts(user.id), [user.id])
  const tx = useMemo(() => getTransactionsByUser(user.id).slice(0,5), [user.id])
  const saldoTotal = accounts.reduce((s,a)=>s+a.saldo,0)

  return (
    <div className="grid cols-2">
      <section className="card">
        <h3 className="section-title">Saldo total</h3>
        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{fmtCOP(saldoTotal)}</div>
        <p className="small">Cuentas: {accounts.map(a => a.tipo).join(' · ')}</p>
      </section>

      <section className="card">
        <h3 className="section-title">Cuentas</h3>
        <div className="grid cols-2">
          {accounts.map(a => (
            <div className="card" key={a.id}>
              <strong>{a.tipo.toUpperCase()}</strong>
              <div className="small mono">#{a.numero}</div>
              <div style={{ marginTop: '.4rem' }}>{fmtCOP(a.saldo)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="section-title">Últimas transacciones</h3>
        <div className="grid">
          {tx.length === 0 && <p className="small">Aún no hay movimientos.</p>}
          {tx.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div><strong>{t.tipo}</strong> · {new Date(t.fecha).toLocaleString()}</div>
                <div className="small mono">Cuenta: {t.cuenta_id}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{fmtCOP(t.monto)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
