import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { mesas, platosIniciales, promocionesIniciales, reservasIniciales } from '../data/datos.js'
import { estadoActual, hayConflicto } from '../utils/reservas.js'

// Estado compartido entre el cliente y el administrador (reservas, platos y promociones)

const ReservasContext = createContext(null)

function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : valorInicial
  } catch {
    return valorInicial
  }
}

export function ReservasProvider({ children }) {
  // useState: aquí viven las reservas y los platos
  const [reservasGuardadas, setReservas] = useState(() => leer('rincon_reservas_v2', reservasIniciales()))
  const [platos, setPlatos] = useState(() => leer('rincon_platos', platosIniciales))
  const [promociones, setPromociones] = useState(() => leer('rincon_promociones', promocionesIniciales))

  // useEffect: cada vez que cambian, se guardan en el navegador
  useEffect(() => {
    localStorage.setItem('rincon_reservas_v2', JSON.stringify(reservasGuardadas))
  }, [reservasGuardadas])

  // useEffect: actualiza la hora cada minuto para cambiar el estado de las reservas
  const [ahora, setAhora] = useState(() => new Date())
  useEffect(() => {
    const reloj = setInterval(() => setAhora(new Date()), 60000)
    return () => clearInterval(reloj)
  }, [])

  // Lo que ven las pantallas: las reservas con su estado según la hora actual
  const reservas = useMemo(
    () => reservasGuardadas.map((r) => ({ ...r, estado: estadoActual(r, ahora) })),
    [reservasGuardadas, ahora]
  )

  useEffect(() => {
    localStorage.setItem('rincon_platos', JSON.stringify(platos))
  }, [platos])

  useEffect(() => {
    localStorage.setItem('rincon_promociones', JSON.stringify(promociones))
  }, [promociones])

  // useEffect: sincroniza los cambios entre pestañas abiertas
  useEffect(() => {
    const alCambiar = (e) => {
      if (e.key === 'rincon_reservas_v2' && e.newValue) setReservas(JSON.parse(e.newValue))
      if (e.key === 'rincon_platos' && e.newValue) setPlatos(JSON.parse(e.newValue))
      if (e.key === 'rincon_promociones' && e.newValue) setPromociones(JSON.parse(e.newValue))
    }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [])

  // Registra una reserva (el cliente la crea 'Pendiente', el admin 'Confirmada')
  const agregarReserva = (datos, estado = 'Pendiente') => {
    const mesa = Number(datos.mesa)
    const personas = Number(datos.personas)
    const infoMesa = mesas.find((m) => m.id === mesa)

    if (!datos.hora) {
      return { ok: false, mensaje: 'Elige la hora de llegada.' }
    }
    if (!infoMesa) {
      return { ok: false, mensaje: 'Elige una mesa.' }
    }
    if (personas > infoMesa.capacidad) {
      return { ok: false, mensaje: `${infoMesa.nombre} solo admite ${infoMesa.capacidad} personas.` }
    }
    // Evita duplicados: la mesa no puede estar ocupada a esa hora
    if (hayConflicto(reservasGuardadas, { fecha: datos.fecha, hora: datos.hora, mesa })) {
      return {
        ok: false,
        mensaje: `${infoMesa.nombre} ya está ocupada a esa hora (cada reserva dura 1 h 30 min). Elige otra mesa u otro horario.`,
      }
    }

    const nueva = {
      id: Date.now(),
      cliente: datos.cliente.trim(),
      telefono: datos.telefono,
      correo: datos.correo,
      fecha: datos.fecha,
      hora: datos.hora,
      personas,
      mesa,
      comentarios: datos.comentarios || '',
      estado,
    }
    setReservas((anteriores) => [nueva, ...anteriores])
    return { ok: true, mensaje: 'Reserva registrada correctamente.' }
  }

  const cambiarEstado = (id, estado) => {
    setReservas((anteriores) => anteriores.map((r) => (r.id === id ? { ...r, estado } : r)))
  }

  const cambiarDisponibilidadPlato = (id) => {
    setPlatos((anteriores) =>
      anteriores.map((p) => (p.id === id ? { ...p, disponible: !p.disponible } : p))
    )
  }

  // Agrega un plato (aparece en la carta del cliente)
  const agregarPlato = (datos) => {
    const nuevo = { id: Date.now(), ...datos, imagen: datos.imagen || '/imagen/plato1.jpg', disponible: true }
    setPlatos((anteriores) => [...anteriores, nuevo])
  }

  // Agrega una promoción (aparece en /promociones)
  const agregarPromocion = (datos) => {
    const nueva = { id: Date.now(), ...datos, imagen: datos.imagen || '/imagen/promocion1.jpg' }
    setPromociones((anteriores) => [...anteriores, nueva])
  }

  const valor = {
    reservas, platos, promociones,
    agregarReserva, cambiarEstado, cambiarDisponibilidadPlato, agregarPlato, agregarPromocion,
  }

  return <ReservasContext.Provider value={valor}>{children}</ReservasContext.Provider>
}

// Hook para usar los datos desde cualquier componente
export function useReservas() {
  return useContext(ReservasContext)
}