const { body, validationResult } = require('express-validator');
const Consulta = require('../../modelos/gestion_cliente/Consulta');

// Crear consulta
exports.crearConsulta = async (req, res) => {
  try {
    const consulta = await Consulta.create(req.body);
    res.status(201).json({ mensaje: 'Consulta creada', consulta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear consulta', error: error.message });
  }
};

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
exports.editarConsulta = async (req, res) => {
  const { id } = req.params;
  try {
    const consulta = await Consulta.findByPk(id);
    if (!consulta) return res.status(404).json({ mensaje: 'Consulta no encontrada' });
    await consulta.update(req.body);
    res.json({ mensaje: 'Consulta actualizada', consulta });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al editar consulta', error: error.message });
  }
};

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
