const express = require('express');
const router = express.Router();
const personaController = require('../../controladores/seguridad/personaController');

// Ruta: Crear una persona
router.post('/persona', personaController.crearPersona);

// Ruta: Editar una persona
router.put('/persona/:id', personaController.editarPersona);

// Ruta: Eliminar una persona
router.delete('/persona/:id', personaController.eliminarPersona);

// Ruta: Crear varias personas
router.post('/personas', personaController.crearMultiplesPersonas);

module.exports = router;
