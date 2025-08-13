const { validationResult } = require('express-validator');
const argon2 = require('argon2');
const Usuario = require('../../modelos/seguridad/UsuarioMongo');
const Persona = require('../../modelos/seguridad/PersonaMongo');
const Rol = require('../../modelos/seguridad/RolMongo');
const { getToken } = require('../../configuraciones/passport');
const mongoose = require('mongoose');
const enviarCorreo = require('../../configuraciones/correo').EnviarCorreo;

// Función para generar PIN de 6 dígitos
const generarPin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// REGISTRAR
exports.registrar = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    console.error('❌ Errores de validación en registro:', errores.array());
    return res.status(400).json({ errores: errores.array() });
  }

  const { Nombre_Usuario, contraseña, idPersona, idrol } = req.body;

  console.log('📝 Datos recibidos para registrar usuario:', {
    Nombre_Usuario,
    contraseña: contraseña ? '[HIDDEN]' : '[MISSING]',
    idPersona,
    idrol,
    tipos: {
      idPersona: typeof idPersona,
      idrol: typeof idrol
    }
  });

  try {
    // Validar que idPersona e idrol sean ObjectIds válidos
    if (!idPersona || !mongoose.Types.ObjectId.isValid(idPersona)) {
      console.error('❌ ID de persona inválido:', idPersona);
      return res.status(400).json({ mensaje: 'ID de persona inválido' });
    }

    if (!idrol || !mongoose.Types.ObjectId.isValid(idrol)) {
      console.error('❌ ID de rol inválido:', idrol);
      return res.status(400).json({ mensaje: 'ID de rol inválido' });
    }

    console.log('✅ IDs validados correctamente');

    // Verificar que la persona y el rol existan
    const persona = await Persona.findById(idPersona);
    if (!persona) {
      console.error('❌ Persona no encontrada con ID:', idPersona);
      return res.status(400).json({ mensaje: 'La persona especificada no existe' });
    }
    console.log('✅ Persona encontrada:', persona._id);

    const rol = await Rol.findById(idrol);
    if (!rol) {
      console.error('❌ Rol no encontrado con ID:', idrol);
      return res.status(400).json({ mensaje: 'El rol especificado no existe' });
    }
    console.log('✅ Rol encontrado:', rol._id);

    const existeUsuario = await Usuario.findOne({ Nombre_Usuario });
    if (existeUsuario) {
      console.error('❌ Usuario ya existe:', Nombre_Usuario);
      return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });
    }

    console.log('✅ Usuario no existe, procediendo a crear...');

    const hash = await argon2.hash(contraseña);
    console.log('✅ Contraseña hasheada correctamente');

    const nuevoUsuario = await Usuario.create({
      Nombre_Usuario,
      contraseña: hash,
      idPersona,
      idrol
    });

    console.log('✅ Usuario creado exitosamente:', nuevoUsuario._id);

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente', 
      usuario: {
        _id: nuevoUsuario._id,
        idUsuario: nuevoUsuario.idUsuario,
        Nombre_Usuario: nuevoUsuario.Nombre_Usuario,
        estado: nuevoUsuario.estado
      }
    });

  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    console.error('❌ Stack trace:', error.stack);
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
    console.log('🔐 iniciarSesion - Buscando usuario:', Nombre_Usuario);
    const usuario = await Usuario.findOne({ Nombre_Usuario })
      .populate('idPersona', 'idPersona Pnombre Snombre Papellido Sapellido Direccion DNI correo fechaNacimiento genero')
      .populate('idrol', 'nombre descripcion');

    if (!usuario) {
      console.log('❌ iniciarSesion - Usuario no encontrado:', Nombre_Usuario);
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    console.log('✅ iniciarSesion - Usuario encontrado:', usuario._id);
    console.log('🔍 iniciarSesion - usuario.idPersona:', usuario.idPersona);
    console.log('🔍 iniciarSesion - usuario.idPersona.Direccion:', usuario.idPersona?.Direccion);

    const contraseñaValida = await argon2.verify(usuario.contraseña, contraseña);
    if (!contraseñaValida) {
      console.log('❌ iniciarSesion - Contraseña incorrecta para usuario:', Nombre_Usuario);
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    console.log('✅ iniciarSesion - Contraseña válida');

    // Generar token JWT
    const payload = {
      idUsuario: usuario._id,
      Nombre_Usuario: usuario.Nombre_Usuario
    };

    const token = getToken(payload);
    console.log('✅ iniciarSesion - Token generado');

    const userResponse = {
      _id: usuario._id, 
      idUsuario: usuario.idUsuario,
      Nombre_Usuario: usuario.Nombre_Usuario,
      idPersona: usuario.idPersona,
      idrol: usuario.idrol,
      estado: usuario.estado
    };

    console.log('✅ iniciarSesion - Enviando respuesta:', userResponse);

    res.json({ 
      mensaje: 'Inicio de sesión exitoso', 
      token, 
      user: userResponse
    });

  } catch (error) {
    console.error('❌ iniciarSesion - Error:', error);
    res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, '-contraseña')
      .populate('idPersona', 'idPersona Pnombre Snombre Papellido Sapellido')
      .populate('idrol', 'idRol nombre descripcion');
    
    // Formatear respuesta para incluir IDs
    const usuariosFormateados = usuarios.map(usuario => ({
      _id: usuario._id,
      idUsuario: usuario.idUsuario,
      Nombre_Usuario: usuario.Nombre_Usuario,
      estado: usuario.estado,
      idPersona: usuario.idPersona,
      idrol: usuario.idrol
    }));
    
    res.json(usuariosFormateados);
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
    console.log('🔍 obtenerUsuarioActual - req.user:', req.user);
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    const usuario = await Usuario.findById(req.user._id, '-contraseña')
      .populate('idPersona', 'idPersona Pnombre Snombre Papellido Sapellido Direccion DNI correo fechaNacimiento genero')
      .populate('idrol', 'idRol nombre descripcion');

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    console.log('✅ Usuario encontrado:', usuario._id);
    console.log('🔍 obtenerUsuarioActual - usuario.idrol:', usuario.idrol);
    console.log('🔍 obtenerUsuarioActual - tipo de usuario.idrol:', typeof usuario.idrol);
    console.log('🔍 obtenerUsuarioActual - usuario.idPersona:', usuario.idPersona);
    console.log('🔍 obtenerUsuarioActual - usuario.idPersona.Direccion:', usuario.idPersona?.Direccion);

    const response = {
      _id: usuario._id,
      idUsuario: usuario.idUsuario,
      Nombre_Usuario: usuario.Nombre_Usuario,
      idPersona: usuario.idPersona,
      idrol: usuario.idrol,
      estado: usuario.estado
    };

    console.log('🔍 obtenerUsuarioActual - respuesta final:', response);

    res.json(response);

  } catch (error) {
    console.error('❌ Error en obtenerUsuarioActual:', error);
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
        idUsuario: usuario.idUsuario,
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
    console.error('❌ Errores de validación:', errores.array());
    return res.status(400).json({ errores: errores.array() });
  }

  const { Pnombre, Snombre, Papellido, Sapellido, Direccion, DNI, correo, fechaNacimiento, genero } = req.body;

  console.log('📝 Datos recibidos para registrar persona:', {
    Pnombre, Snombre, Papellido, Sapellido, Direccion, DNI, correo, fechaNacimiento, genero
  });

  try {
    // Validar que el DNI no esté duplicado
    if (DNI) {
      const personaExistente = await Persona.findOne({ DNI });
      if (personaExistente) {
        return res.status(400).json({ mensaje: 'Ya existe una persona con este DNI' });
      }
    }

    // Validar que el correo no esté duplicado si se proporciona
    if (correo) {
      const personaExistente = await Persona.findOne({ correo });
      if (personaExistente) {
        return res.status(400).json({ mensaje: 'Ya existe una persona con este correo electrónico' });
      }
    }

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

    console.log('✅ Persona creada exitosamente:', nuevaPersona._id);

    res.status(201).json({ 
      mensaje: 'Persona registrada exitosamente', 
      persona: {
        _id: nuevaPersona._id,
        idPersona: nuevaPersona.idPersona
      }
    });

  } catch (error) {
    console.error('❌ Error al crear persona:', error);
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
    
    // Formatear respuesta para incluir IDs
    const personasFormateadas = personas.map(persona => ({
      _id: persona._id,
      idPersona: persona.idPersona,
      Pnombre: persona.Pnombre,
      Snombre: persona.Snombre,
      Papellido: persona.Papellido,
      Sapellido: persona.Sapellido,
      Direccion: persona.Direccion,
      DNI: persona.DNI,
      correo: persona.correo,
      fechaNacimiento: persona.fechaNacimiento,
      genero: persona.genero
    }));
    
    res.json(personasFormateadas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener personas', error: error.message });
  }
};

