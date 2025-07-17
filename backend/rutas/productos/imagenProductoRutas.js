const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const imagenProductoController = require('../../controladores/productos/imagenProductoController');

router.put(
  '/imagen',
  query('id').isInt().withMessage('El id debe ser un número entero'),
  imagenProductoController.validarImagenProducto,
  imagenProductoController.actualizarImagenProducto
);

module.exports = router;
