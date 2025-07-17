const Producto = require('../../modelos/productos/ProductoModel');
const CategoriaProducto = require('../../modelos/productos/CategoriaProducto');
const { Op } = require('sequelize');

exports.buscarProducto = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        console.log(errores.array());
        return res.status(400).json(errores.array());
    }

    const {
        nombre = '',
        marca = '',
        categoria = '',
        precioMin,
        precioMax
    } = req.query;

    const condiciones = [];
    const include = [];

    if (nombre.length >= 3) {
        condiciones.push({
            Nombre: { [Op.like]: `%${nombre}%` }
        });
    }

    if (marca.length >= 2) {
        condiciones.push({
            marca: { [Op.like]: `%${marca}%` }
        });
    }

    if (precioMin && !isNaN(precioMin)) {
        condiciones.push({
            precioVenta: { [Op.gte]: parseFloat(precioMin) }
        });
    }

    if (precioMax && !isNaN(precioMax)) {
        condiciones.push({
            precioVenta: { [Op.lte]: parseFloat(precioMax) }
        });
    }

    if (categoria.length >= 3) {
        include.push({
            model: CategoriaProducto,
            where: {
                nombreCategoria: { [Op.like]: `%${categoria}%` }
            }
        });
    } else {
        // incluir la categoría aunque no se filtre por ella
        include.push({
            model: CategoriaProducto
        });
    }

    if (condiciones.length === 0 && categoria.length < 3) {
        return res.status(400).json({
            msj: 'Debe proporcionar al menos un filtro válido: nombre (≥3), marca (≥2), precio o categoría (≥3).'
        });
    }

    const productos = await ProductoModel.findAll({
        where: condiciones.length > 0 ? { [Op.and]: condiciones } : undefined,
        include
    });

    res.json(productos);
};

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
