const express = require('express');
const router = express.Router();
const diagnosticoController = require('../../controladores/consulta_examenes/DiagnosticoController');

router.post('/diagnostico', diagnosticoController.crearDiagnostico);
router.get('/diagnostico', diagnosticoController.obtenerDiagnosticos);
router.get('/diagnostico/:id', diagnosticoController.obtenerDiagnosticoPorId);
router.put('/diagnostico/:id', diagnosticoController.editarDiagnostico);
router.delete('/diagnostico/:id', diagnosticoController.eliminarDiagnostico);

module.exports = router; 