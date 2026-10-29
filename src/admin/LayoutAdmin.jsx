import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const opciones = [
  { ruta: '/admin', texto: 'Dashboard', icono: 'bi-speedometer2', exacta: true },
  { ruta: '/admin/reservas', texto: 'Reservas', icono: 'bi-journal-check' },
  { ruta: '/admin/calendario', texto: 'Calendario y horarios', icono: 'bi-calendar3' },
  { ruta: '/admin/mesas', texto: 'Mesas', icono: 'bi-grid-3x3-gap' },
  { ruta: '/admin/platos', texto: 'Platos', icono: 'bi-cup-straw' },
  { ruta: '/admin/promociones', texto: 'Promociones', icono: 'bi-megaphone' },
]

// Menú lateral, barra superior y contenido de todas las páginas del administrador
export default function LayoutAdmin() {
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarSesion = () => {
    sessionStorage.removeItem('rincon_admin')
    navigate('/login')
  }

  const claseEnlace = ({ isActive }) => 'nav-link' + (isActive ? ' active' : '')

  return (
    <div className="d-flex flex-column flex-lg-row bg-light">
      <aside className="sidebar-admin bg-dark text-white p-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="text-warning mb-0">
            <i className="bi bi-egg-fried me-2"></i>El Rincón del Gustito
          </h5>
          <button className="btn btn-outline-light btn-sm d-lg-none" aria-label="Abrir menú"
            onClick={() => setMenuAbierto(!menuAbierto)}>
            <i className="bi bi-list"></i>
          </button>
        </div>

        <ul className={'nav flex-column gap-1 mt-3 d-lg-flex ' + (menuAbierto ? '' : 'd-none')}>
          {opciones.map((op) => (
            <li className="nav-item" key={op.ruta}>
              <NavLink to={op.ruta} end={op.exacta} className={claseEnlace}
                onClick={() => setMenuAbierto(false)}>
                <i className={`bi ${op.icono} me-2`}></i>{op.texto}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-grow-1 min-vh-100">
        <nav className="navbar bg-white border-bottom shadow-sm px-3 px-md-4">
          <span className="navbar-brand mb-0 h6 fw-bold text-secondary">Panel de gestión de reservas</span>
          <div className="d-flex gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-box-arrow-up-right me-1"></i>Ver sitio
            </a>
            <button className="btn btn-outline-danger btn-sm" onClick={cerrarSesion}>
              <i className="bi bi-box-arrow-right me-1"></i>Salir
            </button>
          </div>
        </nav>

        <main className="p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}