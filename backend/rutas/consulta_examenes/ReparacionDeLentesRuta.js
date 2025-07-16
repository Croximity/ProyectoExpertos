const express = require('express');
const router = express.Router();
const reparacionDeLentesController = require('../../controladores/consulta_examenes/ReparacionDeLentesController');

router.post('/reparacion-lentes', reparacionDeLentesController.crearReparacionDeLentes);
router.get('/reparacion-lentes', reparacionDeLentesController.obtenerReparacionesDeLentes);
router.get('/reparacion-lentes/:id', reparacionDeLentesController.obtenerReparacionDeLentesPorId);
router.put('/reparacion-lentes/:id', reparacionDeLentesController.editarReparacionDeLentes);
router.delete('/reparacion-lentes/:id', reparacionDeLentesController.eliminarReparacionDeLentes);

module.exports = router; 