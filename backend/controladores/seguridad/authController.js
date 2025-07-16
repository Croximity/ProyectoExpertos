const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../../modelos/seguridad/Usuario');
require('dotenv').config();

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

    const hash = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = await Usuario.create({
      Nombre_Usuario,
      Contraseña: hash, 
      idPersona,
      idRol
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error(' ERROR DETALLADO:', error);
    res.status(500).json({
      mensaje: 'Error en el servidor',
      error: error.message,
      detalles: error.errors || null
    });
  }
};

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

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.Contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    const payload = { idUsuario: usuario.idUsuario, Nombre_Usuario: usuario.Nombre_Usuario };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};
