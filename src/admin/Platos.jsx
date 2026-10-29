import { useReservas } from '../context/ReservasContext.jsx'
import FormularioItem from '../components/FormularioItem.jsx'

export default function Platos() {
  const { platos, cambiarDisponibilidadPlato, agregarPlato } = useReservas()

  return (
    <div>
      <h2 className="fw-bold">Platos</h2>
      <p className="text-muted">
        Agrega platos nuevos (se ven en la carta del cliente) o márcalos como agotados.
      </p>

      <FormularioItem titulo="Agregar un plato" alGuardar={agregarPlato} />

      <div className="card shadow-sm border-0 p-3">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>Foto</th>
                <th>Plato</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {platos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.imagen} alt={p.nombre} className="rounded"
                      style={{ width: 56, height: 40, objectFit: 'cover' }} />
                  </td>
                  <td className="fw-bold">{p.nombre}</td>
                  <td>S/{p.precio.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.disponible ? 'bg-success' : 'bg-secondary'}`}>
                      {p.disponible ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-dark"
                      onClick={() => cambiarDisponibilidadPlato(p.id)}>
                      {p.disponible ? 'Marcar agotado' : 'Marcar disponible'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}