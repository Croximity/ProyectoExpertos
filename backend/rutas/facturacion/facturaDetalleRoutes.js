const express = require('express');
const router = express.Router();
const facturaDetalleController = require('../../controladores/facturacion/facturaDetalleController');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: FacturaDetalle
 *   description: Gestión de los detalles de las facturas
 */

/**
 * @swagger
 * /factura-detalle:
 *   post:
 *     summary: Crear un nuevo detalle de factura
 *     security:
 *       - BearerAuth: []
 *     tags: [FacturaDetalle]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idFactura
 *               - idProducto
 *               - cantidad
 *               - precioUnitario
 *             properties:
 *               idFactura:
 *                 type: integer
 *               idProducto:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precioUnitario:
 *                 type: number
 *           example:
 *             idFactura: 2
 *             idProducto: 2
 *             cantidad: 2
 *             precioUnitario: 199.99
 *     responses:
 *       201:
 *         description: Detalle creado correctamente
 *       400:
 *         description: Error de validación o datos incompletos
 */
router.post('/factura-detalle', verificarUsuario, facturaDetalleController.validarCrearDetalle, facturaDetalleController.crearDetalle);

/**
 * @swagger
 * /factura-detalles:
 *   get:
 *     summary: Obtener todos los detalles de factura
 *     security:
 *       - BearerAuth: []
 *     tags: [FacturaDetalle]
 *     responses:
 *       200:
 *         description: Lista de detalles de factura
 */
router.get('/factura-detalles', verificarUsuario, facturaDetalleController.obtenerDetalles);

/**
 * @swagger
 * /factura-detalle/{id}:
 *   get:
 *     summary: Obtener un detalle de factura por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [FacturaDetalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de factura
 *     responses:
 *       200:
 *         description: Detalle encontrado
 *       404:
 *         description: Detalle no encontrado
 */
router.get('/factura-detalle/:id', verificarUsuario, facturaDetalleController.obtenerDetallePorId);

/**
 * @swagger
 * /factura-detalle/{id}:
 *   put:
 *     summary: Editar un detalle de factura
 *     security:
 *       - BearerAuth: []
 *     tags: [FacturaDetalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de factura
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idProducto:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precioUnitario:
 *                 type: number
 *     responses:
 *       200:
 *         description: Detalle actualizado correctamente
 *       404:
 *         description: Detalle no encontrado
 */
router.put('/factura-detalle/:id', verificarUsuario, facturaDetalleController.validarEditarDetalle, facturaDetalleController.editarDetalle);

/**
 * @swagger
 * /factura-detalle/{id}:
 *   delete:
 *     summary: Eliminar un detalle de factura
 *     security:
 *       - BearerAuth: []
 *     tags: [FacturaDetalle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de factura
 *     responses:
 *       200:
 *         description: Detalle eliminado correctamente
 *       404:
 *         description: Detalle no encontrado
 */
router.delete('/factura-detalle/:id', verificarUsuario, facturaDetalleController.eliminarDetalle);

module.exports = router;

 