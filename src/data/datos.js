import { fechaISO, generarHorarios } from '../utils/reservas.js'

// Mesas iniciales
export const mesasIniciales = [
  { id: 1, nombre: 'Mesa 01', capacidad: 4, zona: 'Salón Principal', estado: 'Disponible' },
  { id: 2, nombre: 'Mesa 02', capacidad: 2, zona: 'Junto a la Ventana', estado: 'Disponible' },
  { id: 3, nombre: 'Mesa 03', capacidad: 4, zona: 'Terraza', estado: 'Disponible' },
  { id: 4, nombre: 'Mesa 04', capacidad: 6, zona: 'Zona VIP', estado: 'Disponible' },
]

export const estadosMesa = ['Disponible', 'Mantenimiento', 'Dañada', 'Fuera de servicio']
export const coloresEstadoMesa = {
  Disponible: 'bg-success',
  Mantenimiento: 'bg-warning text-dark',
  Dañada: 'bg-danger',
  'Fuera de servicio': 'bg-secondary',
}

export const ADELANTO_POR_PERSONA = 10
export const metodosPago = ['Yape', 'Plin', 'Transferencia bancaria']
export const datosPago = { titular: 'El Rincón del Gustito', numero: '999 999 999' }

export const horarios = generarHorarios()

// Categorías del restaurante
export const categoriasMenu = ['Platos de Fondo', 'Entradas', 'Postres', 'Bebidas']

// Platos iniciales con variedad y fotos seguras de tu carpeta
export const platosIniciales = [
  // Platos de Fondo
  {
    id: 1,
    nombre: 'Lomo Saltado',
    categoria: 'Platos de Fondo',
    precio: 38,
    descripcion: 'Carne de res al wok con tomate, cebolla, papas fritas y arroz.',
    imagen: '/imagen/lomo-saltado.jpg',
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Filete de Pollo',
    categoria: 'Platos de Fondo',
    precio: 35,
    descripcion: 'Pechuga a la plancha con base de arroz integral y vegetales frescos.',
    imagen: '/imagen/filete-pollo.jpg',
    disponible: true,
  },
  {
    id: 3,
    nombre: 'Seco a la Norteña',
    categoria: 'Platos de Fondo',
    precio: 45,
    descripcion: 'Guiso tierno en reducción de culantro con frijoles y arroz.',
    imagen: '/imagen/seco-norte.jpg',
    disponible: true,
  },
  // Entradas
  {
    id: 4,
    nombre: 'Causa Rellena de Pollo',
    categoria: 'Entradas',
    precio: 22,
    descripcion: 'Papa amarilla sazonada con ají amarillo y limón, rellena de pechuga y palta.',
    imagen: '/imagen/causa-rellena.jpg',
    disponible: true,
  },
  {
    id: 5,
    nombre: 'Tequeños Criollos',
    categoria: 'Entradas',
    precio: 20,
    descripcion: 'Crujientes deditos de masa rellenos de queso fundido con salsa guacamole.',
    imagen: '/imagen/tequenos-criollos.jpg',
    disponible: true,
  },
  // Postres
  {
    id: 6,
    nombre: 'Torta de Chocolate',
    categoria: 'Postres',
    precio: 16,
    descripcion: 'Bizcocho húmedo de puro cacao bañado en fudge casero de olla.',
    imagen: '/imagen/torta-chocolate.jpg',
    disponible: true,
  },
  {
    id: 7,
    nombre: 'Torta Tres Leches',
    categoria: 'Postres',
    precio: 15,
    descripcion: 'Bizcocho bañado en tres leches con canela y merengue flameado.',
    imagen: '/imagen/tres-leches.jpg',
    disponible: true,
  },
  // Bebidas
  {
    id: 8,
    nombre: 'Chicha Morada (Jarra)',
    categoria: 'Bebidas',
    precio: 18,
    descripcion: 'Maíz morado hervido con piña, manzana, canela, clavo y gotas de limón.',
    imagen: '/imagen/chicha-morada.jpg',
    disponible: true,
  },
  {
    id: 9,
    nombre: 'Limonada Frozen',
    categoria: 'Bebidas',
    precio: 12,
    descripcion: 'Zumo de limón fresco granizado al momento con toques de hierbabuena.',
    imagen: '/imagen/limonada.jpg',
    disponible: true,
  },
]

