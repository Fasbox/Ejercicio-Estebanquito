import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()

  return (
    <>
      <div className="shell">
        {/* SIDEBAR (desktop/tablet) */}
        <aside className="sidebar">
          {/* Marca compacta (logo + texto) */}
          <div className="brand">
            <div className="brand-logo" aria-hidden="true" />
            <div className="brand-text">
              <strong>Estebanquito</strong>
              <span className="small">Sientete seguro</span>
            </div>
          </div>

          {/* Navegación primaria: usa NavLink para obtener la clase 'active' automáticamente */}
          <nav className="side-nav" aria-label="Navegación principal">
            <NavLink to="/dashboard" className="navitem">
              <span className="nav-ico">🏠</span> <span>Dashboard</span>
            </NavLink>
            <NavLink to="/cuentas" className="navitem">
              <span className="nav-ico">💳</span> <span>Cuentas</span>
            </NavLink>
            <NavLink to="/transacciones" className="navitem">
              <span className="nav-ico">🔁</span> <span>Transacciones</span>
            </NavLink>
            <NavLink to="/prestamos" className="navitem">
              <span className="nav-ico">📄</span> <span>Préstamos</span>
            </NavLink>
            <NavLink to="/reportes" className="navitem">
              <span className="nav-ico">📊</span> <span>Reportes</span>
            </NavLink>
            <NavLink to="/perfil" className="navitem">
              <span className="nav-ico">👤</span> <span>Perfil</span>
            </NavLink>
          </nav>

          {/* Pie del sidebar: útil para versión, enlaces o estado */}
          <div className="side-footer small">
            <div>v1.5 · demo</div>
          </div>
        </aside>

        {/* MAIN: contenido y topbar */}
        <div className="main">
          <header className="topbar">
            {/* Acciones de usuario: información y cierre de sesión */}
            <div className="top-actions">
              <span className="small">{user?.nombre} · {user?.email}</span>
              <button
                className="btn secondary"
                onClick={() => { signOut(); nav('/login'); }}
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          {/* Outlet: enrutador pinta aquí cada página */}
          <main className="container">
            <Outlet />
          </main>
        </div>
      </div>

      {/* BOTTOM NAV (solo móvil): navegación compacta tipo app */}
      <nav className="bottomnav" aria-label="Navegación móvil">
        <NavLink to="/dashboard" className="bn-item">🏠<span>Home</span></NavLink>
        <NavLink to="/cuentas" className="bn-item">💳<span>Cuentas</span></NavLink>
        <NavLink to="/transacciones" className="bn-item">🔁<span>Movs</span></NavLink>
        <NavLink to="/prestamos" className="bn-item">📄<span>Prést</span></NavLink>
        <NavLink to="/reportes" className="bn-item">📊<span>Rep</span></NavLink>
      </nav>

      {/* FAB (solo móvil): atajo a "Nueva transacción"
          Se muestra cuando el viewport < 900px (ver CSS) */}
      <a className="fab" href="/transacciones" aria-label="Nueva transacción">＋</a>
    </>
  )
}