// OBTENER TODOS LOS ROLES
exports.obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.find().sort({ createdAt: -1 });
    
    // Formatear respuesta para incluir IDs
    const rolesFormateados = roles.map(rol => ({
      _id: rol._id,
      idRol: rol.idRol,
      nombre: rol.nombre,
      descripcion: rol.descripcion
    }));
    
    res.json(rolesFormateados);
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
      rol: {
        _id: nuevoRol._id,
        idRol: nuevoRol.idRol,
        nombre: nuevoRol.nombre,
        descripcion: nuevoRol.descripcion
      }
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

// ============ ADMIN: GESTIÓN DE USUARIOS ============

// Crear usuario (Admin). Puede recibir idPersona existente o datos de persona para crearla
exports.crearUsuarioAdmin = async (req, res) => {
  try {
    const { Nombre_Usuario, contraseña, idrol, idPersona, persona } = req.body;

    if (!Nombre_Usuario || !contraseña || !idrol) {
      return res.status(400).json({ mensaje: 'Nombre_Usuario, contraseña e idrol son obligatorios' });
    }

    if (!mongoose.Types.ObjectId.isValid(idrol)) {
      return res.status(400).json({ mensaje: 'ID de rol inválido' });
    }

    const rol = await Rol.findById(idrol);
    if (!rol) return res.status(400).json({ mensaje: 'El rol especificado no existe' });

    let personaMongo = null;

    if (idPersona) {
      if (!mongoose.Types.ObjectId.isValid(idPersona)) {
        return res.status(400).json({ mensaje: 'ID de persona inválido' });
      }
      personaMongo = await Persona.findById(idPersona);
      if (!personaMongo) return res.status(400).json({ mensaje: 'La persona especificada no existe' });
    } else if (persona) {
      // Crear persona si no se proporciona idPersona
      personaMongo = await Persona.create({
        Pnombre: persona.Pnombre,
        Snombre: persona.Snombre || '',
        Papellido: persona.Papellido,
        Sapellido: persona.Sapellido || '',
        Direccion: persona.Direccion || '',
        DNI: persona.DNI || '',
        correo: persona.correo,
        fechaNacimiento: persona.fechaNacimiento || null,
        genero: persona.genero || 'M'
      });
    } else {
      return res.status(400).json({ mensaje: 'Debe enviar idPersona o datos de persona' });
    }

    // Validar que el usuario no exista
    const existeUsuario = await Usuario.findOne({ Nombre_Usuario });
    if (existeUsuario) return res.status(400).json({ mensaje: 'El nombre de usuario ya está en uso' });

    const hash = await argon2.hash(contraseña);

    const nuevoUsuario = await Usuario.create({
      Nombre_Usuario,
      contraseña: hash,
      idPersona: personaMongo._id,
      idrol
    });

    // Enviar correo con credenciales si hay correo
    if (personaMongo.correo) {
      try {
        await enviarCorreo({
          para: personaMongo.correo,
          asunto: 'Credenciales de acceso - Óptica Velasquez',
          descripcion: `Hola ${personaMongo.Pnombre}, se ha creado un usuario para usted. Usuario: ${Nombre_Usuario}`,
          html: `<h2>Bienvenido/a ${personaMongo.Pnombre}</h2>
                 <p>Se han generado sus credenciales de acceso al sistema:</p>
                 <ul>
                   <li><strong>Usuario:</strong> ${Nombre_Usuario}</li>
                   <li><strong>Contraseña:</strong> ${contraseña}</li>
                   <li><strong>Rol:</strong> ${rol.nombre}</li>
                 </ul>
                 <p>Le recomendamos cambiar su contraseña tras el primer inicio de sesión.</p>`
        });
      } catch (err) {
        console.error('❌ Error enviando correo de credenciales:', err.message);
      }
    }

    res.status(201).json({
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        _id: nuevoUsuario._id,
        Nombre_Usuario: nuevoUsuario.Nombre_Usuario,
        idPersona: personaMongo._id,
        idrol
      }
    });
  } catch (error) {
    console.error('❌ crearUsuarioAdmin - Error:', error);
    res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
};

