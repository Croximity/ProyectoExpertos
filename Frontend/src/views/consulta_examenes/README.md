# Módulo de Consulta de Exámenes

Este módulo proporciona funcionalidad completa para la gestión de consultas médicas oftalmológicas, incluyendo recetas, exámenes de vista, diagnósticos y más.

## Estructura del Módulo

### Componentes Principales

#### 1. PanelConsultaExamenes
- **Ubicación**: `./PanelConsultaExamenes.js`
- **Descripción**: Panel principal que muestra estadísticas y navegación a todos los submódulos
- **Características**:
  - Dashboard con métricas en tiempo real
  - Navegación rápida a todos los módulos
  - Acciones rápidas para crear nuevos registros

#### 2. Recetas (`./Recetas.js` y `./RecetaForm.js`)
- **Funcionalidad**: Gestión completa de recetas médicas
- **Características**:
  - Lista con filtros avanzados (cliente, empleado, tipo lente, fechas)
  - Formulario completo con medidas ópticas (esfera, cilindro, eje)
  - Validaciones del lado del cliente
  - CRUD completo (Crear, Leer, Actualizar, Eliminar)

#### 3. ExamenesVista (`./ExamenesVista.js`)
- **Funcionalidad**: Gestión de exámenes oftalmológicos
- **Características**:
  - Lista con filtros por consulta, receta y fechas
  - Vinculación con recetas y consultas
  - Estados de seguimiento

#### 4. Diagnosticos (`./Diagnosticos.js`)
- **Funcionalidad**: Gestión de diagnósticos médicos
- **Características**:
  - Lista de diagnósticos con información del examen y tipo de enfermedad
  - Vinculación con tipos de enfermedad
  - Historial de diagnósticos

### Servicios (API)

#### 1. RecetaService (`../../services/consulta_examenes/recetaService.js`)
- `obtenerRecetas(filtros)` - Obtener recetas con filtros opcionales
- `obtenerRecetaPorId(id)` - Obtener receta específica
- `crearReceta(data)` - Crear nueva receta
- `editarReceta(id, data)` - Actualizar receta existente
- `eliminarReceta(id)` - Eliminar receta

#### 2. ExamenVistaService (`../../services/consulta_examenes/examenVistaService.js`)
- `obtenerExamenesVista(filtros)` - Obtener exámenes con filtros
- `obtenerExamenVistaPorId(id)` - Obtener examen específico
- `crearExamenVista(data)` - Crear nuevo examen
- `editarExamenVista(id, data)` - Actualizar examen
- `eliminarExamenVista(id)` - Eliminar examen

#### 3. DiagnosticoService (`../../services/consulta_examenes/diagnosticoService.js`)
- `obtenerDiagnosticos()` - Obtener todos los diagnósticos
- `obtenerDiagnosticoPorId(id)` - Obtener diagnóstico específico
- `crearDiagnostico(data)` - Crear nuevo diagnóstico
- `editarDiagnostico(id, data)` - Actualizar diagnóstico
- `eliminarDiagnostico(id)` - Eliminar diagnóstico

#### 4. TipoEnfermedadService (`../../services/consulta_examenes/tipoEnfermedadService.js`)
- `obtenerTiposEnfermedad(filtros)` - Obtener tipos de enfermedad
- `obtenerTipoEnfermedadPorId(id)` - Obtener tipo específico
- `crearTipoEnfermedad(data)` - Crear nuevo tipo
- `editarTipoEnfermedad(id, data)` - Actualizar tipo
- `eliminarTipoEnfermedad(id)` - Eliminar tipo

#### 5. ReparacionLentesService (`../../services/consulta_examenes/reparacionLentesService.js`)
- `obtenerReparaciones(filtros)` - Obtener reparaciones con filtros
- `obtenerReparacionPorId(id)` - Obtener reparación específica
- `crearReparacion(data)` - Crear nueva reparación
- `editarReparacion(id, data)` - Actualizar reparación
- `eliminarReparacion(id)` - Eliminar reparación

## Endpoints del Backend

Los servicios se conectan a los siguientes endpoints del backend:

### Recetas
- `GET /api/optica/receta/listar` - Listar recetas con filtros
- `GET /api/optica/receta/obtener/:id` - Obtener receta por ID
- `POST /api/optica/receta/guardar` - Crear nueva receta
- `PUT /api/optica/receta/editar/:id` - Actualizar receta
- `DELETE /api/optica/receta/eliminar/:id` - Eliminar receta

### Exámenes de Vista
- `GET /api/optica/examen-vista/listar` - Listar exámenes
- `GET /api/optica/examen-vista/obtener/:id` - Obtener examen por ID
- `POST /api/optica/examen-vista/guardar` - Crear examen
- `PUT /api/optica/examen-vista/editar/:id` - Actualizar examen
- `DELETE /api/optica/examen-vista/eliminar/:id` - Eliminar examen

### Diagnósticos
- `GET /api/optica/diagnostico/listar` - Listar diagnósticos
- `GET /api/optica/diagnostico/obtener/:id` - Obtener diagnóstico por ID
- `POST /api/optica/diagnostico/guardar` - Crear diagnóstico
- `PUT /api/optica/diagnostico/editar/:id` - Actualizar diagnóstico
- `DELETE /api/optica/diagnostico/eliminar/:id` - Eliminar diagnóstico

## Características Técnicas

### Validaciones
- Validación en tiempo real en formularios
- Manejo de errores del backend
- Feedback visual al usuario

### UI/UX
- Diseño consistente con el resto de la aplicación
- Iconos FontAwesome para mejor UX
- Loading states y manejo de estados de error
- Filtros dinámicos en listas
- Navegación intuitiva

### Seguridad
- Todos los endpoints requieren autenticación (Bearer token)
- Validaciones tanto en frontend como backend
- Manejo seguro de datos sensibles

## Uso

### Importar componentes:
```javascript
import { 
  PanelConsultaExamenes, 
  Recetas, 
  RecetaForm,
  ExamenesVista,
  Diagnosticos
} from './views/consulta_examenes';
```

### Importar servicios:
```javascript
import { 
  recetaService,
  examenVistaService,
  diagnosticoService 
} from './views/consulta_examenes';
```

## Rutas Sugeridas

Para integrar con el sistema de rutas de la aplicación:

```javascript
// En routes.js
{
  path: "/consulta-examenes",
  name: "Panel Consulta Exámenes",
  icon: "ni ni-collection text-info",
  component: PanelConsultaExamenes,
  layout: "/admin"
},
{
  path: "/consulta-examenes/recetas",
  name: "Recetas",
  component: Recetas,
  layout: "/admin"
},
{
  path: "/consulta-examenes/recetas/nuevo",
  name: "Nueva Receta",
  component: RecetaForm,
  layout: "/admin"
},
{
  path: "/consulta-examenes/recetas/editar/:id",
  name: "Editar Receta",
  component: RecetaForm,
  layout: "/admin"
}
```

## Dependencias

- React 18.2.0
- reactstrap 8.10.0
- react-router-dom 6.21.1
- @fortawesome/react-fontawesome
- axios (a través de axiosInstance)

## Notas de Desarrollo

- Todos los componentes son funcionales usando hooks
- Manejo de estado local con useState
- Efectos secundarios con useEffect
- Navegación programática con useNavigate
- Diseño responsive con reactstrap
- Consistencia visual con la plantilla Argon Dashboard
