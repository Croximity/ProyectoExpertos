# Módulo de Gestión de Clientes

Este módulo proporciona una interfaz completa para la gestión de clientes y empleados de la óptica, con funcionalidades CRUD completas y una experiencia de usuario moderna.

## Componentes

### 1. PanelGestionCliente.js
Panel principal que muestra estadísticas y acceso rápido a las funcionalidades del módulo.

**Características:**
- Dashboard con estadísticas en tiempo real
- Acceso rápido a gestión de clientes y empleados
- Vista de registros recientes
- Información del sistema

### 2. Clientes.js
Componente principal para la gestión de clientes.

**Funcionalidades:**
- Lista de clientes con búsqueda avanzada
- Agregar nuevos clientes (con opción de crear nueva persona o seleccionar existente)
- Ver detalles de clientes
- Eliminar clientes
- Validaciones de formulario
- Notificaciones por email automáticas

### 3. Empleados.js
Componente principal para la gestión de empleados.

**Funcionalidades:**
- Lista de empleados con búsqueda avanzada
- Agregar nuevos empleados (con opción de crear nueva persona o seleccionar existente)
- Ver detalles de empleados
- Eliminar empleados
- Validaciones de formulario

### 4. ClienteForm.js
Formulario para crear y editar clientes.

**Características:**
- Formulario con validaciones
- Opción de seleccionar persona existente o crear nueva
- Campos completos de información personal
- Manejo de errores
- Estados de carga

### 5. EmpleadoForm.js
Formulario para crear y editar empleados.

**Características:**
- Formulario con validaciones
- Opción de seleccionar persona existente o crear nueva
- Campos completos de información personal
- Manejo de errores
- Estados de carga

## Características Principales

### Gestión Integrada de Personas
- Sistema unificado que permite reutilizar personas existentes
- Opción de crear nuevas personas al registrar clientes/empleados
- Validaciones consistentes en todos los formularios

### Búsqueda Avanzada
- Búsqueda por nombre y apellido
- Filtros dinámicos
- Resultados en tiempo real

### Notificaciones por Email
- Los clientes reciben un correo de bienvenida automáticamente
- Plantilla HTML personalizada
- Configuración flexible del remitente

### Validaciones
- Validación de campos obligatorios
- Validación de formato de email
- Validación de DNI (13 caracteres)
- Validación de fechas
- Mensajes de error contextuales

### Experiencia de Usuario
- Interfaz moderna y responsiva
- Estados de carga con spinners
- Notificaciones toast
- Modales para confirmaciones
- Navegación intuitiva

## Rutas

- `/admin/gestion-cliente` - Panel principal
- `/admin/clientes` - Lista de clientes
- `/admin/clientes/nuevo` - Nuevo cliente
- `/admin/clientes/editar/:id` - Editar cliente
- `/admin/empleados` - Lista de empleados
- `/admin/empleados/nuevo` - Nuevo empleado
- `/admin/empleados/editar/:id` - Editar empleado

## Servicios Utilizados

### clienteService
- `obtenerClientes(filtros)` - Obtener lista de clientes
- `obtenerClientePorId(id)` - Obtener cliente específico
- `crearCliente(data)` - Crear nuevo cliente
- `editarCliente(id, data)` - Editar cliente existente
- `eliminarCliente(id)` - Eliminar cliente

### empleadoService
- `obtenerEmpleados(filtros)` - Obtener lista de empleados
- `obtenerEmpleadoPorId(id)` - Obtener empleado específico
- `crearEmpleado(data)` - Crear nuevo empleado
- `editarEmpleado(id, data)` - Editar empleado existente
- `eliminarEmpleado(id)` - Eliminar empleado

### personaService
- `obtenerPersonas()` - Obtener lista de personas
- `crearPersona(data)` - Crear nueva persona
- `actualizarPersona(id, data)` - Actualizar persona existente

## Dependencias

- React
- Reactstrap (UI components)
- FontAwesome (iconos)
- React Router (navegación)
- Axios (llamadas HTTP)

## Estructura de Datos

### Cliente
```javascript
{
  idCliente: number,
  fechaRegistro: string,
  idPersona: number,
  persona: {
    idPersona: number,
    Pnombre: string,
    Snombre: string,
    Papellido: string,
    Sapellido: string,
    Direccion: string,
    DNI: string,
    correo: string,
    fechaNacimiento: string,
    genero: 'M' | 'F'
  }
}
```

### Empleado
```javascript
{
  idEmpleado: number,
  Fecha_Registro: string,
  idPersona: number,
  persona: {
    // Misma estructura que en Cliente
  }
}
```

## Configuración de Email

El sistema está configurado para enviar emails automáticamente cuando se crea un nuevo cliente. La configuración se encuentra en:

- Backend: `backend/configuraciones/correo.js`
- Variables de entorno: `correousuario`

## Mejoras Futuras

- [ ] Exportación de datos a Excel/PDF
- [ ] Filtros avanzados por fecha de registro
- [ ] Historial de cambios
- [ ] Importación masiva de clientes
- [ ] Dashboard con gráficos estadísticos
- [ ] Notificaciones push
- [ ] Integración con WhatsApp Business 