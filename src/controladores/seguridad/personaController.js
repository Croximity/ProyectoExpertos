const { body, validationResult } = require('express-validator');
const Persona = require('../../modelos/seguridad/Persona');

// === VALIDACIONES PERSONALIZADAS ===
const reglasCrear = [
  body('Pnombre')
    .notEmpty().withMessage('El primer nombre es obligatorio')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('Solo se permiten letras en el primer nombre'),

  body('Snombre')
    .optional()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/).withMessage('Solo se permiten letras en el segundo nombre'),

  body('Papellido')
    .optional()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/).withMessage('Solo se permiten letras en el primer apellido'),

  body('Sapellido')
    .optional()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/).withMessage('Solo se permiten letras en el segundo apellido'),

  body('correo')
    .optional()
    .isEmail().withMessage('El correo no tiene un formato válido'),

  body('telefono')
    .optional()
    .matches(/^[0-9]{8}$/).withMessage('El teléfono debe tener 8 dígitos'),

  body('DNI')
    .optional()
    .isLength({ min: 13, max: 13 }).withMessage('El DNI debe tener exactamente 13 caracteres'),

  body('fechaNacimiento')
    .optional()
    .isISO8601().toDate().withMessage('Fecha de nacimiento no válida'),

  body('genero')
    .notEmpty().withMessage('El género es obligatorio')
    .isIn(['M', 'F']).withMessage('El género debe ser "M" o "F"')
];

const reglasEditar = [...reglasCrear.map(r => r.optional())];

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

// Crear múltiples personas con validaciones manuales
const crearMultiplesPersonas = async (req, res) => {
  const personas = req.body;

  if (!Array.isArray(personas)) {
    return res.status(400).json({ mensaje: 'Debes enviar un arreglo de personas' });
  }

  const erroresTotales = [];

  personas.forEach((p, index) => {
    const errores = [];

    if (!p.Pnombre || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(p.Pnombre)) {
      errores.push('El primer nombre es obligatorio y debe tener solo letras');
    }

    if (p.Snombre && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(p.Snombre)) {
      errores.push('El segundo nombre solo puede contener letras');
    }

    if (p.Papellido && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(p.Papellido)) {
      errores.push('El primer apellido solo puede contener letras');
    }

    if (p.Sapellido && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(p.Sapellido)) {
      errores.push('El segundo apellido solo puede contener letras');
    }

    if (p.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.correo)) {
      errores.push('El correo no es válido');
    }

    if (p.telefono && !/^\d{8}$/.test(p.telefono)) {
      errores.push('El teléfono debe tener 8 dígitos');
    }

    if (p.DNI && p.DNI.length !== 13) {
      errores.push('El DNI debe tener 13 caracteres');
    }

    if (!p.genero || !['M', 'F'].includes(p.genero)) {
      errores.push('El género es obligatorio y debe ser "M" o "F"');
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

// === EXPORTAR ===
module.exports = {
  crearPersona,
  editarPersona,
  eliminarPersona,
  crearMultiplesPersonas
};
