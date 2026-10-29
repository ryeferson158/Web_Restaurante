import { useState } from 'react'
import { useReservas } from '../context/ReservasContext.jsx'
import ListaReservas from '../components/ListaReservas.jsx'
import FormularioReserva from '../components/FormularioReserva.jsx'
import { ordenarPorFecha } from '../utils/reservas.js'

export default function Reservas() {
  const { reservas, cambiarEstado, agregarReserva } = useReservas()

  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [mostrarModal, setMostrarModal] = useState(false)

  const filtradas = ordenarPorFecha(reservas).filter(
    (r) =>
      r.cliente.toLowerCase().includes(busqueda.toLowerCase()) &&
      (filtroEstado === 'Todos' || r.estado === filtroEstado)
  )

  // El admin registra la reserva ya como "Confirmada" (por ejemplo, una llamada telefónica)
  const guardar = (datos) => {
    const resultado = agregarReserva(datos, 'Confirmada')
    if (resultado.ok) setMostrarModal(false)
    return resultado
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="fw-bold mb-0">Reservas</h2>
          <p className="text-muted mb-0">Aprueba, cancela o registra reservas.</p>
        </div>
        <button className="btn btn-primary fw-bold" onClick={() => setMostrarModal(true)}>
          <i className="bi bi-plus-lg me-1"></i>Nueva reserva
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input type="text" className="form-control" placeholder="Buscar por nombre del cliente..."
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option>Todos</option>
            <option>Pendiente</option>
            <option>Confirmada</option>
            <option>Completada</option>
            <option>Vencida</option>
            <option>Cancelada</option>
          </select>
        </div>
      </div>

      <div className="card shadow-sm border-0 p-3">
        <ListaReservas reservas={filtradas} onCambiarEstado={cambiarEstado} />
      </div>

      {mostrarModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(34, 34, 34, 0.6)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Registrar nueva reserva</h5>
                <button type="button" className="btn-close" aria-label="Cerrar"
                  onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body">
                <FormularioReserva onGuardar={guardar} textoBoton="Guardar reserva" mostrarConteo />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}