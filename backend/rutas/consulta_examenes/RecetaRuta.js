const express = require('express');
const router = express.Router();
const recetaController = require('../../controladores/consulta_examenes/RecetaController');

router.post('/receta', recetaController.crearReceta);
router.get('/receta', recetaController.obtenerRecetas);
router.get('/receta/:id', recetaController.obtenerRecetaPorId);
router.put('/receta/:id', recetaController.editarReceta);
router.delete('/receta/:id', recetaController.eliminarReceta);

module.exports = router; 