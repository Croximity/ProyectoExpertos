const express = require('express');
const router = express.Router();
const categoriaController = require('../../controladores/productos/CategoriaProductoController');

// Rutas para categoría de producto, con ruta simplificada
router.post('/categoria', categoriaController.crearCategoria);
router.get('/categoria', categoriaController.obtenerCategorias);
router.get('/categoria/:id', categoriaController.obtenerCategoriaPorId);
router.put('/categoria/:id', categoriaController.actualizarCategoria);
router.delete('/categoria/:id', categoriaController.eliminarCategoria);

module.exports = router;
