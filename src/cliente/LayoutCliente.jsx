import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

// Menú, contenido y pie de página de todas las páginas del cliente
export default function LayoutCliente() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const cerrarMenu = () => setMenuAbierto(false)

  // NavLink agrega la clase "active" al enlace de la página actual
  const claseEnlace = ({ isActive }) => 'nav-link' + (isActive ? ' active fw-bold' : '')

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/" onClick={cerrarMenu}>
            <i className="bi bi-egg-fried me-2 text-warning"></i>El Rincón del Gustito
          </Link>

          <button className="navbar-toggler" type="button" aria-label="Abrir menú"
            onClick={() => setMenuAbierto(!menuAbierto)}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={'collapse navbar-collapse' + (menuAbierto ? ' show' : '')}>
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              <li className="nav-item">
                <NavLink to="/" end className={claseEnlace} onClick={cerrarMenu}>Inicio</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/carta" className={claseEnlace} onClick={cerrarMenu}>Carta</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/promociones" className={claseEnlace} onClick={cerrarMenu}>Promociones</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/nosotros" className={claseEnlace} onClick={cerrarMenu}>Nosotros</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contacto" className={claseEnlace} onClick={cerrarMenu}>Contacto</NavLink>
              </li>
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link to="/reservar" className="btn btn-warning fw-bold" onClick={cerrarMenu}>
                  <i className="bi bi-calendar-check me-1"></i>Reservar
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="bg-dark text-white-50 py-4">
        <div className="container text-center small">
          &copy; 2026 El Rincón del Gustito &middot; Todos los días de 9:00 a 22:00
        </div>
      </footer>
    </div>
  )
}