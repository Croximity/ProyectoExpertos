const { validationResult } = require('express-validator');
const argon2 = require('argon2');
const Usuario = require('../../modelos/seguridad/UsuarioMongo');
const Persona = require('../../modelos/seguridad/PersonaMongo');
const Rol = require('../../modelos/seguridad/RolMongo');
const { getToken } = require('../../configuraciones/passportMongo');

// Función para generar PIN de 6 dígitos
const generarPin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// REGISTRAR
exports.registrar = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { Nombre_Usuario, contraseña, idPersona, idrol } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({ Nombre_Usuario });
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

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente', 
      usuario: {
        _id: nuevoUsuario._id,
        Nombre_Usuario: nuevoUsuario.Nombre_Usuario,
        estado: nuevoUsuario.estado
      }
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error en el servidor',
      error: error.message
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
    const usuario = await Usuario.findOne({ Nombre_Usuario })
      .populate('idPersona', 'Pnombre Snombre Papellido Sapellido DNI correo')
      .populate('idrol', 'nombre descripcion');

    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    const contraseñaValida = await argon2.verify(usuario.contraseña, contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const payload = {
      idUsuario: usuario._id,
      Nombre_Usuario: usuario.Nombre_Usuario
    };

    const token = getToken(payload);

    res.json({ 
      mensaje: 'Inicio de sesión exitoso', 
      token, 
      user: { 
        _id: usuario._id, 
        Nombre_Usuario: usuario.Nombre_Usuario,
        idPersona: usuario.idPersona,
        idrol: usuario.idrol,
        estado: usuario.estado
      } 
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, '-contraseña')
      .populate('idPersona', 'Pnombre Snombre Papellido Sapellido')
      .populate('idrol', 'nombre descripcion');
    
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

// VERIFICAR PIN 2FA - Temporalmente deshabilitado
exports.verificarPin = async (req, res) => {
  res.status(400).json({ mensaje: 'Funcionalidad de PIN 2FA temporalmente deshabilitada' });
};

// OBTENER USUARIO ACTUAL
exports.obtenerUsuarioActual = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.idUsuario, '-contraseña')
      .populate('idPersona', 'Pnombre Snombre Papellido Sapellido DNI correo fechaNacimiento genero')
      .populate('idrol', 'nombre descripcion');

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({
      _id: usuario._id,
      Nombre_Usuario: usuario.Nombre_Usuario,
      idPersona: usuario.idPersona,
      idrol: usuario.idrol,
      estado: usuario.estado
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// ENDPOINT TEMPORAL: ASOCIAR PERSONA A USUARIO
exports.asociarPersonaAUsuario = async (req, res) => {
  try {
    const { idUsuario, idPersona } = req.body;

    const usuario = await Usuario.findById(idUsuario);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const persona = await Persona.findById(idPersona);
    if (!persona) {
      return res.status(404).json({ mensaje: 'Persona no encontrada' });
    }

    usuario.idPersona = idPersona;
    await usuario.save();

    res.json({ 
      mensaje: 'Persona asociada exitosamente al usuario',
      usuario: {
        _id: usuario._id,
        Nombre_Usuario: usuario.Nombre_Usuario,
        idPersona: usuario.idPersona
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// REGISTRAR PERSONA
exports.registrarPersona = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { Pnombre, Snombre, Papellido, Sapellido, Direccion, DNI, correo, fechaNacimiento, genero } = req.body;

  try {
    const nuevaPersona = await Persona.create({
      Pnombre,
      Snombre,
      Papellido,
      Sapellido,
      Direccion,
      DNI,
      correo,
      fechaNacimiento,
      genero
    });

    res.status(201).json({ 
      mensaje: 'Persona registrada exitosamente', 
      idPersona: nuevaPersona._id 
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al registrar persona',
      error: error.message
    });
  }
};

// OBTENER TODAS LAS PERSONAS
exports.obtenerPersonas = async (req, res) => {
  try {
    const personas = await Persona.find().sort({ createdAt: -1 });
    res.json(personas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener personas', error: error.message });
  }
};

// OBTENER TODOS LOS ROLES
exports.obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener roles', error: error.message });
  }
};

// CREAR ROL
exports.crearRol = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombre, descripcion } = req.body;

  try {
    const nuevoRol = await Rol.create({
      nombre,
      descripcion
    });

    res.status(201).json({ 
      mensaje: 'Rol creado exitosamente', 
      rol: nuevoRol 
    });

  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al crear rol',
      error: error.message
    });
  }
};

exports.error = (req, res) => {
  res.status(401).json({ mensaje: 'Error en la autenticación' });
};
