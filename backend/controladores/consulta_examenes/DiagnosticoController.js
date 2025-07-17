const { body, validationResult } = require('express-validator');
const Diagnostico = require('../../modelos/consulta_examenes/Diagnostico');

// === VALIDACIONES ===
const reglasCrear = [
  body('idExamen')
    .notEmpty().withMessage('El idExamen es obligatorio')
    .isInt().withMessage('El idExamen debe ser un número entero'),
  body('idTipoEnfermedad')
    .notEmpty().withMessage('El idTipoEnfermedad es obligatorio')
    .isInt().withMessage('El idTipoEnfermedad debe ser un número entero')
];

const reglasEditar = [
  body('idExamen')
    .optional()
    .isInt().withMessage('El idExamen debe ser un número entero'),
  body('idTipoEnfermedad')
    .optional()
    .isInt().withMessage('El idTipoEnfermedad debe ser un número entero')
];

// === CONTROLADORES ===

// Crear diagnóstico
const guardarDiagnostico = [
  ...reglasCrear,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    try {
      const diagnostico = await Diagnostico.create(req.body);
      res.status(201).json({ mensaje: 'Diagnóstico creado', diagnostico });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear diagnóstico', error: error.message });
    }
  }
];

// Obtener todos los diagnósticos
const listarDiagnostico = async (req, res) => {
  try {
    const diagnosticos = await Diagnostico.findAll();
    res.json(diagnosticos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener diagnósticos', error: error.message });
  }
};

// Obtener diagnóstico por ID
const obtenerDiagnosticoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const diagnostico = await Diagnostico.findByPk(id);
    if (!diagnostico) return res.status(404).json({ mensaje: 'Diagnóstico no encontrado' });
    res.json(diagnostico);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener diagnóstico', error: error.message });
  }
};

// Editar diagnóstico
const editarDiagnostico = [
  ...reglasEditar,
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    const { id } = req.params;
    try {
      const diagnostico = await Diagnostico.findByPk(id);
      if (!diagnostico) return res.status(404).json({ mensaje: 'Diagnóstico no encontrado' });
      await diagnostico.update(req.body);
      res.json({ mensaje: 'Diagnóstico actualizado', diagnostico });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al editar diagnóstico', error: error.message });
    }
  }
];

// Eliminar diagnóstico
const eliminarDiagnostico = async (req, res) => {
  const { id } = req.params;
  try {
    const diagnostico = await Diagnostico.findByPk(id);
    if (!diagnostico) return res.status(404).json({ mensaje: 'Diagnóstico no encontrado' });
    await diagnostico.destroy();
    res.json({ mensaje: 'Diagnóstico eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar diagnóstico', error: error.message });
  }
};

// === EXPORTAR ===
module.exports = {
  guardarDiagnostico,
  listarDiagnostico,
  obtenerDiagnosticoPorId,
  editarDiagnostico,
  eliminarDiagnostico
};