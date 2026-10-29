import { useReservas } from '../context/ReservasContext.jsx'

export default function Promociones() {
  const { promociones } = useReservas()

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bolder">Promociones especiales</h1>
        <p className="lead text-muted">Combos y descuentos por tiempo limitado.</p>
      </div>

      <div className="row g-4">
        {promociones.map((promo) => (
          <div className="col-md-6 col-lg-4" key={promo.id}>
            <div className="card h-100 shadow border-0">
              <img src={promo.imagen} alt={promo.nombre} className="card-img-top"
                style={{ height: 200, objectFit: 'cover' }} />
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title fw-bold mb-0">{promo.nombre}</h5>
                  <span className="text-dark fw-bold">S/{promo.precio.toFixed(2)}</span>
                </div>
                <p className="card-text text-muted mb-0">{promo.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}