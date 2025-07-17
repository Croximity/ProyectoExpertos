const { Op } = require('sequelize');
const Atributo = require('../../modelos/productos/Atributo');

// Buscar atributos con filtros opcionales
exports.buscarAtributos = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json(errores.array());
    }

    const { nombre = '', tipo = '' } = req.query;
    const condiciones = [];

    if (nombre.length >= 3) {
        condiciones.push({ nombre: { [Op.like]: `%${nombre}%` } });
    }
    if (tipo.length >= 3) {
        condiciones.push({ tipo: { [Op.like]: `%${tipo}%` } });
    }

    if (condiciones.length === 0) {
        return res.status(400).json({
            msj: 'Debe proporcionar al menos 3 caracteres en el nombre o tipo para buscar.'
        });
    }

    try {
        const atributos = await Atributo.findAll({
            where: { [Op.and]: condiciones }
        });
        res.json(atributos);
    } catch (error) {
        console.error('Error buscando atributos:', error);
        res.status(500).json({ msj: 'Error interno del servidor' });
    }
};
// (Resto de funciones que ya tienes sin cambios)

exports.crearAtributo = async (req, res) => {
  try {
    const atributo = await Atributo.create(req.body);
    res.status(201).json({ mensaje: 'Atributo creado', atributo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear atributo', error: error.message });
  }
};

exports.obtenerAtributos = async (req, res) => {
  try {
    const atributos = await Atributo.findAll();
    res.json(atributos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener atributos', error: error.message });
  }
};

exports.obtenerAtributoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const atributo = await Atributo.findByPk(id);
    if (!atributo) return res.status(404).json({ mensaje: 'Atributo no encontrado' });
    res.json(atributo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener atributo', error: error.message });
  }
};

exports.actualizarAtributo = async (req, res) => {
  const { id } = req.params;
  try {
    const atributo = await Atributo.findByPk(id);
    if (!atributo) return res.status(404).json({ mensaje: 'Atributo no encontrado' });

    await atributo.update(req.body);
    res.json({ mensaje: 'Atributo actualizado', atributo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar atributo', error: error.message });
  }
};

exports.eliminarAtributo = async (req, res) => {
  const { id } = req.params;
  try {
    const atributo = await Atributo.findByPk(id);
    if (!atributo) return res.status(404).json({ mensaje: 'Atributo no encontrado' });

    await atributo.destroy();
    res.json({ mensaje: 'Atributo eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar atributo', error: error.message });
  }
};
