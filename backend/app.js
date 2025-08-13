const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const db = require('./configuraciones/db');
const connectMongoDB = require('./configuraciones/mongodb');

// Importar configuración de passport
const { validarAutenticacion } = require('./configuraciones/passport');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configuraciones/swagger.js'); // ajusta según tu ruta
const path = require('path');

// Cargar variables de entorno
dotenv.config();

// Inicializar la app
const app = express();

// Configuración básica de CORS
app.use(cors({
  origin: 'http://localhost:3002', // frontend (React)
  credentials: true,               // para enviar cookies o encabezados de autorización
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));





// Middlewares
app.use(morgan('dev'));
app.use(express.json());
// Servir archivos estáticos desde /public
app.use('/public', express.static(path.join(__dirname, 'public')));


// Middleware para validar factura

app.use(passport.initialize());



// rutas de documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/* ========== RUTAS DE SEGURIDAD (MongoDB) ========== */
const authRoutes = require('./rutas/seguridad/authRoutes');
const personaRutas = require('./rutas/seguridad/personaRutas');
const rolRutas = require('./rutas/seguridad/rolRutas');

/* ========== RUTAS DE PRODUCTOS/INVENTARIO ========== */
const productoRutas = require('./rutas/productos/productoRutas');
const categoriaProductoRutas = require('./rutas/productos/categoriaProductoRutas');
const atributoRutas = require('./rutas/productos/atributoRutas');
const productoAtributoRutas = require('./rutas/productos/productoAtributoRutas');
const imagenProductoRutas = require('./rutas/productos/imagenProductoRutas');


/* ========== RUTAS DE GESTIÓN CLIENTE ========== */
const clienteRuta = require('./rutas/gestion_cliente/ClienteRuta');
const empleadoRuta = require('./rutas/gestion_cliente/EmpleadoRuta');
const telefonoRuta = require('./rutas/gestion_cliente/TelefonoRuta');
const consultaRuta = require('./rutas/gestion_cliente/ConsultaRuta');

/* ========== RUTAS DE CONSULTA EXAMENES ========== */
const tipoEnfermedadRuta = require('./rutas/consulta_examenes/TipoEnfermedadRuta');
const recetaRuta = require('./rutas/consulta_examenes/RecetaRuta');
const examenVistaRuta = require('./rutas/consulta_examenes/Examen_VistaRuta');
const diagnosticoRuta = require('./rutas/consulta_examenes/DiagnosticoRuta');
const reparacionDeLentesRuta = require('./rutas/consulta_examenes/ReparacionDeLentesRuta');

/* ========== RUTAS DE Facturacion ========== */
const facturaRutas = require('./rutas/facturacion/facturaRoutes');
const facturaDetalleRutas = require('./rutas/facturacion/facturaDetalleRoutes');
const detalleDescuentoRutas = require('./rutas/facturacion/detalleDescuentoRoutes');
const archivoRoutes = require('./rutas/facturacion/archivoRoutes');
const descuentoRoutes = require('./rutas/facturacion/descuentoRoutes');
const formaPagoRoutes = require('./rutas/facturacion/formaPagoRoutes');
const caiRoutes = require('./rutas/facturacion/caiRoutes');
const pagoRoutes = require('./rutas/facturacion/pagoRoutes');

// Usar rutas de gestión cliente
app.use('/api/optica/gestion_cliente/clientes', clienteRuta);
app.use('/api/optica/gestion_cliente/empleados', empleadoRuta);
app.use('/api/optica/gestion_cliente/telefonos', telefonoRuta);
app.use('/api/optica/gestion_cliente/consultas', consultaRuta);

// Usar rutas de consulta exámenes
app.use('/api/optica', tipoEnfermedadRuta);
app.use('/api/optica', recetaRuta);
app.use('/api/optica', examenVistaRuta);
app.use('/api/optica', diagnosticoRuta);
app.use('/api/optica', reparacionDeLentesRuta);

// Usar rutas de Facturacion
app.use('/api/optica', facturaRutas);
app.use('/api/optica', facturaDetalleRutas);
app.use('/api/optica', detalleDescuentoRutas);
app.use('/api/optica', descuentoRoutes);
app.use('/api/optica', formaPagoRoutes);
app.use('/api/optica', caiRoutes);
app.use('/api/optica', pagoRoutes);

app.use('/api/optica', archivoRoutes);
app.use('/api/optica', express.static('uploads')); 
// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static('uploads'));

// Usar rutas de autenticación MongoDB
app.use('/api/optica/auth', authRoutes);
app.use('/api/optica/personas', personaRutas);
app.use('/api/optica/roles', rolRutas);

app.use('/api/optica/productos', productoRutas);
app.use('/api/optica/categorias', categoriaProductoRutas);
app.use('/api/optica/atributos', atributoRutas);
app.use('/api/optica/asignaciones', productoAtributoRutas);
app.use('/api/optica/productos', imagenProductoRutas);


/* ========== MODELOS A SINCRONIZAR (si querés controlar uno a uno) ========== */
const Persona = require('./modelos/seguridad/Persona');
const Rol = require('./modelos/seguridad/Rol');
const Usuario = require('./modelos/seguridad/Usuario');



// Modelos de consulta exámenes
const TipoEnfermedad = require('./modelos/consulta_examenes/TipoEnfermedad');
const Receta = require('./modelos/consulta_examenes/Receta');
const Examen_Vista = require('./modelos/consulta_examenes/Examen_Vista');
const Diagnostico = require('./modelos/consulta_examenes/Diagnostico');
const ReparacionDeLentes = require('./modelos/consulta_examenes/ReparacionDeLentes');

//modelo Gestion de Clientes
const Empleado = require('./modelos/gestion_cliente/Empleado')
const Cliente = require("./modelos/gestion_cliente/Cliente")
const Telefono = require("./modelos/gestion_cliente/Telefono")
const Consulta = require("./modelos/gestion_cliente/Consulta")

// Modelos de Facturacion
const FormaPago = require('./modelos/facturacion/FormaPago');
const Factura = require('./modelos/facturacion/Factura'); // <-- CORREGIDO
const FacturaDetalle = require('./modelos/facturacion/FacturaDetalle');
const Pago = require('./modelos/facturacion/Pago');
const Descuento = require('./modelos/facturacion/Descuento');
const DetalleDescuento = require('./modelos/facturacion/DetalleDescuento');
const Atributo = require('./modelos/productos/Atributo');
const Cai = require('./modelos/facturacion/Cai');

//modelos de productos
const Producto = require('./modelos/productos/ProductoModel');
const CategoriaProducto = require('./modelos/productos/CategoriaProducto');
const ProductoAtributo = require('./modelos/productos/ProductoAtributo');


const startServer = async () => {
  try {
    // Conectar a MySQL
    await db.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente.');
    
    // Conectar a MongoDB
    await connectMongoDB();
    console.log('✅ Conexión a MongoDB establecida correctamente.');
    
    // Sincronizar modelos de seguridad
    await Persona.sync();
    await Rol.sync();
    await Usuario.sync();
    console.log('✅ Modelos de seguridad sincronizados.');

    // Verificar y crear roles por defecto si no existen
    try {
      const rolesExistentes = await require('./modelos/seguridad/RolMongo').find();
      if (rolesExistentes.length === 0) {
        console.log('⚠️ No se encontraron roles, creando roles por defecto...');
        
        const rolesPorDefecto = [
          { nombre: 'Administrador', descripcion: 'Rol con acceso completo al sistema' },
          { nombre: 'Usuario', descripcion: 'Rol de usuario estándar' },
          { nombre: 'Empleado', descripcion: 'Rol para empleados del negocio' }
        ];

        for (const rolData of rolesPorDefecto) {
          const nuevoRol = await require('./modelos/seguridad/RolMongo').create(rolData);
          console.log(`✅ Rol creado: ${nuevoRol.nombre} (ID: ${nuevoRol._id})`);
        }
        
        console.log('✅ Roles por defecto creados exitosamente.');
      } else {
        console.log(`✅ Se encontraron ${rolesExistentes.length} roles existentes.`);
      }
    } catch (error) {
      console.error('❌ Error al verificar/crear roles por defecto:', error);
    }

    await Empleado.sync();
    await Cliente.sync();
    await Telefono.sync();
    await Consulta.sync();
    console.log('✅ Modelos de gestion de cliente sincronizados.')

    // Sincronizar modelos de consulta exámenes
    await TipoEnfermedad.sync();
    await Receta.sync();
    await Examen_Vista.sync();
    await Diagnostico.sync();
    await ReparacionDeLentes.sync();
    console.log('✅ Modelos de consulta exámenes sincronizados.');

    // Sincronizar el resto (productos, etc.)
    await CategoriaProducto.sync();
    await Producto.sync({ alter: true });
    await Atributo.sync();
    await ProductoAtributo.sync();
    
    console.log('✅ Modelos de productos/inventario sincronizados.');

        // Sincronizar modelos de Fcaturacion
    await FormaPago.sync();
    await Factura.sync();
    await Descuento.sync();
    await DetalleDescuento.sync();
    await FacturaDetalle.sync();
    await Cai.sync();
    await Pago.sync();
    console.log('✅ Modelos de  Facturacion sincronizados.');

    // Iniciar servidor
    const PORT = process.env.puerto || 4051;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar la base de datos o el servidor:', err);
  }
};

startServer();
