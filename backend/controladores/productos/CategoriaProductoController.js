const CategoriaProducto = require('../../modelos/productos/CategoriaProducto');

// Crear una nueva categoría
exports.crearCategoria = async (req, res) => {
  try {
    const categoria = await CategoriaProducto.create(req.body);
    res.status(201).json({ mensaje: 'Categoría creada', categoria });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la categoría', error: error.message });
  }
};

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaProducto.findAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las categorías', error: error.message });
  }
};

// Obtener una categoría por ID
exports.obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await CategoriaProducto.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar la categoría', error: error.message });
  }
};

// Actualizar una categoría
exports.actualizarCategoria = async (req, res) => {
  try {
    const categoria = await CategoriaProducto.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });

    await categoria.update(req.body);
    res.status(200).json({ mensaje: 'Categoría actualizada', categoria });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la categoría', error: error.message });
  }
};

// Eliminar una categoría
exports.eliminarCategoria = async (req, res) => {
  try {
    const categoria = await CategoriaProducto.findByPk(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });

    await categoria.destroy();
    res.status(200).json({ mensaje: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la categoría', error: error.message });
  }
};
