import { Link } from 'react-router-dom'
import { useReservas } from '../context/ReservasContext.jsx'

export default function Carta() {
  const { platos } = useReservas()

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bolder">Nuestra carta</h1>
        <p className="lead text-muted">Elige tu platillo favorito y reserva tu mesa.</p>
      </div>

      <div className="row g-4">
        {platos.map((plato) => (
          <div className="col-md-6 col-lg-4" key={plato.id}>
            <div className={'card h-100 shadow border-0' + (plato.disponible ? '' : ' plato-agotado')}>
              <img src={plato.imagen} alt={plato.nombre} className="card-img-top"
                style={{ height: 200, objectFit: 'cover' }} />
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title fw-bold mb-0">{plato.nombre}</h5>
                  <span className="text-dark fw-bold">S/{plato.precio.toFixed(2)}</span>
                </div>
                <p className="card-text text-muted">{plato.descripcion}</p>
                {!plato.disponible && <span className="badge bg-secondary">Agotado hoy</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-5">
        <Link to="/reservar" className="btn btn-warning btn-lg fw-bold">Reservar una mesa</Link>
      </div>
    </div>
  )
}