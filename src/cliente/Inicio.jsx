import { Link } from 'react-router-dom'

export default function Inicio() {
  return (
    <>
      {/* Portada */}
      <header className="hero py-5">
        <div className="container py-5 text-center">
          <h1 className="display-4 fw-bolder">El Rincón del Gustito</h1>
          <p className="lead mb-4">
            Sabores auténticos, ingredientes frescos y un ambiente para disfrutar en familia.
          </p>
          <Link to="/carta" className="btn btn-outline-light btn-lg me-2">Ver carta</Link>
          <Link to="/reservar" className="btn btn-warning btn-lg fw-bold">Reservar mesa</Link>
        </div>
      </header>

      {/* Características */}
      <section className="container py-5">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <img src={`${import.meta.env.BASE_URL}imagen/portada2.jpg`} alt="Calidad" className="rounded-circle shadow mb-3"
              style={{ width: 140, height: 140, objectFit: 'cover' }} />
            <h2 className="h4 fw-bold">Calidad excepcional</h2>
            <p className="text-muted">Seleccionamos cada ingrediente para garantizar el mejor sabor.</p>
          </div>
          <div className="col-md-4">
            <img src={`${import.meta.env.BASE_URL}imagen/portada3.jpg`} alt="Pasión" className="rounded-circle shadow mb-3"
              style={{ width: 140, height: 140, objectFit: 'cover' }} />
            <h2 className="h4 fw-bold">Pasión por la cocina</h2>
            <p className="text-muted">Recetas tradicionales con técnicas modernas para sorprenderte.</p>
          </div>
          <div className="col-md-4">
            <img src={`${import.meta.env.BASE_URL}imagen/portada4.jpg`} alt="Ambiente" className="rounded-circle shadow mb-3"
              style={{ width: 140, height: 140, objectFit: 'cover' }} />
            <h2 className="h4 fw-bold">Ambiente acogedor</h2>
            <p className="text-muted">Un espacio pensado para compartir con tu familia y amigos.</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Nuestros servicios</h2>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <i className="bi bi-calendar-check display-5 text-warning"></i>
              <h3 className="h5 mt-2">Reservas en línea</h3>
              <p className="text-muted mb-0">Elige tu mesa y horario sin llamar por teléfono.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-people display-5 text-warning"></i>
              <h3 className="h5 mt-2">Eventos y celebraciones</h3>
              <p className="text-muted mb-0">Cumpleaños y reuniones en nuestra Zona VIP.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-cup-hot display-5 text-warning"></i>
              <h3 className="h5 mt-2">Desayuno, almuerzo y cena</h3>
              <p className="text-muted mb-0">Tres turnos para que vengas cuando quieras.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}