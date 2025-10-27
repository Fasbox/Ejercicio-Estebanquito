import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user } = useAuth()
  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h3 className="section-title">Mi perfil</h3>
      <div><strong>Nombre:</strong> {user.nombre}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div className="small" style={{ marginTop: '.75rem' }}>
        * Para cuando esté el backend esta parte estará disponible.
      </div>
    </div>
  )
}
