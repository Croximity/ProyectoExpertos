const { validationResult } = require('express-validator');
const { uploadImagenProducto } = require('../../configuraciones/archivo');
const Producto = require('../../modelos/productos/ProductoModel');
const fs = require('fs');
const path = require('path');

exports.validarImagenProducto = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  uploadImagenProducto(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }
    next();
  });
};

exports.actualizarImagenProducto = async (req, res) => {
  const { id } = req.query;
  const nuevaImagen = req.file.filename;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Eliminar imagen anterior si existe
    if (producto.imagen) {
      const rutaImagenAnterior = path.join(__dirname, '../../../public/img/productos/', producto.imagen);
      if (fs.existsSync(rutaImagenAnterior)) {
        fs.unlinkSync(rutaImagenAnterior);
      }
    }

    producto.imagen = nuevaImagen;
    await producto.save();

    res.status(200).json({ mensaje: 'Imagen actualizada', producto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al actualizar imagen', error: err.message });
  }
};
