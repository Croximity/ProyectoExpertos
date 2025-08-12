const express = require('express');
const router = express.Router();
const pagoController = require('../../controladores/facturacion/pagoController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Pago
 *   description: Gestión de pagos de facturas
 */

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Crear un nuevo pago
 *     security:
 *       - BearerAuth: []
 *     tags: [Pago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idFactura
 *               - monto
 *               - idFormaPago
 *             properties:
 *               idFactura:
 *                 type: integer
 *                 description: ID de la factura
 *                 example: 1
 *               monto:
 *                 type: number
 *                 description: Monto del pago
 *                 example: 150.50
 *               idFormaPago:
 *                 type: integer
 *                 description: ID de la forma de pago
 *                 example: 1
 *               fechaPago:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha del pago (opcional)
 *                 example: "2025-01-15T10:30:00.000Z"
 *               observaciones:
 *                 type: string
 *                 description: Observaciones del pago
 *                 example: "Pago parcial"
 *     responses:
 *       201:
 *         description: Pago creado correctamente
 *       400:
 *         description: Error de validación o datos incompletos
 *       404:
 *         description: Factura no encontrada
 */
router.post('/pagos', verificarUsuario, pagoController.validarCrearPago, pagoController.manejarErrores, pagoController.crearPago);

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Obtener todos los pagos
 *     security:
 *       - BearerAuth: []
 *     tags: [Pago]
 *     responses:
 *       200:
 *         description: Lista de pagos obtenida correctamente
 *       500:
 *         description: Error del servidor
 */
router.get('/pagos', verificarUsuario, pagoController.obtenerPagos);

/**
 * @swagger
 * /pagos/{id}:
 *   get:
 *     summary: Obtener un pago por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Pago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Pago obtenido correctamente
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/pagos/:id', verificarUsuario, pagoController.obtenerPagoPorId);

/**
 * @swagger
 * /pagos/factura/{idFactura}:
 *   get:
 *     summary: Obtener pagos por factura
 *     security:
 *       - BearerAuth: []
 *     tags: [Pago]
 *     parameters:
 *       - in: path
 *         name: idFactura
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Pagos de la factura obtenidos correctamente
 *       500:
 *         description: Error del servidor
 */
router.get('/pagos/factura/:idFactura', verificarUsuario, pagoController.obtenerPagosPorFactura);

/**
 * @swagger
 * /pagos/{id}/anular:
 *   patch:
 *     summary: Anular un pago
 *     security:
 *       - BearerAuth: []
 *     tags: [Pago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Pago anulado correctamente
 *       400:
 *         description: El pago ya está anulado
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch('/pagos/:id/anular', verificarUsuario, pagoController.anularPago);

module.exports = router;
