const { body, validationResult, query } = require('express-validator');
const TipoEnfermedad = require('../../modelos/consulta_examenes/TipoEnfermedad');

// === VALIDACIONES ===
const reglasCrear = [
  body('Nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ max: 45 }).withMessage('El nombre no puede exceder 45 caracteres'),
  body('Descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto')
];

const reglasEditar = [
  body('Nombre')
    .optional()
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ max: 45 }).withMessage('El nombre no puede exceder 45 caracteres'),
  body('Descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto')
];

// === CONTROLADORES ===

const validarFiltrosTipoEnfermedad = [
  query('nombre').optional().isString().withMessage('nombre debe ser texto'),
];

// Crear tipo de enfermedad
const guardarTipoEnfermedad = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const tipoEnfermedad = await TipoEnfermedad.create(req.body);
      res.status(201).json({ mensaje: 'Tipo de enfermedad creado', tipoEnfermedad });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear tipo de enfermedad', error: error.message });
    }
  }
];

// Obtener todos los tipos de enfermedad con filtro
const listarTipoEnfermedad = [
  ...validarFiltrosTipoEnfermedad,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { nombre } = req.query;
    const where = {};
    if (nombre) where.Nombre = { $like: `%${nombre}%` };
    try {
      const tiposEnfermedad = await TipoEnfermedad.findAll({ where });
      res.json(tiposEnfermedad);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener tipos de enfermedad', error: error.message });
    }
  }
];

// Obtener tipo de enfermedad por ID
const obtenerTipoEnfermedadPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const tipoEnfermedad = await TipoEnfermedad.findByPk(id);
    if (!tipoEnfermedad) return res.status(404).json({ mensaje: 'Tipo de enfermedad no encontrado' });
    res.json(tipoEnfermedad);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tipo de enfermedad', error: error.message });
  }
};

// Editar tipo de enfermedad
const editarTipoEnfermedad = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      const tipoEnfermedad = await TipoEnfermedad.findByPk(id);
      if (!tipoEnfermedad) return res.status(404).json({ mensaje: 'Tipo de enfermedad no encontrado' });
      await tipoEnfermedad.update(req.body);
      res.json({ mensaje: 'Tipo de enfermedad actualizado', tipoEnfermedad });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar tipo de enfermedad', error: error.message });
    }
  }
];

// Eliminar tipo de enfermedad
const eliminarTipoEnfermedad = async (req, res) => {
  const { id } = req.params;
  try {
    const tipoEnfermedad = await TipoEnfermedad.findByPk(id);
    if (!tipoEnfermedad) return res.status(404).json({ mensaje: 'Tipo de enfermedad no encontrado' });
    await tipoEnfermedad.destroy();
    res.json({ mensaje: 'Tipo de enfermedad eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar tipo de enfermedad', error: error.message });
  }
};

// === EXPORTAR ===
module.exports = {
  guardarTipoEnfermedad,
  listarTipoEnfermedad,
  obtenerTipoEnfermedadPorId,
  editarTipoEnfermedad,
  eliminarTipoEnfermedad
};