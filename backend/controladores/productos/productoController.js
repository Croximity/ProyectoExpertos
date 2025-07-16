const Producto = require('../../modelos/productos/ProductoModel');
const CategoriaProducto = require('../../modelos/productos/CategoriaProducto');

// Crear un producto
exports.crearProducto = async (req, res) => {
  try {
    const nuevo = await Producto.create(req.body);
    res.status(201).json({ mensaje: 'Producto creado', producto: nuevo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
};

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: [{ model: CategoriaProducto }]
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
};

// Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id, {
      include: [{ model: CategoriaProducto }]
    });
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
  }
};

// Editar un producto
exports.editarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    await producto.update(req.body);
    res.json({ mensaje: 'Producto actualizado', producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
};
