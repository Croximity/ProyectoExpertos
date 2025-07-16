const DetalleDescuento = require('../../modelos/facturacion/DetalleDescuento');
const { body, param, validationResult } = require('express-validator');

// Validar creación de detalle descuento
exports.validarCrearDetalleDescuento = [
  body('idFactura')
    .notEmpty().withMessage('idFactura es obligatorio')
    .isInt({ gt: 0 }).withMessage('idFactura debe ser un número entero positivo'),

  body('idDescuento')
    .notEmpty().withMessage('idDescuento es obligatorio')
    .isInt({ gt: 0 }).withMessage('idDescuento debe ser un número entero positivo')
];

// Validar eliminación por params
exports.validarEliminarDetalleDescuento = [
  param('idFactura')
    .notEmpty().withMessage('idFactura es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo'),

  param('idDescuento')
    .notEmpty().withMessage('idDescuento es obligatorio')
    .isInt({ gt: 0 }).withMessage('Debe ser un número entero positivo')
];

// Middleware común para manejar errores
exports.manejarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(404).json({ errores: errores.array() }); // o 400 si prefieres
  }
  next();
};


// CONTROLADOR PARA DETALLES DE DESCUENTO
// Crear relación de descuento
exports.crearDetalleDescuento = async (req, res) => {
  try {
    const detalle = await DetalleDescuento.create(req.body);
    res.status(201).json({ mensaje: 'Descuento agregado a factura', detalle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear detalle de descuento', error: error.message });
  }
};

// Obtener todos los descuentos aplicados
exports.obtenerDetalles = async (req, res) => {
  try {
    const detalles = await DetalleDescuento.findAll();
    res.json({ detalles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener detalles de descuento', error: error.message });
  }
};

// Eliminar un descuento específico por factura y descuento
exports.eliminarDetalleDescuento = async (req, res) => {
  const { idFactura, idDescuento } = req.params;
  try {
    const eliminado = await DetalleDescuento.destroy({
      where: { idFactura, idDescuento }
    });
    if (!eliminado) return res.status(404).json({ mensaje: 'Relación no encontrada' });
    res.json({ mensaje: 'Descuento eliminado de factura' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar detalle de descuento', error: error.message });
  }
};
