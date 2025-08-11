const express = require('express');
const router = express.Router();
const facturaController = require('../../controladores/facturacion/facturaController');
const fs = require('fs');
const path = require('path');
const Factura = require('../../modelos/facturacion/Factura');
const { verificarUsuario } = require('../../configuraciones/passport');

const { body, param, validationResult, query } = require('express-validator');


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
 *                   - idFactura 
 *                   - idCliente  
 *                   - idFormaPago  
 *                   - idEmpleado  
 *                 properties:   
 *                   idFactura:  
 *                     type: integer  
 *                     description: ID único de la factura  
 *                     example: 37  
 *                   Fecha:  
 *                     type: string  
 *                     format: date-time  
 *                     description: Fecha de emisión (opcional, se toma la fecha actual del sistema)  
 *                     example: "2025-07-22T15:30:00.000Z"  
 *                   Total_Facturado:  
 *                     type: number  
 *                     format: double  
 *                     description: Total de la factura (opcional, se calcula automáticamente)  
 *                     example: 862.50  
 *                   Tipo_documento:  
 *                     type: string  
 *                     maxLength: 45  
 *                     example: "Factura"  
 *                   idCliente:  
 *                     type: integer  
 *                     minimum: 1  
 *                     example: 2  
 *                   idFormaPago:  
 *                     type: integer  
 *                     minimum: 1  
 *                     example: 1  
 *                   idEmpleado:  
 *                     type: integer  
 *                     minimum: 1  
 *                     example: 1  
 *                   estadoFactura:  
 *                     type: string  
 *                     enum: ['activa', 'anulada']  
 *                     default: 'activa'  
 *                     example: "activa"  
 *               detalles:  
 *                 type: array  
 *                 minItems: 1  
 *                 items:  
 *                   type: object  
 *                   required:  
 *                     - idProducto  
 *                     - cantidad  
 *                   properties:  
 *                     idProducto:  
 *                       type: integer  
 *                       minimum: 1  
 *                       description: ID del producto  
 *                       example: 8  
 *                     cantidad:  
 *                       type: integer  
 *                       minimum: 1  
 *                       description: Cantidad del producto  
 *                       example: 2  
 *               descuentos:  
 *                 type: array  
 *                 description: Array de descuentos (opcional)  
 *                 items:  
 *                   type: object  
 *                   required:  
 *                     - idDescuento  
 *                     - monto  
 *                   properties:  
 *                     idDescuento:  
 *                       type: integer  
 *                       minimum: 1  
 *                       description: ID del descuento  
 *                       example: 2  
 *                     monto:  
 *                       type: number  
 *                       format: double  
 *                       minimum: 0  
 *                       description: Monto del descuento  
 *                       example: 25.00  
 *           example:  
 *             factura:  
 *               idFactura: 37   
 *               Tipo_documento: "Factura"  
 *               idCliente: 2  
 *               idFormaPago: 1  
 *               idEmpleado: 1  
 *               estadoFactura: "activa"  
 *             detalles:  
 *               - idProducto: 8  
 *                 cantidad: 2  
 *               - idProducto: 12  
 *                 cantidad: 1  
 *             descuentos:  
 *               - idDescuento: 2  
 *                 monto: 25  
 *     responses:  
 *       201:  
 *         description: Factura creada correctamente con PDF generado  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 mensaje:  
 *                   type: string  
 *                   example: "Factura completa registrada con éxito"  
 *                 factura:  
 *                   type: object  
 *                   properties:  
 *                     idFactura:  
 *                       type: integer  
 *                       example: 37  
 *                     Fecha:  
 *                       type: string  
 *                       format: date-time  
 *                     Total_Facturado:  
 *                       type: number  
 *                       format: double  
 *                     archivo_pdf:  
 *                       type: string  
 *                       example: "factura_37.pdf"  
 *       400:  
 *         description: Error de validación o datos incompletos  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 errores:  
 *                   type: array  
 *                   items:  
 *                     type: object  
 *                     properties:  
 *                       msg:  
 *                         type: string  
 *                       param:  
 *                         type: string  
 *       500:  
 *         description: Error del servidor  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 mensaje:  
 *                   type: string  
 *                   example: "Error al crear factura completa"  
 *                 error:  
 *                   type: string  
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
 * /factura-consulta:
 *   post:
 *     summary: Crear una factura por consulta médica
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
 *               - consultas
 *             properties:
 *               factura:
 *                 type: object
 *                 required:
 *                   - idCliente
 *                   - idFormaPago
 *                   - idEmpleado
 *                 properties:
 *                   idCliente:
 *                     type: integer
 *                     minimum: 1
 *                     description: ID del cliente
 *                     example: 2
 *                   idFormaPago:
 *                     type: integer
 *                     minimum: 1
 *                     description: ID de la forma de pago
 *                     example: 1
 *                   idEmpleado:
 *                     type: integer
 *                     minimum: 1
 *                     description: ID del empleado
 *                     example: 1
 *                   Fecha:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha de emisión (opcional)
 *                     example: "2025-07-22T15:30:00.000Z"
 *                   Tipo_documento:
 *                     type: string
 *                     description: Tipo de documento
 *                     example: "Factura Consulta"
 *               consultas:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - idConsulta
 *                     - precio
 *                   properties:
 *                     idConsulta:
 *                       type: integer
 *                       minimum: 1
 *                       description: ID de la consulta médica
 *                       example: 15
 *                     precio:
 *                       type: number
 *                       minimum: 0
 *                       description: Precio del servicio médico
 *                       example: 150.00
 *                     descripcion:
 *                       type: string
 *                       description: Descripción del servicio
 *                       example: "Examen de la vista completo"
 *                     tipo:
 *                       type: string
 *                       description: Tipo de consulta
 *                       example: "Examen de la vista"
 *               descuentos:
 *                 type: array
 *                 description: Array de descuentos (opcional)
 *                 items:
 *                   type: object
 *                   properties:
 *                     idDescuento:
 *                       type: integer
 *                       minimum: 1
 *                       description: ID del descuento
 *                       example: 2
 *                     monto:
 *                       type: number
 *                       minimum: 0
 *                       description: Monto del descuento
 *                       example: 25.00
 *           example:
 *             factura:
 *               idCliente: 2
 *               idFormaPago: 1
 *               idEmpleado: 1
 *               Tipo_documento: "Factura Consulta"
 *             consultas:
 *               - idConsulta: 15
 *                 precio: 150.00
 *                 descripcion: "Examen de la vista completo"
 *                 tipo: "Examen de la vista"
 *               - idConsulta: 16
 *                 precio: 75.00
 *                 descripcion: "Diagnóstico oftalmológico"
 *                 tipo: "Diagnóstico"
 *             descuentos:
 *               - idDescuento: 2
 *                 monto: 25.00
 *     responses:
 *       201:
 *         description: Factura por consulta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Factura por consulta médica registrada con éxito"
 *                 factura:
 *                   type: object
 *                   properties:
 *                     idFactura:
 *                       type: integer
 *                       example: 38
 *                     archivo_pdf:
 *                       type: string
 *                       example: "factura_consulta_38.pdf"
 *       400:
 *         description: Error de validación o datos incompletos
 *       500:
 *         description: Error del servidor
 */
