const { body, validationResult } = require('express-validator');
const Descuento = require('../../modelos/facturacion/Descuento');

// === VALIDACIONES ===
exports.validarCrear = [
  body('idDescuento')
    .notEmpty().withMessage('El idDescuento es obligatorio')
    .isInt().withMessage('Debe ser un número entero'),

  body('Tipo')
    .notEmpty().withMessage('El tipo de descuento es obligatorio')
    .isString().withMessage('Debe ser texto')
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),

  body('Estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['Activo', 'Inactivo']).withMessage('Debe ser Activo o Inactivo'),
];

exports.validarEditar = [
  body('Tipo')
    .optional()
    .isString().withMessage('Debe ser texto')
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),

  body('Estado')
    .optional()
    .isIn(['Activo', 'Inactivo']).withMessage('Debe ser Activo o Inactivo'),
];

// === CONTROLADORES ===

// Obtener todos los descuentos
exports.obtenerDescuentos = async (req, res) => {
  try {
    const descuentos = await Descuento.findAll();
    res.json(descuentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los descuentos' });
  }
};

// Obtener un descuento por ID
exports.obtenerDescuentoPorId = async (req, res) => {
  try {
    const descuento = await Descuento.findByPk(req.params.id);
    if (!descuento) return res.status(404).json({ error: 'Descuento no encontrado' });
    res.json(descuento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el descuento' });
  }
};

// Crear un nuevo descuento
exports.crearDescuento = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const nuevoDescuento = await Descuento.create(req.body);
    res.status(201).json({ mensaje: 'Nuevo descuento creado', nuevoDescuento });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el descuento' });
  }
};

// Actualizar un descuento existente
exports.actualizarDescuento = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const descuento = await Descuento.findByPk(req.params.id);
    if (!descuento) return res.status(404).json({ error: 'Descuento no encontrado' });

    await descuento.update(req.body);
    res.json({ mensaje: 'Descuento actualizado', descuento });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el descuento' });
  }
};

// Eliminar un descuento
exports.eliminarDescuento = async (req, res) => {
  try {
    const descuento = await Descuento.findByPk(req.params.id);
    if (!descuento) return res.status(404).json({ error: 'Descuento no encontrado' });

    await descuento.destroy();
    res.json({ mensaje: 'Descuento eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el descuento' });
  }
};
