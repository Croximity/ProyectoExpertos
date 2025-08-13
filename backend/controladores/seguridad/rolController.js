const { body, validationResult } = require('express-validator');
const Rol = require('../../modelos/seguridad/RolMongo');

// === VALIDACIONES PERSONALIZADAS ===
const reglasCrearRol = [
  body('nombre')
    .notEmpty().withMessage('El nombre del rol es obligatorio')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios')
];

const reglasEditarRol = [
  body('nombre')
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios')
];

// === CONTROLADORES ===

// Crear un rol
const crearRol = [
  ...reglasCrearRol,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre } = req.body;

    try {
      const existente = await Rol.findOne({ nombre });
      if (existente) {
        return res.status(400).json({ mensaje: 'Ya existe un rol con ese nombre' });
      }

      const rol = await Rol.create({ nombre });
      res.status(201).json({ mensaje: 'Rol creado', rol });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear rol', error: error.message });
    }
  }
];

// Obtener todos los roles
const obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener roles', error: error.message });
  }
};

// Editar un rol
const editarRol = [
  ...reglasEditarRol,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { id } = req.params;
    try {
      const rol = await Rol.findById(id);
      if (!rol) return res.status(404).json({ mensaje: 'Rol no encontrado' });

      const { nombre } = req.body;

      if (nombre) {
        const duplicado = await Rol.findOne({ nombre, _id: { $ne: id } });
        if (duplicado) {
          return res.status(400).json({ mensaje: 'Ya existe otro rol con ese nombre' });
        }
      }

      const rolActualizado = await Rol.findByIdAndUpdate(id, req.body, { new: true });
      res.json({ mensaje: 'Rol actualizado', rol: rolActualizado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar rol', error: error.message });
    }
  }
];

// Eliminar un rol
const eliminarRol = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findByIdAndDelete(id);
    if (!rol) return res.status(404).json({ mensaje: 'Rol no encontrado' });

    res.json({ mensaje: 'Rol eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar rol', error: error.message });
  }
};


// === EXPORTAR ===
module.exports = {
  crearRol,
  obtenerRoles,
  editarRol,
  eliminarRol
};
