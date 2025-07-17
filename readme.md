# API-Optica

Sistema de gestión integral para ópticas y consultorios oftalmológicos desarrollado con Node.js y Express.

## 📌 Descripción

API-Optica es una API REST completa diseñada para gestionar las operaciones de una óptica o consultorio oftalmológico. El sistema maneja desde la gestión de pacientes y empleados hasta el control de inventario, facturación y consultas médicas.

## 🚀 Características Principales

- ✅ Gestión de usuarios y autenticación JWT
- ✅ Registro y administración de clientes
- ✅ Consultas médicas y exámenes oftalmológicos
- ✅ Control de inventario de productos ópticos
- ✅ Sistema completo de facturación con descuentos
- ✅ Generación de archivos PDF de facturas
- ✅ Documentación interactiva con Swagger UI

## 🛠️ Tecnologías Utilizadas

- Backend: Node.js con Express 5.1.0
- Base de Datos: MySQL con Sequelize ORM
- Autenticación: JWT con Passport
- Seguridad: bcrypt para hash de contraseñas
- Validación: express-validator
- Archivos: Multer para uploads
- PDF: PDFKit para generar facturas
- Documentación: Swagger UI

## 📦 Instalación

1. Clona el repositorio:

    cd expertosPruebas
    git clone https://github.com/Croximity/ProyectoExpertos.git
   

2. Instala las dependencias:

   npm install

3. Configura las variables de entorno en un archivo `.env`:

    PuertoBase=tupuertobase
    puerto=tuPuerto
    NombreBase=tunombreBD
    UsuarioBase=tuusuario
    ContrasenaBase=tucontraseña
    JWT_SECRET=tu_jwt_secret_aqui  

4. Ejecuta el servidor:

   npm run dev

## 🗂️ Estructura del Proyecto

## Estructura del Proyecto

- `ProyectoExpertos/`
  - `backend/`
    - `app.js` – Archivo principal
    - `configuraciones/` – Configuraciones de base de datos, Swagger y entorno
    - `controladores/` – Lógica de negocio
        - `seguridad/`
        - `gestion_cliente/`
        - `productos/`
        - `consulta_examenes/`
        - `facturacion/`
    - `modelos/` – Modelos de datos con Sequelize
    - `rutas/` – Endpoints de la API
    - `middlewares/` – Middlewares personalizados
  - `frontend/`


## 📚 Módulos del Sistema

### 1. Seguridad y Autenticación

- Registro y login
- Autenticación JWT
- Roles de acceso

### 2. Gestión de Clientes

- Registro de pacientes y empleados
- Información de contacto
- Historial

### 3. Consultas Médicas

- Exámenes de vista
- Diagnóstico y recetas

### 4. Productos

- Inventario óptico
- Categorías y stock

### 5. Facturación

- Facturas con detalle y descuentos
- Formas de pago
- Generación de factura en PDF

## 📘 Documentación de la API

Accede a la documentación en Swagger UI:

   http://localhost:3000/api-docs

## 🔐 Autenticación

Para acceder a rutas protegidas usa el siguiente encabezado:

   Authorization: Bearer <tu_jwt_token>

## 🛠️ Scripts Disponibles

- npm run dev – Inicia el servidor en desarrollo
- npm test – Ejecuta pruebas (por implementar)

## 🗃️ Base de Datos

MySQL + Sequelize. Los modelos se sincronizan automáticamente al arrancar el proyecto.

## 📤 Generar PDF de Factura

La API permite descargar archivos PDF de cada factura. Ejemplo:

   GET /api/optica/factura/12/pdf

Esto descargará el archivo factura_12.pdf si existe en la carpeta uploads.

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea tu rama: git checkout -b feature/miFeature
3. Haz commit: git commit -m "Añadir miFeature"
4. Haz push: git push origin feature/miFeature
5. Abre un Pull Request

## 📬 Contacto

Para soporte técnico, escribe a:  
ajgamez02@gmail.com

## 🪪 Licencia

Este proyecto está bajo la licencia ISC.
