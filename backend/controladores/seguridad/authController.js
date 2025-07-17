const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../../modelos/seguridad/Usuario');
const Persona = require('../../modelos/seguridad/Persona');
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
      contraseña: hash, 
      idPersona,
      idrol
    });
    const persona = await Persona.findByPk(req.body.idPersona);
      if (persona && persona.correo) {
        // Enviar correo con HTML bonito
        const adminCorreo = process.env.correousuario || 'admin@optica.com';
        await enviarCorreo({
          para: persona.correo,
          asunto: '¡Bienvenido a Óptica Expertos!',
          descripcion: `Hola ${persona.Pnombre}, su registro como cliente fue exitoso por el administrador (${adminCorreo}).`,
          html: `
            <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 30px;">
              <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #ccc; padding: 24px;">
                <h2 style="color: #2e7d32; text-align: center;">¡Bienvenido a Óptica Expertos!</h2>
                <p style="font-size: 18px; color: #333;">Hola <b>${persona.Pnombre}</b>,</p>
                <p style="font-size: 16px; color: #333;">Te informamos que has sido registrado exitosamente como cliente por el administrador.</p>
                <p style="font-size: 16px; color: #333;">Si tienes dudas, puedes contactarnos respondiendo a este correo.</p>
                <hr style="margin: 24px 0;">
                <p style="font-size: 14px; color: #888;">Correo del administrador: <b>${adminCorreo}</b></p>
                <p style="font-size: 14px; color: #888; text-align: center;">Gracias por confiar en nosotros.<br>Óptica Expertos</p>
              </div>
            </div>
          `
        });
      }
    res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: Nombre_Usuario});

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

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    const payload = { idUsuario: usuario.idUsuario, Nombre_Usuario: usuario.Nombre_Usuario };
    const token = jwt.sign(payload, 'Unah123.', { expiresIn: '1h' });

    res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};
