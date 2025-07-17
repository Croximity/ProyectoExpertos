const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const productoAtributoController = require('../../controladores/productos/productoAtributoController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: ProductoAtributo
 *   description: Gestión de asignaciones entre productos y atributos
 */

/**
 * @swagger
 * /asignaciones/producto-atributo/buscar:
 *   get:
 *     summary: Buscar asignaciones de producto-atributo con filtros opcionales
 *     tags: [ProductoAtributo]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: idProducto
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por ID de producto
 *         example: 1
 *       - in: query
 *         name: idAtributo
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filtrar por ID de atributo
 *         example: 2
 *     responses:
 *       200:
 *         description: Lista de asignaciones encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductoAtributo'
 */

/**
 * @swagger
 * /asignaciones/producto-atributo:
 *   post:
 *     summary: Crear una nueva asignación producto-atributo
 *     tags: [ProductoAtributo]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoAtributoInput'
 *     responses:
 *       201:
 *         description: Asignación creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Asignación creada
 *                 asignacion:
 *                   $ref: '#/components/schemas/ProductoAtributo'
 */

/**
 * @swagger
 * /asignaciones/producto-atributo:
 *   get:
 *     summary: Obtener todas las asignaciones producto-atributo
 *     tags: [ProductoAtributo]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de asignaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductoAtributo'
 */

/**
 * @swagger
 * /asignaciones/producto-atributo/producto/{idProducto}:
 *   get:
 *     summary: Obtener asignaciones por ID de producto
 *     tags: [ProductoAtributo]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProducto
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *         example: 1
 *     responses:
 *       200:
 *         description: Asignaciones encontradas para el producto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductoAtributo'
 *       404:
 *         description: No se encontraron asignaciones para el producto
 */

/**
 * @swagger
 * /asignaciones/producto-atributo/{id}:
 *   put:
 *     summary: Actualizar stock de una asignación producto-atributo
 *     tags: [ProductoAtributo]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asignación a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *                 example: 10
 *                 description: Nuevo stock (entero igual o mayor a cero)
 *     responses:
 *       200:
 *         description: Stock actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Stock actualizado
 *                 asignacion:
 *                   $ref: '#/components/schemas/ProductoAtributo'
 *       404:
 *         description: Asignación no encontrada
 */

/**
 * @swagger
 * /asignaciones/producto-atributo/{id}:
 *   delete:
 *     summary: Eliminar una asignación producto-atributo por ID
 *     tags: [ProductoAtributo]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asignación a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Asignación eliminada
 *       404:
 *         description: Asignación no encontrada
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductoAtributo:
 *       type: object
 *       properties:
 *         idProductoAtributo:
 *           type: integer
 *           example: 1
 *         idProducto:
 *           type: integer
 *           example: 2
 *         idAtributo:
 *           type: integer
 *           example: 3
 *         stockActual:
 *           type: integer
 *           example: 100
 *     ProductoAtributoInput:
 *       type: object
 *       required:
 *         - idProducto
 *         - idAtributo
 *         - stock
 *       properties:
 *         idProducto:
 *           type: integer
 *           example: 2
 *         idAtributo:
 *           type: integer
 *           example: 3
 *         stock:
 *           type: integer
 *           example: 100
 */

// Buscar asignaciones con filtros
router.get('/producto-atributo/buscar', verificarUsuario, productoAtributoController.buscarAsignaciones);

// Crear asignación
router.post(
  '/producto-atributo',
  body('idProducto')
    .isInt({ gt: 0 })
    .withMessage('idProducto debe ser un número entero positivo'),
  body('idAtributo')
    .isInt({ gt: 0 })
    .withMessage('idAtributo debe ser un número entero positivo'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('stock debe ser un número entero igual o mayor a cero'),
  verificarUsuario,
  productoAtributoController.crearAsignacion
);

// Obtener todas las asignaciones
router.get('/producto-atributo', verificarUsuario, productoAtributoController.obtenerAsignaciones);

// Obtener asignaciones por producto
router.get(
  '/producto-atributo/producto/:idProducto',
  param('idProducto')
    .isInt({ gt: 0 })
    .withMessage('idProducto debe ser un número entero positivo'),
  verificarUsuario,
  productoAtributoController.obtenerAsignacionesPorProducto
);

// Actualizar stock
router.put(
  '/producto-atributo/:id',
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El id debe ser un número entero positivo'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('stock debe ser un número entero igual o mayor a cero'),
  verificarUsuario,
  productoAtributoController.actualizarStock
);

// Eliminar asignación
router.delete(
  '/producto-atributo/:id',
  param('id')
    .isInt({ gt: 0 })
    .withMessage('El id debe ser un número entero positivo'),
  verificarUsuario,
  productoAtributoController.eliminarAsignacion
);

module.exports = router;
