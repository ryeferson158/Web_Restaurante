import { useState } from 'react'
import { useReservas } from '../context/ReservasContext.jsx'
import CalendarioMensual from '../components/CalendarioMensual.jsx'
import TablaOcupacion from '../components/TablaOcupacion.jsx'
import ListaReservas from '../components/ListaReservas.jsx'
import { fechaISO, formatearFecha, ordenarPorFecha, reservasDelDia } from '../utils/reservas.js'

export default function Calendario() {
  const { reservas } = useReservas()
  const [fecha, setFecha] = useState(fechaISO(0))

  return (
    <div>
      <h2 className="fw-bold">Calendario y horarios</h2>
      <p className="text-muted">Haz clic en un día para ver qué mesas y horarios están ocupados.</p>

      <div className="row g-4">
        <div className="col-lg-5">
          <CalendarioMensual reservas={reservas} fechaSeleccionada={fecha} onSeleccionar={setFecha} />
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-3 mb-4">
            <h5 className="fw-bold mb-3">Ocupación del {formatearFecha(fecha)}</h5>
            <TablaOcupacion reservas={reservas} fecha={fecha} />
          </div>

          <div className="card shadow-sm border-0 p-3">
            <h5 className="fw-bold mb-3">Reservas de ese día</h5>
            <ListaReservas reservas={ordenarPorFecha(reservasDelDia(reservas, fecha))} />
          </div>
        </div>
      </div>
    </div>
  )
}