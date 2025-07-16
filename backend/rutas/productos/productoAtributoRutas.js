const express = require('express');
const router = express.Router();
const productoAtributoController = require('../../controladores/productos/productoAtributoController');


router.post('/producto-atributo', productoAtributoController.crearAsignacion);
router.get('/producto-atributo', productoAtributoController.obtenerAsignaciones);
router.get('/producto-atributo/producto/:idProducto', productoAtributoController.obtenerAsignacionesPorProducto);
router.put('/producto-atributo/:id', productoAtributoController.actualizarStock);
router.delete('/producto-atributo/:id', productoAtributoController.eliminarAsignacion);

module.exports = router;
