# El Rincón del Gustito – Sistema de reservas

Aplicación web hecha con **React + Vite + Bootstrap** para gestionar las reservas de mesas de un restaurante.
Tiene dos zonas **separadas**:

| Zona | Dirección | Quién la usa |
|------|-----------|--------------|
| Sitio del cliente | `/` , `/carta`, `/promociones`, `/nosotros`, `/contacto`, `/reservar` | Clientes |
| Panel del administrador | `/login` y `/admin/...` | Personal del restaurante |

## 1. Requisitos

- [Node.js](https://nodejs.org) versión 18 o superior (incluye `npm`)

## 2. Instalar y ejecutar

```bash
npm install      # solo la primera vez
npm run dev      # inicia el proyecto
```

Abre en el navegador la dirección que muestra la terminal (normalmente http://localhost:5173).

Otros comandos: `npm run build` (versión para producción) y `npm run preview` (probarla).

## 3. Acceso al panel de administración

- Dirección: http://localhost:5173/login (se escribe a mano: el sitio del cliente no tiene ningún enlace al panel)
- Usuario: `admin`
- Clave: `1234`

## 4. Cómo se conectan el cliente y el administrador

Las dos zonas **no se mezclan**: cada una tiene su carpeta, su menú y sus páginas.
Lo único que comparten es `src/context/ReservasContext.jsx`:

```
Cliente (/reservar)  ──►  ReservasContext  ──►  Administrador (/admin)
   crea solicitud         (useState +            aprueba / cancela
   "Pendiente"            useEffect +            y ve el calendario
                          localStorage)
```

- El cliente envía una reserva → queda **Pendiente**.
- El administrador la ve en su panel y la **aprueba o cancela**.
- Si el admin marca un plato como **agotado**, el cliente lo ve así en la carta.
- Si el admin **agrega un plato o una promoción** (con foto opcional), aparece al instante en `/carta` o `/promociones`.
- Los datos se guardan en `localStorage`, por lo que no se pierden al recargar.
  Si abres el sitio en una pestaña y el panel en otra, los cambios se actualizan solos.

## 5. Estructura del proyecto

```
src/
├── main.jsx                  Punto de entrada
├── App.jsx                   Rutas (cliente y admin)
├── estilos.css               Estilos propios (poquitos)
├── context/
│   └── ReservasContext.jsx   Estado compartido (reservas y platos)
├── data/
│   └── datos.js              Mesas, horarios, platos, promociones y reservas de ejemplo
├── utils/
│   └── reservas.js           Funciones: detectar conflictos, fechas, ordenar
├── components/               Componentes REUTILIZABLES (cliente y admin)
│   ├── FormularioReserva.jsx
│   ├── CalendarioMensual.jsx
│   ├── TablaOcupacion.jsx
│   ├── ListaReservas.jsx
│   ├── FormularioItem.jsx    Formulario para agregar plato o promoción
│   └── BadgeEstado.jsx
├── cliente/                  Todo lo que ve el cliente
│   ├── LayoutCliente.jsx     Menú + pie de página
│   └── Inicio, Carta, Promociones, Nosotros, Contacto, Reservar
└── admin/                    Todo lo que ve el administrador
    ├── Login.jsx, RutaPrivada.jsx, LayoutAdmin.jsx
    └── Dashboard, Reservas, Calendario, Mesas, Platos, PromocionesAdmin
```

## 6. Dónde se cumple cada punto de la rúbrica (parte React)

| Pedido | Dónde está |
|--------|-----------|
| Componentes reutilizables en JSX (formulario, calendario, lista) | `src/components/` |
| `useState` para manejar las reservas | `ReservasContext.jsx`, `FormularioReserva.jsx`, páginas del admin |
| `useEffect` para actualizar y evitar conflictos en tiempo real | `FormularioReserva.jsx` (recalcula mesas ocupadas al cambiar fecha u hora) y `ReservasContext.jsx` (guarda y sincroniza) |
| Registrar reservas sin duplicados | `agregarReserva()` en `ReservasContext.jsx` + `hayConflicto()` en `utils/reservas.js` |
| Gestionar horarios de ocupación | Admin → *Calendario y horarios* (`TablaOcupacion.jsx`) y *Mesas* |
| Calendario interactivo con las reservas | Admin → *Calendario y horarios* (`CalendarioMensual.jsx`) |
| Vista para administradores y clientes | Carpetas `admin/` y `cliente/` |
| Interfaz móvil y de escritorio | Bootstrap (grilla responsiva y menús que se pliegan) |

> Falta aparte (no es código): el diseño en **Figma**, el **informe de pruebas de usabilidad** y el **PDF** de la sustentación.

## 7. Reglas de las reservas

- El restaurante atiende de **09:00 a 22:00**.
- Se puede llegar cada **30 minutos** (09:00, 09:30, 10:00...). La última hora de llegada es 20:30.
- Cada reserva ocupa la mesa **1 hora y 30 minutos** (por ejemplo, 13:00 a 14:30).
- Una mesa no se puede reservar si el tramo se cruza con otra reserva (13:30 con una reserva de 13:00 está ocupado; 14:30 ya está libre).
- Las reservas **canceladas** liberan la mesa.
- **Cuando pasa la hora de la reserva** (hora de llegada + 1 h 30 min) el estado cambia solo:
  una reserva **Confirmada** pasa a **Completada** y una **Pendiente** que nadie aprobó pasa a **Vencida**.
  Ninguna de las dos tiene botones de acción (se muestra "Sin acciones"). Se calcula con la hora actual
  (`estadoActual()` en `utils/reservas.js`), se actualiza cada minuto y no hace falta recargar la página.
- El cliente debe dejar nombre, teléfono y **correo**.

## 8. Cómo probar la aplicación

1. **Reserva normal:** en `/reservar` elige un día en el calendario, personas, hora, mesa y tus datos. Debe salir un mensaje verde.
2. **Aprobación:** entra a `/login` → *Dashboard*. La solicitud aparece en "pendientes". Pulsa **Aprobar**.
3. **Cruce de horarios:** reserva la Mesa 01 de 13:00 a 14:30 y luego intenta reservarla a las 14:00: la mesa aparece **OCUPADA**. A las 14:30 sí queda libre.
4. **Horas llenas:** las horas sin mesas libres aparecen en gris y no se pueden elegir.
5. **Capacidad:** elige 6 personas; solo la Mesa 04 queda habilitada.
6. **Cancelar libera la mesa:** en *Reservas* cancela esa reserva y verifica que la mesa vuelve a estar libre.
7. **Calendario:** en *Calendario y horarios* haz clic en distintos días y revisa la tabla de ocupación.
8. **Platos:** en *Platos* marca uno como agotado y revisa `/carta`.
7b. **Completada:** las reservas de ejemplo de hoy (13:00 y 14:00) pasan a **Completada** cuando termina su tiempo (14:30 y 15:30), sin botones de acción. Para verlo de inmediato, en `localStorage` (`rincon_reservas_v2`) cambia la `fecha` de una reserva Confirmada a un día anterior y recarga: el Dashboard cuenta una más en *Completadas*.
8b. **Agregar plato/promoción:** en *Platos* o *Promociones* llena el formulario (la foto debe pesar menos de 500 KB), pulsa **Agregar** y revisa `/carta` o `/promociones`.
9. **Responsive:** reduce el ancho del navegador (o usa el modo móvil) y comprueba que los menús se adaptan.
10. **Restablecer datos de ejemplo:** en las herramientas del navegador borra `localStorage` y recarga.

## 9. Paleta de colores

Se define **una sola vez** en `src/estilos.css` (variables `--grafito`, `--dorado`, etc.) y reemplaza los colores de Bootstrap,
por eso las páginas siguen usando las clases normales (`bg-dark`, `btn-warning`, `bg-success`, `text-muted`...).

| Color | Hex | Dónde se ve |
|-------|-----|-------------|
| Negro grafito | `#222222` | Menú lateral, barras de navegación, encabezados de tabla (`bg-dark`, `table-dark`) |
| Gris cálido | `#77736C` | Textos secundarios, etiquetas (`text-muted`, `bg-secondary`) |
| Marfil | `#F5F3EF` | Fondo de las páginas (`body`, `bg-light`) |
| Dorado champagne | `#C6A76A` | Botones destacados, ítem activo del menú, pendientes (`btn-warning`, `btn-primary`, `bg-warning`) |
| Blanco | `#FFFFFF` | Tarjetas, formularios, ventanas emergentes (`card`, `form-control`, `modal-content`) |
| Verde bosque | `#467653` | Reservas confirmadas y mensajes de éxito (`bg-success`, `alert-success`) |
| Ladrillo (extra) | `#A64B3C` | Solo canceladas y errores (`bg-danger`); no está en el diseño original |

Para cambiar un color basta con editar su variable al inicio de `estilos.css`.

## 10. Integrantes

- (escribir los nombres del grupo)

**Enlace del prototipo en Figma:** (pegar aquí)
