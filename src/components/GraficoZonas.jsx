import { useMemo } from 'react'

const COLORES = [
  '#2E7D5B', // Verde menta suave
  '#C99A45', // Dorado cálido
  '#4A5568', // Gris pizarra elegante
  '#E07A5F', // Terracota cálido
  '#8E9AAF', // Azul grisáceo
]

export default function GraficoZonas({ reservas, mesas }) {
  const datosZonas = useMemo(() => {
    const aprobadas = reservas.filter(
      (r) => r.estado === 'Confirmada' || r.estado === 'Completada'
    )

    const mapaMesas = {}
    mesas.forEach((m) => {
      mapaMesas[m.id] = m.zona || 'Sin zona'
    })

    const conteo = {}
    aprobadas.forEach((r) => {
      const zona = mapaMesas[Number(r.mesa)] || 'Otras'
      conteo[zona] = (conteo[zona] || 0) + 1
    })

    const total = aprobadas.length

    const zonas = Object.entries(conteo).map(([nombre, cantidad], index) => {
      const porcentaje = total > 0 ? Math.round((cantidad / total) * 100) : 0
      return {
        nombre,
        cantidad,
        porcentaje,
        color: COLORES[index % COLORES.length],
      }
    })

    zonas.sort((a, b) => b.cantidad - a.cantidad)

    return { zonas, total }
  }, [reservas, mesas])

  const { gradiente, leyenda } = useMemo(() => {
    const { zonas, total } = datosZonas
    if (total === 0) {
      return { gradiente: '#E9E5DD', leyenda: [] }
    }

    let acumulado = 0
    const tramos = zonas.map((z) => {
      const inicio = acumulado
      const fin = acumulado + (z.cantidad / total) * 100
      acumulado = fin
      return `${z.color} ${inicio}% ${fin}%`
    })

    return {
      gradiente: `conic-gradient(${tramos.join(', ')})`,
      leyenda: zonas,
    }
  }, [datosZonas])

  return (
    <div className="card shadow-sm border-0 p-3 h-100 d-flex flex-column">
      {/* Cabecera */}
      <div className="mb-2">
        <h5 className="fw-bold mb-1">
          <i className="bi bi-pie-chart-fill text-warning me-2"></i>
          Preferencia por zonas
        </h5>
        <p className="small text-muted mb-0">
          Distribución de <strong>{datosZonas.total} reservas confirmadas</strong> por ambiente.
        </p>
      </div>

      {/* Gráfico y Leyenda centrados verticalmente */}
      {datosZonas.total === 0 ? (
        <div className="my-auto text-center text-muted py-4 small">
          No hay reservas confirmadas para calcular las zonas.
        </div>
      ) : (
        <div className="row align-items-center g-3 my-auto py-2">
          {/* Dona */}
          <div className="col-5 d-flex justify-content-center">
            <div
              style={{
                width: '145px',
                height: '145px',
                borderRadius: '50%',
                background: gradiente,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 8px rgba(0,0,0,0.06)',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="fw-bold fs-4 text-dark mb-0 lh-1">{datosZonas.total}</span>
                <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                  reservas
                </span>
              </div>
            </div>
          </div>

          {/* Leyenda */}
          <div className="col-7">
            <ul className="list-unstyled mb-0 d-flex flex-column gap-2 pe-1">
              {leyenda.map((item) => (
                <li key={item.nombre} className="d-flex align-items-center justify-content-between small">
                  <div className="d-flex align-items-center text-truncate me-2">
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        backgroundColor: item.color,
                        borderRadius: '3px',
                        display: 'inline-block',
                      }}
                      className="me-2 flex-shrink-0"
                    ></span>
                    <span className="fw-semibold text-truncate" title={item.nombre}>
                      {item.nombre}
                    </span>
                  </div>
                  <div className="text-nowrap">
                    <span className="fw-bold">{item.porcentaje}%</span>{' '}
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      ({item.cantidad})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Pie de la tarjeta fijado abajo con mt-auto */}
      <div className="small text-muted mt-auto pt-2 border-top d-flex align-items-center" style={{ minHeight: '31px' }}>
        <span>
          <i className="bi bi-arrow-repeat me-1"></i>Actualizado en tiempo real con las reservas.
        </span>
      </div>
    </div>
  )
}