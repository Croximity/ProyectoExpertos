const { body, validationResult, query } = require('express-validator');
const Receta = require('../../modelos/consulta_examenes/Receta');

// === VALIDACIONES ===
const reglasCrear = [
  body('Agudeza_Visual')
    .optional()
    .isString().withMessage('La agudeza visual debe ser texto')
    .isLength({ max: 10 }).withMessage('La agudeza visual no puede exceder 10 caracteres'),
  body('EsferaIzquierdo')
    .optional()
    .isFloat().withMessage('La esfera izquierda debe ser un número decimal'),
  body('Esfera_Derecho')
    .optional()
    .isFloat().withMessage('La esfera derecha debe ser un número decimal'),
  body('Cilindro_Izquierdo')
    .optional()
    .isFloat().withMessage('El cilindro izquierdo debe ser un número decimal'),
  body('Cilindro_Derecho')
    .optional()
    .isFloat().withMessage('El cilindro derecho debe ser un número decimal'),
  body('Eje_Izquierdo')
    .optional()
    .isFloat().withMessage('El eje izquierdo debe ser un número decimal'),
  body('Eje_Derecho')
    .optional()
    .isFloat().withMessage('El eje derecho debe ser un número decimal'),
  body('Distancia_Pupilar')
    .optional()
    .isFloat().withMessage('La distancia pupilar debe ser un número decimal'),
  body('Tipo_Lente')
    .optional()
    .isString().withMessage('El tipo de lente debe ser texto')
    .isLength({ max: 100 }).withMessage('El tipo de lente no puede exceder 100 caracteres'),
  body('Diagnostico')
    .optional()
    .isString().withMessage('El diagnóstico debe ser texto'),
  body('idCliente')
    .notEmpty().withMessage('El idCliente es obligatorio')
    .isInt().withMessage('El idCliente debe ser un número entero'),
  body('idEmpleado')
    .notEmpty().withMessage('El idEmpleado es obligatorio')
    .isInt().withMessage('El idEmpleado debe ser un número entero'),
  body('Fecha')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

const reglasEditar = [
  body('Agudeza_Visual')
    .optional()
    .isString().withMessage('La agudeza visual debe ser texto')
    .isLength({ max: 10 }).withMessage('La agudeza visual no puede exceder 10 caracteres'),
  body('EsferaIzquierdo')
    .optional()
    .isFloat().withMessage('La esfera izquierda debe ser un número decimal'),
  body('Esfera_Derecho')
    .optional()
    .isFloat().withMessage('La esfera derecha debe ser un número decimal'),
  body('Cilindro_Izquierdo')
    .optional()
    .isFloat().withMessage('El cilindro izquierdo debe ser un número decimal'),
  body('Cilindro_Derecho')
    .optional()
    .isFloat().withMessage('El cilindro derecho debe ser un número decimal'),
  body('Eje_Izquierdo')
    .optional()
    .isFloat().withMessage('El eje izquierdo debe ser un número decimal'),
  body('Eje_Derecho')
    .optional()
    .isFloat().withMessage('El eje derecho debe ser un número decimal'),
  body('Distancia_Pupilar')
    .optional()
    .isFloat().withMessage('La distancia pupilar debe ser un número decimal'),
  body('Tipo_Lente')
    .optional()
    .isString().withMessage('El tipo de lente debe ser texto')
    .isLength({ max: 100 }).withMessage('El tipo de lente no puede exceder 100 caracteres'),
  body('Diagnostico')
    .optional()
    .isString().withMessage('El diagnóstico debe ser texto'),
  body('idCliente')
    .optional()
    .isInt().withMessage('El idCliente debe ser un número entero'),
  body('idEmpleado')
    .optional()
    .isInt().withMessage('El idEmpleado debe ser un número entero'),
  body('Fecha')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)')
];

// === CONTROLADORES ===

const validarFiltrosReceta = [
  query('idCliente').optional().isInt().withMessage('idCliente debe ser un número entero'),
  query('idEmpleado').optional().isInt().withMessage('idEmpleado debe ser un número entero'),
  query('tipoLente').optional().isString().withMessage('tipoLente debe ser texto'),
  query('fechaInicio').optional().isISO8601().withMessage('fechaInicio debe tener formato YYYY-MM-DD'),
  query('fechaFin').optional().isISO8601().withMessage('fechaFin debe tener formato YYYY-MM-DD'),
];

// Crear receta
const guardarReceta = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const receta = await Receta.create(req.body);
      res.status(201).json({ mensaje: 'Receta creada', receta });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear receta', error: error.message });
    }
  }
];

// Obtener todas las recetas con filtros
const listarReceta = [
  ...validarFiltrosReceta,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { idCliente, idEmpleado, tipoLente, fechaInicio, fechaFin } = req.query;
    const where = {};
    if (idCliente) where.idCliente = idCliente;
    if (idEmpleado) where.idEmpleado = idEmpleado;
    if (tipoLente) where.Tipo_Lente = tipoLente;
    if (fechaInicio || fechaFin) {
      where.Fecha = {};
      if (fechaInicio) where.Fecha['$gte'] = fechaInicio;
      if (fechaFin) where.Fecha['$lte'] = fechaFin;
    }
    try {
      const recetas = await Receta.findAll({ where });
      res.json(recetas);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener recetas', error: error.message });
    }
  }
];

// Obtener receta por ID
const obtenerRecetaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const receta = await Receta.findByPk(id);
    if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });
    res.json(receta);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener receta', error: error.message });
  }
};

// Editar receta
const editarReceta = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      const receta = await Receta.findByPk(id);
      if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });
      await receta.update(req.body);
      res.json({ mensaje: 'Receta actualizada', receta });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar receta', error: error.message });
    }
  }
];

// Eliminar receta
const eliminarReceta = async (req, res) => {
  const { id } = req.params;
  try {
    const receta = await Receta.findByPk(id);
    if (!receta) return res.status(404).json({ mensaje: 'Receta no encontrada' });
    await receta.destroy();
    res.json({ mensaje: 'Receta eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar receta', error: error.message });
  }
};

// === EXPORTAR ===
module.exports = {
  guardarReceta,
  listarReceta,
  obtenerRecetaPorId,
  editarReceta,
  eliminarReceta
};