const { body, validationResult } = require('express-validator');
const FormaPago = require('../../modelos/facturacion/FormaPago');

// === VALIDACIONES ===
exports.validarCrear = [
  body('idFormaPago')
    .notEmpty().withMessage('El idFormaPago es obligatorio')
    .isInt().withMessage('Debe ser un número entero'),

  body('Formapago')
    .notEmpty().withMessage('La forma de pago es obligatoria')
    .isString().withMessage('Debe ser texto')
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),

  body('Estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['A', 'I']).withMessage('Debe ser A (Activo) o I (Inactivo)')
];

exports.validarEditar = [
  body('Formapago')
    .optional()
    .isString().withMessage('Debe ser texto')
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),

  body('Estado')
    .optional()
    .isIn(['A', 'I']).withMessage('Debe ser A (Activo) o I (Inactivo)')
];

// === CONTROLADORES ===

// Obtener todos
exports.obtenerFormasPago = async (req, res) => {
  try {
    const formas = await FormaPago.findAll();
    res.json(formas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las formas de pago' });
  }
};

// Obtener uno por ID
exports.obtenerFormaPagoPorId = async (req, res) => {
  try {
    const forma = await FormaPago.findByPk(req.params.id);
    if (!forma) return res.status(404).json({ error: 'Forma de pago no encontrada' });
    res.json(forma);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la forma de pago' });
  }
};

// Crear
exports.crearFormaPago = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const nuevaForma = await FormaPago.create(req.body);
    res.status(201).json({ mensaje: 'Forma de pago creada', nuevaForma });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la forma de pago' });
  }
};

// Actualizar
exports.actualizarFormaPago = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const forma = await FormaPago.findByPk(req.params.id);
    if (!forma) return res.status(404).json({ error: 'Forma de pago no encontrada' });

    await forma.update(req.body);
    res.json({ mensaje: 'Forma de pago actualizada', forma });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la forma de pago' });
  }
};

// Inactivar forma de pago
exports.inactivarFormaPago = async (req, res) => {
  try {
    const forma = await FormaPago.findByPk(req.params.id);
    if (!forma) {
      return res.status(404).json({ error: 'Forma de pago no encontrada' });
    }

    // Verificar si ya está inactiva
    if (forma.Estado === 'I') {
      return res.status(400).json({ mensaje: 'La forma de pago ya está inactiva' });
    }

    forma.Estado = 'I'; // Inactiva
    await forma.save();

    res.json({ mensaje: 'Forma de pago inactivada correctamente', forma });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al inactivar la forma de pago' });
  }
};


