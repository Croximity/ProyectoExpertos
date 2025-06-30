const { validationResult } = require('express-validator');
const Persona = require('../modelos/Persona');

// Crear una persona
exports.crearPersona = async (req, res) => {
  try {
    const persona = await Persona.create(req.body);
    res.status(201).json({ mensaje: 'Persona creada', persona });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear persona', error: error.message });
  }
};

// Editar una persona
exports.editarPersona = async (req, res) => {
  const { id } = req.params;

  try {
    const persona = await Persona.findByPk(id);
    if (!persona) return res.status(404).json({ mensaje: 'Persona no encontrada' });

    await persona.update(req.body);
    res.json({ mensaje: 'Persona actualizada', persona });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al editar persona', error: error.message });
  }
};

// Eliminar una persona
exports.eliminarPersona = async (req, res) => {
  const { id } = req.params;

  try {
    const persona = await Persona.findByPk(id);
    if (!persona) return res.status(404).json({ mensaje: 'Persona no encontrada' });

    await persona.destroy();
    res.json({ mensaje: 'Persona eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar persona', error: error.message });
  }
};

// Crear varias personas
exports.crearMultiplesPersonas = async (req, res) => {
  try {
    const personas = await Persona.bulkCreate(req.body); // req.body debe ser un array
    res.status(201).json({ mensaje: 'Personas creadas', personas });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear múltiples personas', error: error.message });
  }
};
