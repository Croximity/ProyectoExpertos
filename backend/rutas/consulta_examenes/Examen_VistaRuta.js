const express = require('express');
const router = express.Router();
const examenVistaController = require('../../controladores/consulta_examenes/Examen_VistaController');

router.post('/examen-vista', examenVistaController.crearExamenVista);
router.get('/examen-vista', examenVistaController.obtenerExamenesVista);
router.get('/examen-vista/:id', examenVistaController.obtenerExamenVistaPorId);
router.put('/examen-vista/:id', examenVistaController.editarExamenVista);
router.delete('/examen-vista/:id', examenVistaController.eliminarExamenVista);

module.exports = router; 