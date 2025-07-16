const express = require('express');
const router = express.Router();
const tipoEnfermedadController = require('../../controladores/consulta_examenes/TipoEnfermedadController');

router.post('/tipo-enfermedad', tipoEnfermedadController.crearTipoEnfermedad);
router.get('/tipo-enfermedad', tipoEnfermedadController.obtenerTiposEnfermedad);
router.get('/tipo-enfermedad/:id', tipoEnfermedadController.obtenerTipoEnfermedadPorId);
router.put('/tipo-enfermedad/:id', tipoEnfermedadController.editarTipoEnfermedad);
router.delete('/tipo-enfermedad/:id', tipoEnfermedadController.eliminarTipoEnfermedad);

module.exports = router; 