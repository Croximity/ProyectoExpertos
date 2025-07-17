const { Op } = require('sequelize');
const ProductoAtributo = require('../../modelos/productos/ProductoAtributo');

// Buscar asignaciones con filtros opcionales
exports.buscarAsignaciones = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json(errores.array());
    }

    const {
        nombreProducto = '',
        nombreAtributo = '',
        tipoAtributo = '',
        stockMin,
        stockMax
    } = req.query;

    const condicionesProducto = [];
    const condicionesAtributo = [];
    const condicionesProductoAtributo = [];

    if (nombreProducto.length >= 3) {
        condicionesProducto.push({ Nombre: { [Op.like]: `%${nombreProducto}%` } });
    }

    if (nombreAtributo.length >= 3) {
        condicionesAtributo.push({ nombre: { [Op.like]: `%${nombreAtributo}%` } });
    }

    if (tipoAtributo.length >= 3) {
        condicionesAtributo.push({ tipo: { [Op.like]: `%${tipoAtributo}%` } });
    }

    if (stockMin && !isNaN(stockMin)) {
        condicionesProductoAtributo.push({ stockActual: { [Op.gte]: parseInt(stockMin) } });
    }

    if (stockMax && !isNaN(stockMax)) {
        condicionesProductoAtributo.push({ stockActual: { [Op.lte]: parseInt(stockMax) } });
    }

    // Si no hay filtros, exigir al menos un filtro para evitar consultas masivas
    if (
        condicionesProducto.length === 0 &&
        condicionesAtributo.length === 0 &&
        condicionesProductoAtributo.length === 0
    ) {
        return res.status(400).json({
            msj: 'Debe proveer al menos un filtro válido: nombreProducto, nombreAtributo, tipoAtributo o stockMin/Max'
        });
    }

    try {
        const resultados = await ProductoAtributo.findAll({
            where: condicionesProductoAtributo.length > 0 ? { [Op.and]: condicionesProductoAtributo } : undefined,
            include: [
                {
                    model: ProductoModel,
                    where: condicionesProducto.length > 0 ? { [Op.and]: condicionesProducto } : undefined
                },
                {
                    model: Atributo,
                    where: condicionesAtributo.length > 0 ? { [Op.and]: condicionesAtributo } : undefined
                }
            ]
        });
        res.json(resultados);
    } catch (error) {
        console.error('Error en buscarProductoAtributo:', error);
        res.status(500).json({ msj: 'Error interno del servidor' });
    }
};

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
