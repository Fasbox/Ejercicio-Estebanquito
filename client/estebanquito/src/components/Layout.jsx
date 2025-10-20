import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()

  return (
    <>
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)'
          }} />
          <strong>Estebanquito</strong>
        </div>

        <nav className="navlinks" aria-label="Navegación principal">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/cuentas">Cuentas</NavLink>
          <NavLink to="/transacciones">Transacciones</NavLink>
          <NavLink to="/prestamos">Préstamos</NavLink>
          <NavLink to="/reportes">Reportes</NavLink>
          <NavLink to="/perfil">Perfil</NavLink>
        </nav>

        <div className="small">
          {user?.nombre} · {user?.email}{' '}
          <button className="btn secondary" style={{ marginLeft: '.75rem' }}
            onClick={() => { signOut(); nav('/login'); }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  )
}
