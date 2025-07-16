const express = require('express');
const router = express.Router();
const atributoController = require('../../controladores/productos/AtributoController');

router.post('/atributo', atributoController.crearAtributo);
router.get('/atributos', atributoController.obtenerAtributos);
router.get('/atributos/:id', atributoController.obtenerAtributoPorId);
router.put('/atributos/:id', atributoController.actualizarAtributo);
router.delete('/atributos/:id', atributoController.eliminarAtributo);

module.exports = router;
