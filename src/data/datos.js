import { fechaISO, generarHorarios } from '../utils/reservas.js'

// Las 4 mesas del restaurante
export const mesas = [
  { id: 1, nombre: 'Mesa 01', capacidad: 4, zona: 'Salón Principal' },
  { id: 2, nombre: 'Mesa 02', capacidad: 2, zona: 'Junto a la Ventana' },
  { id: 3, nombre: 'Mesa 03', capacidad: 4, zona: 'Terraza' },
  { id: 4, nombre: 'Mesa 04', capacidad: 6, zona: 'Zona VIP' },
]

// Horas de llegada disponibles (cada 30 min). Cada reserva dura 1 h 30 min.
export const horarios = generarHorarios()

// Platos de la carta
export const platosIniciales = [
  {
    id: 1,
    nombre: 'Lomo Saltado',
    precio: 38,
    descripcion: 'Carne de res al wok con tomate, cebolla, papas fritas y arroz.',
    imagen: '/imagen/plato1.jpg',
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Filete de Pollo',
    precio: 45,
    descripcion: 'Pechuga a la plancha con base de arroz integral y vegetales frescos.',
    imagen: '/imagen/plato2.jpg',
    disponible: true,
  },
  {
    id: 3,
    nombre: 'Seco a la Norteña',
    precio: 45,
    descripcion: 'Cerdo estofado en reducción de culantro, con arroz, frijoles y zarza criolla.',
    imagen: '/imagen/plato3.jpg',
    disponible: true,
  },
]

// Promociones iniciales (el admin puede agregar más)
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

// Reservas de ejemplo (las fechas se calculan desde hoy)
export function reservasIniciales() {
  return [
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
}