const fs = require('fs');
const path = require('path');

console.log('🧹 Limpiando archivos temporales de migración...');

// Archivos temporales a eliminar
const archivosTemporales = [
  'migracion-mongodb.js',
  'test-mongodb.js',
  'test-connection.js',
  'MIGRACION_MONGODB.md'
];

// Eliminar archivos temporales
archivosTemporales.forEach(archivo => {
  const rutaArchivo = path.join(__dirname, archivo);
  if (fs.existsSync(rutaArchivo)) {
    fs.unlinkSync(rutaArchivo);
    console.log(`✅ Eliminado: ${archivo}`);
  } else {
    console.log(`⚠️ No encontrado: ${archivo}`);
  }
});

console.log('🎉 Limpieza completada!');
console.log('📝 El sistema de autenticación ahora usa exclusivamente MongoDB');
console.log('🔐 Endpoints disponibles:');
console.log('   - POST /api/optica/auth/registro');
console.log('   - POST /api/optica/auth/login');
console.log('   - GET /api/optica/auth/usuario-actual');
console.log('   - Y todos los demás endpoints protegidos');

