import { useState } from 'react'
import { estadosMesa } from '../data/datos.js'

/*
  Formulario para crear o editar una mesa.

  Props:
    onGuardar   -> recibe { nombre, capacidad, zona, estado } y devuelve { ok, mensaje }
    mesaInicial -> (opcional) si se envía, se edita esa mesa
*/
export default function FormularioMesa({ onGuardar, mesaInicial = null }) {
  const [datos, setDatos] = useState(
    mesaInicial
      ? { nombre: mesaInicial.nombre, capacidad: mesaInicial.capacidad, zona: mesaInicial.zona, estado: mesaInicial.estado }
      : { nombre: '', capacidad: 4, zona: '', estado: 'Disponible' }
  )
  const [aviso, setAviso] = useState(null)

  const cambiar = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
    setAviso(null)
  }

  const enviar = (e) => {
    e.preventDefault()
    const resultado = onGuardar(datos)
    if (!resultado.ok) setAviso(resultado.mensaje)
  }

  return (
    <form onSubmit={enviar}>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="nombre" className="form-label fw-bold">Nombre</label>
          <input id="nombre" name="nombre" type="text" className="form-control" placeholder="Ej. Mesa 05"
            required value={datos.nombre} onChange={cambiar} />
        </div>
        <div className="col-md-6">
          <label htmlFor="capacidad" className="form-label fw-bold">Capacidad (personas)</label>
          <input id="capacidad" name="capacidad" type="number" min="1" max="20" className="form-control"
            required value={datos.capacidad} onChange={cambiar} />
        </div>
        <div className="col-md-6">
          <label htmlFor="zona" className="form-label fw-bold">Zona</label>
          <input id="zona" name="zona" type="text" className="form-control" placeholder="Ej. Terraza"
            required value={datos.zona} onChange={cambiar} />
        </div>
        <div className="col-md-6">
          <label htmlFor="estado" className="form-label fw-bold">Estado</label>
          <select id="estado" name="estado" className="form-select" value={datos.estado} onChange={cambiar}>
            {estadosMesa.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>

        {aviso && (
          <div className="col-12">
            <div className="alert alert-danger mb-0 py-2">{aviso}</div>
          </div>
        )}

        <div className="col-12">
          <button type="submit" className="btn btn-primary fw-bold">
            {mesaInicial ? 'Guardar cambios' : 'Agregar mesa'}
          </button>
        </div>
      </div>
    </form>
  )
}
