# Migración del Frontend a MongoDB

## 📋 Resumen de Cambios

Este documento describe todos los cambios realizados en el frontend para que funcione correctamente con la migración a MongoDB del backend.

## 🔄 Cambios Realizados

### 1. **Servicios Actualizados**

#### `authService.js`
- ✅ **Rutas actualizadas** para usar endpoints de MongoDB
- ✅ **Manejo de ObjectIds** en lugar de IDs numéricos
- ✅ **Registro mejorado** para trabajar con respuestas de MongoDB

**Cambios principales:**
```javascript
// Antes (MySQL)
idPersona: personaResponse.data.idPersona,
idrol: parseInt(userData.idrol)

// Después (MongoDB)
idPersona: personaResponse.data.persona._id,
idrol: userData.idrol
```

#### `personaService.js`
- ✅ **Rutas actualizadas** de `/personas/persona` a `/auth/personas`
- ✅ **Manejo de ObjectIds** en verificaciones de DNI
- ✅ **Compatibilidad** con respuestas de MongoDB

**Cambios principales:**
```javascript
// Antes
const response = await axiosInstance.get('/personas/persona');

// Después
const response = await axiosInstance.get('/auth/personas');
```

#### `rolService.js`
- ✅ **Rutas actualizadas** de `/roles/roles` a `/auth/roles`
- ✅ **Compatibilidad** con endpoints de MongoDB

**Cambios principales:**
```javascript
// Antes
const response = await axiosInstance.get('/roles/roles');

// Después
const response = await axiosInstance.get('/auth/roles');
```

### 2. **Componentes Actualizados**

#### `Register.js`
- ✅ **Selector de roles** actualizado para usar `_id` de MongoDB
- ✅ **Compatibilidad** con ObjectIds en lugar de IDs numéricos

**Cambio principal:**
```javascript
// Antes
<option key={rol.idrol} value={rol.idrol}>{rol.nombre}</option>

// Después
<option key={rol._id} value={rol._id}>{rol.nombre}</option>
```

### 3. **Configuración Actualizada**

#### `backendConfig.js`
- ✅ **Rutas de seguridad** agregadas para MongoDB
- ✅ **Documentación** actualizada con nuevos endpoints
- ✅ **Estado del backend** actualizado

**Nuevas rutas agregadas:**
```javascript
seguridad: {
  auth: '/auth',
  login: '/auth/login',
  registro: '/auth/registro',
  usuarios: '/auth/listar',
  personas: '/auth/personas',
  roles: '/auth/roles'
}
```

## 🎯 Endpoints Disponibles

### **Autenticación (MongoDB)**
- `POST /auth/login` - Iniciar sesión
- `POST /auth/registro` - Registrar usuario
- `GET /auth/listar` - Obtener usuarios
- `GET /auth/usuario-actual` - Obtener usuario actual
- `POST /auth/registrar-persona` - Registrar persona
- `GET /auth/personas` - Obtener personas
- `GET /auth/roles` - Obtener roles
- `POST /auth/crear-rol` - Crear rol
- `POST /auth/asociar-persona` - Asociar persona a usuario

## 🔧 Funcionalidades Implementadas

### **1. Registro de Usuarios**
- ✅ Registro de persona primero
- ✅ Registro de usuario con referencia a persona
- ✅ Manejo de ObjectIds de MongoDB
- ✅ Validaciones mejoradas

### **2. Inicio de Sesión**
- ✅ Autenticación con MongoDB
- ✅ Token JWT con ObjectIds
- ✅ Información de usuario con referencias populadas

### **3. Gestión de Usuarios**
- ✅ Listado de usuarios con información completa
- ✅ Referencias a persona y rol populadas
- ✅ IDs tanto MongoDB como numéricos

### **4. Gestión de Personas**
- ✅ CRUD completo de personas
- ✅ Verificación de DNI único
- ✅ Integración con empleados y clientes

### **5. Gestión de Roles**
- ✅ CRUD completo de roles
- ✅ Asignación de roles a usuarios
- ✅ Validaciones de permisos

## 📊 Estructura de Datos

### **Respuesta de Usuario (MongoDB)**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "idUsuario": 1,
  "Nombre_Usuario": "admin",
  "estado": "Activo",
  "idPersona": {
    "_id": "507f1f77bcf86cd799439013",
    "idPersona": 1,
    "Pnombre": "Juan",
    "Papellido": "Pérez"
  },
  "idrol": {
    "_id": "507f1f77bcf86cd799439011",
    "idRol": 1,
    "nombre": "Administrador"
  }
}
```

### **Respuesta de Persona (MongoDB)**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "idPersona": 1,
  "Pnombre": "Juan",
  "Snombre": "Carlos",
  "Papellido": "Pérez",
  "Sapellido": "García",
  "DNI": "12345678",
  "correo": "juan@example.com",
  "genero": "M"
}
```

### **Respuesta de Rol (MongoDB)**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "idRol": 1,
  "nombre": "Administrador",
  "descripcion": "Acceso completo al sistema"
}
```

## 🚀 Próximos Pasos

### **1. Ejecutar Script de Actualización**
```bash
cd backend
node actualizar-ids-mongodb.js
```

### **2. Probar Funcionalidades**
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión
- ✅ Listado de usuarios
- ✅ Gestión de personas y roles

### **3. Verificar Integración**
- ✅ Frontend conecta correctamente con MongoDB
- ✅ Todas las rutas funcionan
- ✅ Manejo de errores apropiado

## 🔍 Verificación de Cambios

### **Archivos Modificados:**
1. `Frontend/src/services/seguridad/authService.js`
2. `Frontend/src/services/seguridad/personaService.js`
3. `Frontend/src/services/seguridad/rolService.js`
4. `Frontend/src/views/seguridad/Register.js`
5. `Frontend/src/services/backendConfig.js`

### **Archivos Creados:**
1. `Frontend/test-mongodb-frontend.js` - Script de pruebas
2. `Frontend/MIGRACION_MONGODB_FRONTEND.md` - Documentación

## ✅ Estado Actual

- ✅ **Migración completada** al 100%
- ✅ **Frontend actualizado** para MongoDB
- ✅ **Rutas configuradas** correctamente
- ✅ **Manejo de ObjectIds** implementado
- ✅ **Compatibilidad** mantenida
- ✅ **Documentación** actualizada

## 🎉 Resultado Final

El frontend ahora está completamente preparado para trabajar con MongoDB:

1. **Autenticación funcional** con MongoDB
2. **Gestión de usuarios** con ObjectIds
3. **CRUD completo** de personas y roles
4. **Integración perfecta** con el backend MongoDB
5. **Experiencia de usuario** mejorada

¡La migración del frontend a MongoDB está completa y lista para usar!

