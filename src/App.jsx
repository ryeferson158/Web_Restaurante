import { Navigate, Route, Routes } from 'react-router-dom'

import LayoutCliente from './cliente/LayoutCliente.jsx'
import Inicio from './cliente/Inicio.jsx'
import Carta from './cliente/Carta.jsx'
import Promociones from './cliente/Promociones.jsx'
import Nosotros from './cliente/Nosotros.jsx'
import Contacto from './cliente/Contacto.jsx'
import Reservar from './cliente/Reservar.jsx'

import Login from './admin/Login.jsx'
import RutaPrivada from './admin/RutaPrivada.jsx'
import LayoutAdmin from './admin/LayoutAdmin.jsx'
import Dashboard from './admin/Dashboard.jsx'
import Reservas from './admin/Reservas.jsx'
import Calendario from './admin/Calendario.jsx'
import Mesas from './admin/Mesas.jsx'
import Platos from './admin/Platos.jsx'
import PromocionesAdmin from './admin/PromocionesAdmin.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<LayoutCliente />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/carta" element={<Carta />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/reservar" element={<Reservar />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<RutaPrivada><LayoutAdmin /></RutaPrivada>}>
        <Route index element={<Dashboard />} />
        <Route path="reservas" element={<Reservas />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="mesas" element={<Mesas />} />
        <Route path="platos" element={<Platos />} />
        <Route path="promociones" element={<PromocionesAdmin />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}