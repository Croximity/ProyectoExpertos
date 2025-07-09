const { body, validationResult } = require('express-validator');
const Persona = require('../../modelos/seguridad/Persona');

// === VALIDACIONES PERSONALIZADAS ===
const reglasCrear = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras'),

  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo puede contener letras'),

  body('correo')
    .optional()
    .isEmail().withMessage('El correo no tiene un formato válido'),

  body('telefono')
    .optional()
    .matches(/^[0-9]{8}$/).withMessage('El teléfono debe tener 8 dígitos'),

  body('dni')
    .notEmpty().withMessage('El DNI es obligatorio')
    .isLength({ min: 13, max: 13 }).withMessage('El DNI debe tener exactamente 13 caracteres')
];

const reglasEditar = [
  body('nombre')
    .optional()
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras'),

  body('apellido')
    .optional()
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo puede contener letras'),

  body('correo')
    .optional()
    .isEmail().withMessage('El correo no tiene un formato válido'),

  body('telefono')
    .optional()
    .matches(/^[0-9]{8}$/).withMessage('El teléfono debe tener 8 dígitos'),

  body('dni')
    .optional()
    .isLength({ min: 13, max: 13 }).withMessage('El DNI debe tener exactamente 13 caracteres')
];

// === CONTROLADORES ===

// Crear una persona
const crearPersona = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    try {
      const persona = await Persona.create(req.body);
      res.status(201).json({ mensaje: 'Persona creada', persona });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al crear persona', error: error.message });
    }
  }
];

// Editar una persona
const editarPersona = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { id } = req.params;

    try {
      const persona = await Persona.findByPk(id);
      if (!persona) return res.status(404).json({ mensaje: 'Persona no encontrada' });

      await persona.update(req.body);
      res.json({ mensaje: 'Persona actualizada', persona });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error al editar persona', error: error.message });
    }
  }
];

// Eliminar una persona
const eliminarPersona = async (req, res) => {
  const { id } = req.params;

  try {
    const persona = await Persona.findByPk(id);
    if (!persona) return res.status(404).json({ mensaje: 'Persona no encontrada' });

    await persona.destroy();
    res.json({ mensaje: 'Persona eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar persona', error: error.message });
  }
};

// Crear varias personas con validaciones por cada objeto
const crearMultiplesPersonas = async (req, res) => {
  const personas = req.body;

  if (!Array.isArray(personas)) {
    return res.status(400).json({ mensaje: 'Debes enviar un arreglo de personas' });
  }

  const erroresTotales = [];

  personas.forEach((p, index) => {
    const errores = [];

    if (!p.nombre || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(p.nombre)) {
      errores.push('El nombre es obligatorio y solo puede contener letras');
    }

    if (!p.apellido || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(p.apellido)) {
      errores.push('El apellido es obligatorio y solo puede contener letras');
    }

    if (p.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.correo)) {
      errores.push('El correo no es válido');
    }

    if (p.telefono && !/^\d{8}$/.test(p.telefono)) {
      errores.push('El teléfono debe tener 8 dígitos');
    }

    if (!p.dni || p.dni.length !== 13) {
      errores.push('El DNI debe tener exactamente 13 caracteres');
    }

    if (errores.length > 0) {
      erroresTotales.push({ index, errores });
    }
  });

  if (erroresTotales.length > 0) {
    return res.status(400).json({ mensaje: 'Errores de validación', errores: erroresTotales });
  }

  try {
    const nuevasPersonas = await Persona.bulkCreate(personas);
    res.status(201).json({ mensaje: 'Personas creadas', personas: nuevasPersonas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear múltiples personas', error: error.message });
  }
};

// === EXPORTAR TODO JUNTO ===
module.exports = {
  crearPersona,
  editarPersona,
  eliminarPersona,
  crearMultiplesPersonas
};
