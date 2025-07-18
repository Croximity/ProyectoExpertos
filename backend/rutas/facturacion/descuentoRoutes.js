const express = require('express');
const router = express.Router();
const descuentoController = require('../../controladores/facturacion/descuentoController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Descuento
 *   description: Gestión de descuentos
 */

/**
 * @swagger
 * /descuentos:
 *   get:
 *     summary: Obtener todos los descuentos
 *     security:
 *       - BearerAuth: []
 *     tags: [Descuento]
 *     responses:
 *       200:
 *         description: Lista de descuentos
 */
router.get('/descuentos', verificarUsuario, descuentoController.obtenerDescuentos);

/**
 * @swagger
 * /descuento/{id}:
 *   get:
 *     summary: Obtener un descuento por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Descuento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 * 
 *     responses:
 *       200:
 *         description: Descuento encontrado
 *       404:
 *         description: Descuento no encontrado
 */
router.get('/descuento/:id', verificarUsuario, descuentoController.obtenerDescuentoPorId);

/**
 * @swagger
 * /descuento:
 *   post:
 *     summary: Crear un nuevo descuento
 *     security:
 *       - BearerAuth: []
 *     tags: [Descuento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idDescuento
 *               - Tipo
 *               - Estado
 *               - Porcentaje
 *             properties:
 *               idDescuento:
 *                 type: integer
 *                 example: 1
 *               Tipo:
 *                 type: string
 *                 example: "Tercera Edad"
 *               Estado:
 *                 type: string
 *                 enum: [Activo, Inactivo]
 *                 example: "Activo"
 *               Porcentaje:
 *                 type: number
 *                 format: float
 *                 example: 0.5
 *     responses:
 *       201:
 *         description: Descuento creado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/descuento', verificarUsuario, descuentoController.validarCrear, descuentoController.crearDescuento);

/**
 * @swagger
 * /descuento/{id}:
 *   put:
 *     summary: Actualizar un descuento existente
 *     security:
 *       - BearerAuth: []
 *     tags: [Descuento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idDescuento
 *               - Tipo
 *               - Estado
 *               - Porcentaje
 *             properties:
 *               idDescuento:
 *                 type: integer
 *                 example: 10
 *               Tipo:
 *                 type: string
 *                 example: "Tercera Edad"
 *               Estado:
 *                 type: string
 *                 enum: [Activo, Inactivo]
 *                 example: "Activo"
 *               Porcentaje:
 *                 type: number
 *                 format: float
 *                 example: 0.5
 *     responses:
 *       200:
 *         description: Descuento actualizado correctamente
 *       404:
 *         description: Descuento no encontrado
 */
router.put('/descuento/:id', verificarUsuario, descuentoController.validarEditar, descuentoController.actualizarDescuento);

/**
 * @swagger
 * /descuento/{id}:
 *   delete:
 *     summary: Eliminar un descuento por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Descuento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del descuento
 *     responses:
 *       200:
 *         description: Descuento eliminado correctamente
 *       404:
 *         description: Descuento no encontrado
 */
router.delete('/descuento/:id', verificarUsuario, descuentoController.eliminarDescuento);

module.exports = router;
