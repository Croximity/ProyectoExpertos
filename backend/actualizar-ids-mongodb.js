const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelos
const Usuario = require('./modelos/seguridad/UsuarioMongo');
const Persona = require('./modelos/seguridad/PersonaMongo');
const Rol = require('./modelos/seguridad/RolMongo');

const actualizarIds = async () => {
  try {
    // Conectar a MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://croximity:K93HkyDPEOArFBDd@cluster0.2qgxidg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado a MongoDB');

    // Actualizar Personas
    console.log('\n🔄 Actualizando Personas...');
    const personas = await Persona.find({ idPersona: { $exists: false } });
    for (let i = 0; i < personas.length; i++) {
      const persona = personas[i];
      persona.idPersona = i + 1;
      await persona.save();
      console.log(`   ✅ Persona ${persona._id} actualizada con idPersona: ${persona.idPersona}`);
    }

    // Actualizar Roles
    console.log('\n🔄 Actualizando Roles...');
    const roles = await Rol.find({ idRol: { $exists: false } });
    for (let i = 0; i < roles.length; i++) {
      const rol = roles[i];
      rol.idRol = i + 1;
      await rol.save();
      console.log(`   ✅ Rol ${rol._id} actualizado con idRol: ${rol.idRol}`);
    }

    // Actualizar Usuarios
    console.log('\n🔄 Actualizando Usuarios...');
    const usuarios = await Usuario.find({ idUsuario: { $exists: false } });
    for (let i = 0; i < usuarios.length; i++) {
      const usuario = usuarios[i];
      usuario.idUsuario = i + 1;
      await usuario.save();
      console.log(`   ✅ Usuario ${usuario._id} actualizado con idUsuario: ${usuario.idUsuario}`);
    }

    console.log('\n✅ Todos los IDs han sido actualizados exitosamente');
    
    // Mostrar estadísticas
    const totalPersonas = await Persona.countDocuments();
    const totalRoles = await Rol.countDocuments();
    const totalUsuarios = await Usuario.countDocuments();
    
    console.log('\n📊 Estadísticas:');
    console.log(`   Personas: ${totalPersonas}`);
    console.log(`   Roles: ${totalRoles}`);
    console.log(`   Usuarios: ${totalUsuarios}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
};

// Ejecutar el script
actualizarIds();

