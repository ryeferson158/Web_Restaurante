import { useReservas } from '../context/ReservasContext.jsx'
import ListaReservas from '../components/ListaReservas.jsx'
import { fechaISO, ordenarPorFecha } from '../utils/reservas.js'

export default function Dashboard() {
  const { reservas, cambiarEstado } = useReservas()

  const hoy = fechaISO(0)
  const total = reservas.length
  const pendientes = reservas.filter((r) => r.estado === 'Pendiente')
  const confirmadas = reservas.filter((r) => r.estado === 'Confirmada').length
  const completadas = reservas.filter((r) => r.estado === 'Completada').length
  const canceladas = reservas.filter((r) => r.estado === 'Cancelada').length
  const deHoy = reservas.filter((r) => r.fecha === hoy && r.estado !== 'Cancelada')

  const tarjetas = [
    { titulo: 'Reservas totales', valor: total, color: 'bg-secondary text-white' },
    { titulo: 'Pendientes', valor: pendientes.length, color: 'bg-warning text-dark' },
    { titulo: 'Confirmadas', valor: confirmadas, color: 'bg-success text-white' },
    { titulo: 'Completadas', valor: completadas, color: 'bg-dark text-white' },
    { titulo: 'Canceladas', valor: canceladas, color: 'bg-danger text-white' },
  ]

  return (
    <div>
      <h2 className="fw-bold">Dashboard</h2>
      <p className="text-muted">Resumen de las reservas del restaurante.</p>

      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div className="col-6 col-xl" key={t.titulo}>
            <div className={`card border-0 shadow-sm ${t.color}`}>
              <div className="card-body">
                <div className="small fw-bold text-uppercase">{t.titulo}</div>
                <div className="display-6 fw-bold">{t.valor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm border-0 p-3 mb-4">
        <h5 className="fw-bold mb-3">Solicitudes pendientes de aprobar</h5>
        <ListaReservas reservas={ordenarPorFecha(pendientes)} onCambiarEstado={cambiarEstado} />
      </div>

      <div className="card shadow-sm border-0 p-3">
        <h5 className="fw-bold mb-3">Reservas de hoy</h5>
        <ListaReservas reservas={ordenarPorFecha(deHoy)} />
      </div>
    </div>
  )
}