export const promocionesIniciales = [
  {
    id: 1,
    nombre: 'Combo Familiar Lomo',
    precio: 150,
    descripcion: 'Dos platos de Lomo Saltado al precio de uno los días martes y miércoles.',
    imagen: '/imagen/promocion1.jpg',
  },
  {
    id: 2,
    nombre: 'Almuerzo Ejecutivo',
    precio: 120,
    descripcion: 'Entrada, plato de fondo y bebida para compartir en tu hora de almuerzo.',
    imagen: '/imagen/promocion2.jpg',
  },
  {
    id: 3,
    nombre: 'Festín Norteño',
    precio: 150,
    descripcion: 'Una selección de nuestros mejores platos norteños para toda la mesa.',
    imagen: '/imagen/promocion3.jpg',
  },
]

export function reservasIniciales() {
  const lista = [
    { id: 1, cliente: 'Carlos Mendoza', telefono: '987654321', correo: 'carlosmendoza@correo.com', fecha: fechaISO(0), hora: '13:00', personas: 2, mesa: 2, comentarios: '', estado: 'Confirmada' },
    { id: 2, cliente: 'Lucía Fernández', telefono: '987654322', correo: 'luciafernandez@correo.com', fecha: fechaISO(0), hora: '14:00', personas: 4, mesa: 1, comentarios: '', estado: 'Confirmada' },
    { id: 3, cliente: 'Roberto Silva', telefono: '987654323', correo: 'robertosilva@correo.com', fecha: fechaISO(1), hora: '13:00', personas: 3, mesa: 1, comentarios: '', estado: 'Confirmada' },
    { id: 4, cliente: 'María López', telefono: '987654324', correo: 'marialopez@correo.com', fecha: fechaISO(1), hora: '20:30', personas: 4, mesa: 3, comentarios: 'Cumpleaños', estado: 'Pendiente' },
    { id: 5, cliente: 'Javier Morales', telefono: '987654325', correo: 'javiermorales@correo.com', fecha: fechaISO(2), hora: '09:00', personas: 3, mesa: 3, comentarios: '', estado: 'Confirmada' },
    { id: 6, cliente: 'Elena Ríos', telefono: '987654326', correo: 'elenarios@correo.com', fecha: fechaISO(2), hora: '14:00', personas: 2, mesa: 2, comentarios: '', estado: 'Pendiente' },
    { id: 7, cliente: 'Andrea Castro', telefono: '987654327', correo: 'andreacastro@correo.com', fecha: fechaISO(3), hora: '20:00', personas: 6, mesa: 4, comentarios: '', estado: 'Confirmada' },
    { id: 8, cliente: 'Marcos Soto', telefono: '987654328', correo: 'marcossoto@correo.com', fecha: fechaISO(3), hora: '10:30', personas: 4, mesa: 1, comentarios: '', estado: 'Confirmada' },
    { id: 9, cliente: 'Juan Pérez', telefono: '987654329', correo: 'juanperez@correo.com', fecha: fechaISO(4), hora: '20:30', personas: 5, mesa: 4, comentarios: '', estado: 'Confirmada' },
    { id: 10, cliente: 'Ana Torres', telefono: '987654330', correo: 'anatorres@correo.com', fecha: fechaISO(5), hora: '13:00', personas: 4, mesa: 3, comentarios: '', estado: 'Confirmada' },
    { id: 11, cliente: 'Pedro Vargas', telefono: '987654331', correo: 'pedrovargas@correo.com', fecha: fechaISO(5), hora: '20:00', personas: 3, mesa: 1, comentarios: '', estado: 'Cancelada' },
  ]

  return lista.map((r) => ({
    ...r,
    pago: {
      monto: r.personas * ADELANTO_POR_PERSONA,
      metodo: 'Yape',
      operacion: String(100000 + r.id * 37),
      estado: r.estado === 'Pendiente' ? 'Por verificar' : 'Verificado',
    },
  }))
}