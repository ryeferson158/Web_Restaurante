import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  ADELANTO_POR_PERSONA,
  mesasIniciales,
  platosIniciales,
  promocionesIniciales,
  reservasIniciales,
} from '../data/datos.js'
import { estadoActual, hayConflicto, pagoVerificado } from '../utils/reservas.js'

/*
  Estado compartido entre el sitio del cliente y el panel del administrador.
  Aquí viven: reservas, mesas, platos y promociones.
  Todo se guarda en localStorage para que no se pierda al recargar.
*/

const ReservasContext = createContext(null)

function leer(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : valorInicial
  } catch {
    return valorInicial
  }
}

// Guarda en el navegador (si no hay espacio, la página no se rompe)
function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    console.warn('No se pudo guardar en el navegador (¿imagen muy pesada?)')
  }
}

export function ReservasProvider({ children }) {
  // useState: aquí viven los datos
  const [reservasGuardadas, setReservas] = useState(() => leer('rincon_reservas_v2', reservasIniciales()))
  const [mesas, setMesas] = useState(() => leer('rincon_mesas', mesasIniciales))
  const [platos, setPlatos] = useState(() => leer('rincon_platos', platosIniciales))
  const [promociones, setPromociones] = useState(() => leer('rincon_promociones', promocionesIniciales))

  // useEffect: cada vez que cambian, se guardan en el navegador
  useEffect(() => { guardar('rincon_reservas_v2', reservasGuardadas) }, [reservasGuardadas])
  useEffect(() => { guardar('rincon_mesas', mesas) }, [mesas])
  useEffect(() => { guardar('rincon_platos', platos) }, [platos])
  useEffect(() => { guardar('rincon_promociones', promociones) }, [promociones])

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

  // useEffect: sincroniza los cambios entre pestañas abiertas
  useEffect(() => {
    const alCambiar = (e) => {
      if (!e.newValue) return
      if (e.key === 'rincon_reservas_v2') setReservas(JSON.parse(e.newValue))
      if (e.key === 'rincon_mesas') setMesas(JSON.parse(e.newValue))
      if (e.key === 'rincon_platos') setPlatos(JSON.parse(e.newValue))
      if (e.key === 'rincon_promociones') setPromociones(JSON.parse(e.newValue))
    }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [])

  // ---------------- RESERVAS ----------------

  // Revisa que la reserva sea válida. Devuelve un error { ok:false, mensaje } o null si está bien.
  // excluirId sirve al EDITAR: la reserva no debe chocar consigo misma.
  const validarReserva = (datos, excluirId = null) => {
    const mesa = Number(datos.mesa)
    const personas = Number(datos.personas)
    const infoMesa = mesas.find((m) => m.id === mesa)
    const otras = excluirId ? reservasGuardadas.filter((r) => r.id !== excluirId) : reservasGuardadas

    if (!datos.hora) return { ok: false, mensaje: 'Elige la hora de llegada.' }
    if (!infoMesa) return { ok: false, mensaje: 'Elige una mesa.' }
    if (infoMesa.estado !== 'Disponible') {
      return { ok: false, mensaje: `${infoMesa.nombre} no está disponible (${infoMesa.estado}). Elige otra mesa.` }
    }
    if (personas > infoMesa.capacidad) {
      return { ok: false, mensaje: `${infoMesa.nombre} solo admite ${infoMesa.capacidad} personas.` }
    }
    // Evita duplicados: la mesa no puede estar ocupada a esa hora
    if (hayConflicto(otras, { fecha: datos.fecha, hora: datos.hora, mesa })) {
      return {
        ok: false,
        mensaje: `${infoMesa.nombre} ya está ocupada a esa hora (cada reserva dura 1 h 30 min). Elige otra mesa u otro horario.`,
      }
    }
    return null
  }

  // Registra una reserva (el cliente la crea 'Pendiente', el admin 'Confirmada').
  // Siempre lleva un adelanto: el cliente lo paga y el admin lo verifica antes de aprobar.
  const agregarReserva = (datos, estado = 'Pendiente') => {
    const error = validarReserva(datos)
    if (error) return error
    if (!datos.metodo || !String(datos.operacion || '').trim()) {
      return { ok: false, mensaje: 'Escribe el código de operación de tu pago de adelanto.' }
    }

    const personas = Number(datos.personas)
    const nueva = {
      id: Date.now(),
      cliente: datos.cliente.trim(),
      telefono: datos.telefono,
      correo: datos.correo,
      fecha: datos.fecha,
      hora: datos.hora,
      personas,
      mesa: Number(datos.mesa),
      comentarios: datos.comentarios || '',
      estado,
      pago: {
        monto: personas * ADELANTO_POR_PERSONA,
        metodo: datos.metodo,
        operacion: String(datos.operacion).trim(),
        // Si la crea el admin, el pago ya lo recibió; si la crea el cliente, falta verificarlo
        estado: estado === 'Confirmada' ? 'Verificado' : 'Por verificar',
      },
    }
    setReservas((anteriores) => [nueva, ...anteriores])
    return { ok: true, mensaje: 'Reserva registrada correctamente.' }
  }

  // Corrige los datos de una reserva (por ejemplo, si el cliente se equivocó)
  const editarReserva = (id, datos) => {
    const actual = reservas.find((r) => r.id === id)
    if (!actual || (actual.estado !== 'Pendiente' && actual.estado !== 'Confirmada')) {
      return { ok: false, mensaje: 'Esta reserva ya no se puede editar.' }
    }
    const error = validarReserva(datos, id)
    if (error) return error

    setReservas((anteriores) =>
      anteriores.map((r) =>
        r.id === id
          ? {
              ...r,
              cliente: datos.cliente.trim(),
              telefono: datos.telefono,
              correo: datos.correo,
              fecha: datos.fecha,
              hora: datos.hora,
              personas: Number(datos.personas),
              mesa: Number(datos.mesa),
              comentarios: datos.comentarios || '',
            }
          : r
      )
    )
    return { ok: true, mensaje: 'Reserva actualizada.' }
  }

  // Aprobar solo se puede si el adelanto ya fue verificado
  const cambiarEstado = (id, estado) => {
    setReservas((anteriores) =>
      anteriores.map((r) => {
        if (r.id !== id) return r
        if (estado === 'Confirmada' && !pagoVerificado(r)) return r
        return { ...r, estado }
      })
    )
  }

  const verificarPago = (id) => {
    setReservas((anteriores) =>
      anteriores.map((r) => (r.id === id && r.pago ? { ...r, pago: { ...r.pago, estado: 'Verificado' } } : r))
    )
  }

  // ---------------- MESAS (CRUD) ----------------

  const nombreRepetido = (nombre, excluirId = null) =>
    mesas.some((m) => m.id !== excluirId && m.nombre.trim().toLowerCase() === nombre.trim().toLowerCase())

  // Reservas que todavía están vigentes en una mesa
  const reservasVigentes = (idMesa) =>
    reservas.filter((r) => Number(r.mesa) === idMesa && (r.estado === 'Pendiente' || r.estado === 'Confirmada'))

  const agregarMesa = (datos) => {
    if (nombreRepetido(datos.nombre)) return { ok: false, mensaje: 'Ya existe una mesa con ese nombre.' }
    const id = Math.max(0, ...mesas.map((m) => m.id)) + 1
    const nueva = {
      id,
      nombre: datos.nombre.trim(),
      capacidad: Number(datos.capacidad),
      zona: datos.zona.trim(),
      estado: datos.estado,
    }
    setMesas((anteriores) => [...anteriores, nueva])
    return { ok: true, mensaje: 'Mesa agregada.' }
  }

  const editarMesa = (id, datos) => {
    if (nombreRepetido(datos.nombre, id)) return { ok: false, mensaje: 'Ya existe otra mesa con ese nombre.' }
    if (reservasVigentes(id).some((r) => r.personas > Number(datos.capacidad))) {
      return { ok: false, mensaje: 'Hay reservas vigentes con más personas que esa capacidad.' }
    }
    setMesas((anteriores) =>
      anteriores.map((m) =>
        m.id === id
          ? { ...m, nombre: datos.nombre.trim(), capacidad: Number(datos.capacidad), zona: datos.zona.trim(), estado: datos.estado }
          : m
      )
    )
    return { ok: true, mensaje: 'Mesa actualizada.' }
  }

  const cambiarEstadoMesa = (id, estado) => {
    setMesas((anteriores) => anteriores.map((m) => (m.id === id ? { ...m, estado } : m)))
  }

  const eliminarMesa = (id) => {
    if (reservasVigentes(id).length > 0) {
      return {
        ok: false,
        mensaje: 'No se puede eliminar: tiene reservas pendientes o confirmadas. Anúlalas primero o cambia el estado de la mesa.',
      }
    }
    setMesas((anteriores) => anteriores.filter((m) => m.id !== id))
    return { ok: true, mensaje: 'Mesa eliminada.' }
  }

  // ---------------- PLATOS Y PROMOCIONES ----------------

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
    reservas, mesas, platos, promociones,
    agregarReserva, editarReserva, cambiarEstado, verificarPago,
    agregarMesa, editarMesa, cambiarEstadoMesa, eliminarMesa,
    cambiarDisponibilidadPlato, agregarPlato, agregarPromocion,
  }

  return <ReservasContext.Provider value={valor}>{children}</ReservasContext.Provider>
}

// Hook para usar los datos desde cualquier componente
export function useReservas() {
  return useContext(ReservasContext)
}
