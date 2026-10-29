import BadgeEstado from './BadgeEstado.jsx'
import { formatearFecha, horaFin } from '../utils/reservas.js'

// Tabla de reservas. Si recibe onCambiarEstado, muestra los botones Aprobar / Cancelar
export default function ListaReservas({ reservas, onCambiarEstado }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th>Cliente</th>
            <th>Fecha / Hora</th>
            <th>Mesa</th>
            <th>Personas</th>
            <th>Estado</th>
            {onCambiarEstado && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {reservas.length === 0 && (
            <tr>
              <td colSpan={onCambiarEstado ? 6 : 5} className="text-center text-muted py-4">
                No hay reservas para mostrar.
              </td>
            </tr>
          )}

          {reservas.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="fw-bold">{r.cliente}</div>
                <div className="small text-muted">{r.telefono}</div>
                {r.correo && <div className="small text-muted">{r.correo}</div>}
              </td>
              <td>{formatearFecha(r.fecha)}<div className="small text-muted">{r.hora} a {horaFin(r.hora)}</div></td>
              <td>Mesa 0{r.mesa}</td>
              <td>{r.personas}</td>
              <td><BadgeEstado estado={r.estado} /></td>
              {onCambiarEstado && (
                <td className="text-nowrap">
                  {r.estado === 'Pendiente' && (
                    <button className="btn btn-sm btn-outline-success me-1"
                      onClick={() => onCambiarEstado(r.id, 'Confirmada')}>
                      Aprobar
                    </button>
                  )}
                  {(r.estado === 'Pendiente' || r.estado === 'Confirmada') && (
                    <button className="btn btn-sm btn-outline-danger"
                      onClick={() => onCambiarEstado(r.id, 'Cancelada')}>
                      Cancelar
                    </button>
                  )}
                  {r.estado !== 'Pendiente' && r.estado !== 'Confirmada' && (
                    <span className="text-muted small">Sin acciones</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}