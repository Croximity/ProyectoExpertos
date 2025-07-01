const Rol = require('../modelos/Rol');

// Crear un rol
exports.crearRol = async (req, res) => {
  try {
    const rol = await Rol.create(req.body);
    res.status(201).json({ mensaje: 'Rol creado', rol });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear rol', error: error.message });
  }
};

// Obtener todos los roles
exports.obtenerRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener roles', error: error.message });
  }
};

// Editar un rol
exports.editarRol = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) return res.status(404).json({ mensaje: 'Rol no encontrado' });

    await rol.update(req.body);
    res.json({ mensaje: 'Rol actualizado', rol });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al editar rol', error: error.message });
  }
};

// Eliminar un rol
exports.eliminarRol = async (req, res) => {
  const { id } = req.params;
  try {
    const rol = await Rol.findByPk(id);
    if (!rol) return res.status(404).json({ mensaje: 'Rol no encontrado' });

    await rol.destroy();
    res.json({ mensaje: 'Rol eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar rol', error: error.message });
  }
};
