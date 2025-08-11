const express = require('express');  
const router = express.Router();  
const caiController = require('../../controladores/facturacion/caiController');  
  
const fs = require('fs');  
const path = require('path');  
const { verificarUsuario } = require('../../configuraciones/passport');  
const { body, param, validationResult, query } = require('express-validator');  

/**  
 * @swagger  
 * tags:  
 *   name: CAI  
 *   description: Gestión de Códigos de Autorización de Impresión (CAI) para facturación fiscal  
 */  
  
/**    
 * @swagger    
 * /cai/activo:    
 *   get:    
 *     summary: Obtener el CAI activo    
 *     tags: [CAI]    
 *     security:    
 *       - BearerAuth: []    
 *     responses:    
 *       200:    
 *         description: CAI activo obtenido exitosamente    
 *         content:    
 *           application/json:    
 *             schema:    
 *               type: object    
 *               properties:    
 *                 cai:    
 *                   $ref: '#/components/schemas/CAI'  
 *             example:  
 *               cai:  
 *                 idCAI: 1  
 *                 codigoCAI: "254F8-612F1-8A0E0-6E8B3-0099B876"  
 *                 numeroFacturaInicio: "000-001-01-00000001"  
 *                 numeroFacturaFin: "000-001-01-99999999"  
 *                 fechaEmision: "2025-01-01"  
 *                 fechaVencimiento: "2025-12-31"  
 *                 resolucionSAR: "SAR No. 45145"  
 *                 nombreEmpresa: "Televisión Comayagua Canal 40"  
 *                 rtnEmpresa: "12171961001526"  
 *                 activo: true  
 *                 facturasEmitidas: 0  
 *       404:    
 *         description: No hay CAI activo configurado  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 mensaje:  
 *                   type: string  
 *                   example: "No hay CAI activo configurado"  
 *       500:    
 *         description: Error interno del servidor  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 mensaje:  
 *                   type: string  
 *                   example: "Error al obtener CAI"  
 *                 error:  
 *                   type: string  
 *                   example: "Mensaje de error detallado"  
 */    
router.get('/cai/activo', verificarUsuario, caiController.obtenerCAIActivo);  
  
/**  
 * @swagger  
 * /cai:  
 *   post:  
 *     summary: Crear un nuevo CAI  
 *     tags: [CAI]  
 *     security:  
 *       - BearerAuth: []  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             $ref: '#/components/schemas/CAI'  
 *           example:  
 *             codigoCAI: "254F8-612F1-8A0E0-6E8B3-0099B876"  
 *             numeroFacturaInicio: "000-001-01-00000001"  
 *             numeroFacturaFin: "000-001-01-99999999"  
 *             fechaEmision: "2025-01-01"  
 *             fechaVencimiento: "2025-12-31"  
 *             resolucionSAR: "SAR No. 45145"  
 *             nombreEmpresa: "Televisión Comayagua Canal 40"  
 *             rtnEmpresa: "12171961001526"  
 *             activo: true  
 *             facturasEmitidas: 0  
 *     responses:  
 *       201:  
 *         description: CAI creado exitosamente  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 mensaje:  
 *                   type: string  
 *                   example: "CAI creado exitosamente"  
 *                 cai:  
 *                   $ref: '#/components/schemas/CAI'  
 *       400:  
 *         description: Datos de entrada inválidos  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 mensaje:  
 *                   type: string  
 *                   example: "Errores de validación"  
 *                 errores:  
 *                   type: array  
 *                   items:  
 *                     type: object  
 *                     properties:  
 *                       msg:  
 *                         type: string  
 *                         example: "El código CAI es obligatorio"  
 *       500:  
 *         description: Error interno del servidor  
 */  
router.post('/cai',     
  verificarUsuario,    
  [    
    body('codigoCAI')    
      .notEmpty()    
      .withMessage('El código CAI es obligatorio')    
      .isLength({ max: 50 })    
      .withMessage('El código CAI no puede exceder 50 caracteres'),    
    body('numeroFacturaInicio')    
      .notEmpty()    
      .withMessage('El número de factura inicial es obligatorio')    
      .isLength({ max: 20 })    
      .withMessage('El número de factura inicial no puede exceder 20 caracteres'),    
    body('numeroFacturaFin')    
      .notEmpty()    
      .withMessage('El número de factura final es obligatorio')    
      .isLength({ max: 20 })    
      .withMessage('El número de factura final no puede exceder 20 caracteres'),    
    body('fechaEmision')    
      .notEmpty()    
      .withMessage('La fecha de emisión es obligatoria')    
      .isISO8601()    
      .withMessage('La fecha de emisión debe tener formato válido'),    
    body('fechaVencimiento')    
      .notEmpty()    
      .withMessage('La fecha de vencimiento es obligatoria')    
      .isISO8601()    
      .withMessage('La fecha de vencimiento debe tener formato válido')    
      .custom((value, { req }) => {    
        if (new Date(value) <= new Date(req.body.fechaEmision)) {    
          throw new Error('La fecha de vencimiento debe ser posterior a la fecha de emisión');    
        }    
        return true;    
      }),    
    body('resolucionSAR')    
      .notEmpty()    
      .withMessage('La resolución SAR es obligatoria')    
      .isLength({ max: 50 })    
      .withMessage('La resolución SAR no puede exceder 50 caracteres'),    
    body('nombreEmpresa')    
      .notEmpty()    
      .withMessage('El nombre de la empresa es obligatorio')    
      .isLength({ max: 100 })    
      .withMessage('El nombre de la empresa no puede exceder 100 caracteres'),    
    body('rtnEmpresa')    
      .notEmpty()    
      .withMessage('El RTN de la empresa es obligatorio')    
      .isLength({ max: 20 })    
      .withMessage('El RTN de la empresa no puede exceder 20 caracteres'),    
    body('activo')    
      .optional()    
      .isBoolean()    
      .withMessage('El campo activo debe ser un valor booleano'),    
    body('facturasEmitidas')    
      .optional()    
      .isInt({ min: 0 })    
      .withMessage('Las facturas emitidas debe ser un número entero mayor o igual a 0')    
  ],    
  (req, res, next) => {    
    const errors = validationResult(req);    
    if (!errors.isEmpty()) {    
      return res.status(400).json({    
        mensaje: 'Errores de validación',    
        errores: errors.array()    
      });    
    }    
    next();    
  },    
  caiController.crearCAI    
);  
  
