const Atributo = require('../../modelos/productos/Atributo');


// Crear un atributo
exports.crearAtributo = async (req, res) => {
  try {
    const atributo = await Atributo.create(req.body);
    res.status(201).json({ mensaje: 'Atributo creado', atributo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear atributo', error: error.message });
  }
};

// Obtener todos los atributos
exports.obtenerAtributos = async (req, res) => {
  try {
    const atributos = await Atributo.findAll();
    res.json(atributos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener atributos', error: error.message });
  }
};

// Obtener atributo por ID
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

// Actualizar atributo
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

// Eliminar atributo
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
