export default function Nosotros() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bolder">Nosotros</h1>
        <p className="lead text-muted">
          En El Rincón del Gustito cocinamos con cariño y atendemos como en casa.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 text-center p-4">
            <i className="bi bi-bullseye display-5 text-warning"></i>
            <h4 className="mt-3">Objetivo</h4>
            <p className="text-muted mb-0">
              Ofrecer platos deliciosos y una experiencia ordenada, sin esperas ni confusiones en tu reserva.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 text-center p-4">
            <i className="bi bi-heart display-5 text-warning"></i>
            <h4 className="mt-3">Misión</h4>
            <p className="text-muted mb-0">
              Preparar comida tradicional con ingredientes frescos y atender a cada cliente con calidez.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0 text-center p-4">
            <i className="bi bi-eye display-5 text-warning"></i>
            <h4 className="mt-3">Visión</h4>
            <p className="text-muted mb-0">
              Ser el restaurante preferido de la zona por nuestro sabor y nuestro servicio.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}