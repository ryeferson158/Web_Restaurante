import FormularioReserva from '../components/FormularioReserva.jsx'
import { useReservas } from '../context/ReservasContext.jsx'

export default function Reservar() {
  const { agregarReserva } = useReservas()

  const guardar = (datos) => {
    const resultado = agregarReserva(datos, 'Pendiente')
    if (resultado.ok) {
      return { ok: true, mensaje: '¡Solicitud enviada! El restaurante la confirmará a la brevedad.' }
    }
    return resultado
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bolder">Reserva una mesa</h1>
        <p className="lead text-muted">Elige el día en el calendario y tu hora de llegada. Cada reserva dura 1 h 30 min.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-xl-10">
          <div className="card shadow border-0 p-4">
            <FormularioReserva onGuardar={guardar} textoBoton="Enviar solicitud" />
          </div>
        </div>
      </div>
    </div>
  )
}