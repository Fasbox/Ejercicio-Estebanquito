import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getUserAccounts } from '../lib/storage.js'
import { fmtCOP } from '../utils/format.js'

export default function Accounts() {
  const { user } = useAuth()
  const accounts = useMemo(() => getUserAccounts(user.id), [user.id])

  return (
    <div className="grid cols-2">
      {accounts.map(a => (
        <div className="card" key={a.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
  )
}
