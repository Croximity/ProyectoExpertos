const { validationResult } = require('express-validator');
const argon2 = require('argon2');
const Usuario = require('../../modelos/seguridad/Usuario');
const { getToken } = require('../../configuraciones/passport'); // Importar función para generar token

// REGISTRAR
exports.registrar = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { Nombre_Usuario, contraseña, idPersona, idrol } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({ where: { Nombre_Usuario } });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
    }

    const hash = await argon2.hash(contraseña);

    const nuevoUsuario = await Usuario.create({
      Nombre_Usuario,
      contraseña: hash,
      idPersona,
      idrol
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: Nombre_Usuario });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error en el servidor',
      error: error.message,
      detalles: error.errors || null
    });
  }
};

// INICIAR SESIÓN
exports.iniciarSesion = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { Nombre_Usuario, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { Nombre_Usuario } });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    const contraseñaValida = await argon2.verify(usuario.contraseña, contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    const payload = {
      idUsuario: usuario.idUsuario,
      Nombre_Usuario: usuario.Nombre_Usuario
    };

    const token = getToken(payload); // ← Aquí usas el token desde passport.js

    res.json({ mensaje: 'Inicio de sesión exitoso', token });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['contraseña'] }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

exports.error = (req, res) => {
  res.status(401).json({ mensaje: 'Error en la autenticación' });
};
