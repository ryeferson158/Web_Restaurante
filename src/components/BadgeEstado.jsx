// Etiqueta de color según el estado de la reserva
const colores = {
  Confirmada: 'bg-success',
  Pendiente: 'bg-warning text-dark',
  Cancelada: 'bg-danger',
  Completada: 'bg-dark',
  Vencida: 'bg-secondary',
}

export default function BadgeEstado({ estado }) {
  return (
    <span className={`badge ${colores[estado]}`}>
      {estado === 'Completada' && <i className="bi bi-check2-all me-1"></i>}
      {estado}
    </span>
  )
}