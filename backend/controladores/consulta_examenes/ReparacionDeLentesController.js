const { body, validationResult, query } = require('express-validator');
const ReparacionDeLentes = require('../../modelos/consulta_examenes/ReparacionDeLentes');

// === VALIDACIONES ===
const reglasCrear = [
  body('Tipo_Reparacion')
    .notEmpty().withMessage('El tipo de reparación es obligatorio')
    .isString().withMessage('El tipo de reparación debe ser texto')
    .isLength({ max: 45 }).withMessage('El tipo de reparación no puede exceder 45 caracteres'),
  body('idConsulta')
    .notEmpty().withMessage('El idConsulta es obligatorio')
    .isInt().withMessage('El idConsulta debe ser un número entero'),
  body('Descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),
  body('Costo')
    .notEmpty().withMessage('El costo es obligatorio')
    .isFloat().withMessage('El costo debe ser un número decimal')
];

const reglasEditar = [
  body('Tipo_Reparacion')
    .optional()
    .isString().withMessage('El tipo de reparación debe ser texto')
    .isLength({ max: 45 }).withMessage('El tipo de reparación no puede exceder 45 caracteres'),
  body('idConsulta')
    .optional()
    .isInt().withMessage('El idConsulta debe ser un número entero'),
  body('Descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto'),
  body('Costo')
    .optional()
    .isFloat().withMessage('El costo debe ser un número decimal')
];

// === CONTROLADORES ===

const validarFiltrosReparacion = [
  query('idConsulta').optional().isInt().withMessage('idConsulta debe ser un número entero'),
  query('tipoReparacion').optional().isString().withMessage('tipoReparacion debe ser texto'),
  query('costoMin').optional().isFloat().withMessage('costoMin debe ser un número decimal'),
  query('costoMax').optional().isFloat().withMessage('costoMax debe ser un número decimal'),
];

// Crear reparación de lentes
const guardarReparacionDeLentes = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const reparacionDeLentes = await ReparacionDeLentes.create(req.body);
      res.status(201).json({ mensaje: 'Reparación de lentes creada', reparacionDeLentes });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear reparación de lentes', error: error.message });
    }
  }
];

// Obtener todas las reparaciones de lentes con filtros
const listarReparacionDeLentes = [
  ...validarFiltrosReparacion,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { idConsulta, tipoReparacion, costoMin, costoMax } = req.query;
    const where = {};
    if (idConsulta) where.idConsulta = idConsulta;
    if (tipoReparacion) where.Tipo_Reparacion = tipoReparacion;
    if (costoMin || costoMax) {
      where.Costo = {};
      if (costoMin) where.Costo['$gte'] = costoMin;
      if (costoMax) where.Costo['$lte'] = costoMax;
    }
    try {
      const reparacionesDeLentes = await ReparacionDeLentes.findAll({ where });
      res.json(reparacionesDeLentes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener reparaciones de lentes', error: error.message });
    }
  }
];

// Obtener reparación de lentes por ID
const obtenerReparacionDeLentesPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const reparacionDeLentes = await ReparacionDeLentes.findByPk(id);
    if (!reparacionDeLentes) return res.status(404).json({ mensaje: 'Reparación de lentes no encontrada' });
    res.json(reparacionDeLentes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reparación de lentes', error: error.message });
  }
};

// Editar reparación de lentes
const editarReparacionDeLentes = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      const reparacionDeLentes = await ReparacionDeLentes.findByPk(id);
      if (!reparacionDeLentes) return res.status(404).json({ mensaje: 'Reparación de lentes no encontrada' });
      await reparacionDeLentes.update(req.body);
      res.json({ mensaje: 'Reparación de lentes actualizada', reparacionDeLentes });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar reparación de lentes', error: error.message });
    }
  }
];

// Eliminar reparación de lentes
const eliminarReparacionDeLentes = async (req, res) => {
  const { id } = req.params;
  try {
    const reparacionDeLentes = await ReparacionDeLentes.findByPk(id);
    if (!reparacionDeLentes) return res.status(404).json({ mensaje: 'Reparación de lentes no encontrada' });
    await reparacionDeLentes.destroy();
    res.json({ mensaje: 'Reparación de lentes eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar reparación de lentes', error: error.message });
  }
};

// === EXPORTAR ===
module.exports = {
  guardarReparacionDeLentes,
  listarReparacionDeLentes,
  obtenerReparacionDeLentesPorId,
  editarReparacionDeLentes,
  eliminarReparacionDeLentes
};