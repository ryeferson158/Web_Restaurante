import { Navigate } from 'react-router-dom'

// Si no se inició sesión, manda al login en vez de mostrar el panel
export default function RutaPrivada({ children }) {
  const haIniciadoSesion = sessionStorage.getItem('rincon_admin') === 'si'
  return haIniciadoSesion ? children : <Navigate to="/login" replace />
}