const mysql = require('mysql2/promise');
const connectMongoDB = require('./configuraciones/mongodb');
const Persona = require('./modelos/seguridad/PersonaMongo');
const Rol = require('./modelos/seguridad/RolMongo');
const Usuario = require('./modelos/seguridad/UsuarioMongo');

// Configuración de MySQL (usar las mismas variables de entorno)
require('dotenv').config();

const mysqlConfig = {
  host: 'localhost',
  port: process.env.PuertoBase || 3306,
  user: process.env.UsuarioBase,
  password: process.env.ContrasenaBase,
  database: process.env.NombreBase
};

async function migrarDatos() {
  try {
    console.log('🔄 Iniciando migración de MySQL a MongoDB...');
    
    // Conectar a MongoDB
    await connectMongoDB();
    console.log('✅ Conectado a MongoDB');
    
    // Conectar a MySQL
    const mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('✅ Conectado a MySQL');
    
    // Migrar Personas
    console.log('📦 Migrando personas...');
    const [personas] = await mysqlConnection.execute('SELECT * FROM persona');
    
    for (const persona of personas) {
      await Persona.create({
        Pnombre: persona.Pnombre,
        Snombre: persona.Snombre,
        Papellido: persona.Papellido,
        Sapellido: persona.Sapellido,
        Direccion: persona.Direccion,
        DNI: persona.DNI,
        correo: persona.correo,
        fechaNacimiento: persona.fechaNacimiento,
        genero: persona.genero
      });
    }
    console.log(`✅ ${personas.length} personas migradas`);
    
    // Migrar Roles
    console.log('📦 Migrando roles...');
    const [roles] = await mysqlConnection.execute('SELECT * FROM rol');
    
    const rolesMap = new Map(); // Para mapear IDs de MySQL a MongoDB
    for (const rol of roles) {
      const nuevoRol = await Rol.create({
        nombre: rol.nombre,
        descripcion: rol.descripcion
      });
      rolesMap.set(rol.idrol, nuevoRol._id);
    }
    console.log(`✅ ${roles.length} roles migrados`);
    
    // Migrar Usuarios
    console.log('📦 Migrando usuarios...');
    const [usuarios] = await mysqlConnection.execute('SELECT * FROM usuario');
    
    for (const usuario of usuarios) {
      // Buscar la persona correspondiente en MongoDB
      const persona = await Persona.findOne({
        DNI: usuario.idPersona ? await getPersonaDNI(mysqlConnection, usuario.idPersona) : null
      });
      
      // Buscar el rol correspondiente en MongoDB
      const rol = rolesMap.get(usuario.idrol);
      
      await Usuario.create({
        Nombre_Usuario: usuario.Nombre_Usuario,
        contraseña: usuario.contraseña,
        estado: usuario.estado,
        idPersona: persona ? persona._id : null,
        idrol: rol || null
      });
    }
    console.log(`✅ ${usuarios.length} usuarios migrados`);
    
    await mysqlConnection.end();
    console.log('🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  }
}

async function getPersonaDNI(mysqlConnection, idPersona) {
  try {
    const [rows] = await mysqlConnection.execute('SELECT DNI FROM persona WHERE idPersona = ?', [idPersona]);
    return rows.length > 0 ? rows[0].DNI : null;
  } catch (error) {
    console.error('Error obteniendo DNI de persona:', error);
    return null;
  }
}

// Función para limpiar datos de MongoDB (usar con precaución)
async function limpiarMongoDB() {
  try {
    console.log('🧹 Limpiando datos de MongoDB...');
    await connectMongoDB();
    
    await Persona.deleteMany({});
    await Rol.deleteMany({});
    await Usuario.deleteMany({});
    
    console.log('✅ Datos de MongoDB limpiados');
  } catch (error) {
    console.error('❌ Error limpiando MongoDB:', error);
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  const comando = process.argv[2];
  
  if (comando === 'limpiar') {
    limpiarMongoDB();
  } else {
    migrarDatos();
  }
}

module.exports = { migrarDatos, limpiarMongoDB };

