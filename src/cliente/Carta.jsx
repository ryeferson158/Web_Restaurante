import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useReservas } from '../context/ReservasContext.jsx'
import { categoriasMenu } from '../data/datos.js'

export default function Carta() {
  const { platos } = useReservas()
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  // Filtra los platos según el botón seleccionado
  const platosFiltrados = useMemo(() => {
    if (categoriaActiva === 'Todos') return platos
    return platos.filter((p) => (p.categoria || 'Platos de Fondo') === categoriaActiva)
  }, [platos, categoriaActiva])

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bolder">Nuestra carta</h1>
        <p className="lead text-muted">Elige tu platillo favorito, postre o bebida y reserva tu mesa.</p>
      </div>

      {/* Botones de Categorías */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
        <button
          type="button"
          className={`btn ${categoriaActiva === 'Todos' ? 'btn-dark' : 'btn-outline-secondary'}`}
          onClick={() => setCategoriaActiva('Todos')}
        >
          Ver todo ({platos.length})
        </button>

        {categoriasMenu.map((cat) => {
          const cantidad = platos.filter((p) => (p.categoria || 'Platos de Fondo') === cat).length
          return (
            <button
              key={cat}
              type="button"
              className={`btn ${categoriaActiva === cat ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat} ({cantidad})
            </button>
          )
        })}
      </div>

      {/* Cuadrícula de Platos */}
      <div className="row g-4">
        {platosFiltrados.map((plato) => (
          <div className="col-md-6 col-lg-4" key={plato.id}>
            <div className={'card h-100 shadow border-0' + (plato.disponible ? '' : ' plato-agotado')}>
              <div className="position-relative">
                <img
                  src={plato.imagen}
                  alt={plato.nombre}
                  className="card-img-top"
                  style={{ height: 200, objectFit: 'cover' }}
                />
                <span
                  className="badge bg-dark bg-opacity-75 text-white position-absolute top-0 end-0 m-2"
                  style={{ fontSize: '0.72rem' }}
                >
                  {plato.categoria || 'Platos de Fondo'}
                </span>
              </div>

              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title fw-bold mb-0">{plato.nombre}</h5>
                  <span className="text-dark fw-bold">S/{plato.precio.toFixed(2)}</span>
                </div>
                <p className="card-text text-muted small flex-grow-1">{plato.descripcion}</p>
                {!plato.disponible && <span className="badge bg-secondary mb-2 align-self-start">Agotado hoy</span>}
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