router.post('/factura-consulta', verificarUsuario, facturaController.crearFacturaPorConsulta);

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
router.get('/factura/:id/pdf', verificarUsuario, async (req, res) => {  
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
router.get('/factura/:id/pdf/view', verificarUsuario, async (req, res) => {    
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

/**
 * @swagger
 * /factura/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de facturación
 *     security:
 *       - BearerAuth: []
 *     tags: [Factura]
 *     description: Retorna estadísticas del mes actual y las últimas facturas
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resumen:
 *                   type: object
 *                   properties:
 *                     totalMes:
 *                       type: number
 *                       description: Total facturado en el mes actual
 *                     emitidas:
 *                       type: integer
 *                       description: Total de facturas emitidas en el mes
 *                     pendientes:
 *                       type: integer
 *                       description: Total de facturas pendientes
 *                     pagadas:
 *                       type: integer
 *                       description: Total de facturas pagadas
 *                     anuladas:
 *                       type: integer
 *                       description: Total de facturas anuladas
 *                 porTipo:
 *                   type: object
 *                   properties:
 *                     consulta:
 *                       type: integer
 *                       description: Facturas por consulta médica
 *                     producto:
 *                       type: integer
 *                       description: Facturas por productos
 *                     servicio:
 *                       type: integer
 *                       description: Facturas por servicios
 *                     mixto:
 *                       type: integer
 *                       description: Facturas mixtas
 *                 ultimasFacturas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID de la factura
 *                       cliente:
 *                         type: string
 *                         description: Nombre del cliente
 *                       fecha:
 *                         type: string
 *                         format: date-time
 *                         description: Fecha de la factura
 *                       estado:
 *                         type: string
 *                         description: Estado de la factura
 *                       total:
 *                         type: number
 *                         description: Total de la factura
 *                       tipo:
 *                         type: string
 *                         description: Tipo de facturación
 *       500:
 *         description: Error del servidor
 */
router.get('/factura/estadisticas', verificarUsuario, facturaController.obtenerEstadisticasFacturacion);

/**
 * @swagger
 * /factura/siguiente-numero:
 *   get:
 *     summary: Obtener el siguiente número de factura disponible
 *     security:
 *       - BearerAuth: []
 *     tags: [Factura]
 *     description: Retorna el siguiente número de factura basado en la última factura creada
 *     responses:
 *       200:
 *         description: Siguiente número obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 siguienteNumero:
 *                   type: integer
 *                   description: Siguiente número de factura disponible
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de confirmación
 *       500:
 *         description: Error del servidor
 */
router.get('/factura/siguiente-numero', verificarUsuario, facturaController.obtenerSiguienteNumeroFactura);

module.exports = router;

