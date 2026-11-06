import FormularioReserva from './FormularioReserva.jsx'
import { useReservas } from '../context/ReservasContext.jsx'

// Ventana para corregir una reserva (se usa en el Dashboard y en Reservas)
export default function ModalEditarReserva({ reserva, onCerrar }) {
  const { editarReserva } = useReservas()

  const guardar = (datos) => {
    const resultado = editarReserva(reserva.id, datos)
    if (resultado.ok) onCerrar()
    return resultado
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(34, 34, 34, 0.6)' }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Editar reserva de {reserva.cliente}</h5>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
          </div>
          <div className="modal-body">
            <FormularioReserva reservaInicial={reserva} onGuardar={guardar} textoBoton="Guardar cambios" mostrarConteo />
          </div>
        </div>
      </div>
    </div>
  )
}
