const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const clave = 'Unah123.';
const moment = require("moment");
const expiracion = moment.duration(1, "days").asSeconds();
const Usuario = require('../modelos/seguridad/Usuario');

exports.getToken = (data) => {
  return jwt.sign(data, clave, { expiresIn: expiracion });
};


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: clave,
};

exports.validarAutenticacion =  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const usuario = await Usuario.findByPk(jwt_payload.id); // sin callback
    if (usuario) {
      return done(null, usuario);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

exports.verificarUsuario = passport.authenticate('jwt', {session: false, failureRedirect: '/api/usuarios/error'})
