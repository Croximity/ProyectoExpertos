const ProductoAtributo = require('../../modelos/productos/ProductoAtributo');

// Crear asignación producto + atributo
exports.crearAsignacion = async (req, res) => {
  try {
    const { idProducto, idAtributo, stockActual } = req.body;
    const nuevaAsignacion = await ProductoAtributo.create({ idProducto, idAtributo, stockActual });
    res.status(201).json({ mensaje: 'Asignación creada', asignacion: nuevaAsignacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear asignación', error: error.message });
  }
};

// Listar todas las asignaciones
exports.obtenerAsignaciones = async (req, res) => {
  try {
    const asignaciones = await ProductoAtributo.findAll();
    res.json(asignaciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener asignaciones', error: error.message });
  }
};

// Listar asignaciones por producto
exports.obtenerAsignacionesPorProducto = async (req, res) => {
  try {
    const { idProducto } = req.params;
    const asignaciones = await ProductoAtributo.findAll({ where: { idProducto } });
    res.json(asignaciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener asignaciones por producto', error: error.message });
  }
};

// Actualizar stockActual de una asignación (por id)
exports.actualizarStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockActual } = req.body;
    const asignacion = await ProductoAtributo.findByPk(id);
    if (!asignacion) return res.status(404).json({ mensaje: 'Asignación no encontrada' });

    asignacion.stockActual = stockActual;
    await asignacion.save();

    res.json({ mensaje: 'Stock actualizado', asignacion });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar stock', error: error.message });
  }
};

// Eliminar asignación
exports.eliminarAsignacion = async (req, res) => {
  try {
    const { id } = req.params;
    const asignacion = await ProductoAtributo.findByPk(id);
    if (!asignacion) return res.status(404).json({ mensaje: 'Asignación no encontrada' });

    await asignacion.destroy();
    res.json({ mensaje: 'Asignación eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar asignación', error: error.message });
  }
};