// Editar usuario (Admin)
exports.editarUsuarioAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre_Usuario, contraseña, idrol, estado } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de usuario inválido' });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    if (Nombre_Usuario) usuario.Nombre_Usuario = Nombre_Usuario;
    if (typeof estado === 'boolean') usuario.estado = estado;
    if (idrol) {
      if (!mongoose.Types.ObjectId.isValid(idrol)) return res.status(400).json({ mensaje: 'ID de rol inválido' });
      const rol = await Rol.findById(idrol);
      if (!rol) return res.status(400).json({ mensaje: 'El rol especificado no existe' });
      usuario.idrol = idrol;
    }
    if (contraseña) {
      usuario.contraseña = await argon2.hash(contraseña);
    }

    await usuario.save();
    res.json({ mensaje: 'Usuario actualizado', usuario: { _id: usuario._id, Nombre_Usuario: usuario.Nombre_Usuario, idrol: usuario.idrol, estado: usuario.estado } });
  } catch (error) {
    console.error('❌ editarUsuarioAdmin - Error:', error);
    res.status(500).json({ mensaje: 'Error al editar usuario', error: error.message });
  }
};

// Eliminar usuario (Admin)
exports.eliminarUsuarioAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de usuario inválido' });
    }
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    await usuario.deleteOne();
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    console.error('❌ eliminarUsuarioAdmin - Error:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};
