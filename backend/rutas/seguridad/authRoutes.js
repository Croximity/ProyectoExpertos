const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const authController = require('../../controladores/seguridad/authController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Autenticación MongoDB
 *   description: Rutas para registrar e iniciar sesión con MongoDB
 */

/**
 * @swagger
 * /auth-mongo/registro:
 *   post:
 *     summary: Registrar un nuevo usuario en MongoDB
 *     tags: [Autenticación MongoDB]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre_Usuario
 *               - contraseña
 *             properties:
 *               Nombre_Usuario:
 *                 type: string
 *                 example: juan123
 *               contraseña:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               idPersona:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               idrol:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos inválidos o usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /auth-mongo/login:
 *   post:
 *     summary: Iniciar sesión de usuario en MongoDB
 *     tags: [Autenticación MongoDB]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre_Usuario
 *               - contraseña
 *             properties:
 *               Nombre_Usuario:
 *                 type: string
 *                 example: juan123
 *               contraseña:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */

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

// Ruta: Verificar PIN 2FA
router.post(
  '/verificar-pin',
  [
    check('Nombre_Usuario', 'El nombre de usuario es obligatorio').notEmpty(),
    check('pin', 'El PIN es obligatorio').notEmpty(),
  ],
  authController.verificarPin
);

// Ruta: Registrar Persona
router.post(
  '/registrar-persona',
  [
    check('Pnombre')
      .notEmpty()
      .withMessage('El primer nombre es obligatorio')
      .isLength({ min: 2, max: 45 })
      .withMessage('El primer nombre debe tener entre 2 y 45 caracteres'),
    check('genero')
      .isIn(['M', 'F'])
      .withMessage('El género debe ser M o F'),
    check('correo')
      .optional({ nullable: true, checkFalsy: true })
      .isEmail()
      .withMessage('El correo electrónico debe tener un formato válido'),
    check('fechaNacimiento')
      .optional({ nullable: true, checkFalsy: true })
      .isISO8601()
      .withMessage('La fecha de nacimiento debe tener un formato válido')
  ],
  authController.registrarPersona
);

// Ruta: Crear Rol
router.post(
  '/crear-rol',
  [
    check('nombre')
      .notEmpty()
      .withMessage('El nombre del rol es obligatorio')
      .isLength({ max: 45 })
      .withMessage('El nombre del rol debe tener máximo 45 caracteres'),
    check('descripcion')
      .optional()
      .isLength({ max: 45 })
      .withMessage('La descripción debe tener máximo 45 caracteres')
  ],
  authController.crearRol
);

// Rutas públicas (no requieren autenticación)
router.get('/roles', authController.obtenerRoles); // Pública para registro
router.get('/test', (req, res) => {
  res.json({ mensaje: 'Sistema funcionando correctamente', timestamp: new Date().toISOString() });
});

// Rutas protegidas
router.get('/listar', verificarUsuario, authController.obtenerUsuarios);
router.get('/usuario-actual', verificarUsuario, authController.obtenerUsuarioActual);
router.post('/asociar-persona', verificarUsuario, authController.asociarPersonaAUsuario);
router.get('/personas', verificarUsuario, authController.obtenerPersonas);
router.get('/error', authController.error);

module.exports = router;
