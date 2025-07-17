
const express = require('express');
const router = express.Router();
const formaPagoController = require('../../controladores/facturacion/formaPagoController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: FormaPago
 *   description: Gestión de formas de pago
 */

/**
 * @swagger
 * /formas-pago:
 *   get:
 *     summary: Obtener todas las formas de pago
 *     security:
 *       - BearerAuth: []
 *     tags: [FormaPago]
 *     responses:
 *       200:
 *         description: Lista de formas de pago
 */
router.get('/formas-pago', verificarUsuario, formaPagoController.obtenerFormasPago);

/**
 * @swagger
 * /forma-pago/{id}:
 *   get:
 *     summary: Obtener una forma de pago por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [FormaPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la forma de pago
 *     responses:
 *       200:
 *         description: Objeto de forma de pago
 *       404:
 *         description: No encontrado
 */
router.get('/forma-pago/:id', verificarUsuario, formaPagoController.obtenerFormaPagoPorId);

/**
 * @swagger
 * /forma-pago:
 *   post:
 *     summary: Crear una nueva forma de pago
 *     security:
 *       - BearerAuth: []
 *     tags: [FormaPago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idFormaPago
 *               - Formapago
 *               - Estado
 *             properties:
 *               idFormaPago:
 *                 type: integer
 *               Formapago:
 *                 type: string
 *               Estado:
 *                 type: string
 *                 enum: [A, I]
 *     responses:
 *       201:
 *         description: Forma de pago creada
 *       400:
 *         description: Error de validación
 */
router.post('/forma-pago', verificarUsuario, formaPagoController.validarCrear, formaPagoController.crearFormaPago);

/**
 * @swagger
 * /forma-pago/{id}:
 *   put:
 *     summary: Actualizar una forma de pago existente
 *     security:
 *       - BearerAuth: []
 *     tags: [FormaPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la forma de pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Formapago:
 *                 type: string
 *               Estado:
 *                 type: string
 *                 enum: [A, I]
 *     responses:
 *       200:
 *         description: Forma de pago actualizada
 *       404:
 *         description: No encontrada
 */
router.put('/forma-pago/:id', verificarUsuario, formaPagoController.validarEditar, formaPagoController.actualizarFormaPago);

/**
 * @swagger
 * /forma-pago/{id}/inactivar:
 *   patch:
 *     summary: Inactivar una forma de pago (no se elimina físicamente)
 *     security:
 *       - BearerAuth: []
 *     tags: [FormaPago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la forma de pago a inactivar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Forma de pago inactivada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Forma de pago inactivada correctamente
 *                 forma:
 *                   type: object
 *                   properties:
 *                     idFormaPago:
 *                       type: integer
 *                       example: 1
 *                     Formapago:
 *                       type: string
 *                       example: "Efectivo"
 *                     Estado:
 *                       type: string
 *                       example: "I"
 *       404:
 *         description: Forma de pago no encontrada
 *       500:
 *         description: Error al inactivar forma de pago
 */
router.patch('/forma-pago/:id/inactivar', verificarUsuario, formaPagoController.inactivarFormaPago);


module.exports = router;
