import { useState } from 'react'
import { fechaISO } from '../utils/reservas.js'

// Calendario del mes: cada día muestra cuántas reservas tiene y se puede seleccionar

const nombresMes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
  'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function CalendarioMensual({ reservas, fechaSeleccionada, onSeleccionar, fechaMinima, mostrarConteo = true }) {
  // Mes que se está viendo (empieza en el mes del día seleccionado)
  const [anio, setAnio] = useState(Number(fechaSeleccionada.slice(0, 4)))
  const [mes, setMes] = useState(Number(fechaSeleccionada.slice(5, 7)) - 1)

  const hoy = fechaISO(0)
  const diasDelMes = new Date(anio, mes + 1, 0).getDate()
  // Cuántos espacios vacíos hay antes del día 1 (la semana empieza en lunes)
  const espaciosVacios = (new Date(anio, mes, 1).getDay() + 6) % 7

  const mesAnterior = () => {
    if (mes === 0) { setMes(11); setAnio(anio - 1) } else { setMes(mes - 1) }
  }
  const mesSiguiente = () => {
    if (mes === 11) { setMes(0); setAnio(anio + 1) } else { setMes(mes + 1) }
  }

  const dias = []
  for (let d = 1; d <= diasDelMes; d++) {
    const iso = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const cantidad = reservas.filter((r) => r.fecha === iso && r.estado !== 'Cancelada').length
    dias.push({ d, iso, cantidad })
  }

  return (
    <div className="card shadow-sm border-0 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={mesAnterior}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <h5 className="fw-bold mb-0">{nombresMes[mes]} {anio}</h5>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={mesSiguiente}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>

      <div className="calendario text-center small fw-bold text-secondary mb-1">
        {diasSemana.map((n) => <div key={n}>{n}</div>)}
      </div>

      <div className="calendario">
        {Array.from({ length: espaciosVacios }).map((_, i) => <div key={'v' + i}></div>)}

        {dias.map(({ d, iso, cantidad }) => {
          const elegido = iso === fechaSeleccionada
          const esHoy = iso === hoy
          const bloqueado = fechaMinima ? iso < fechaMinima : false
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSeleccionar(iso)}
              disabled={bloqueado}
              className={`dia btn ${elegido ? 'btn-dark' : esHoy ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
            >
              <div>{d}</div>
              {mostrarConteo && cantidad > 0 && (
                <span className={`badge ${elegido ? 'bg-warning text-dark' : 'bg-success'}`}>{cantidad}</span>
              )}
            </button>
          )
        })}
      </div>

      {mostrarConteo && (
        <div className="small text-muted mt-3">
          El número verde indica cuántas reservas hay ese día.
        </div>
      )}
    </div>
  )
}