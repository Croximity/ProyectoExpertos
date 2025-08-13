const connectMongoDB = require('./configuraciones/mongodb');
const Persona = require('./modelos/seguridad/PersonaMongo');
const Rol = require('./modelos/seguridad/RolMongo');
const Usuario = require('./modelos/seguridad/UsuarioMongo');

async function testMongoDB() {
  try {
    console.log('🧪 Iniciando pruebas de MongoDB...');
    
    // Conectar a MongoDB
    await connectMongoDB();
    console.log('✅ Conexión a MongoDB exitosa');
    
    // Crear un rol de prueba
    console.log('📝 Creando rol de prueba...');
    const rol = await Rol.create({
      nombre: 'Usuario',
      descripcion: 'Rol de usuario básico'
    });
    console.log('✅ Rol creado:', rol);
    
    // Crear una persona de prueba
    console.log('📝 Creando persona de prueba...');
    const persona = await Persona.create({
      Pnombre: 'Test',
      Snombre: 'Usuario',
      Papellido: 'Prueba',
      Sapellido: 'MongoDB',
      DNI: '12345678',
      correo: 'test@mongodb.com',
      genero: 'M'
    });
    console.log('✅ Persona creada:', persona);
    
    // Crear un usuario de prueba
    console.log('📝 Creando usuario de prueba...');
    const usuario = await Usuario.create({
      Nombre_Usuario: 'testuser',
      contraseña: '$argon2id$v=19$m=65536,t=3,p=4$test',
      estado: 'Activo',
      idPersona: persona._id,
      idrol: rol._id
    });
    console.log('✅ Usuario creado:', usuario);
    
    // Probar consultas
    console.log('🔍 Probando consultas...');
    
    const usuarios = await Usuario.find()
      .populate('idPersona', 'Pnombre Papellido')
      .populate('idrol', 'nombre');
    
    console.log('✅ Usuarios encontrados:', usuarios.length);
    console.log('📊 Datos del primer usuario:', JSON.stringify(usuarios[0], null, 2));
    
    // Limpiar datos de prueba
    console.log('🧹 Limpiando datos de prueba...');
    await Usuario.deleteOne({ Nombre_Usuario: 'testuser' });
    await Persona.deleteOne({ DNI: '12345678' });
    await Rol.deleteOne({ nombre: 'Usuario' });
    console.log('✅ Datos de prueba eliminados');
    
    console.log('🎉 Todas las pruebas pasaron exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    process.exit(0);
  }
}

testMongoDB();

