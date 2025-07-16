const express = require('express');
const router = express.Router();
const detalleDescuentoController = require('../../controladores/facturacion/detalleDescuentoController');

/**
 * @swagger
 * tags:
 *   name: DetalleDescuento
 *   description: Gestión de descuentos aplicados a facturas
 */

/**
 * @swagger
 * /detalle-descuento:
 *   post:
 *     summary: Asignar un descuento a una factura
 *     tags: [DetalleDescuento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idFactura
 *               - idDescuento
 *               - Monto
 *             properties:
 *               idFactura:
 *                 type: integer
 *                 description: ID de la factura
 *                 example: 1       
 *               idDescuento:
 *                 type: integer
 *                 example: 1
 *                 description: ID del descuento
 *               Monto:
 *                 type: integer
 *                 example: 50
 *                 description: Monto del descuento aplicado
 *     responses:
 *       201:
 *         description: Descuento agregado a la factura
 *       400:
 *         description: Datos inválidos o faltantes
 */
router.post('/detalle-descuento',
    detalleDescuentoController.validarCrearDetalleDescuento,
    detalleDescuentoController.crearDetalleDescuento
);
/**
 * @swagger
 * /detalles-descuento:
 *   get:
 *     summary: Obtener todos los detalles de descuento aplicados a facturas
 *     tags: [DetalleDescuento]
 *     responses:
 *       200:
 *         description: Lista de detalles de descuentos
 */
router.get('/detalles-descuento', detalleDescuentoController.obtenerDetalles);

/**
 * @swagger
 * /detalle-descuento/{idFactura}/{idDescuento}:
 *   delete:
 *     summary: Eliminar un descuento aplicado a una factura
 *     tags: [DetalleDescuento]
 *     parameters:
 *       - in: path
 *         name: idFactura
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *       - in: path
 *         name: idDescuento
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del descuento
 *     responses:
 *       200:
 *         description: Descuento eliminado de la factura
 *       404:
 *         description: Detalle no encontrado
 */
router.delete('/detalle-descuento/:idFactura/:idDescuento',
  detalleDescuentoController.validarEliminarDetalleDescuento,
  detalleDescuentoController.manejarErrores,
  detalleDescuentoController.eliminarDetalleDescuento
);


module.exports = router;
