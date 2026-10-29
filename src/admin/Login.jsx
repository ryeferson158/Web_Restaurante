import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Datos de acceso de prueba (en un proyecto real esto iría en un servidor)
const USUARIO = 'admin'
const CLAVE = '1234'

export default function Login() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')

  const ingresar = (e) => {
    e.preventDefault()
    if (usuario === USUARIO && clave === CLAVE) {
      sessionStorage.setItem('rincon_admin', 'si')
      navigate('/admin')
    } else {
      setError('Usuario o clave incorrectos.')
    }
  }

  return (
    <div className="min-vh-100 bg-dark d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4">
                <h3 className="text-center fw-bold mb-1">
                  <i className="bi bi-egg-fried text-warning me-2"></i>Administración
                </h3>
                <p className="text-center text-muted">El Rincón del Gustito</p>

                <form onSubmit={ingresar}>
                  <div className="mb-3">
                    <label htmlFor="usuario" className="form-label fw-bold">Usuario</label>
                    <input id="usuario" type="text" className="form-control" required
                      value={usuario} onChange={(e) => { setUsuario(e.target.value); setError('') }} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="clave" className="form-label fw-bold">Clave</label>
                    <input id="clave" type="password" className="form-control" required
                      value={clave} onChange={(e) => { setClave(e.target.value); setError('') }} />
                  </div>

                  {error && <div className="alert alert-danger py-2">{error}</div>}

                  <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                </form>

                <div className="alert alert-info small mt-3 mb-2">
                  Para la demo: usuario <strong>admin</strong> y clave <strong>1234</strong>
                </div>
                <div className="text-center">
                  <Link to="/" className="small">Volver al sitio del restaurante</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}