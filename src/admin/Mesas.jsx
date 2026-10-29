import { useState } from 'react'
import { useReservas } from '../context/ReservasContext.jsx'
import { mesas } from '../data/datos.js'
import { fechaISO, horaFin, ordenarPorFecha, reservasDelDia } from '../utils/reservas.js'

export default function Mesas() {
  const { reservas } = useReservas()
  const [fecha, setFecha] = useState(fechaISO(0))

  const delDia = ordenarPorFecha(reservasDelDia(reservas, fecha))

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="fw-bold mb-0">Mesas</h2>
          <p className="text-muted mb-0">Estado de cada mesa según la fecha.</p>
        </div>
        <input type="date" className="form-control w-auto" value={fecha}
          onChange={(e) => setFecha(e.target.value)} />
      </div>

      <div className="row g-3">
        {mesas.map((mesa) => {
          const suyas = delDia.filter((r) => Number(r.mesa) === mesa.id)
          return (
            <div className="col-md-6 col-xl-3" key={mesa.id}>
              <div className={`card h-100 shadow-sm ${suyas.length ? 'border-danger' : 'border-success'}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between small text-muted">
                    <span>{mesa.zona}</span>
                    <span>Cap. {mesa.capacidad}</span>
                  </div>
                  <h4 className="fw-bold my-2">{mesa.nombre}</h4>

                  {suyas.length === 0 ? (
                    <span className="badge bg-success">Libre todo el día</span>
                  ) : (
                    <>
                      <span className="badge bg-danger mb-2">{suyas.length} reserva(s)</span>
                      <ul className="list-unstyled small mb-0">
                        {suyas.map((r) => (
                          <li key={r.id}>{r.hora}-{horaFin(r.hora)} {r.cliente} ({r.personas})</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}