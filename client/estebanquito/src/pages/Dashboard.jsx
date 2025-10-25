import { useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getUserAccounts, getTransactionsByUser } from '../lib/storage.js'
import { fmtCOP } from '../utils/format.js'

export default function Dashboard() {
  const { user } = useAuth()
  const accounts = useMemo(() => getUserAccounts(user.id), [user.id])
  const tx = useMemo(() => getTransactionsByUser(user.id).slice(0, 6), [user.id])
  const saldoTotal = accounts.reduce((s,a)=>s+a.saldo,0)

  // --- CountUp suave sin dependencias ---
  const [displaySaldo, setDisplaySaldo] = useState(saldoTotal)
  const prevRef = useRef(saldoTotal)
  useEffect(() => {
    const start = prevRef.current
    const end = saldoTotal
    const dur = 600 // ms
    const t0 = performance.now()
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setDisplaySaldo(Math.round(start + (end - start) * eased))
      if (p < 1) requestAnimationFrame(step)
      else prevRef.current = end
    }
    requestAnimationFrame(step)
  }, [saldoTotal])

  return (
    <div className="grid cols-2">
      {/* KPI principal: saldo total animado */}
      <section className="card">
        <h3 className="section-title">Saldo total</h3>
        <div className="kpi">
          <div className="kpi-amount">{fmtCOP(displaySaldo)}</div>
          <div className="kpi-label">Cuentas: {accounts.map(a => a.tipo).join(' · ')}</div>
        </div>
      </section>

      {/* Resumen de cuentas del usuario */}
      <section className="card">
        <h3 className="section-title">Cuentas</h3>
        <div className="grid cols-2">
          {accounts.map(a => (
            <div className="card" key={a.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{a.tipo.toUpperCase()}</strong>
                  <div className="small mono">#{a.numero}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="small">Saldo</div>
                  <div style={{ fontWeight: 800 }}>{fmtCOP(a.saldo)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline de últimas transacciones con clasificación visual */}
      <section className="card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="section-title">Últimas transacciones</h3>
        {tx.length === 0 && <p className="small">Aún no hay movimientos.</p>}
        <div className="timeline">
          {tx.map(t => {
            // Regla visual: ingreso, egreso o transferencia
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
