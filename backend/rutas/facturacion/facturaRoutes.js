const express = require('express');
const router = express.Router();
const facturaController = require('../../controladores/facturacion/facturaController');
const fs = require('fs');
const path = require('path');
const Factura = require('../../modelos/facturacion/Factura');
const { verificarUsuario } = require('../../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Factura
 *   description: Gestión de facturas
 */

/**
 * @swagger
 * /factura:
 *   post:
 *     summary: Crear una factura simple
 *     security:
 *       - BearerAuth: []
 *     tags: [Factura]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idFactura
 *               - Fecha
 *               - Total_Facturado
 *               - Tipo_documento
 *               - idCliente
 *               - idFormaPago
 *               - idEmpleado
 *               - archivo_pdf
 *               - estadoFactura
 *             properties:
 *               idFactura:
 *                 type: number
 *                 example: 4
 *               Fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-15T20:09:17.000Z"
 *               Total_Facturado:
 *                 type: number
 *                 example: 200
 *               Tipo_documento:
 *                 type: string
 *                 example: "Factura"
 *               idCliente:
 *                 type: integer
 *                 example: 1
 *               idFormaPago:
 *                 type: integer
 *                 example: 1
 *               idEmpleado:
 *                 type: integer
 *                 example: 1
 *               archivo_pdf:
 *                 type: string
 *                 example: "factura1.pdf"
 *               estadoFactura:
 *                 type: string
 *                 example: "activa"
 *           example:
 *             idFactura: 4
 *             Fecha: "2025-07-15T20:09:17.000Z"
 *             Total_Facturado: 200
 *             Tipo_documento: "Factura"
 *             idCliente: 1
 *             idFormaPago: 1
 *             idEmpleado: 1
 *             archivo_pdf: "factura1.pdf"
 *             estadoFactura: "activa"
 *     responses:
 *       201:
 *         description: Factura creada correctamente
 *       400:
 *         description: Error de validación o datos incompletos
 */
router.post('/factura', verificarUsuario, facturaController.crearFactura);

/**
 * @swagger
 * /factura-completa:
 *   post:
 *     summary: Crear una factura completa (con detalle de productos y descuentos)
 *     security:
 *       - BearerAuth: []
 *     tags: [Factura]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - factura
 *               - detalles
 *             properties:
 *               factura:
 *                 type: object
 *                 required:
 *                   - idCliente
 *                   - idFormaPago
 *                   - idEmpleado
 *                   - Fecha
 *                   - Total_Facturado
 *                   - Tipo_documento
 *                   - estadoFactura
 *                 properties:
 *                   idFactura:
 *                     type: integer
 *                     example: 17
 *                   Fecha:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-07-17T15:30:00.000Z"
 *                   Total_Facturado:
 *                     type: number
 *                     format: double
 *                     example: 862.50
 *                   Tipo_documento:
 *                     type: string
 *                     example: "Factura"
 *                   idCliente:
 *                     type: integer
 *                     example: 2
 *                   idFormaPago:
 *                     type: integer
 *                     example: 1
 *                   idEmpleado:
 *                     type: integer
 *                     example: 2
 *                   estadoFactura:
 *                     type: string
 *                     example: "activa"
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - idProducto
 *                     - cantidad
 *                   properties:
 *                     idProducto:
 *                       type: integer
 *                       example: 1
 *                     cantidad:
 *                       type: integer
 *                       example: 2
 *               descuentos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - idDescuento
 *                     - monto
 *                   properties:
 *                     idDescuento:
 *                       type: integer
 *                       example: 2
 *                     monto:
 *                       type: number
 *                       format: double
 *                       example: 25.00
 *           example:
 *             factura:
 *               idFactura: 17
 *               Fecha: "2025-07-17T15:30:00.000Z"
 *               Total_Facturado: 862.50
 *               Tipo_documento: "Factura"
 *               idCliente: 2
 *               idFormaPago: 1
 *               idEmpleado: 2
 *               estadoFactura: "activa"
 *             detalles:
 *               - idProducto: 1
 *                 cantidad: 2
 *               - idProducto: 2
 *                 cantidad: 1
 *             descuentos:
 *               - idDescuento: 2
 *                 monto: 25
 *     responses:
 *       201:
 *         description: Factura creada correctamente
 *       400:
 *         description: Error de validación o datos incompletos
 *       500:
 *         description: Error del servidor
 */
router.post('/factura-completa', verificarUsuario, facturaController.validarCrearFacturaCompleta,
  facturaController.manejarErrores, facturaController.crearFacturaCompleta);

/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Obtener todas las facturas
 *     security:
 *       - BearerAuth: []
 *     tags: [Factura]
 *     responses:
 *       200:
 *         description: Lista de facturas
 */
router.get('/facturas', verificarUsuario, facturaController.obtenerFacturas);

/**
 * @swagger
 * /factura/{id}:
 *   get:
 *     summary: Obtener una factura por ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       200:
 *         description: Factura encontrada
 *       404:
 *         description: Factura no encontrada
 */
router.get('/factura/:id', verificarUsuario, facturaController.obtenerFacturaPorId);

/**
 * @swagger
 * /facturas/{id}:
 *   put:
 *     summary: Las facturas no pueden ser editadas (Regulación SAR)
 *     security:
 *      - BearerAuth: []
 *     tags: [Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura
 *     responses:
 *       403:
 *         description: Las facturas no pueden ser modificadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Las facturas no pueden ser modificadas según la regulación de la SAR.
 */
router.put('/facturas/:id', verificarUsuario, facturaController.editarFactura);

/**
 * @swagger
 * /facturas/{id}/anular:
 *   patch:
 *     summary: Anular una factura (según normativa SAR, no se permite edición)
 *     security:
 *       - BearerAuth: []
 *     tags: [Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la factura a anular
 *     responses:
 *       200:
 *         description: Factura anulada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Factura anulada correctamente
 *                 factura:
 *                   $ref: '#/components/schemas/Factura'
 *       404:
 *         description: Factura no encontrada
 *       500:
 *         description: Error al anular la factura
 */
router.patch('/facturas/:id/anular', verificarUsuario, facturaController.anularFactura);


/**
 * @swagger
 * /factura/{id}/pdf:
 *   get:
 *     summary: Descargar el PDF de una factura
 *     security:
 *       - BearerAuth: []
 *     description: Retorna el archivo PDF asociado a una factura si existe.
 *     tags: [Factura]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la factura
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: PDF descargado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: PDF no encontrado o factura inexistente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: PDF de factura no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/factura/:id/pdf',  async (req, res) => {  
  try {  
    const factura = await Factura.findByPk(req.params.id);  
    if (!factura || !factura.archivo_pdf) {  
      return res.status(404).json({ error: 'PDF de factura no encontrado' });  
    }  
      
    const filePath = path.join(__dirname, '../../uploads', factura.archivo_pdf);  
    if (!fs.existsSync(filePath)) {  
      return res.status(404).json({ error: 'Archivo PDF no encontrado' });  
    }  
      
    res.download(filePath);  
  } catch (error) {  
    res.status(500).json({ error: 'Error al obtener PDF de factura' });  
  }  
});

/**  
 * @swagger  
 * /factura/{id}/pdf/view:  
 *   get:  
 *     summary: Visualizar el PDF de una factura en el navegador
 *     security:  
 *      - BearerAuth: []
 *     description: Muestra el archivo PDF asociado a una factura directamente en el navegador sin forzar la descarga.  
 *     tags: [Factura]  
 *     parameters:  
 *       - in: path  
 *         name: id  
 *         required: true  
 *         description: ID de la factura  
 *         schema:  
 *           type: integer  
 *           example: 12  
 *     responses:  
 *       200:  
 *         description: PDF mostrado en navegador  
 *         content:  
 *           application/pdf:  
 *             schema:  
 *               type: string  
 *               format: binary  
 *       404:  
 *         description: PDF no encontrado o factura inexistente  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   example: "PDF de factura no encontrado"  
 *       500:  
 *         description: Error interno del servidor  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   example: "Error al obtener PDF de factura"  
 */
router.get('/factura/:id/pdf/view', async (req, res) => {    
  try {    
    const factura = await Factura.findByPk(req.params.id);    
    if (!factura || !factura.archivo_pdf) {    
      return res.status(404).json({ error: 'PDF de factura no encontrado' });    
    }    
        
    const filePath = path.resolve(__dirname, '../../uploads', factura.archivo_pdf);    
    if (!fs.existsSync(filePath)) {    
      return res.status(404).json({ error: 'Archivo PDF no encontrado' });    
    }    
        
    // Headers correctos para mostrar PDF en navegador  
    res.setHeader('Content-Type', 'application/pdf');  
    res.setHeader('Content-Disposition', 'inline; filename="factura.pdf"');  
    res.setHeader('Cache-Control', 'no-cache');  
    res.sendFile(filePath);  
  } catch (error) {    
    console.error('Error al servir PDF:', error);  
    res.status(500).json({ error: 'Error al obtener PDF de factura' });    
  }    
});





module.exports = router;

