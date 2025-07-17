const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../../controladores/seguridad/authController');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para registro e inicio de sesión de usuarios
 */

/**
 * @swagger
 * /auth/registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistroInput'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Usuario registrado correctamente
 *       400:
 *         description: Datos inválidos o error de validación
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     idUsuario:
 *                       type: integer
 *                       example: 1
 *                     Nombre_Usuario:
 *                       type: string
 *                       example: jhernandez
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     RegistroInput:
 *       type: object
 *       required:
 *         - Nombre_Usuario
 *         - contraseña
 *       properties:
 *         Nombre_Usuario:
 *           type: string
 *           example: jhernandez
 *         contraseña:
 *           type: string
 *           example: 12345678
 *     LoginInput:
 *       type: object
 *       required:
 *         - Nombre_Usuario
 *         - contraseña
 *       properties:
 *         Nombre_Usuario:
 *           type: string
 *           example: jhernandez
 *         contraseña:
 *           type: string
 *           example: 12345678
 */

module.exports = router;
