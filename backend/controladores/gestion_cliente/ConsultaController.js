const { body, validationResult } = require('express-validator');
const Consulta = require('../../modelos/gestion_cliente/Consulta');


// === VALIDACIONES ===
const reglasCrear = [
  body('idCliente')
    .notEmpty().withMessage('El idCliente es obligatorio')
    .isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),
  body('Fecha_consulta')
    .notEmpty().withMessage('La fecha de consulta es obligatoria')
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
  body('Motivo_consulta')
    .notEmpty().withMessage('El motivo es obligatorio')
    .isString().withMessage('El motivo debe ser un texto')
    .isLength({ min: 5, max: 255 }).withMessage('El motivo debe tener entre 5 y 255 caracteres'),
  // Regla personalizada: motivo no puede contener solo números
  body('Motivo_consulta').custom(motivo => {
    if (/^\d+$/.test(motivo)) {
      throw new Error('El motivo no puede ser solo números');
    }
    return true;
  })
];

const reglasEditar = [
  body('idCliente')
    .optional()
    .isInt({ min: 1 }).withMessage('El idCliente debe ser un número entero positivo'),
  body('Fecha_consulta')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
  body('Motivo_consulta')
    .optional()
    .isString().withMessage('El motivo debe ser un texto')
    .isLength({ min: 5, max: 255 }).withMessage('El motivo debe tener entre 5 y 255 caracteres'),
  body('Motivo_consulta').optional().custom(motivo => {
    if (motivo && /^\d+$/.test(motivo)) {
      throw new Error('El motivo no puede ser solo números');
    }
    return true;
  })
];

// Crear consulta
exports.crearConsulta = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const consulta = await Consulta.create(req.body);
      res.status(201).json({ mensaje: 'Consulta creada', consulta });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear consulta', error: error.message });
    }
  }
];

// Obtener todas las consultas
exports.obtenerConsultas = async (req, res) => {
  try {
    const consultas = await Consulta.findAll();
    res.json(consultas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener consultas', error: error.message });
  }
};

// Obtener consulta por ID
exports.obtenerConsultaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const consulta = await Consulta.findByPk(id);
    if (!consulta) return res.status(404).json({ mensaje: 'Consulta no encontrada' });
    res.json(consulta);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener consulta', error: error.message });
  }
};

// Editar consulta
exports.editarConsulta = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      const consulta = await Consulta.findByPk(id);
      if (!consulta) return res.status(404).json({ mensaje: 'Consulta no encontrada' });
      await consulta.update(req.body);
      res.json({ mensaje: 'Consulta actualizada', consulta });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar consulta', error: error.message });
    }
  }
];

// Eliminar consulta
exports.eliminarConsulta = async (req, res) => {
  const { id } = req.params;
  try {
    const consulta = await Consulta.findByPk(id);
    if (!consulta) return res.status(404).json({ mensaje: 'Consulta no encontrada' });
    await consulta.destroy();
    res.json({ mensaje: 'Consulta eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar consulta', error: error.message });
  }
};