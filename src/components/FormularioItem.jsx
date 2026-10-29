import { useState } from 'react'

const vacio = { nombre: '', precio: '', descripcion: '', imagen: '' }

// Formulario para agregar un plato o una promoción
export default function FormularioItem({ titulo, alGuardar }) {
  const [datos, setDatos] = useState(vacio)
  const [error, setError] = useState('')

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  const elegirFoto = (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    if (archivo.size > 500 * 1024) {
      setError('La foto pesa más de 500 KB. Elige una más pequeña.')
      e.target.value = ''
      return
    }
    setError('')
    const lector = new FileReader()
    lector.onload = () => setDatos((d) => ({ ...d, imagen: lector.result }))
    lector.readAsDataURL(archivo)
  }

  const guardar = (e) => {
    e.preventDefault()
    if (!datos.nombre.trim() || !datos.descripcion.trim() || Number(datos.precio) <= 0) {
      setError('Completa el nombre, un precio mayor a 0 y la descripción.')
      return
    }
    alGuardar({
      nombre: datos.nombre.trim(),
      precio: Number(datos.precio),
      descripcion: datos.descripcion.trim(),
      imagen: datos.imagen,
    })
    e.currentTarget.reset()
    setDatos(vacio)
    setError('')
  }

  return (
    <form className="card shadow-sm border-0 p-3 mb-4" onSubmit={guardar}>
      <h5 className="fw-bold mb-3">{titulo}</h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input className="form-control" name="nombre" value={datos.nombre} onChange={cambiar} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Precio (S/)</label>
          <input type="number" min="0" step="0.5" className="form-control" name="precio"
            value={datos.precio} onChange={cambiar} />
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea rows="2" className="form-control" name="descripcion"
            value={datos.descripcion} onChange={cambiar}></textarea>
        </div>
        <div className="col-md-8">
          <label className="form-label">Foto (opcional)</label>
          <input type="file" accept="image/*" className="form-control" onChange={elegirFoto} />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          {datos.imagen && (
            <img src={datos.imagen} alt="Vista previa" className="rounded"
              style={{ height: 60, objectFit: 'cover' }} />
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger py-2 mt-3 mb-0">{error}</div>}

      <div className="mt-3">
        <button className="btn btn-warning fw-bold" type="submit">
          <i className="bi bi-plus-lg me-1"></i>Agregar
        </button>
      </div>
    </form>
  )
}