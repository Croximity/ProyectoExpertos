const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../../controladores/seguridad/authController');

// Ruta: Registro de usuario
router.post(
  '/registro',
  [
    check('Nombre_Usuario')
      .notEmpty()
      .withMessage('El nombre de usuario es obligatorio'),
    check('contraseña')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres')
  ],
  authController.registrar
);

// Ruta: Inicio de sesión
router.post(
  '/login',
  [
    check('Nombre_Usuario')
      .notEmpty()
      .withMessage('El nombre de usuario es obligatorio'),
    check('contraseña')
      .notEmpty()
      .withMessage('La contraseña es obligatoria')
  ],
  authController.iniciarSesion
);

module.exports = router;
