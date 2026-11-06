import { useState } from 'react'
import { useReservas } from '../context/ReservasContext.jsx'
import ListaReservas from '../components/ListaReservas.jsx'
import ModalEditarReserva from '../components/ModalEditarReserva.jsx'
import { fechaISO, ordenarPorFecha } from '../utils/reservas.js'
import GraficoReservasPorDia from '../components/GraficoReservasPorDia.jsx'
import GraficoZonas from '../components/GraficoZonas.jsx' // 1. IMPORTAR AQUÍ

export default function Dashboard() {
  const { reservas, mesas, cambiarEstado, verificarPago } = useReservas() // 2. EXTRAER "mesas"
  const [reservaEditando, setReservaEditando] = useState(null)

  const hoy = fechaISO(0)
  const total = reservas.length
  const pendientes = reservas.filter((r) => r.estado === 'Pendiente')
  const confirmadas = reservas.filter((r) => r.estado === 'Confirmada')
  const completadas = reservas.filter((r) => r.estado === 'Completada').length
  const anuladas = reservas.filter((r) => r.estado === 'Cancelada').length
  const proximasConfirmadas = confirmadas.filter((r) => r.fecha >= hoy)

const tarjetas = [
    { titulo: 'Reservas totales', valor: total, icono: 'bi-journal-text', colorTexto: 'text-dark', badge: 'bg-light text-secondary' },
    { titulo: 'Pendientes', valor: pendientes.length, icono: 'bi-clock-history', colorTexto: 'text-warning', badge: 'bg-warning-subtle text-warning-emphasis' },
    { titulo: 'Confirmadas', valor: confirmadas.length, icono: 'bi-check-circle', colorTexto: 'text-success', badge: 'bg-success-subtle text-success-emphasis' },
    { titulo: 'Completadas', valor: completadas, icono: 'bi-check2-all', colorTexto: 'text-secondary', badge: 'bg-secondary-subtle text-secondary-emphasis' },
    { titulo: 'Anuladas', valor: anuladas, icono: 'bi-x-circle', colorTexto: 'text-danger', badge: 'bg-danger-subtle text-danger-emphasis' },
  ]
  
  return (
    <div>
      <h2 className="fw-bold">Dashboard</h2>
      <p className="text-muted">Resumen de las reservas del restaurante.</p>

{/* Tarjetas de métricas modernas */}
      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div className="col-6 col-xl" key={t.titulo}>
            <div className="card border-0 p-3 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-semibold text-muted text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                  {t.titulo}
                </span>
                <span className={`badge ${t.badge} p-2`}>
                  <i className={`bi ${t.icono}`}></i>
                </span>
              </div>
              <div className={`display-6 fw-bold ${t.colorTexto}`}>
                {t.valor}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE REPORTES: BARRAS A LA IZQUIERDA Y CIRCULAR A LA DERECHA */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <GraficoReservasPorDia reservas={reservas} />
        </div>
        <div className="col-lg-5">
          <GraficoZonas reservas={reservas} mesas={mesas} />
        </div>
      </div>

      {/* Solicitudes pendientes de aprobar */}
      <div className="card shadow-sm border-0 p-3 mb-4">
        <h5 className="fw-bold mb-1">Solicitudes pendientes de aprobar</h5>
        <p className="small text-muted">Primero verifica el pago del adelanto; después podrás aprobar la reserva.</p>
        <ListaReservas
          reservas={ordenarPorFecha(pendientes)}
          onCambiarEstado={cambiarEstado}
          onVerificarPago={verificarPago}
          onEditar={setReservaEditando}
        />
      </div>

      {/* Reservas confirmadas */}
      <div className="card shadow-sm border-0 p-3">
        <h5 className="fw-bold mb-1">Reservas confirmadas</h5>
        <p className="small text-muted">Si el cliente cometió un error, puedes editar o anular su reserva.</p>
        <ListaReservas
          reservas={ordenarPorFecha(proximasConfirmadas)}
          onCambiarEstado={cambiarEstado}
          onEditar={setReservaEditando}
        />
      </div>

      {reservaEditando && (
        <ModalEditarReserva reserva={reservaEditando} onCerrar={() => setReservaEditando(null)} />
      )}
    </div>
  )
}