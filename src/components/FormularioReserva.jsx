import { useEffect, useState } from 'react'
import { useReservas } from '../context/ReservasContext.jsx'
import CalendarioMensual from './CalendarioMensual.jsx'
import { ADELANTO_POR_PERSONA, datosPago, horarios, metodosPago } from '../data/datos.js'
import {
  DURACION_MIN,
  fechaISO,
  formatearFecha,
  horaDisponible,
  horaFin,
  horaPasada,
  mesasOcupadas,
} from '../utils/reservas.js'

/*
  Formulario de reserva: lo usan el cliente (/reservar) y el administrador.

  Props:
    onGuardar      -> recibe los datos y devuelve { ok, mensaje }
    textoBoton     -> texto del botón
    mostrarConteo  -> el calendario muestra cuántas reservas tiene cada día (solo admin)
    reservaInicial -> (opcional) si se envía, el formulario EDITA esa reserva
*/

const datosVacios = () => ({
  cliente: '',
  telefono: '',
  correo: '',
  fecha: fechaISO(0),
  hora: '',
  personas: 2,
  mesa: '',
  comentarios: '',
  metodo: metodosPago[0],
  operacion: '',
})

// Datos del formulario cuando se edita una reserva
const datosDeReserva = (r) => ({
  cliente: r.cliente,
  telefono: r.telefono,
  correo: r.correo || '',
  fecha: r.fecha,
  hora: r.hora,
  personas: r.personas,
  mesa: r.mesa,
  comentarios: r.comentarios || '',
  metodo: metodosPago[0],
  operacion: '',
})

