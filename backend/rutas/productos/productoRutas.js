const express = require('express');
const router = express.Router();
const productoController = require('../../controladores/productos/productoController');


// Crear un producto
router.post('/producto', productoController.crearProducto);

// Obtener todos los productos
router.get('/producto', productoController.obtenerProductos);

// Obtener un producto por ID
router.get('/producto/:id', productoController.obtenerProductoPorId);

// Editar un producto
router.put('/producto/:id', productoController.editarProducto);

// Eliminar un producto
router.delete('/producto/:id', productoController.eliminarProducto);

module.exports = router;
