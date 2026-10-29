export const APERTURA = '09:00'     // primera hora de llegada
export const CIERRE = '22:00'       // el restaurante cierra
export const INTERVALO_MIN = 30     // se puede llegar cada 30 minutos (13:00, 13:30, 14:00...)
export const DURACION_MIN = 90      // cada reserva ocupa la mesa 1 hora y 30 minutos

// "13:30" -> 810 (minutos desde las 00:00)
export function aMinutos(hora) {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

// 810 -> "13:30"
export function aHora(minutos) {
  const h = String(Math.floor(minutos / 60)).padStart(2, '0')
  const m = String(minutos % 60).padStart(2, '0')
  return `${h}:${m}`
}

// Hora en la que termina una reserva que empieza a "hora". Ej: "13:00" -> "14:30"
export function horaFin(hora) {
  return aHora(aMinutos(hora) + DURACION_MIN)
}

// Lista de horas de llegada: 09:00, 09:30 ... hasta la última que alcanza a terminar antes del cierre
export function generarHorarios() {
  const lista = []
  for (let min = aMinutos(APERTURA); min + DURACION_MIN <= aMinutos(CIERRE); min += INTERVALO_MIN) {
    lista.push(aHora(min))
  }
  return lista
}

// Devuelve una fecha en formato "2026-10-27". offsetDias = 0 es hoy, 1 es mañana...
export function fechaISO(offsetDias = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDias)
  const anio = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

// "2026-10-27" -> "mar, 27 oct"
export function formatearFecha(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-PE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

// Dos reservas se cruzan si una empieza antes de que la otra termine
function seCruzan(horaA, horaB) {
  const a = aMinutos(horaA)
  const b = aMinutos(horaB)
  return a < b + DURACION_MIN && b < a + DURACION_MIN
}

// ¿Esa mesa ya está ocupada en ese momento? (las canceladas no cuentan)
export function hayConflicto(reservas, { fecha, hora, mesa }) {
  return reservas.some(
    (r) =>
      r.estado !== 'Cancelada' &&
      r.fecha === fecha &&
      Number(r.mesa) === Number(mesa) &&
      seCruzan(r.hora, hora)
  )
}

// Lista de números de mesa ocupadas si alguien llega a esa fecha y hora
export function mesasOcupadas(reservas, fecha, hora) {
  return reservas
    .filter((r) => r.estado !== 'Cancelada' && r.fecha === fecha && seCruzan(r.hora, hora))
    .map((r) => Number(r.mesa))
}

// ¿Queda al menos una mesa libre (y con capacidad suficiente) a esa hora?
export function horaDisponible(reservas, fecha, hora, personas, mesas) {
  const ocupadas = mesasOcupadas(reservas, fecha, hora)
  return mesas.some((m) => !ocupadas.includes(m.id) && m.capacidad >= Number(personas))
}

// ¿Esa hora ya pasó? (solo importa cuando la fecha es hoy)
export function horaPasada(fecha, hora) {
  if (fecha !== fechaISO(0)) return false
  const ahora = new Date()
  return aMinutos(hora) <= ahora.getHours() * 60 + ahora.getMinutes()
}

// ¿Ya terminó el tiempo de la mesa reservada? (hora de llegada + 1 h 30 min)
export function reservaTerminada(reserva, ahora = new Date()) {
  const [anio, mes, dia] = reserva.fecha.split('-').map(Number)
  const fin = new Date(anio, mes - 1, dia, 0, aMinutos(reserva.hora) + DURACION_MIN)
  return fin <= ahora
}

// Pasada la hora: Confirmada -> Completada, Pendiente -> Vencida
export function estadoActual(reserva, ahora = new Date()) {
  if (reserva.estado === 'Cancelada' || !reservaTerminada(reserva, ahora)) return reserva.estado
  return reserva.estado === 'Confirmada' ? 'Completada' : 'Vencida'
}

// Reservas activas de un día
export function reservasDelDia(reservas, fecha) {
  return reservas.filter((r) => r.fecha === fecha && r.estado !== 'Cancelada')
}

// Ordena por fecha y hora (de la más próxima a la más lejana)
export function ordenarPorFecha(reservas) {
  return [...reservas].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
}