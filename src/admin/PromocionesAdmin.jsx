import { useReservas } from '../context/ReservasContext.jsx'
import FormularioItem from '../components/FormularioItem.jsx'

export default function PromocionesAdmin() {
  const { promociones, agregarPromocion } = useReservas()

  return (
    <div>
      <h2 className="fw-bold">Promociones</h2>
      <p className="text-muted">
        Las promociones que agregues aparecerán en la página de promociones del cliente.
      </p>

      <FormularioItem titulo="Agregar una promoción" alGuardar={agregarPromocion} />

      <div className="card shadow-sm border-0 p-3">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Foto</th>
                <th>Promoción</th>
                <th>Precio</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {promociones.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.imagen} alt={p.nombre} className="rounded"
                      style={{ width: 56, height: 40, objectFit: 'cover' }} />
                  </td>
                  <td className="fw-bold">{p.nombre}</td>
                  <td>S/{p.precio.toFixed(2)}</td>
                  <td className="text-muted">{p.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}