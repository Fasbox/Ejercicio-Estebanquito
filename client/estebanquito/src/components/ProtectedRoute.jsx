import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

{/* Previene a los usuarios de ir a rutas mientras no estén autorizados */}
export default function ProtectedRoute({ children }) {
  const { isAuth } = useAuth()
  const loc = useLocation()
  if (!isAuth) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
}
