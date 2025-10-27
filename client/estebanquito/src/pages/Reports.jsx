import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getReports } from '../lib/storage.js'
import { fmtCOP } from '../utils/format.js'

export default function Reports() {
  const { user } = useAuth()
  const data = useMemo(() => getReports(user.id), [user.id])

  return (
    <div className="grid cols-3">
      <div className="card kpi">
        <div className="kpi-label">Ingresos históricos</div>
        <div className="kpi-amount">{fmtCOP(data.ingresos)}</div>
      </div>
      <div className="card kpi">
        <div className="kpi-label">Egresos históricos</div>
        <div className="kpi-amount">{fmtCOP(data.egresos)}</div>
      </div>
      <div className="card kpi">
        <div className="kpi-label">Deudas pendientes</div>
        <div className="kpi-amount">{fmtCOP(data.deudas)}</div>
      </div>
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="small">
          * Cálculos derivados del historial de transacciones, aún sin gráficas.
        </div>
      </div>
    </div>
  )
}