export default function FormularioReserva({
  onGuardar,
  textoBoton = 'Confirmar reserva',
  mostrarConteo = false,
  reservaInicial = null,
}) {
  const { reservas, mesas } = useReservas()
  const editando = Boolean(reservaInicial)

  // useState: datos del formulario, mesas ocupadas y aviso
  const [datos, setDatos] = useState(editando ? datosDeReserva(reservaInicial) : datosVacios())
  const [ocupadas, setOcupadas] = useState([])
  const [aviso, setAviso] = useState(null)

  // Al editar, la reserva no debe contarse a sí misma como "ocupada"
  const reservasVisibles = editando ? reservas.filter((r) => r.id !== reservaInicial.id) : reservas

  // ¿Hay una mesa disponible y libre a esa hora, y aún no pasó?
  const horaLibre = (hora) =>
    (editando || !horaPasada(datos.fecha, hora)) &&
    horaDisponible(reservasVisibles, datos.fecha, hora, datos.personas, mesas)

  // useEffect 1: recalcula las mesas ocupadas al cambiar fecha u hora
  useEffect(() => {
    setOcupadas(datos.hora ? mesasOcupadas(reservasVisibles, datos.fecha, datos.hora) : [])
  }, [reservas, datos.fecha, datos.hora])

  // useEffect 2: si la hora elegida ya no está libre, se deselecciona
  useEffect(() => {
    if (datos.hora && !horaLibre(datos.hora)) {
      setDatos((anteriores) => ({ ...anteriores, hora: '' }))
    }
  }, [reservas, mesas, datos.fecha, datos.hora, datos.personas])

  // useEffect 3: si la mesa elegida ya no sirve (ocupada, pequeña o no disponible), se deselecciona
  useEffect(() => {
    const mesaElegida = mesas.find((m) => m.id === Number(datos.mesa))
    if (
      mesaElegida &&
      (mesaElegida.estado !== 'Disponible' ||
        ocupadas.includes(mesaElegida.id) ||
        mesaElegida.capacidad < Number(datos.personas))
    ) {
      setDatos((anteriores) => ({ ...anteriores, mesa: '' }))
    }
  }, [ocupadas, mesas, datos.personas, datos.mesa])

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
    setAviso(null)
  }

  const elegirFecha = (fecha) => {
    setDatos({ ...datos, fecha })
    setAviso(null)
  }

  const elegirHora = (hora) => {
    setDatos({ ...datos, hora })
    setAviso(null)
  }

  const enviar = (e) => {
    e.preventDefault()
    const resultado = onGuardar(datos)
    setAviso({ tipo: resultado.ok ? 'success' : 'danger', texto: resultado.mensaje })
    if (resultado.ok && !editando) setDatos({ ...datosVacios(), fecha: datos.fecha })
  }

  const duracionTexto = `${Math.floor(DURACION_MIN / 60)} h ${DURACION_MIN % 60} min`
  const montoAdelanto = Number(datos.personas) * ADELANTO_POR_PERSONA

  return (
    <form onSubmit={enviar}>
      <div className="row g-4">
        <div className="col-lg-5">
          <label className="form-label fw-bold">1. Elige el día</label>
          <CalendarioMensual
            reservas={reservas}
            fechaSeleccionada={datos.fecha}
            onSeleccionar={elegirFecha}
            fechaMinima={editando ? undefined : fechaISO(0)}
            mostrarConteo={mostrarConteo}
          />
          <div className="mt-2">
            Día elegido: <strong>{formatearFecha(datos.fecha)}</strong>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="mb-3">
            <label htmlFor="personas" className="form-label fw-bold">2. Número de personas</label>
            <select id="personas" name="personas" className="form-select" value={datos.personas} onChange={cambiar}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">3. Hora de llegada</label>
            <div className="d-flex flex-wrap gap-2">
              {horarios.map((hora) => {
                const libre = horaLibre(hora)
                const elegida = datos.hora === hora
                return (
                  <button
                    key={hora}
                    type="button"
                    disabled={!libre}
                    title={libre ? 'Disponible' : 'No hay mesas libres a esa hora'}
                    className={`btn btn-sm ${elegida ? 'btn-dark' : libre ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                    onClick={() => elegirHora(hora)}
                  >
                    {hora}
                  </button>
                )
              })}
            </div>
            <div className="form-text">
              {datos.hora
                ? `Tu mesa quedará reservada de ${datos.hora} a ${horaFin(datos.hora)} (${duracionTexto}).`
                : `Cada reserva dura ${duracionTexto}. Las horas en gris no tienen mesas libres.`}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="mesa" className="form-label fw-bold">4. Mesa</label>
            <select id="mesa" name="mesa" className="form-select" required disabled={!datos.hora}
              value={datos.mesa} onChange={cambiar}>
              <option value="">{datos.hora ? 'Elige una mesa...' : 'Primero elige la hora'}</option>
              {mesas.map((m) => {
                const noDisponible = m.estado !== 'Disponible'
                const estaOcupada = ocupadas.includes(m.id)
                const muyPequena = m.capacidad < Number(datos.personas)
                return (
                  <option key={m.id} value={m.id} disabled={noDisponible || estaOcupada || muyPequena}>
                    {m.nombre} - {m.zona} (hasta {m.capacidad})
                    {noDisponible ? ` - ${m.estado.toUpperCase()}` : estaOcupada ? ' - OCUPADA' : muyPequena ? ' - muy pequeña' : ''}
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        <div className="col-12"><hr className="my-0" /></div>

        <div className="col-md-4">
          <label htmlFor="cliente" className="form-label fw-bold">Nombre completo</label>
          <input id="cliente" name="cliente" type="text" className="form-control"
            placeholder="Ej. Juan Pérez" required value={datos.cliente} onChange={cambiar} />
        </div>

        <div className="col-md-4">
          <label htmlFor="telefono" className="form-label fw-bold">Teléfono</label>
          <input id="telefono" name="telefono" type="tel" className="form-control"
            placeholder="999 999 999" required value={datos.telefono} onChange={cambiar} />
        </div>

        <div className="col-md-4">
          <label htmlFor="correo" className="form-label fw-bold">Correo electrónico</label>
          <input id="correo" name="correo" type="email" className="form-control"
            placeholder="micorreo@mail.com" required value={datos.correo} onChange={cambiar} />
        </div>

        <div className="col-12">
          <label htmlFor="comentarios" className="form-label fw-bold">Comentarios o alergias (opcional)</label>
          <textarea id="comentarios" name="comentarios" rows="2" className="form-control"
            value={datos.comentarios} onChange={cambiar}></textarea>
        </div>

        {/* Pago por adelanto (solo al crear la reserva) */}
        {!editando && (
          <div className="col-12">
            <div className="card border-warning bg-warning-subtle">
              <div className="card-body">
                <h6 className="fw-bold">
                  <i className="bi bi-cash-coin me-2"></i>Pago por adelanto: S/ {montoAdelanto.toFixed(2)}
                </h6>
                <p className="small mb-3">
                  Para aprobar tu reserva se paga un adelanto de S/ {ADELANTO_POR_PERSONA} por persona.
                  Paga al número <strong>{datosPago.numero}</strong> a nombre de <strong>{datosPago.titular}</strong> y
                  escribe aquí el código de operación. El restaurante verificará el pago y confirmará tu reserva.
                </p>
                <div className="row g-2">
                  <div className="col-md-5">
                    <label htmlFor="metodo" className="form-label fw-bold small mb-1">Método de pago</label>
                    <select id="metodo" name="metodo" className="form-select" value={datos.metodo} onChange={cambiar}>
                      {metodosPago.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="col-md-7">
                    <label htmlFor="operacion" className="form-label fw-bold small mb-1">Código de operación</label>
                    <input id="operacion" name="operacion" type="text" className="form-control"
                      placeholder="Ej. 123456" required value={datos.operacion} onChange={cambiar} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {aviso && (
          <div className="col-12">
            <div className={`alert alert-${aviso.tipo} mb-0`} role="alert">{aviso.texto}</div>
          </div>
        )}

        <div className="col-12 d-grid">
          <button type="submit" className="btn btn-warning btn-lg fw-bold">
            <i className="bi bi-calendar-check me-2"></i>{textoBoton}
          </button>
        </div>
      </div>
    </form>
  )
}
