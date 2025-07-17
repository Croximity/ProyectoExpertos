const { body, validationResult, query } = require('express-validator');
const Examen_Vista = require('../../modelos/consulta_examenes/Examen_Vista');

// === VALIDACIONES ===
const reglasCrear = [
  body('idConsulta')
    .notEmpty().withMessage('El idConsulta es obligatorio')
    .isInt().withMessage('El idConsulta debe ser un número entero'),
  body('Fecha_Examen')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
  body('Observaciones')
    .optional()
    .isString().withMessage('Las observaciones deben ser texto'),
  body('idReceta')
    .optional()
    .isInt().withMessage('El idReceta debe ser un número entero')
];

const reglasEditar = [
  body('idConsulta')
    .optional()
    .isInt().withMessage('El idConsulta debe ser un número entero'),
  body('Fecha_Examen')
    .optional()
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
  body('Observaciones')
    .optional()
    .isString().withMessage('Las observaciones deben ser texto'),
  body('idReceta')
    .optional()
    .isInt().withMessage('El idReceta debe ser un número entero')
];

// === CONTROLADORES ===

const validarFiltrosExamenVista = [
  query('idConsulta').optional().isInt().withMessage('idConsulta debe ser un número entero'),
  query('idReceta').optional().isInt().withMessage('idReceta debe ser un número entero'),
  query('fechaInicio').optional().isISO8601().withMessage('fechaInicio debe tener formato YYYY-MM-DD'),
  query('fechaFin').optional().isISO8601().withMessage('fechaFin debe tener formato YYYY-MM-DD'),
];

// Crear examen de vista
const guardarExamenVista = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const examenVista = await Examen_Vista.create(req.body);
      res.status(201).json({ mensaje: 'Examen de vista creado', examenVista });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear examen de vista', error: error.message });
    }
  }
];

// Obtener todos los exámenes de vista con filtros
const listarExamenVista = [
  ...validarFiltrosExamenVista,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { idConsulta, idReceta, fechaInicio, fechaFin } = req.query;
    const where = {};
    if (idConsulta) where.idConsulta = idConsulta;
    if (idReceta) where.idReceta = idReceta;
    if (fechaInicio || fechaFin) {
      where.Fecha_Examen = {};
      if (fechaInicio) where.Fecha_Examen['$gte'] = fechaInicio;
      if (fechaFin) where.Fecha_Examen['$lte'] = fechaFin;
    }
    try {
      const examenesVista = await Examen_Vista.findAll({ where });
      res.json(examenesVista);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener exámenes de vista', error: error.message });
    }
  }
];

// Obtener examen de vista por ID
const obtenerExamenVistaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const examenVista = await Examen_Vista.findByPk(id);
    if (!examenVista) return res.status(404).json({ mensaje: 'Examen de vista no encontrado' });
    res.json(examenVista);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener examen de vista', error: error.message });
  }
};

// Editar examen de vista
const editarExamenVista = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      const examenVista = await Examen_Vista.findByPk(id);
      if (!examenVista) return res.status(404).json({ mensaje: 'Examen de vista no encontrado' });
      await examenVista.update(req.body);
      res.json({ mensaje: 'Examen de vista actualizado', examenVista });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar examen de vista', error: error.message });
    }
  }
];

// Eliminar examen de vista
const eliminarExamenVista = async (req, res) => {
  const { id } = req.params;
  try {
    const examenVista = await Examen_Vista.findByPk(id);
    if (!examenVista) return res.status(404).json({ mensaje: 'Examen de vista no encontrado' });
    await examenVista.destroy();
    res.json({ mensaje: 'Examen de vista eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar examen de vista', error: error.message });
  }
};

// === EXPORTAR ===
module.exports = {
  guardarExamenVista,
  listarExamenVista,
  obtenerExamenVistaPorId,
  editarExamenVista,
  eliminarExamenVista
};