import { mesas, horarios } from '../data/datos.js'
import { aMinutos, DURACION_MIN, reservasDelDia } from '../utils/reservas.js'

// Tabla de horas x mesas de un día (rojo = ocupada, verde = libre)
export default function TablaOcupacion({ reservas, fecha }) {
  const delDia = reservasDelDia(reservas, fecha)

  // Reserva que tiene la mesa ocupada en ese tramo (si hay una)
  const buscar = (mesa, hora) => {
    const tramo = aMinutos(hora)
    return delDia.find(
      (r) =>
        Number(r.mesa) === mesa &&
        aMinutos(r.hora) <= tramo &&
        tramo < aMinutos(r.hora) + DURACION_MIN
    )
  }

  return (
    <div className="table-responsive" style={{ maxHeight: 420 }}>
      <table className="table table-bordered text-center align-middle mb-0">
        <thead className="table-light sticky-top">
          <tr>
            <th>Hora</th>
            {mesas.map((m) => <th key={m.id}>{m.nombre}</th>)}
          </tr>
        </thead>
        <tbody>
          {horarios.map((hora) => (
            <tr key={hora}>
              <td className="fw-bold bg-light">{hora}</td>
              {mesas.map((m) => {
                const reserva = buscar(m.id, hora)
                return (
                  <td key={m.id} className={reserva ? 'bg-danger-subtle' : 'bg-success-subtle'}>
                    {!reserva && <span className="badge bg-success">Libre</span>}
                    {reserva && reserva.hora === hora && (
                      <>
                        <div className="small fw-bold">{reserva.cliente}</div>
                        <div className="small text-muted">{reserva.personas} pers.</div>
                      </>
                    )}
                    {reserva && reserva.hora !== hora && (
                      <span className="small text-muted">Ocupada</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}