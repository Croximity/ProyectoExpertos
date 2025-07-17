const { body, validationResult } = require('express-validator');
const Telefono = require('../../modelos/gestion_cliente/Telefono');


// === VALIDACIONES ===
const reglasCrear = [
  body('idPersona')
    .notEmpty().withMessage('El idPersona es obligatorio')
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('Numero')
    .notEmpty().withMessage('El número es obligatorio')
    .isString().withMessage('El número debe ser un texto')
    .matches(/^[\d]{7,15}$/).withMessage('El número debe tener entre 7 y 15 dígitos'),
  body('Estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['movil', 'fijo', 'fax']).withMessage('El estado debe ser movil, fijo o fax'),
  // Regla personalizada: si el estado es "fax", el número debe empezar por 2
  body().custom(body => {
    if (body.Estado === 'fax' && (!body.Numero || !body.Numero.startsWith('2'))) {
      throw new Error('El número de fax debe empezar por 2');
    }
    return true;
  })
];

const reglasEditar = [
  body('idPersona')
    .optional()
    .isInt({ min: 1 }).withMessage('El idPersona debe ser un número entero positivo'),
  body('Numero')
    .optional()
    .isString().withMessage('El número debe ser un texto')
    .matches(/^[\d]{7,15}$/).withMessage('El número debe tener entre 7 y 15 dígitos'),
  body('Estado')
    .optional()
    .isIn(['movil', 'fijo', 'fax']).withMessage('El estado debe ser movil, fijo o fax'),
  body().custom(body => {
    if (body.Estado === 'fax' && body.Numero && !body.Numero.startsWith('2')) {
      throw new Error('El número de fax debe empezar por 2');
    }
    return true;
  })
];

// Crear teléfono
exports.crearTelefono = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const telefono = await Telefono.create(req.body);
      res.status(201).json({ mensaje: 'Teléfono creado', telefono });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear teléfono', error: error.message });
    }
  }
];

// Obtener todos los teléfonos
exports.obtenerTelefonos = async (req, res) => {
  try {
    const telefonos = await Telefono.findAll();
    res.json(telefonos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener teléfonos', error: error.message });
  }
};

// Obtener teléfono por ID
exports.obtenerTelefonoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const telefono = await Telefono.findByPk(id);
    if (!telefono) return res.status(404).json({ mensaje: 'Teléfono no encontrado' });
    res.json(telefono);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener teléfono', error: error.message });
  }
};

// Editar teléfono
exports.editarTelefono = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      const telefono = await Telefono.findByPk(id);
      if (!telefono) return res.status(404).json({ mensaje: 'Teléfono no encontrado' });
      await telefono.update(req.body);
      res.json({ mensaje: 'Teléfono actualizado', telefono });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar teléfono', error: error.message });
    }
  }
];

// Eliminar teléfono
exports.eliminarTelefono = async (req, res) => {
  const { id } = req.params;
  try {
    const telefono = await Telefono.findByPk(id);
    if (!telefono) return res.status(404).json({ mensaje: 'Teléfono no encontrado' });
    await telefono.destroy();
    res.json({ mensaje: 'Teléfono eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar teléfono', error: error.message });
  }
};