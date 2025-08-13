const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a MongoDB...');
    console.log('📡 URI:', process.env.MONGODB_URI ? 'Configurada' : 'NO CONFIGURADA');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI no está configurada en el archivo .env');
      console.log('💡 Agrega esta línea a tu archivo .env:');
      console.log('MONGODB_URI=mongodb+srv://croximity:TU_CONTRASEÑA@cluster0.kz5s70i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
      return;
    }
    
    // Intentar conectar
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 segundos de timeout
    });
    
    console.log('✅ Conexión exitosa a MongoDB!');
    console.log('📊 Base de datos:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Puerto:', mongoose.connection.port);
    
    // Listar las colecciones disponibles
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Colecciones disponibles:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.message.includes('whitelist')) {
      console.log('\n🔧 SOLUCIÓN:');
      console.log('1. Ve a MongoDB Atlas → Network Access');
      console.log('2. Haz clic en "Add IP Address"');
      console.log('3. Agrega "0.0.0.0/0" para desarrollo');
      console.log('4. O agrega tu IP específica');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n🔧 SOLUCIÓN:');
      console.log('1. Verifica tu contraseña en MongoDB Atlas');
      console.log('2. Ve a Database Access → Edit User');
      console.log('3. Genera una nueva contraseña');
      console.log('4. Actualiza tu variable MONGODB_URI');
    }
    
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
}

testConnection();

