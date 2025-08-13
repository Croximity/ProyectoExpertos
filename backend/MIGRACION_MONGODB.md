# Migración a MongoDB - Sistema de Autenticación

Este documento describe la migración del sistema de autenticación de MySQL a MongoDB, manteniendo la integridad del proyecto.

## 📋 Resumen de Cambios

### Nuevos Archivos Creados:
- `configuraciones/mongodb.js` - Configuración de conexión MongoDB
- `modelos/seguridad/PersonaMongo.js` - Esquema MongoDB para Persona
- `modelos/seguridad/RolMongo.js` - Esquema MongoDB para Rol
- `modelos/seguridad/UsuarioMongo.js` - Esquema MongoDB para Usuario
- `controladores/seguridad/authControllerMongo.js` - Controlador de autenticación para MongoDB
- `configuraciones/passportMongo.js` - Configuración Passport para MongoDB
- `rutas/seguridad/authRoutesMongo.js` - Rutas de autenticación para MongoDB
- `migracion-mongodb.js` - Script de migración de datos
- `MIGRACION_MONGODB.md` - Este archivo de documentación

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
MongoDB ya está incluido en el `package.json`. Si necesitas instalar manualmente:

```bash
npm install mongoose
```

### 2. Configurar Variables de Entorno
Agregar la siguiente variable a tu archivo `.env`:

```env
MONGODB_URI=mongodb+srv://croximity:<db_password>@cluster0.kz5s70i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

**⚠️ IMPORTANTE:** Reemplaza `<db_password>` con tu contraseña real de MongoDB.

### 3. Ejecutar Migración de Datos

#### Opción A: Migración Automática
```bash
cd backend
node migracion-mongodb.js
```

#### Opción B: Limpiar Datos de MongoDB (si es necesario)
```bash
cd backend
node migracion-mongodb.js limpiar
```

## 🔄 Integración con la Aplicación

### Opción 1: Usar MongoDB en Paralelo (Recomendado)
Agregar las siguientes líneas a `app.js` después de las rutas existentes:

```javascript
// MongoDB Authentication Routes
const authRoutesMongo = require('./rutas/seguridad/authRoutesMongo');
app.use('/api/optica/auth-mongo', authRoutesMongo);
```

### Opción 2: Reemplazar Completamente
1. Reemplazar las importaciones en `app.js`:
   ```javascript
   // Cambiar de:
   const authRoutes = require('./rutas/seguridad/authRoutes');
   // A:
   const authRoutes = require('./rutas/seguridad/authRoutesMongo');
   ```

2. Actualizar la configuración de Passport:
   ```javascript
   // Cambiar de:
   const { verificarUsuario } = require('./configuraciones/passport');
   // A:
   const { verificarUsuario } = require('./configuraciones/passportMongo');
   ```

## 📊 Estructura de Datos MongoDB

### Colección: `personas`
```javascript
{
  _id: ObjectId,
  Pnombre: String (required),
  Snombre: String,
  Papellido: String,
  Sapellido: String,
  Direccion: String,
  DNI: String,
  correo: String,
  fechaNacimiento: Date,
  genero: String (M/F, default: 'M'),
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `roles`
```javascript
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Colección: `usuarios`
```javascript
{
  _id: ObjectId,
  Nombre_Usuario: String (required, unique),
  contraseña: String (required, hashed),
  estado: String (enum: ['Activo', 'Bloqueado', 'Inactivo', 'Logeado']),
  idPersona: ObjectId (ref: 'Persona'),
  idrol: ObjectId (ref: 'Rol'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Endpoints de Autenticación MongoDB

### Base URL: `/api/optica/auth-mongo`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/registro` | Registrar nuevo usuario |
| POST | `/login` | Iniciar sesión |
| POST | `/registrar-persona` | Registrar nueva persona |
| POST | `/crear-rol` | Crear nuevo rol |
| GET | `/listar` | Listar usuarios (protegido) |
| GET | `/usuario-actual` | Obtener usuario actual (protegido) |
| GET | `/personas` | Listar personas (protegido) |
| GET | `/roles` | Listar roles (protegido) |
| POST | `/asociar-persona` | Asociar persona a usuario (protegido) |

## 🔧 Diferencias Clave con MySQL

### 1. IDs
- **MySQL**: Enteros auto-incrementales (`idUsuario: 1, 2, 3...`)
- **MongoDB**: ObjectIds (`_id: "507f1f77bcf86cd799439011"`)

### 2. Relaciones
- **MySQL**: Claves foráneas con JOINs
- **MongoDB**: Referencias con `populate()`

### 3. Consultas
- **MySQL**: SQL con Sequelize ORM
- **MongoDB**: Métodos Mongoose (`find()`, `findById()`, etc.)

## 🧪 Pruebas

### 1. Crear un Rol
```bash
curl -X POST http://localhost:4051/api/optica/auth-mongo/crear-rol \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Administrador",
    "descripcion": "Rol de administrador del sistema"
  }'
```

### 2. Registrar una Persona
```bash
curl -X POST http://localhost:4051/api/optica/auth-mongo/registrar-persona \
  -H "Content-Type: application/json" \
  -d '{
    "Pnombre": "Juan",
    "Snombre": "Carlos",
    "Papellido": "Pérez",
    "Sapellido": "García",
    "DNI": "12345678",
    "correo": "juan@example.com",
    "genero": "M"
  }'
```

### 3. Registrar un Usuario
```bash
curl -X POST http://localhost:4051/api/optica/auth-mongo/registro \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre_Usuario": "juan123",
    "contraseña": "password123"
  }'
```

### 4. Iniciar Sesión
```bash
curl -X POST http://localhost:4051/api/optica/auth-mongo/login \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre_Usuario": "juan123",
    "contraseña": "password123"
  }'
```

## ⚠️ Consideraciones Importantes

### 1. Seguridad
- Las contraseñas se hashean con Argon2 (igual que en MySQL)
- Los tokens JWT mantienen la misma estructura
- La autenticación es compatible con el frontend existente

### 2. Rendimiento
- MongoDB es más rápido para consultas de lectura
- Los índices están configurados para optimizar búsquedas
- Las referencias se cargan bajo demanda con `populate()`

### 3. Migración Gradual
- Puedes mantener ambos sistemas funcionando en paralelo
- El frontend puede usar cualquiera de los dos endpoints
- Facilita la transición y pruebas

## 🐛 Solución de Problemas

### Error de Conexión MongoDB
```bash
# Verificar que la URI es correcta
echo $MONGODB_URI

# Verificar conectividad
mongo "mongodb+srv://cluster0.kz5s70i.mongodb.net/" --username croximity
```

### Error de Migración
```bash
# Limpiar datos y reintentar
node migracion-mongodb.js limpiar
node migracion-mongodb.js
```

### Error de Autenticación
- Verificar que el token JWT contiene el `idUsuario` correcto
- Asegurar que el usuario existe en MongoDB
- Verificar que las referencias (Persona, Rol) son ObjectIds válidos

## 📞 Soporte

Si encuentras problemas durante la migración:

1. Revisar los logs del servidor
2. Verificar la conectividad a MongoDB
3. Comprobar que las variables de entorno están configuradas
4. Ejecutar las pruebas de ejemplo

## 🎯 Próximos Pasos

1. **Migración Completa**: Una vez probado, migrar completamente a MongoDB
2. **Optimización**: Ajustar índices según el uso real
3. **Monitoreo**: Implementar métricas de rendimiento
4. **Backup**: Configurar respaldos automáticos de MongoDB

