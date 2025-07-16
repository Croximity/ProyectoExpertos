const FacturaDetalle = require('../../modelos/facturacion/FacturaDetalle');
const { body } = require('express-validator');

exports.validarCrearDetalle = [
  body('idFactura')
    .notEmpty().withMessage('idFactura es obligatorio')
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo'),

  body('idProductoAtributo')
    .notEmpty().withMessage('idProductoAtributo es obligatorio')
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo'),

  body('cantidad')
    .notEmpty().withMessage('La cantidad es obligatoria')
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo'),

  body('precioUnitario')
    .notEmpty().withMessage('El precio unitario es obligatorio')
    .isFloat({ min: 0 }).withMessage('Debe ser un número positivo'),
];

exports.validarEditarDetalle = [
  body('idFactura')
    .optional()
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo'),

  body('idProductoAtributo')
    .optional()
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo'),

  body('cantidad')
    .optional()
    .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo'),

  body('precioUnitario')
    .optional()
    .isFloat({ min: 0 }).withMessage('Debe ser un número positivo'),
];

// Crear detalle
exports.crearDetalle = async (req, res) => {
  try {
    const detalle = await FacturaDetalle.create(req.body);
    res.status(201).json({ mensaje: 'Detalle creado', detalle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear detalle', error: error.message });
  }
};

// Obtener todos los detalles
exports.obtenerDetalles = async (req, res) => {
  try {
    const detalles = await FacturaDetalle.findAll();
    res.json({ detalles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener detalles', error: error.message });
  }
};

// Obtener detalle por ID
exports.obtenerDetallePorId = async (req, res) => {
  try {
    const detalle = await FacturaDetalle.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ mensaje: 'Detalle no encontrado' });

    res.json({ detalle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener detalle', error: error.message });
  }
};

// Editar un detalle
exports.editarDetalle = async (req, res) => {
  try {
    const detalle = await FacturaDetalle.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ mensaje: 'Detalle no encontrado' });

    await detalle.update(req.body);
    res.json({ mensaje: 'Detalle actualizado', detalle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar detalle', error: error.message });
  }
};

// Eliminar un detalle
exports.eliminarDetalle = async (req, res) => {
  try {
    const detalle = await FacturaDetalle.findByPk(req.params.id);
    if (!detalle) return res.status(404).json({ mensaje: 'Detalle no encontrado' });

    await detalle.destroy();
    res.json({ mensaje: 'Detalle eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar detalle', error: error.message });
  }
};
