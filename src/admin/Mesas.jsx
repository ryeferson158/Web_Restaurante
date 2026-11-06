import { useState } from 'react'
import { useReservas } from '../context/ReservasContext.jsx'
import FormularioMesa from '../components/FormularioMesa.jsx'
import { coloresEstadoMesa, estadosMesa } from '../data/datos.js'
import { fechaISO, horaFin, ordenarPorFecha, reservasDelDia } from '../utils/reservas.js'

export default function Mesas() {
  const { reservas, mesas, agregarMesa, editarMesa, cambiarEstadoMesa, eliminarMesa } = useReservas()

  const [fecha, setFecha] = useState(fechaISO(0))
  const [modal, setModal] = useState(null) // null = cerrado, { mesa: null } = nueva, { mesa } = editar
  const [aviso, setAviso] = useState(null)

  const hoy = fechaISO(0)
  const delDia = ordenarPorFecha(reservasDelDia(reservas, fecha))

  // Reservas de hoy en adelante que siguen vigentes (sirve para avisar si la mesa no está disponible)
  const proximas = (id) =>
    reservas.filter(
      (r) => Number(r.mesa) === id && r.fecha >= hoy && (r.estado === 'Pendiente' || r.estado === 'Confirmada')
    ).length

  const guardar = (datos) => {
    const resultado = modal.mesa ? editarMesa(modal.mesa.id, datos) : agregarMesa(datos)
    if (resultado.ok) {
      setModal(null)
      setAviso({ tipo: 'success', texto: resultado.mensaje })
    }
    return resultado
  }

  const borrar = (mesa) => {
    if (!window.confirm(`¿Eliminar ${mesa.nombre}?`)) return
    const resultado = eliminarMesa(mesa.id)
    setAviso({ tipo: resultado.ok ? 'success' : 'danger', texto: resultado.mensaje })
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="fw-bold mb-0">Mesas</h2>
          <p className="text-muted mb-0">Agrega, edita o elimina mesas y cambia su estado.</p>
        </div>
        <div className="d-flex gap-2">
          <input type="date" className="form-control w-auto" value={fecha}
            onChange={(e) => setFecha(e.target.value)} />
          <button className="btn btn-primary fw-bold text-nowrap" onClick={() => setModal({ mesa: null })}>
            <i className="bi bi-plus-lg me-1"></i>Nueva mesa
          </button>
        </div>
      </div>

      {aviso && (
        <div className={`alert alert-${aviso.tipo} alert-dismissible`} role="alert">
          {aviso.texto}
          <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setAviso(null)}></button>
        </div>
      )}

      <div className="row g-3">
        {mesas.map((mesa) => {
          const suyas = delDia.filter((r) => Number(r.mesa) === mesa.id)
          const disponible = mesa.estado === 'Disponible'
          const pendientes = proximas(mesa.id)
          return (
            <div className="col-md-6 col-xl-3" key={mesa.id}>
              <div className={`card h-100 shadow-sm ${!disponible ? 'border-secondary' : suyas.length ? 'border-danger' : 'border-success'}`}>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between small text-muted">
                    <span>{mesa.zona}</span>
                    <span>Cap. {mesa.capacidad}</span>
                  </div>
                  <h4 className="fw-bold my-2">{mesa.nombre}</h4>

                  <select className="form-select form-select-sm mb-2" value={mesa.estado}
                    aria-label={`Estado de ${mesa.nombre}`}
                    onChange={(e) => cambiarEstadoMesa(mesa.id, e.target.value)}>
                    {estadosMesa.map((e) => <option key={e}>{e}</option>)}
                  </select>

                  {!disponible && (
                    <div className="mb-2">
                      <span className={`badge ${coloresEstadoMesa[mesa.estado]}`}>{mesa.estado}</span>
                      <div className="small text-muted mt-1">No se puede reservar mientras esté así.</div>
                      {pendientes > 0 && (
                        <div className="small text-danger fw-bold">
                          Tiene {pendientes} reserva(s) próxima(s): edítalas para cambiarlas de mesa.
                        </div>
                      )}
                    </div>
                  )}

                  {suyas.length === 0 ? (
                    <span className="badge bg-light text-dark border align-self-start">Sin reservas el día elegido</span>
                  ) : (
                    <>
                      <span className="badge bg-danger mb-2 align-self-start">{suyas.length} reserva(s)</span>
                      <ul className="list-unstyled small mb-2">
                        {suyas.map((r) => (
                          <li key={r.id}>{r.hora}-{horaFin(r.hora)} {r.cliente} ({r.personas})</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div className="mt-auto pt-2 d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setModal({ mesa })}>
                      <i className="bi bi-pencil me-1"></i>Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => borrar(mesa)}>
                      <i className="bi bi-trash me-1"></i>Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {mesas.length === 0 && <p className="text-muted">No hay mesas. Agrega la primera con "Nueva mesa".</p>}

      {modal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(34, 34, 34, 0.6)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{modal.mesa ? `Editar ${modal.mesa.nombre}` : 'Nueva mesa'}</h5>
                <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setModal(null)}></button>
              </div>
              <div className="modal-body">
                <FormularioMesa mesaInicial={modal.mesa} onGuardar={guardar} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
