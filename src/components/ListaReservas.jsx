import BadgeEstado from './BadgeEstado.jsx'
import { useReservas } from '../context/ReservasContext.jsx'
import { formatearFecha, horaFin, pagoVerificado } from '../utils/reservas.js'

/*
  Tabla de reservas.

  Props:
    reservas        -> lista a mostrar
    onCambiarEstado -> (opcional) activa los botones Aprobar y Anular
    onEditar        -> (opcional) activa el botón Editar
    onVerificarPago -> (opcional) activa el botón Verificar pago
*/
export default function ListaReservas({ reservas, onCambiarEstado, onEditar, onVerificarPago }) {
  const { mesas } = useReservas()
  const conAcciones = Boolean(onCambiarEstado)

  const nombreMesa = (id) => mesas.find((m) => m.id === Number(id))?.nombre ?? `Mesa ${id}`

  // Pide confirmación antes de anular, para no hacerlo por error
  const anular = (r) => {
    if (window.confirm(`¿Anular la reserva de ${r.cliente}? La mesa quedará libre.`)) {
      onCambiarEstado(r.id, 'Cancelada')
    }
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th>Cliente</th>
            <th>Fecha / Hora</th>
            <th>Mesa</th>
            <th>Personas</th>
            <th>Adelanto</th>
            <th>Estado</th>
            {conAcciones && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {reservas.length === 0 && (
            <tr>
              <td colSpan={conAcciones ? 7 : 6} className="text-center text-muted py-4">
                No hay reservas para mostrar.
              </td>
            </tr>
          )}

          {reservas.map((r) => {
            const vigente = r.estado === 'Pendiente' || r.estado === 'Confirmada'
            return (
              <tr key={r.id}>
                <td>
                  <div className="fw-bold">{r.cliente}</div>
                  <div className="small text-muted">{r.telefono}</div>
                  {r.correo && <div className="small text-muted">{r.correo}</div>}
                </td>
                <td>
                  {formatearFecha(r.fecha)}
                  <div className="small text-muted">{r.hora} a {horaFin(r.hora)}</div>
                </td>
                <td>{nombreMesa(r.mesa)}</td>
                <td>{r.personas}</td>
                <td>
                  {r.pago ? (
                    <>
                      <div>S/ {r.pago.monto.toFixed(2)}</div>
                      <span className={`badge ${pagoVerificado(r) ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {r.pago.estado}
                      </span>
                      <div className="small text-muted">{r.pago.metodo} · Op. {r.pago.operacion}</div>
                    </>
                  ) : (
                    <span className="text-muted small">-</span>
                  )}
                </td>
                <td><BadgeEstado estado={r.estado} /></td>
                {conAcciones && (
                  <td className="text-nowrap">
                    {r.estado === 'Pendiente' && !pagoVerificado(r) && onVerificarPago && (
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => onVerificarPago(r.id)}>
                        Verificar pago
                      </button>
                    )}
                    {r.estado === 'Pendiente' && (
                      <button className="btn btn-sm btn-outline-success me-1"
                        disabled={!pagoVerificado(r)}
                        title={pagoVerificado(r) ? 'Aprobar la reserva' : 'Primero verifica el pago del adelanto'}
                        onClick={() => onCambiarEstado(r.id, 'Confirmada')}>
                        Aprobar
                      </button>
                    )}
                    {vigente && onEditar && (
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onEditar(r)}>
                        Editar
                      </button>
                    )}
                    {vigente && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => anular(r)}>
                        Anular
                      </button>
                    )}
                    {!vigente && <span className="text-muted small">Sin acciones</span>}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
