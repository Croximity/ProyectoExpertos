const express = require('express');
const router = express.Router();
const rolController = require('../../controladores/seguridad/rolController');

// Crear un rol
router.post('/rol', rolController.crearRol);

// Obtener todos los roles
router.get('/roles', rolController.obtenerRoles);

// Editar un rol
router.put('/rol/:id', rolController.editarRol);

// Eliminar un rol
router.delete('/rol/:id', rolController.eliminarRol);

module.exports = router;
