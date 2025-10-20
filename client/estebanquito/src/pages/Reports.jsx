import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getReports } from '../lib/storage.js'
import { fmtCOP } from '../utils/format.js'

export default function Reports() {
  const { user } = useAuth()
  const data = useMemo(() => getReports(user.id), [user.id])

  return (
    <div className="grid cols-3">
      <div className="card">
        <div className="small">Ingresos históricos</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{fmtCOP(data.ingresos)}</div>
      </div>
      <div className="card">
        <div className="small">Egresos históricos</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{fmtCOP(data.egresos)}</div>
      </div>
      <div className="card">
        <div className="small">Deudas pendientes</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{fmtCOP(data.deudas)}</div>
      </div>
      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="small">
          * Reporte sin gráficas (como pide el punto extra). Se calcula desde el historial de transacciones y préstamos.
        </div>
      </div>
    </div>
  )
}
