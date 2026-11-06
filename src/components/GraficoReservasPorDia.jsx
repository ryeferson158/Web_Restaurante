import { useMemo, useState } from 'react'
import { fechaISO } from '../utils/reservas.js'

// Formato compacto para que las fechas nunca choquen: "Sáb 7", "Dom 8", etc.
function etiquetaCorta(fecha, index) {
  if (index === 0) return 'Hoy'
  if (index === 1) return 'Mañana'
  const d = new Date(fecha + 'T00:00:00')
  const diaSemana = d.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '')
  const diaMes = d.getDate()
  return `${diaSemana} ${diaMes}`
}

export default function GraficoReservasPorDia({ reservas }) {
  const [diasMostrar, setDiasMostrar] = useState(7)
  const [diaHover, setDiaHover] = useState(null)

  const datosGrafico = useMemo(() => {
    const dias = []

    for (let i = 0; i < diasMostrar; i++) {
      const fecha = fechaISO(i)

      const reservasAprobadas = reservas.filter(
        (r) => r.fecha === fecha && (r.estado === 'Confirmada' || r.estado === 'Completada')
      )

      const totalPersonas = reservasAprobadas.reduce((acc, r) => acc + Number(r.personas), 0)
      const totalReservas = reservasAprobadas.length

      dias.push({
        fecha,
        etiqueta: etiquetaCorta(fecha, i),
        totalPersonas,
        totalReservas,
      })
    }

    return dias
  }, [reservas, diasMostrar])

  // Damos un 15% de margen superior para que el número más alto nunca choque con el techo
  const maxReal = Math.max(...datosGrafico.map((d) => d.totalPersonas), 4)
  const maxEscala = Math.ceil(maxReal * 1.15)

  const totalPersonasPeriodo = datosGrafico.reduce((acc, d) => acc + d.totalPersonas, 0)
  const totalReservasPeriodo = datosGrafico.reduce((acc, d) => acc + d.totalReservas, 0)

  return (
    <div className="card shadow-sm border-0 p-3 h-100 d-flex flex-column">
      {/* Cabecera */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h5 className="fw-bold mb-1">
            <i className="bi bi-bar-chart-fill text-warning me-2"></i>
            Comensales confirmados por día
          </h5>
          <p className="small text-muted mb-0">
            Total próximos {diasMostrar} días:{' '}
            <strong>{totalPersonasPeriodo} personas</strong> en{' '}
            <strong>{totalReservasPeriodo} reserva(s)</strong>.
          </p>
        </div>

        <div className="btn-group btn-group-sm">
          <button
            type="button"
            className={`btn ${diasMostrar === 7 ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setDiasMostrar(7)}
          >
            7 días
          </button>
          <button
            type="button"
            className={`btn ${diasMostrar === 14 ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setDiasMostrar(14)}
          >
            14 días
          </button>
        </div>
      </div>

      {/* Contenedor del Gráfico con Cuadrícula */}
      <div className="my-auto px-1 position-relative">
        {/* Líneas guía sutiles */}
        <div
          className="position-absolute w-100 d-flex flex-column justify-content-between pointer-events-none"
          style={{ height: '165px', top: '25px', left: 0, zIndex: 0 }}
        >
          <div style={{ borderBottom: '1px dashed #EAE6DF', width: '100%' }}></div>
          <div style={{ borderBottom: '1px dashed #EAE6DF', width: '100%' }}></div>
          <div style={{ borderBottom: '1px solid #D8D2C7', width: '100%' }}></div>
        </div>

        {/* Columnas */}
        <div
          className="d-flex align-items-end justify-content-between position-relative"
          style={{ height: '190px', zIndex: 1 }}
        >
          {datosGrafico.map((item) => {
            const porcentaje = Math.round((item.totalPersonas / maxEscala) * 100)
            const tieneDatos = item.totalPersonas > 0
            const esHover = diaHover === item.fecha

            return (
              <div
                key={item.fecha}
                className="d-flex flex-column align-items-center h-100 justify-content-end"
                style={{ flex: 1 }}
                onMouseEnter={() => setDiaHover(item.fecha)}
                onMouseLeave={() => setDiaHover(null)}
              >
                {/* Número flotante */}
                <span
                  className="small fw-bold mb-1"
                  style={{
                    fontSize: '0.8rem',
                    color: tieneDatos ? '#1E2229' : '#A0AAB5',
                    transition: 'transform 0.15s ease',
                    transform: esHover ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  {item.totalPersonas}
                </span>

                {/* Barra */}
                <div
                  style={{
                    width: diasMostrar === 7 ? '60px' : '28px', // <-- Aquí aumentamos el grosor
                    height: tieneDatos ? `${Math.max(porcentaje, 6)}%` : '0%',
                    backgroundColor: esHover ? '#246348' : '#2E7D5B',
                    borderRadius: '7px 7px 0 0',
                    transition: 'all 0.25s ease',
                    boxShadow: tieneDatos && esHover ? '0 4px 12px rgba(46, 125, 91, 0.35)' : 'none',
                    cursor: tieneDatos ? 'pointer' : 'default',
                  }}
                  title={`${item.etiqueta}: ${item.totalPersonas} personas (${item.totalReservas} reservas)`}
                ></div>

                {/* Etiqueta del Día (compacta: "Hoy", "Mañana", "sáb 7", "dom 8") */}
                <div
                  className="text-center small mt-2 w-100 text-capitalize"
                  style={{
                    fontSize: '0.74rem',
                    color: esHover ? '#1E2229' : '#77736C',
                    fontWeight: esHover ? '600' : '400',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.etiqueta}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pie de la tarjeta */}
      <div className="small text-muted mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
        <span>
          <i className="bi bi-info-circle me-1"></i>
          Reservas confirmadas o completadas.
        </span>
        <span
          className="badge"
          style={{ backgroundColor: '#2E7D5B', color: '#ffffff', fontWeight: '600' }}
        >
          Pico: {maxReal > 4 ? maxReal : 0} personas
        </span>
      </div>
    </div>
  )
}