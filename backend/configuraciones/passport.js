const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const moment = require("moment");
const argon2 = require('argon2');
const mongoose = require('mongoose');

const clave = 'Unah123.';
const expiracion = moment.duration(1, "days").asSeconds();
const Usuario = require('../modelos/seguridad/UsuarioMongo');

// ========================
// Función para generar el JWT
// ========================
exports.getToken = (data) => {
  return jwt.sign(data, clave, { expiresIn: expiracion });
};

// ========================
// Configuración estrategia JWT
// ========================
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: clave,
};

exports.validarAutenticacion = passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log('🔐 JWT Strategy - Payload recibido:', jwt_payload);
      
      // Verificar que el idUsuario es un ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(jwt_payload.idUsuario)) {
        console.error('❌ JWT Strategy - ID de usuario inválido:', jwt_payload.idUsuario);
        return done(null, false);
      }

      console.log('🔍 JWT Strategy - Buscando usuario con ID:', jwt_payload.idUsuario);
      
      const usuario = await Usuario.findById(jwt_payload.idUsuario);
      if (usuario) {
        console.log('✅ JWT Strategy - Usuario encontrado:', usuario._id);
        return done(null, usuario);
      } else {
        console.error('❌ JWT Strategy - Usuario no encontrado con ID:', jwt_payload.idUsuario);
        return done(null, false);
      }
    } catch (err) {
      console.error('❌ JWT Strategy - Error:', err);
      return done(err, false);
    }
  })
);

// ========================
// Middleware para proteger rutas
// ========================
exports.verificarUsuario = passport.authenticate('jwt', { session: false });

// ========================
// Función para verificar contraseña con argon2
// ========================
exports.verificarPassword = async (passwordPlano, hashGuardado) => {
  try {
    return await argon2.verify(hashGuardado, passwordPlano);
  } catch (err) {
    console.error("Error al verificar la contraseña:", err);
    return false;
  }
};

// ========================
// Función para encriptar contraseña con argon2
// ========================
exports.hashearPassword = async (passwordPlano) => {
  try {
    return await argon2.hash(passwordPlano);
  } catch (err) {
    console.error("Error al hashear la contraseña:", err);
    throw err;
  }
};
