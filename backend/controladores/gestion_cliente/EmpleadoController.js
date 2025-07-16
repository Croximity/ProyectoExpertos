const { body, validationResult } = require('express-validator');
const Empleado = require('../../modelos/gestion_cliente/Empleado');

// Crear empleado
exports.crearEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.create(req.body);
    res.status(201).json({ mensaje: 'Empleado creado', empleado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear empleado', error: error.message });
  }
};

// Obtener todos los empleados
exports.obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleados', error: error.message });
  }
};

// Obtener empleado por ID
exports.obtenerEmpleadoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleado', error: error.message });
  }
};

// Editar empleado
exports.editarEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    await empleado.update(req.body);
    res.json({ mensaje: 'Empleado actualizado', empleado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al editar empleado', error: error.message });
  }
};

// Eliminar empleado
exports.eliminarEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    await empleado.destroy();
    res.json({ mensaje: 'Empleado eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar empleado', error: error.message });
  }
};
