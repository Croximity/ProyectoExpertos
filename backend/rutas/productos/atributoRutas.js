const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const atributoController = require('../../controladores/productos/AtributoController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Atributos
 *   description: Gestión de atributos de productos
 */

/**
 * @swagger
 * /atributos/atributos/buscar:
 *   get:
 *     summary: Buscar atributos por filtro
 *     tags: [Atributos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filtro
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtro para buscar atributos por nombre o tipo
 *         example: tamaño
 *     responses:
 *       200:
 *         description: Lista de atributos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Atributo'
 */

/**
 * @swagger
 * /atributos/atributos:
 *   post:
 *     summary: Crear un nuevo atributo
 *     tags: [Atributos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtributoInput'
 *     responses:
 *       201:
 *         description: Atributo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Atributo creado
 *                 atributo:
 *                   $ref: '#/components/schemas/Atributo'
 */

/**
 * @swagger
 * /atributos/atributos:
 *   get:
 *     summary: Obtener todos los atributos
 *     tags: [Atributos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de atributos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Atributo'
 */

/**
 * @swagger
 * /atributos/atributos/{id}:
 *   get:
 *     summary: Obtener un atributo por ID
 *     tags: [Atributos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del atributo
 *         example: 1
 *     responses:
 *       200:
 *         description: Atributo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Atributo'
 *       404:
 *         description: Atributo no encontrado
 */

/**
 * @swagger
 * /atributos/atributos/{id}:
 *   put:
 *     summary: Actualizar un atributo
 *     tags: [Atributos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del atributo a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtributoInput'
 *     responses:
 *       200:
 *         description: Atributo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Atributo actualizado
 *                 atributo:
 *                   $ref: '#/components/schemas/Atributo'
 *       404:
 *         description: Atributo no encontrado
 */

/**
 * @swagger
 * /atributos/atributos/{id}:
 *   delete:
 *     summary: Eliminar un atributo por ID
 *     tags: [Atributos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del atributo a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Atributo eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Atributo eliminado
 *       404:
 *         description: Atributo no encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Atributo:
 *       type: object
 *       properties:
 *         idAtributo:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Tamaño
 *         tipo:
 *           type: string
 *           example: texto
 *     AtributoInput:
 *       type: object
 *       required:
 *         - nombre
 *         - tipo
 *       properties:
 *         nombre:
 *           type: string
 *           example: Tamaño
 *         tipo:
 *           type: string
 *           example: texto
 */

router.get('/atributos/buscar', verificarUsuario, atributoController.buscarAtributos);

// CREAR atributo
router.post(
  '/atributos',
  verificarUsuario,
  body('nombre')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
  atributoController.crearAtributo
);

// LISTAR todos
router.get('/atributos', verificarUsuario, atributoController.obtenerAtributos);

// OBTENER por ID
router.get(
  '/atributos/:id',
  verificarUsuario,
  param('id')
    .isInt().withMessage('El ID debe ser un número entero'),
  atributoController.obtenerAtributoPorId
);

// ACTUALIZAR
router.put(
  '/atributos/:id',
  verificarUsuario,
  param('id')
    .isInt().withMessage('El ID debe ser un número entero'),
  body('nombre')
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
  atributoController.actualizarAtributo
);

// ELIMINAR
router.delete(
  '/atributos/:id',
  verificarUsuario,
  param('id')
    .isInt().withMessage('El ID debe ser un número entero'),
  atributoController.eliminarAtributo
);

module.exports = router;
