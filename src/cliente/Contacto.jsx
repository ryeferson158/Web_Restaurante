import { useState } from 'react'

export default function Contacto() {
  const [enviado, setEnviado] = useState(false)

  const enviar = (e) => {
    e.preventDefault()
    setEnviado(true)
    e.target.reset()
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bolder">Contacto</h1>
        <p className="lead text-muted">Escríbenos o visítanos.</p>
      </div>

      <div className="row g-5">
        <div className="col-md-6">
          <h4 className="mb-3">Escríbenos</h4>
          <form onSubmit={enviar}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label fw-bold">Nombres y apellidos</label>
              <input id="nombre" type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label fw-bold">Correo</label>
              <input id="correo" type="email" className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="mensaje" className="form-label fw-bold">Mensaje</label>
              <textarea id="mensaje" rows="4" className="form-control" required></textarea>
            </div>
            {enviado && (
              <div className="alert alert-success">¡Gracias! Recibimos tu mensaje.</div>
            )}
            <button type="submit" className="btn btn-primary">Enviar</button>
          </form>
        </div>

        <div className="col-md-6">
          <h4 className="mb-3">Datos de contacto</h4>
          <p><i className="bi bi-geo-alt text-warning me-2"></i>Av. Principal 123, Lima</p>
          <p><i className="bi bi-telephone text-warning me-2"></i>999 999 999</p>
          <p><i className="bi bi-envelope text-warning me-2"></i>contacto@rincondelgustito.com</p>
          <p><i className="bi bi-clock text-warning me-2"></i>Todos los días de 9:00 a 22:00</p>

          <h4 className="mt-4 mb-3">Redes sociales</h4>
          <div className="fs-3 d-flex gap-3">
            <a href="#!" className="text-dark" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#!" className="text-dark" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#!" className="text-dark" aria-label="WhatsApp"><i className="bi bi-whatsapp"></i></a>
            <a href="#!" className="text-dark" aria-label="TikTok"><i className="bi bi-tiktok"></i></a>
          </div>
        </div>
      </div>
    </div>
  )
}