/**    
 * @swagger    
 * /cai/{id}:    
 *   put:    
 *     summary: Actualizar un CAI existente    
 *     tags: [CAI]    
 *     security:    
 *       - BearerAuth: []    
 *     parameters:    
 *       - in: path    
 *         name: id    
 *         required: true    
 *         schema:    
 *           type: integer  
 *           minimum: 1  
 *         description: ID del CAI a actualizar  
 *         example: 1  
 *     requestBody:    
 *       required: true    
 *       content:    
 *         application/json:    
 *           schema:    
 *             $ref: '#/components/schemas/CAI'  
 *           example:  
 *             codigoCAI: "254F8-612F1-8A0E0-6E8B3-0099B876"  
 *             numeroFacturaInicio: "000-001-01-00000001"  
 *             numeroFacturaFin: "000-001-01-99999999"  
 *             fechaEmision: "2025-01-01"  
 *             fechaVencimiento: "2025-12-31"  
 *             resolucionSAR: "SAR No. 45145"  
 *             nombreEmpresa: "Televisión Comayagua Canal 40"  
 *             rtnEmpresa: "12171961001526"  
 *             activo: false  
 *             facturasEmitidas: 150  
 *     responses:    
 *       200:    
 *         description: CAI actualizado exitosamente    
 *         content:    
 *           application/json:    
 *             schema:    
 *               type: object    
 *               properties:    
 *                 mensaje:    
 *                   type: string  
 *                   example: "CAI actualizado exitosamente"  
 *                 cai:    
 *                   $ref: '#/components/schemas/CAI'  
 *       404:    
 *         description: CAI no encontrado  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 mensaje:  
 *                   type: string  
 *                   example: "CAI no encontrado"  
 *       400:    
 *         description: Datos de entrada inválidos      
 *       500:  
 *         description: Error interno del servidor  
 */  
router.put('/cai/:id',  
  verificarUsuario,  
  [  
    body('codigoCAI')  
      .optional()  
      .isLength({ max: 50 })  
      .withMessage('El código CAI no puede exceder 50 caracteres'),  
    body('numeroFacturaInicio')  
      .optional()  
      .isLength({ max: 20 })  
      .withMessage('El número de factura inicial no puede exceder 20 caracteres'),  
    body('numeroFacturaFin')  
      .optional()  
      .isLength({ max: 20 })  
      .withMessage('El número de factura final no puede exceder 20 caracteres'),  
    body('fechaEmision')  
      .optional()  
      .isISO8601()  
      .withMessage('La fecha de emisión debe tener formato válido'),  
    body('fechaVencimiento')  
      .optional()  
      .isISO8601()  
      .withMessage('La fecha de vencimiento debe tener formato válido'),  
    body('resolucionSAR')  
      .optional()  
      .isLength({ max: 50 })  
      .withMessage('La resolución SAR no puede exceder 50 caracteres'),  
    body('nombreEmpresa')  
      .optional()  
      .isLength({ max: 100 })  
      .withMessage('El nombre de la empresa no puede exceder 100 caracteres'),  
    body('rtnEmpresa')  
      .optional()  
      .isLength({ max: 20 })  
      .withMessage('El RTN de la empresa no puede exceder 20 caracteres'),  
    body('activo')  
      .optional()  
      .isBoolean()  
      .withMessage('El campo activo debe ser un valor booleano'),  
    body('facturasEmitidas')  
      .optional()  
      .isInt({ min: 0 })  
      .withMessage('Las facturas emitidas debe ser un número entero mayor o igual a 0')  
  ],  
  (req, res, next) => {  
    const errors = validationResult(req);  
    if (!errors.isEmpty()) {  
      return res.status(400).json({  
        mensaje: 'Errores de validación',  
        errores: errors.array()  
      });  
    }  
    next();  
  },  
  caiController.actualizarCAI  
);  
  
/**  
 * @swagger  
 * /cai:  
 *   get:  
 *     summary: Obtener todos los CAI  
 *     tags: [CAI]  
 *     security:  
 *       - BearerAuth: []  
 *     responses:  
 *       200:  
 *         description: Lista de CAI obtenida exitosamente  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 cais:  
 *                   type: array  
 *                   items:  
 *                     $ref: '#/components/schemas/CAI'  
 *       500:  
 *         description: Error interno del servidor  
 */  
router.get('/cais', verificarUsuario, async (req, res) => {  
  try {  
    const CAI = require('../../modelos/facturacion/Cai');  
    const cais = await CAI.findAll({  
      order: [['fechaEmision', 'DESC']]  
    });  
    res.json({ cais });  
  } catch (error) {  
    res.status(500).json({ mensaje: 'Error al obtener CAI', error: error.message });  
  }  
});  
  
module.exports = router;